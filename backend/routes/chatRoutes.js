



import express from "express";
import { getChatMessages, sendChatMessage } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddlewares.js";

const router = express.Router();

// ✅ Get Chat Messages by Appointment ID
router.get("/:appointmentId", authMiddleware, getChatMessages);

// ✅ Send Chat Message
router.post("/send", authMiddleware, sendChatMessage);

export default router;
