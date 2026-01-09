import Event from "../Models/EventCard.js";
import Review from "../Models/Review.js";
import { createRazorpayInstance } from "../Config/razorpay.config.js";
import { createEmailTransporter } from "../Config/email.config.js";
import crypto from "crypto";
import TicketPurchase from "../Models/Transaction.js";
import mongoose from "mongoose";


// ✅ Create Event
export const createEvent = async (req, res) => {
  try {
    const { title, imageUrl, shortDescription, longDescription,category,date, location, price } = req.body;

    if (!title || !imageUrl || !shortDescription || !longDescription || !date || !location || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEvent = new Event({
      title,
      imageUrl,
      shortDescription,
      longDescription,
      date,
      location,
      price,
      category,
      createdBy: req.user.uid, // ✅ Firebase UID from Token
      createdByEmail: req.user.email, // ✅ User Email from Token
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });

  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const allEvents =  async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// ✅ Get Logged-in User's Events
export const yourEvents = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const userEvents = await Event.find({ createdBy: req.user.uid });
  res.json(userEvents);
};

//edit event (Only Creator)
export const editEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.uid) {  // Added toString()
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error("Edit event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const eventDetailPage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Recalculate and persist average rating + count for an event
const recalcEventRating = async (eventId) => {
  const stats = await Review.aggregate([
    { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  const averageRatingRaw = stats[0]?.averageRating || 0;
  const ratingCount = stats[0]?.ratingCount || 0;
  const averageRating = Number(averageRatingRaw.toFixed(2));

  await Event.findByIdAndUpdate(eventId, { averageRating, ratingCount });
  return { averageRating, ratingCount };
};

// Create or update a review for an event
export const addOrUpdateReview = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, comment = "" } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existingReview = await Review.findOne({ eventId, userId: req.user.uid });
    const userName = req.user.name || req.user.email || "Anonymous";

    let review;
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      review = await existingReview.save();
    } else {
      review = await Review.create({
        eventId,
        userId: req.user.uid,
        userName,
        rating,
        comment,
      });
    }

    const stats = await recalcEventRating(eventId);

    res.status(existingReview ? 200 : 201).json({
      message: existingReview ? "Review updated" : "Review added",
      review,
      ...stats,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch reviews for an event with optional sorting
export const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;
    const sort = req.query.sort || "newest";

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    let sortOption = { createdAt: -1 };
    if (sort === "highest") {
      sortOption = { rating: -1, createdAt: -1 };
    }

    const reviews = await Review.find({ eventId }).sort(sortOption);
    const stats = await recalcEventRating(eventId);

    res.status(200).json({ reviews, ...stats });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


    // Delete Event (Only Creator)
export const deleteEvent = async (req, res) => {
      try {
        const event = await Event.findById(req.params.id);
        
        if (!event || !req.user || event.createdBy.toString() !== req.user.uid) {
          return res.status(403).json({ message: "Not authorized" });
        }
    
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted" });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    };


// ✅ Search Events Controller
export const searchEvents = async (req, res) => {
  try {
      const query = req.query.q || ""; // Search query
      const location = req.query.location || ""; // Location filter

      if (!query && !location) {
        return res.status(200).json({ events: [] }); // Empty result if no query or location
      }

      const searchCriteria = {};

      if (query) {
        searchCriteria.title = { $regex: query, $options: "i" }; // Title search (case-insensitive)
      }

      if (location) {
        searchCriteria.location = { $regex: location, $options: "i" }; // Location search (case-insensitive)
      }

      const events = await Event.find(searchCriteria);
      res.status(200).json({ events });
  } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Error fetching search results", error });
  }
};


 export const categoryEvents = async (req, res) => {
  try {
    const categoryName = req.params.category;
    console.log("Searching for category:", categoryName);
    
    // Try exact match first
    let events = await Event.find({ category: categoryName });
    
    // If no events found, try case-insensitive search
    if (events.length === 0) {
      const categoryQuery = new RegExp(categoryName, "i");
      events = await Event.find({ category: { $regex: categoryQuery } });
    }

    if (events.length === 0) {
      return res.status(200).json({ message: "No events found in this category." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Category search error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}



// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in rupees
    const razorpay = createRazorpayInstance();
    
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// Verify payment after Razorpay callback
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      eventId,
      userId,
      quantity,
      amount,
      eventTitle 
    } = req.body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || 
        !eventId || !userId || !quantity || !amount || !eventTitle) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields for payment verification" 
      });
    }
    
    // Create signature using your secret key
    const shasum = crypto.createHmac("sha256", "Uew5OFDPM3PjQ6TQRTyMr4MT");
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");
    
    // Compare signatures
    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment" });
    }
    
    // Check if this payment is already saved (to prevent duplicates)
    const existingPurchase = await TicketPurchase.findOne({ paymentId: razorpay_payment_id });
    if (existingPurchase) {
      return res.json({
        success: true,
        message: "Payment already verified",
        paymentId: razorpay_payment_id
      });
    }
    
    // Save the ticket purchase to database
    const ticketPurchase = new TicketPurchase({
      userId,
      eventId,
      eventTitle,
      quantity,
      amount,
      paymentId: razorpay_payment_id
    });
    
    const savedPurchase = await ticketPurchase.save();
    console.log("Ticket purchase saved:", savedPurchase); // Debug log
    
    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      ticketId: savedPurchase._id
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};

// Get user's ticket purchases
export const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const tickets = await TicketPurchase.find({
      userId, 
      resaleStatus: { $ne: "approved" }, 
      isForResale: { $ne: true }, 
    }).sort({ purchaseDate: -1 });
    
    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
};


export const getTicketDetails = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await TicketPurchase.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket); 
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const listTicketForResale = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { resalePrice } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!resalePrice || resalePrice <= 0) return res.status(400).json({ message: "Valid resale price is required" });

    const ticket = await TicketPurchase.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.userId !== req.user.uid) return res.status(403).json({ message: "You can only resell your own tickets" });
    if (ticket.isForResale) return res.status(400).json({ message: "Ticket is already listed for resale" });

    ticket.isForResale = true;
    ticket.resalePrice = resalePrice;
    ticket.resaleStatus = "pending";
    ticket.originalOwnerId = req.user.uid;

    await ticket.save();

    const event = await Event.findById(ticket.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const hostEmail = event.createdByEmail;
    const transporter = createEmailTransporter();

    // Generate approval/rejection links
    const baseUrl = "https://event-tracker-frontend-l8ve.onrender.com"; // Frontend URL (adjust port if needed)
    const approveLink = `${baseUrl}/tickets/${ticketId}/approve?action=approve`;
    const rejectLink = `${baseUrl}/tickets/${ticketId}/approve?action=reject`;

    const mailOptions = {
      from: "tea01089@gmail.com",
      to: hostEmail,
      subject: "Ticket Resale Approval Request",
      text: `A ticket (ID: ${ticketId}) for your event "${event.title}" has been listed for resale at ${resalePrice} INR.\n\n` +
            `Click to Approve: ${approveLink}\n` +
            `Click to Reject: ${rejectLink}`,
      html: `
        <p>A ticket (ID: <strong>${ticketId}</strong>) for your event "<strong>${event.title}</strong>" has been listed for resale at <strong>${resalePrice} INR</strong>.</p>
        <p>Please approve or reject this request:</p>
        <a href="${approveLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Approve</a>
        <a href="${rejectLink}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">Reject</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${hostEmail}`);

    res.status(200).json({ message: "Ticket listed for resale and host notified", ticket });
  } catch (error) {
    console.error("Error listing ticket for resale:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getResaleTickets = async (req, res) => {
  try {
    const tickets = await TicketPurchase.find({ resaleStatus: "approved" }).populate({
      path: "eventId",
      select: "title imageUrl time location shortDescription createdByEmail",
      model: "Event", 
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching resale tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveResaleTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const action = req.query.action || req.body.action;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const ticket = await TicketPurchase.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const event = await Event.findById(ticket.eventId);
    if (!event || event.createdBy !== req.user.uid) {
      return res.status(403).json({ message: "Only event host can approve resale" });
    }

    if (ticket.resaleStatus !== "pending") {
      return res.status(400).json({ message: "Ticket is not pending approval" });
    }

    if (action === "approve") {
      ticket.resaleStatus = "approved";

      const razorpay = createRazorpayInstance();
      const refundAmount = ticket.amount;
      const paymentId = ticket.paymentId;

      if (!paymentId) {
        console.error("Payment ID missing for ticket:", ticketId);
        return res.status(400).json({ message: "Payment ID not found" });
      }

      // Check if refund already processed
      if (!ticket.refundId) {
        try {
          console.log("Initiating refund for payment:", paymentId, "Amount:", refundAmount);
          const refund = await razorpay.payments.refund(paymentId, {
            amount: refundAmount * 100,
            notes: { reason: "Ticket approved for resale" },
          });
          ticket.refundId = refund.id;
          console.log("Refund successful:", refund);
        } catch (refundError) {
          console.error("Refund failed:", refundError);
          return res.status(500).json({ message: "Refund processing failed", error: refundError.message });
        }
      } else {
        console.log("Refund already processed for payment:", paymentId, "Refund ID:", ticket.refundId);
      }

      // Remove ticket from original owner
      ticket.userId = null; // Now works with updated schema
      ticket.originalOwnerId = ticket.originalOwnerId || ticket.userId; // Preserve original owner for record
    } else if (action === "reject") {
      ticket.resaleStatus = "rejected";
      ticket.isForResale = false;
      ticket.resalePrice = null;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await ticket.save();
    res.status(200).json({ message: `Ticket resale ${action}d`, ticket });
  } catch (error) {
    console.error("Error approving resale ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const purchaseResaleTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const ticket = await TicketPurchase.findById(ticketId);
    if (!ticket || !ticket.isForResale || ticket.resaleStatus !== "approved") {
      return res.status(400).json({ message: "Ticket not available for resale" });
    }

    // Verify Razorpay payment
    const razorpaySecret = "Uew5OFDPM3PjQ6TQRTyMr4MT";
    const shasum = crypto.createHmac("sha256", razorpaySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Calculate amount and platform fee
    const totalAmount = ticket.resalePrice * 100; // Convert to paisa
    const platformFee = totalAmount * 0.1; // 10% platform fee
    const amountToTransfer = totalAmount - platformFee;

    // Transfer payment to original owner using Razorpay Transfers
    const originalOwnerId = ticket.originalOwnerId;
    const razorpay = createRazorpayInstance();

    // Placeholder: Fetch owner's Razorpay account ID
    const ownerRazorpayAccountId = await getOwnerRazorpayAccountId(originalOwnerId);
    let transferId = null;

    if (ownerRazorpayAccountId) {
      const transfer = await razorpay.transfers.create({
        account: ownerRazorpayAccountId,
        amount: amountToTransfer,
        currency: "INR",
        on_hold: false,
        notes: {
          ticketId: ticketId,
          purpose: "Resale ticket payment",
        },
      });
      transferId = transfer.id;
      console.log("Payment transferred to original owner:", transfer);
    } else {
      console.log(`Manual transfer required: ${amountToTransfer / 100} INR to user ${originalOwnerId}`);
    }

    // Transfer ownership
    ticket.userId = req.user.uid; // New owner
    ticket.isForResale = false;
    ticket.resaleStatus = "sold";
    ticket.resalePurchaseDate = new Date();

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Resale ticket purchased successfully",
      ticket,
      transferId: transferId || "Manual transfer pending",
    });
  } catch (error) {
    console.error("Error purchasing resale ticket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Temporary implementation of getOwnerRazorpayAccountId
async function getOwnerRazorpayAccountId(userId) {
  // For testing, return a hardcoded Razorpay test account ID
  // In production, replace this with actual logic to fetch from a user database or API
  const testAccountIds = {
    "user1": "acc_test_1234", // Example: Replace with real test account IDs from Razorpay
    "user2": "acc_test_5678",
  };

  const accountId = testAccountIds[userId];
  if (!accountId) {
    console.log(`No Razorpay account ID found for user ${userId}`);
    return null; // Triggers manual transfer
  }
  return accountId;
}

