import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    chats: [],
    messages: [],
    currentChatId: null,
    loading: false,
    error: null,
}

export const fetchChats = createAsyncThunk(
    "chat/fetchChats",
    async () => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/deepseek/chats`,
            { withCredentials: true }
        );
        return data.chats;
    }
);


export const fetchChatMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (chatId) => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/deepseek/chat/${chatId}`,
            { withCredentials: true }
        );

        return {
            chatId,
            messages: data.messages
        };
    }
);


export const sendPrompt = createAsyncThunk(
    "chat/sendPrompt",
    async ({ content, chatId }) => {

        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/deepseek/prompt`,
            { content, chatId },
            { withCredentials: true }
        );

        return {
            chatId: data.chatId,
            userMessage: { role: "user", content },
            assistantMessage: { role: "assistant", content: data.reply },
        };
    }
);


export const deleteChat = createAsyncThunk(
    "chat/deleteChat",
    async (chatId) => {
        await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/deepseek/chat/${chatId}`,
            { withCredentials: true }
        );

        return chatId;
    }
);


export const renameChat = createAsyncThunk(
    "chat/renameChat",
    async ({ chatId, title }) => {
        const { data } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/deepseek/chat/${chatId}/rename`,
            { title },
            { withCredentials: true }
        );

        return data.chat;
    }
);

export const togglePinChat = createAsyncThunk(
    "chat/togglePin",
    async (chatId) => {
        const { data } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/deepseek/chat/${chatId}/pin`,
            {},
            { withCredentials: true }
        );

        return data.chat;
    }
);

export const shareChat = createAsyncThunk(
    "chat/shareChat",
    async (chatId) => {
        const { data } = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/deepseek/chat/${chatId}/share`,
            {},
            { withCredentials: true }
        );

        return {
            chatId,
            link: data.link
        };
    }
);


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChat: (state) => {
            state.messages = [];
            state.currentChatId = null;
            localStorage.removeItem("currentChatId");
        },
        setCurrentChat: (state, action) => {
            state.currentChatId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.chats = action.payload;
            })

            .addCase(fetchChatMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.messages;
                state.currentChatId = action.payload.chatId;
            })
            .addCase(fetchChatMessages.rejected, (state) => {
                state.loading = false;
            })

            .addCase(sendPrompt.pending, (state, action) => {
                state.loading = true;
                const { content } = action.meta.arg;

                state.messages.push({
                    role: "user",
                    content
                });
            })
            .addCase(sendPrompt.fulfilled, (state, action) => {
                state.loading = false;

                const isNewChat = !state.currentChatId;

                state.currentChatId = action.payload.chatId;

                state.messages.push(action.payload.assistantMessage);

                if (isNewChat) {
                    state.chats.unshift({
                        _id: action.payload.chatId,
                        title: action.payload.userMessage.content.slice(0, 30),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isPinned: false
                    });
                }

            })
            .addCase(sendPrompt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.chats = state.chats.filter(
                    chat => chat._id !== action.payload
                );

                if (state.currentChatId === action.payload) {
                    state.messages = [];
                    state.currentChatId = null;
                }
            })

            .addCase(renameChat.fulfilled, (state, action) => {
                const updated = action.payload;

                const index = state.chats.findIndex(c => c._id === updated._id);
                if (index !== -1) state.chats[index] = updated;
            })

            .addCase(togglePinChat.fulfilled, (state, action) => {
                const updated = action.payload;

                const index = state.chats.findIndex(c => c._id === updated._id);
                if (index !== -1) state.chats[index] = updated;

                state.chats.sort((a, b) => {
                    if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
            })


            .addCase(shareChat.fulfilled, (state, action) => {
                state.lastSharedLink = action.payload.link;
            });


    },
});

export const { clearChat, setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
