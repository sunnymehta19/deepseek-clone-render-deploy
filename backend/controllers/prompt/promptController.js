import OpenAI from "openai";
import promptModel from "../../model/prompt.js"
import chatModel from "../../model/chat.js";


const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": `${import.meta.env.VITE_API_URL}`,
        "X-Title": "DeepSeek Clone",
    },
});


const sendPrompt = async (req, res) => {
    try {
        const { content, chatId } = req.body;
        const userId = req.user._id;

        if (!content || content.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        let activeChatId = chatId;

        // CREATE CHAT IF NEW
        if (!chatId) {
            const newChat = await chatModel.create({
                userId,
                title: content.slice(0, 30),
            });

            activeChatId = newChat._id;
        }

        // SAVE USER MESSAGE
        await promptModel.create({
            chatId: activeChatId,
            userId,
            role: "user",
            content,
        });

        // AI RESPONSE
        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: [{ role: "user", content }],
        });

        const aiContent = completion.choices[0].message.content;

        // SAVE AI MESSAGE
        await promptModel.create({
            chatId: activeChatId,
            userId,
            role: "assistant",
            content: aiContent,
        });

        // UPDATE CHAT TIMESTAMP
        await chatModel.findByIdAndUpdate(activeChatId, {
            updatedAt: new Date()
        });

        res.status(200).json({
            success: true,
            reply: aiContent,
            chatId: activeChatId,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error sending prompt",
        });
    }
};



const getAllChats = async (req, res) => {
    try {
        const chats = await chatModel.find({ userId: req.user._id })
            .sort({ isPinned: -1, updatedAt: -1 });

        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting chats"
        });
    }
};


const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await promptModel.find({ chatId })
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting chat messages"
        });
    }
};


const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        await promptModel.deleteMany({ chatId });
        await chatModel.findByIdAndDelete(chatId);

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting chat"
        });
    }
};


const renameChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { title } = req.body;

        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.title = title || "Untitled Chat";
        await chat.save();

        res.status(200).json({
            success: true,
            chat
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error renaming chat"
        });
    }
};


const shareChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.isPublic = true;
        await chat.save();

        res.status(200).json({
            success: true,
            link: `${process.env.FRONTEND_BASE_URL}/share/${chatId}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error sharing chat"
        });
    }
};


const togglePinChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.isPinned = !chat.isPinned;
        await chat.save();

        res.status(200).json({
            success: true,
            chat
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error pinning chat"
        });
    }
};



export { sendPrompt, getAllChats, getChatMessages, deleteChat, renameChat, shareChat, togglePinChat };