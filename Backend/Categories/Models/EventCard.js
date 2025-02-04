import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  trendingScore: { type: Number, default: 0 }, // Only used for trending events
  status: { type: String, enum: ["trending", "upcoming"], required: true }, // Identify event type
  image: { type: String, required: true },
});

const Event = mongoose.model("EventCard", eventSchema);

export default Event;
