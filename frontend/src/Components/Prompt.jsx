import React, { useState, useEffect, useRef } from "react";
import { Paperclip, ArrowUp, Globe, Bot } from "lucide-react";
import logo from "../../public/favicon.png";
import DeepThinkLogo from "../../public/deepthink.svg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useDispatch, useSelector } from "react-redux";
import { clearChat, sendPrompt } from "../Store/slices/chatSlice";
import { useNavigate } from "react-router-dom";
import SidebarButton from "../../public/sidebarButton.svg";
import NewChat from "../../public/newChat.svg";
import Whale from "../../public/whale.svg";
import { toast } from "react-toastify";

const Prompt = ({ openSidebar, isSidebarOpen }) => {

    const [inputValue, setInputValue] = useState("");
    const [typeMessage, setTypeMessage] = useState("");

    const dispatch = useDispatch();
    const { messages, loading, currentChatId } = useSelector((state) => state.chat);

    const promtEndRef = useRef();
    const textareaRef = useRef(null);
    const navigate = useNavigate();

    const isDisabled = !inputValue.trim();


    useEffect(() => {
        promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (currentChatId) {
            localStorage.setItem("currentChatId", currentChatId);
        }
    }, [currentChatId]);

    const handleChange = (e) => {
        setInputValue(e.target.value);

        const textarea = textareaRef.current;
        textarea.style.height = "auto";

        const maxHeight = 14 * 24;

        if (textarea.scrollHeight > maxHeight) {
            textarea.style.height = maxHeight + "px";
            textarea.style.overflowY = "auto";
        } else {
            textarea.style.height = textarea.scrollHeight + "px";
            textarea.style.overflowY = "hidden";
        }
    };



    const handleSend = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        setInputValue("");
        setTypeMessage(trimmed);

        dispatch(sendPrompt({
            content: trimmed,
            chatId: currentChatId
        }));

    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`flex flex-col flex-1 min-h-0 w-full px-4 ${messages.length === 0 ? "justify-center" : "pt-0"}`}>


            {/* Greeting only when no messages */}
            {messages.length === 0 && (
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        <img src={logo} alt="DeepSeek Logo" className="h-6 md:h-10" />
                        <h1 className="text-lg md:text-2xl font-bold text-white">
                            How can i help you?
                        </h1>
                    </div>
                </div>
            )}


            {/* Chat Area */}
            {(messages.length > 0 || loading) && (
                <div className="w-full max-w-3xl mx-auto flex-1 min-h-0 overflow-y-auto mt-5 md:mt-10 px-2 pb-40 scroll-area">

                    <div className="space-y-8">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {msg.role === "assistant" ? (
                                    <div className=" text-[15px] leading-7 text-gray-200 max-w-full min-w-0">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ children }) => (
                                                    <h1 className="text-2xl font-semibold mt-6 mb-4">
                                                        {children}
                                                    </h1>
                                                ),
                                                h2: ({ children }) => (
                                                    <h2 className="text-xl font-semibold mt-6 mb-3">
                                                        {children}
                                                    </h2>
                                                ),
                                                h3: ({ children }) => (
                                                    <h3 className="text-lg font-semibold mt-5 mb-2">
                                                        {children}
                                                    </h3>
                                                ),
                                                p: ({ children }) => (
                                                    <p className="mb-4">
                                                        {children}
                                                    </p>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="list-disc ml-6 mb-4 space-y-2">
                                                        {children}
                                                    </ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="list-decimal ml-6 mb-4 space-y-2">
                                                        {children}
                                                    </ol>
                                                ),
                                                hr: ({ ...props }) => (
                                                    <hr
                                                        className="border-0 h-px bg-[#2a2a2a] my-6 opacity-60"
                                                        {...props}
                                                    />
                                                ),
                                                code({ inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || "");
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={codeTheme}
                                                            language={match[1]}
                                                            PreTag="pre"
                                                            wrapLongLines={true}
                                                            codeTagProps={{
                                                                style: {
                                                                    whiteSpace: "pre-wrap",
                                                                    wordBreak: "break-word"
                                                                }
                                                            }}
                                                            customStyle={{
                                                                overflowX: "auto",
                                                                borderRadius: "16px",
                                                                padding: "16px"
                                                            }}
                                                            className="mt-4 text-sm"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, "")}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className="bg-[#2c2c2e] px-1.5 py-0.5 rounded-full text-sm">
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="max-w-[80%] bg-[#2c2c2e] text-white rounded-3xl px-5 py-3 text-[15px] leading-6 break-words">
                                        {msg.content}
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className=" px-5 py-4 ">
                                    <div className="flex gap-2 items-center">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div ref={promtEndRef} />
                    </div>
                </div>
            )}

            {/* Input Box */}
            <div className={`w-full max-w-3xl mx-auto pb-4 lg:pb-6 rounded-t-3xl bg-[#151517] 
                ${messages.length > 0 ? "mt-auto sticky bottom-0" : "mt-7 mb-10"}`}>
                <div className="bg-[#2c2c2e] rounded-3xl px-4 md:px-4 py-4 md:py-3 shadow-md ">
                    <textarea
                        ref={textareaRef}
                        placeholder="Message DeepSeek"
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="ds-scroll bg-transparent w-full text-white placeholder-[#7e8289] text-base md:text-[15px] font-inter font-medium outline-none resize-none overflow-y-hidden"
                    />

                    <div className="flex items-center justify-between mt-4 gap-4">
                        <div className="flex gap-2 flex-nowrap">
                            <div className="relative group">
                                <button
                                    disabled
                                    className="flex items-center gap-1 border border-[#464647] text-white text-[13px] font-bold px-3 py-1.5 rounded-full opacity-40 cursor-not-allowed"
                                >
                                    <img src={DeepThinkLogo} alt="deepthinkimage" className="w-4 h-4" />
                                    <p>DeepThink</p>
                                </button>

                                {/* Tooltip */}
                                <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                    Under Development
                                </span>
                            </div>

                            <div className="relative group">
                                <button
                                    disabled
                                    className="flex items-center gap-1 border border-[#464647] text-white text-[14px] font-semibold px-3 py-1.5 rounded-full opacity-40 cursor-not-allowed"
                                >
                                    <Globe className="w-4 h-4" />
                                    Search
                                </button>

                                {/* Tooltip */}
                                <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                    Under Development
                                </span>
                            </div>

                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                            <div className="relative group">
                                <button
                                    disabled
                                    className="text-gray-500 cursor-not-allowed p-1"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>

                                {/* Tooltip */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#2c2c2e] text-xs text-gray-300 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                    File upload coming soon
                                </div>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={isDisabled}
                                className={`p-2 rounded-full text-white transition 
                                    ${isDisabled
                                        ? "bg-[#3b4f80] cursor-not-allowed opacity-50"
                                        : "bg-[#5686fe] hover:bg-[#5279db] cursor-pointer"
                                    }`}
                            >
                                <ArrowUp className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {!isSidebarOpen && (
                <div className="hidden md:block fixed top-3 left-4 z-50 shadow-lg transition">
                    <div className="flex gap-2 items-center">
                        <img
                            src={Whale}
                            alt="DeepSeek"
                            onClick={() => navigate("/")}
                            className="w-9 h-9 cursor-pointer"
                        />
                        <div className="flex items-center p-0.5 bg-[#353638] border-r-[1px] border-[#282829] rounded-full">
                            <button
                                className="cursor-pointer p-2.5 rounded-full hover:bg-[#454648] transition "
                                onClick={openSidebar}
                            >
                                <img
                                    src={SidebarButton}
                                    alt="Sidebar"
                                    className="w-4 h-4 "
                                />
                            </button>
                            <button
                                className="cursor-pointer p-2.5 rounded-full hover:bg-[#454648] transition"
                                onClick={() => dispatch(clearChat())}
                            >
                                <img
                                    src={NewChat}
                                    alt="New Chat"
                                    className="w-4 h-4 "
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prompt;
