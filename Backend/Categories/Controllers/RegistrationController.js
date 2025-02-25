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

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: "Event Registration Confirmation",
      text: `Hello ${userName},\n\nYou have successfully registered for "${event.title}".\n\nEvent Details:\nDate: ${new Date(event.date).toLocaleDateString()}\nLocation: ${event.location}\n\nThank you!`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent successfully to ${userEmail}`);
    } catch (emailError) {
      console.error(`Failed to send email to ${userEmail}:`, emailError);
    }

    res.status(200).json({ message: "Registration successful. Confirmation email sent!" });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ 2️⃣ Get all registered users for an event
export const getRegisteredUsers = async (req, res) => {
    try {
      const { eventId } = req.params;
      const users = await Registration.find({ eventId }).select("userName userEmail");
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registered users", error });
    }
  };