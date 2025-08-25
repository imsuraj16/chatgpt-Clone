import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "../store/actions/chatActions";
import { Trash, Plus, Search, MessageCircle, User, LogOut, LogIn } from "lucide-react";
import { logoutUser } from "../store/actions/userActions";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector((state) => state.chat.chats);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("connect_error", (err) => {
      console.error("socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chatHandler = () => {
    const chat = prompt("enter the name of the chat");
    dispatch(addChat(chat));
  };

  const loginHandler = () => {
    navigate("/login");
  };

  return (
    <div className="w-full flex h-screen bg-black text-white">
      <div className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium text-white">Grok</h1>
            <button
              onClick={chatHandler}
              className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto px-3 py-4">
          <div className="space-y-1">
            {chats && chats?.map((chat) => (
              <div
                key={chat._id}
                className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <span className="text-sm text-zinc-300 truncate">{chat.title}</span>
                <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-800 transition-all">
                  <Trash className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            ))}
            
            {(!chats || chats.length === 0) && (
              <div className="text-center py-12">
                <MessageCircle className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">No chats</p>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-zinc-800">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User</p>
              </div>
              <button
                onClick={() => dispatch(logoutUser())}
                className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
              >
                <LogOut className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginHandler}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Chat area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-medium mb-2">How can I help you today?</h2>
            <p className="text-zinc-500">Start a conversation or select a chat from the sidebar</p>
          </div>
        </div>

        {/* Input */}
        <div className="p-6">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Message Grok..."
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors pr-12"
              onChange={(e)=>console.log(e.target.value)
              }
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white text-black rounded-lg flex items-center justify-center hover:bg-zinc-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;