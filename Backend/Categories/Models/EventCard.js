import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  location: String,
  imageUrl: String,
  price: Number,
});

const Event = mongoose.model("EventCard", eventSchema);

export default Event;
