import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  date: { type: String, required: true }, // ✅ Date (YYYY-MM-DD format)
  location: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdByEmail: { type: String, required: true },
  attendees: [{ type: String }] // ✅ Attendees list (User Firebase UID)
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
