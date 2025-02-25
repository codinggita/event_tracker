import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: String, required: true }, // Firebase UID
  userEmail: { type: String, required: true }, // User's email from Firebase
  userName: { type: String, required: true }, // User's Name
  createdAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
