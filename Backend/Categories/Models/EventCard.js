import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  host: {   // ✅ Host (User) Information
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    profilePic: { type: String, default: "https://via.placeholder.com/150" }
  }
});


const Event = mongoose.model("EventCard", eventSchema);

export default Event;
