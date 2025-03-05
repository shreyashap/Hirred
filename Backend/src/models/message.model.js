import mongoose from "mongoose";
import { string } from "zod";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    image: { type: String },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
