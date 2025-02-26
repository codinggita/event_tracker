import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // 👈 Category field added
  createdBy: { type: String, required: true }, // Firebase UID
  createdByEmail: { type: String, required: true }, // Email ID
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
