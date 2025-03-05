import express from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";

import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from "../controllers/message.controller.js";
import { verifyRecruiter } from "../middlewares/admin.middleware.js";

const router = express.Router();

router
  .route("/start-conversation")
  .post(verifyJWt, verifyRecruiter, startConversation);
router.route("/get-conversations").get(verifyJWt, getConversations);
router.route("/get-messages/:conversationId").get(verifyJWt, getMessages);
router.route("/send-message").post(verifyJWt, sendMessage);

export default router;
