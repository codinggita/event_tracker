// models/ticketPurchase.js
import mongoose from "mongoose";

const ticketPurchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  }
});

const TicketPurchase = mongoose.model("TicketPurchase", ticketPurchaseSchema);

export default TicketPurchase;