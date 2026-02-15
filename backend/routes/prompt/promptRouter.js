import express from "express"
import { sendPrompt, getAllChats, getChatMessages, deleteChat, renameChat, togglePinChat, shareChat } from "../../controllers/prompt/promptController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/prompt", authMiddleware, sendPrompt);
router.get("/chats", authMiddleware, getAllChats);
router.get("/chat/:chatId", authMiddleware, getChatMessages);
router.delete("/chat/:chatId", authMiddleware, deleteChat);
router.patch("/chat/:chatId/rename", authMiddleware, renameChat);
router.patch("/chat/:chatId/pin", authMiddleware, togglePinChat);
router.patch("/chat/:chatId/share", authMiddleware, shareChat);



export default router;
