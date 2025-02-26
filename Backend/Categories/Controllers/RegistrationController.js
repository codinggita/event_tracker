import Registration from "../Models/Registration.js";
import Event from "../Models/EventCard.js";
import transporter from "../data/emailConfig.js";

export const registerForEvent = async (req, res) => {
  try {
    const { eventId, userId, userEmail, userName } = req.body;
    
    if (!eventId || !userId || !userEmail || !userName) {
      console.log("Missing fields:", { eventId, userId, userEmail, userName });
      return res.status(400).json({ message: "All fields (eventId, userId, userEmail, userName) are required!" });
    }
    
    console.log("Received eventId:", eventId);
    const event = await Event.findById(eventId);
    console.log("Found event:", event);
    if (!event) {
      console.log(`Event not found for ID: ${eventId}`);
      return res.status(404).json({ message: "Event not found!" });
    }
    
    const existingRegistration = await Registration.findOne({ eventId, userId });
    if (existingRegistration) {
      console.log(`User ${userId} already registered for event ${eventId}`);
      return res.status(400).json({ message: "You have already registered for this event!" });
    }
    
    const registration = new Registration({ eventId, userId, userEmail, userName });
    await registration.save();
    console.log(`Registration saved for user ${userId} and event ${eventId}`);
    
    // Format the date properly
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: "Event Registration Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #4a4a4a;">Event Registration Confirmation</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>You have successfully registered for <strong>"${event.title}"</strong>.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #4a4a4a;">Event Details:</h3>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
          <p>Thank you for registering!</p>
        </div>
      `,
      text: `Hello ${userName},\n\nYou have successfully registered for "${event.title}".\n\nEvent Details:\nDate: ${eventDate}\nLocation: ${event.location}\n\nThank you!`,
    };
    
    // More robust email sending with better error handling
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent successfully to ${userEmail}`);
      console.log("Message ID:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
      
      res.status(200).json({ 
        message: "Registration successful. Confirmation email sent!",
        registration: true,
        emailSent: true,
        messageId: info.messageId
      });
    } catch (emailError) {
      console.error(`Failed to send email to ${userEmail}:`, emailError);
      console.error("Email error stack:", emailError.stack);
      
      // Try to provide more specific error information
      let emailErrorMessage = "Email could not be sent due to a server issue";
      if (emailError.code === 'EAUTH') {
        emailErrorMessage = "Email authentication failed. Please check your SMTP settings.";
      } else if (emailError.code === 'ESOCKET') {
        emailErrorMessage = "Email server connection failed. Please check your SMTP host and port.";
      }
      
      // Continue with successful registration even if email fails
      return res.status(200).json({ 
        message: "Registration successful, but confirmation email could not be sent. " + emailErrorMessage,
        registration: true,
        emailSent: false,
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all registered users for an event
export const getRegisteredUsers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const users = await Registration.find({ eventId }).select("userName userEmail createdAt");
    
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching registered users:", error);
    res.status(500).json({ message: "Failed to fetch registered users", error: error.message });
  }
};