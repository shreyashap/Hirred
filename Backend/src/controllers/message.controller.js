import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { io } from "../app.js";
import { getReceiverSocketId } from "../socket.js";
import { Conversation } from "../models/conversation.model.js";
import { Job } from "../models/job.model.js";
import { client } from "../client.js";
import { chat } from "googleapis/build/src/apis/chat/index.js";

export const startConversation = asyncHandler(async (req, res) => {
  const { senderId, receiverId, jobId } = req.query;
  if (!senderId || !receiverId || !jobId) {
    return res.status(400).json({
      error: "All fields required",
    });
  }

  const job = await Job.findById(jobId).lean();
  if (!job) {
    return res.status(400).json({
      errorMsg: "Job not found",
    });
  }

  const prevConversation = await Conversation.find({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  });

  if (prevConversation.length > 0) {
    return res.status(400).json({
      errorMsg: "Conversation already exist",
    });
  }

  const newConversation = new Conversation({
    sender: senderId,
    receiver: receiverId,
    job: jobId,
  });
  await newConversation.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    message: "success",
    newConversation,
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { receiverId, conversationId } = req.query;

  if (!receiverId || !content || !conversationId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return res.status(400).json({
      error: "Conversation not found",
    });
  }

  const message = new Message({
    conversation: conversation._id,
    senderId: req.user._id,
    receiverId,
    content,
  });

  (conversation.lastMessage = content),
    (conversation.lastMessageAt = Date.now());

  await Promise.all([message.save(), conversation.save()]);

  const receiverSocketId = getReceiverSocketId(receiverId);
  console.log(receiverSocketId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("sendMessage", message);
  }
  res.status(200).json({
    message: "success",
    message,
  });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const cacheKey = `messages:${JSON.stringify(conversationId)}`;

  const messagesResult = await client.get(cacheKey);

  if (messagesResult && messagesResult.length > 0) {
    return res.status(200).json({
      messages: JSON.parse(messagesResult),
    });
  }

  const messages = await Message.find({
    conversation: conversationId,
  })
    .sort({ createdAt: 1 })
    .lean();

  if (!messages) {
    return res.status(400).json({
      error: "Messages not found",
    });
  }

  await client.setEx(cacheKey, 900, JSON.stringify(messages));
  res.status(200).json({
    message: "success",
    messages,
  });
});

export const getConversations = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const user = req.user;

  const cacheKey = `conversation:${JSON.stringify(userId)}`;

  const cachedResult = await client.get(cacheKey);

  if (cachedResult && cachedResult.length > 0) {
    return res.status(200).json({
      conversations: JSON.parse(cachedResult),
    });
  }

  if (!userId) {
    return res.status(404).json({
      err: "Invalid request",
    });
  }

  let conversations;
  if (user.accountType === "recruiter") {
    conversations = await Conversation.find({
      sender: userId,
    })
      .sort({ createdAt: 1 })
      .populate(["sender", "receiver", "job"])
      .lean();
  } else {
    conversations = await Conversation.find({
      receiver: userId,
    })
      .sort({ createdAt: 1 })
      .populate(["sender", "receiver", "job"])
      .lean();
  }

  if (!conversations) {
    return res.status(400).json({
      error: "conversations not found",
    });
  }

  await client.setEx(cacheKey, 900, JSON.stringify(conversations));

  res.status(200).json({
    message: "success",
    conversations,
  });
});
