// models/ticketPurchase.js
import mongoose from "mongoose";

const { Schema } = mongoose; 

const ticketPurchaseSchema = new Schema({
  userId: {
    type: String,
    required: false,
  },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
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
  },
  isForResale: {
    type: Boolean,
    default: false,
  },
  resalePrice: {
    type: Number,
    default: null,
  },
  resaleStatus: {
    type: String,
    enum: ["pending", "approved", "sold", "rejected"],
    default: null,
  },
  originalOwnerId: {
    type: String,
    default: null,
  },
  resalePurchaseDate: {
    type: Date,
    default: null,
  },
  refundId: { type: String, default: null },
});

const TicketPurchase = mongoose.model("TicketPurchase", ticketPurchaseSchema);

export default TicketPurchase;