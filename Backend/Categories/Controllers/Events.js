import Event from "../Models/EventCard.js";
import { createRazorpayInstance } from "../Config/razorpay.config.js";
import crypto from "crypto";
import TicketPurchase from "../Models/Transaction.js";

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
      const query = req.query.q || ""; // Get search query
      if (!query) return res.status(200).json({ events: [] }); // Return empty if no query

      const events = await Event.find({
          title: { $regex: query, $options: "i" }, // Case-insensitive search
      });

      res.status(200).json({ events });
  } catch (error) {
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
    
    const tickets = await TicketPurchase.find({ userId })
      .sort({ purchaseDate: -1 });
    
    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
};