import { Plus, MessageSquare, PanelLeftClose, User as UserIcon, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChatSidebar({ isOpen, onNewChat, onLoadChat, onClose, refreshTrigger }) {
  const { token, user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    if (token && (isOpen || refreshTrigger > 0)) {
      setLoading(true);
      fetch(`https://utkarsh-ai-chatbot.onrender.com/chathistory`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if(data.conversations) {
          setChats(data.conversations);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch history", err);
        setLoading(false);
      });
    }
  }, [isOpen, token, refreshTrigger]);

  const handleChatClick = (chat) => {
    setActiveChatId(chat.id);
    onLoadChat(chat);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f111a] text-gray-300 select-none">
      
      {/* Sidebar Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
              <Sparkles size={16} className="text-indigo-400" />
           </div>
           <span className="font-black text-sm tracking-[0.2em] uppercase text-gray-400">Utkarsh</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors border border-white/5"
          title="Close Sidebar"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* New Chat Action */}
      <div className="px-4 py-2">
        <button
          onClick={onNewChat}
          className="w-full relative group overflow-hidden rounded-xl p-[1px] bg-gradient-to-br from-indigo-500/50 to-purple-600/50 hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-indigo-600/5"
        >
          <div className="flex items-center justify-center gap-3 bg-[#161a27] px-4 py-3.5 rounded-xl relative z-10">
            <Plus size={20} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-bold text-sm tracking-wide text-gray-100">New Chat</span>
          </div>
        </button>
      </div>

      {/* Chats List Section */}
      <div className="flex-1 overflow-y-auto custom-scroll px-3 py-6 mt-2 space-y-1.5">
        {loading && chats.length === 0 ? (
          <div className="flex flex-col gap-2 px-2">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
             ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="px-4 py-10 text-center opacity-40 italic text-xs">
            No transmissions recorded.
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`
                w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3.5 group relative
                ${activeChatId === chat.id 
                  ? "bg-indigo-600/10 text-indigo-100 border border-indigo-500/30 ring-1 ring-indigo-500/10" 
                  : "hover:bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent"
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full transition-all ${activeChatId === chat.id ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-gray-700 opacity-20'}`} />
              
              <div className="truncate flex-1 min-w-0 pr-1">
                <p className="text-[13px] font-semibold truncate leading-tight">
                  {chat.title || "Untitled Sequence"}
                </p>
                <p className="text-[10px] text-gray-600 font-bold tracking-widest mt-0.5 uppercase">
                  {new Date(chat.timestamp).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-[#161a27] rounded-2xl border border-white/5 p-3.5 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-600/10 transition-colors" />
           
           <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <UserIcon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate tracking-wider uppercase">
                  {user?.name || "Utkarsh Principal"}
                </p>
                <p className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest mt-0.5">
                  Verified Identity
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}