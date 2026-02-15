import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import Prompt from './Prompt';
import NewChat from "../../public/newChat.svg";
import MenuBar from "../../public/menuBar.svg"
import Share from "../../public/share.svg"
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearChat, deleteChat, shareChat } from '../Store/slices/chatSlice';

const Home = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [deleteChatId, setDeleteChatId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const { currentChatId } = useSelector((state) => state.chat);



    const dispatch = useDispatch();


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <>
            <div className="flex h-screen overflow-hidden text-white`">

                <div
                    className={`fixed top-0 left-0 h-full w-66 bg-[#1b1b1c] border-r border-[#282829] transition-transform duration-300 z-40
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <Sidebar
                        closeSidebar={() => setIsSidebarOpen(false)}
                        setDeleteChatId={setDeleteChatId}
                    />
                </div>


                {/* Main content */}
                <div
                    className={`flex-1 flex flex-col w-full transition-all duration-300 min-h-0
                    ${isSidebarOpen ? "pl-66" : "pl-0"}`}
                >
                    <div className="lg:hidden flex items-center justify-between px-4 pt-4">
                        <button onClick={() => setIsSidebarOpen(true)} className='md:hidden'>
                            <img src={MenuBar} alt="Menu" className=" h-5 w-5" />
                        </button>
                        <div className="flex gap-7">
                            <button onClick={() => dispatch(clearChat())} className="md:hidden">
                                <img src={NewChat} alt="NewChat" className=" h-5 w-5" />
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const result = await dispatch(shareChat(currentChatId)).unwrap();
                                        await navigator.clipboard.writeText(result.link);
                                        toast.success("Link copied to clipboard!");

                                        setOpenMenuId(null);

                                    } catch (error) {
                                        toast.error("Failed to share chat");
                                    }
                                }}
                                className="md:hidden">
                                <img src={Share} alt="share" className=" h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col px-2 sm:px-6 transition-all duration-300 min-h-0">

                        <Prompt openSidebar={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} />
                    </div>
                </div>

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}



                {deleteChatId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#2c2c2e] md:w-[420px] w-[350px] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95">

                            <h2 className="text-lg font-semibold text-white mb-3">
                                Delete this chat?
                            </h2>

                            <p className="text-sm text-gray-400 mb-6">
                                This chat can't be recovered. Share links from it will be disabled. Delete?
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteChatId(null)}
                                    className="px-4 py-2 rounded-full bg-[#3a3a3c] text-white hover:bg-[#4a4a4c] transition cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        dispatch(deleteChat(deleteChatId));
                                        setDeleteChatId(null);
                                        toast.success("Chat deleted");
                                    }}
                                    className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default Home