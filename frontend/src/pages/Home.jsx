import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "../store/actions/chatActions";
import {
  Trash,
  Plus,
  Search,
  MessageCircle,
  User,
  LogOut,
  LogIn,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getChatMessages } from "../store/actions/messageActions";
import { addAiMessage, addUserMessage } from "../store/reducers/messageSlice";
import { logOut } from "../store/actions/userActions";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector((state) => state.chat.chats);
  const user = useSelector((state) => state.user.user);
  const messages = useSelector((state) => state.message.message);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setmessage] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // new state for mobile sidebar
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("socket connected");
    });

    socketRef.current.on("ai-response", (msg) => {
      dispatch(addAiMessage(msg));
      setIsAiTyping(false);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("socket connection error:", err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Auto scroll to bottom when messages change or AI is typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  const chatHandler = () => {
    const chat = prompt("enter the name of the chat");
    dispatch(addChat(chat));
  };

  const loginHandler = () => {
    navigate("/login");
  };

  // Close sidebar when a chat is selected (on mobile)
  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
    dispatch(getChatMessages(chatId));
    setIsAiTyping(false);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // Close sidebar on ESC
  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen]);

  const sendMessage = () => {
    if (!message.trim() || !selectedChatId) return;

    const newMessage = {
      role : 'user',
      message: message,
      chat: selectedChatId,
      createdAt: new Date().toISOString(),
    };
    socketRef.current.emit("ai-msg", newMessage);
    dispatch(addUserMessage(newMessage));
    setmessage("");
    setIsAiTyping(true);
  };

  const ThinkingAnimation = () => (
    <div className="flex justify-end mb-4">
      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-zinc-800 text-white">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <span className="text-sm text-zinc-400 ml-2">thinking...</span>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => {
    // Check if no chat is selected
    if (!selectedChatId) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-medium mb-2">
              How can I help you today?
            </h2>
            <p className="text-zinc-500">
              Start a conversation or select a chat from the sidebar
            </p>
          </div>
        </div>
      );
    }

    // Check if messages are loading or empty
    if (!messages || messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-medium mb-2">No messages yet</h2>
            <p className="text-zinc-500">
              Start the conversation by sending a message
            </p>
          </div>
        </div>
      );
    }

    // Render messages
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.isArray(messages) ? (
            messages.map((message, index) => {
              return (
                <div
                  key={message._id || index}
                  className={`flex ${
                    message.sender === "user" || message.role === "user"
                      ? "justify-start"  // User messages on left
                      : "justify-end"    // AI messages on right
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                       message.role === "user"
                        ? "bg-zinc-800 text-white"    // User messages dark
                        : "bg-white text-black"       // AI messages light
                    }`}
                  >
                    <p className="text-sm">
                      {message.message}
                    </p>
                    {(message.timestamp || message.createdAt) && (
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user" || message.role === "user"
                            ? "text-zinc-400"
                            : "text-gray-600"
                        }`}
                      >
                        {new Date(
                          message.timestamp || message.createdAt
                        ).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-zinc-500">
              <p>Messages format error. Check console for details.</p>
            </div>
          )}
          
          {/* Show thinking animation when AI is typing */}
          {isAiTyping && <ThinkingAnimation />}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex h-screen bg-black text-white overflow-hidden">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 border-b border-zinc-800 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 active:scale-95 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" /></svg>
        </button>
        <span className="font-semibold tracking-wide">Nexus</span>
        <button
          onClick={user ? () => dispatch(logOut()) : loginHandler}
          className="text-xs px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
        >
          {user ? 'Logout' : 'Login'}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-hidden={!sidebarOpen && window.innerWidth < 1024}
      >
        <div className="p-6 border-b border-zinc-800 hidden lg:block">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium text-white">Nexus</h1>
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

        {/* Mobile header inside sidebar */}
        <div className="lg:hidden p-4 flex items-center justify-between border-b border-zinc-800 h-14">
          <span className="font-semibold">Chats</span>
          <div className="flex items-center gap-2">
            <button
              onClick={chatHandler}
              className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-auto px-3 py-4">
          <div className="space-y-1">
            {chats && chats?.map((chat) => (
              <div
                onClick={() => handleChatClick(chat._id)}
                key={chat._id}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer ${
                  selectedChatId === chat._id ? 'bg-zinc-900' : ''
                }`}
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

        <div className="p-4 border-t border-zinc-800 hidden lg:block">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User</p>
              </div>
              <button
                onClick={() => dispatch(logOut())}
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

        {/* Mobile footer auth */}
        <div className="lg:hidden border-t border-zinc-800 p-3 mt-auto">
          {user ? (
            <button
              onClick={() => dispatch(logOut())}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:border-zinc-600 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <button
              onClick={loginHandler}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Sign in
            </button>
          )}
        </div>
      </aside>

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm animate-fade-in"
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col pt-14 lg:pt-0">
        {/* Messages area */}
        {renderMessages()}

        {/* Input */}
        <div className="p-4 sm:p-6 border-t border-zinc-800 bg-gradient-to-b from-black to-zinc-950">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              disabled={!selectedChatId}
              placeholder={
                selectedChatId ? 'Message Nexus...' : 'Select a chat to start messaging'
              }
              className="w-full px-4 py-3 sm:py-3.5 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors pr-12"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedChatId || !message.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-lg flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-center text-zinc-500 select-none">
            AI responses may be inaccurate. Verify critical information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;