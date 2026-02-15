import React, { useState, useRef, useEffect } from "react";
import { BadgeQuestionMark, LogOut, Pin, Settings, Smartphone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../Store/slices/authSlice";
import DeepSeekLogo from "../../public/deepSeekLogo.svg";
import SidebarButton from "../../public/sidebarButton.svg";
import NewChat from "../../public/newChat.svg";
import ThreeDot from "../../public/threeDot.svg";
import noMessage from "../../public/message.svg";
import { clearChat, deleteChat, fetchChatMessages, fetchChats, renameChat, setCurrentChat, shareChat, togglePinChat } from "../Store/slices/chatSlice";
import { toast } from "react-toastify";
import { TiPin } from "react-icons/ti";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaShare } from "react-icons/fa";




const groupChatsByDate = (chats) => {
    const groups = {};
    const now = new Date();

    chats.forEach(chat => {

        const rawDate = chat.updatedAt || chat.createdAt;
        const date = rawDate ? new Date(rawDate) : new Date();

        if (isNaN(date.getTime())) return;

        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        let label;

        if (diffDays === 0) label = "Today";
        else if (diffDays === 1) label = "Yesterday";
        else if (diffDays <= 7) label = "7 Days";
        else if (diffDays <= 30) label = "30 Days";
        else label = date.toISOString().slice(0, 7);

        if (!groups[label]) groups[label] = [];
        groups[label].push(chat);
    });

    return groups;
};


const Sidebar = ({ closeSidebar, setDeleteChatId }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [titleValue, setTitleValue] = useState("");


    const menuRef = useRef(null);

    const { user, isAuthenticated } = useSelector((store) => store.auth);
    const { chats, currentChatId } = useSelector(state => state.chat);

    const groupedChats = groupChatsByDate(chats);


    if (!user) return null;


    const handleLogout = async () => {
        try {
            const data = await dispatch(logOutUser()).unwrap();
            await dispatch(clearChat());
            navigate("/login");

        } catch (error) {
            toast.success((error?.response?.data?.errors || "Logout Failed"));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const close = () => setOpenMenuId(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);


    useEffect(() => {
        dispatch(fetchChats());
    }, []);


    useEffect(() => {
        const savedChatId = localStorage.getItem("currentChatId");

        if (savedChatId) {
            dispatch(fetchChatMessages(savedChatId));
            dispatch(setCurrentChat(savedChatId));
        }
    }, []);


    return (
        <div className="h-full flex flex-col justify-between p-3">
            {/* Header */}
            <div>
                <div className="">
                    <div className="flex py-2 px-1 justify-between items-center mb-3">
                        <div className="text-2xl font-bold ">
                            <img
                                src={DeepSeekLogo}
                                alt="deepseeklogo"
                                className="cursor-pointer"
                                onClick={() => navigate("/")}
                            />
                        </div>
                        <button
                            onClick={closeSidebar}
                            className="p-2 rounded-full hover:bg-[#2D2D2E] transition"
                        >
                            <img src={SidebarButton} alt="" className="cursor-pointer" />
                        </button>

                    </div>

                    <div className="">
                        <button
                            onClick={() => dispatch(clearChat())}
                            className="flex gap-1 items-center justify-center font-semibold font-inter text-[15px] w-full bg-[#43454a] text-[#f0f1f2] py-2 rounded-full mb-7 cursor-pointer shadow-sm"
                        >
                            <span className="">
                                <img src={NewChat} alt="" />
                            </span>
                            <span className="">New chat</span>
                        </button>
                    </div>
                </div>

                {/* History */}
                <div className="scroll-area text-gray-500 text-sm overflow-y-scroll h-[70vh]">

                    <div className="scroll-area text-gray-500 text-sm overflow-y-scroll h-[70vh] spac-y-2">
                        {/* No chat history yet */}

                        {chats.length === 0 ? (
                            <div className="flex flex-col justify-center items-center gap-2 h-full text-gray-500 text-sm px-2">
                                <span>
                                    <img src={noMessage} alt="" />
                                </span>
                                <span className="text-xs font-bold text-[#94989d]">No chat History</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">

                                {Object.entries(groupedChats).map(([label, chats]) => (
                                    <div key={label}>

                                        {/* GROUP TITLE */}
                                        <div className="text-xs text-gray-500 px-2 mb-1 font-bold">
                                            {label}
                                        </div>

                                        {/* CHATS */}
                                        <div className="flex flex-col ">
                                            {chats.map(chat => (
                                                <div
                                                    key={chat._id}
                                                    className={`group flex items-center justify-between ${editingId === chat._id ? "" : "px-2 py-2.5"} font-semibold rounded-xl cursor-pointer text-[#f0f1f2]
                                                         ${currentChatId === chat._id
                                                            ? "bg-[#2c2c2e]"
                                                            : "hover:bg-[#353638]"
                                                        }`}
                                                >

                                                    <div className="flex w-full items-center">

                                                        {/* LEFT — TITLE */}
                                                        <div className="flex-1 min-w-0">

                                                            {editingId === chat._id ? (
                                                                <input
                                                                    autoFocus
                                                                    value={titleValue}
                                                                    onChange={(e) => setTitleValue(e.target.value)}
                                                                    onBlur={() => {
                                                                        dispatch(renameChat({ chatId: chat._id, title: titleValue }));
                                                                        setEditingId(null);
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            dispatch(renameChat({ chatId: chat._id, title: titleValue }));
                                                                            setEditingId(null);
                                                                        }
                                                                        if (e.key === "Escape") {
                                                                            setEditingId(null);
                                                                        }
                                                                    }}
                                                                    className="bg-transparent outline-none border px-2 py-2 rounded-xl  border-[#5686FE] text-white w-full"
                                                                />
                                                            ) : (
                                                                <span
                                                                    onClick={() => {
                                                                        dispatch(fetchChatMessages(chat._id));
                                                                        dispatch(setCurrentChat(chat._id));
                                                                    }}
                                                                    className="truncate block cursor-pointer"
                                                                >
                                                                    {chat.title}
                                                                </span>
                                                            )}

                                                        </div>

                                                        {/* RIGHT — ICONS (fixed width) */}
                                                        <div className="flex items-center gap-2 ml-2 shrink-0">

                                                            {chat.isPinned && (
                                                                <span className="text-lg"><TiPin /></span>
                                                            )}

                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenMenuId(prev => prev === chat._id ? null : chat._id);
                                                                    }}
                                                                    className={`transition cursor-pointer
                                                                            ${openMenuId === chat._id
                                                                            ? "opacity-100"
                                                                            : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}
                                                                            `}
                                                                >
                                                                    <img src={ThreeDot} className="w-4 h-4 pt-1" />
                                                                </button>

                                                                {openMenuId === chat._id && (
                                                                    <div className="absolute right-0 mt-2 w-32 bg-[#2c2c2e] border border-[#3a3a3c] rounded-xl shadow-lg p-1 z-50">

                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingId(chat._id);
                                                                                setTitleValue(chat.title);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="menuItem flex gap-2 items-center cursor-pointer"
                                                                        >
                                                                            <MdDriveFileRenameOutline />
                                                                            Rename
                                                                        </button>

                                                                        <button
                                                                            onClick={() => dispatch(togglePinChat(chat._id))}
                                                                            className="menuItem flex gap-2 items-center cursor-pointer"
                                                                        >
                                                                            <TiPin />
                                                                            {chat.isPinned ? "Unpin" : "Pin"}
                                                                        </button>

                                                                        <button
                                                                            onClick={async () => {
                                                                                try {
                                                                                    const result = await dispatch(shareChat(chat._id)).unwrap();
                                                                                    await navigator.clipboard.writeText(result.link);
                                                                                    toast.success("Link copied to clipboard!");

                                                                                    setOpenMenuId(null);

                                                                                } catch (error) {
                                                                                    toast.error("Failed to share chat");
                                                                                }
                                                                            }}
                                                                            className="menuItem flex gap-2 items-center cursor-pointer"
                                                                        >
                                                                            <FaShare />
                                                                            Share
                                                                        </button>

                                                                        <button
                                                                            onClick={() => {
                                                                                setDeleteChatId(chat._id);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="menuItem text-red-400 flex gap-2 items-center cursor-pointer"
                                                                        >
                                                                            <RiDeleteBinLine />
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className=" border-t border-gray-600">
                <div
                    ref={menuRef}
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className=" relative flex items-center justify-between px-2 hover:bg-[#29292b] rounded-xl mt-2 cursor-pointer"
                >
                    <div className="flex  items-center gap-2 cursor-pointer my-2 ">
                        <div className="bg-black text-white w-4 h-4 flex items-center justify-center p-4 font-extrabold rounded-full capitalize">
                            {user?.username[0]?.toUpperCase()}
                        </div>
                        <div className="text-gray-300 font-bold capitalize">
                            {user ? user.username : "My Profile"}
                        </div>
                    </div>
                    {isMenuOpen && (
                        <div className="absolute bottom-12 right-5 w-56 bg-[#2c2c2e] border border-[#3a3a3c] text-white rounded-xl shadow-lg p-1 z-50 transition-all duration-200">

                            <button className="flex gap-2 items-center w-full text-left px-2 py-2 text-sm hover:bg-[#3a3a3c] rounded-lg cursor-pointer transition">
                                <span ><Smartphone size={20} /></span>
                                <span>Download mobile App</span>
                            </button>

                            <button className="flex gap-2 w-full text-left px-2 py-2 text-sm hover:bg-[#3a3a3c] rounded-lg cursor-pointer transition">
                                <span><Settings size={20} /></span>
                                <span>Settings</span>
                            </button>

                            <button className="flex gap-2 w-full text-left px-2 py-2 text-sm hover:bg-[#3a3a3c] rounded-lg cursor-pointer transition">
                                <span><BadgeQuestionMark size={20} /></span>
                                <span>Help & Feedback</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex gap-2 w-full text-left px-2 py-2 text-sm hover:bg-[#3a3a3c] rounded-lg cursor-pointer transition "
                            >
                                <span><LogOut size={20} /></span>
                                <span>Log out</span>
                            </button>

                        </div>
                    )}

                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(prev => !prev)}>
                            <img src={ThreeDot} alt="menu" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar