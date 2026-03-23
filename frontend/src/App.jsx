import ChatHero from "./components/ChatHero";
import ChatSidebar from "./components/ChatSidebar";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { useState, useRef, useEffect } from "react";
import { PanelLeftOpen, LogOut, Heart, Plus, Sparkles } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default false for "clean" landing page
  const [showSignup, setShowSignup] = useState(false);
  const chatHeroRef = useRef(null);
  const { user, logout } = useAuth();
  const [historyVersion, setHistoryVersion] = useState(0);

  // Auto-close sidebar on small screens
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLoadChat = (chatData) => {
    if (chatHeroRef.current && chatHeroRef.current.loadConversation) {
      chatHeroRef.current.loadConversation(chatData);
      setSidebarOpen(false); // Close sidebar after selection for better focus
    }
  };

  const handleSaveSuccess = () => {
    setHistoryVersion(prev => prev + 1);
  };

  const handleNewChat = () => {
    if (chatHeroRef.current && chatHeroRef.current.resetChat) {
      chatHeroRef.current.resetChat();
      setSidebarOpen(false);
    }
  };

  if (!user) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return (
    <div className="flex h-[100dvh] bg-[#0b0d14] text-gray-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar Component */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside 
            initial={{ width: 0, x: -50, opacity: 0 }}
            animate={{ width: 280, x: 0, opacity: 1 }}
            exit={{ width: 0, x: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full z-40 shrink-0 border-r border-white/5 bg-[#0f111a] overflow-hidden"
          >
            <ChatSidebar 
              isOpen={sidebarOpen} 
              onNewChat={handleNewChat} 
              onLoadChat={handleLoadChat}
              onClose={() => setSidebarOpen(false)}
              refreshTrigger={historyVersion}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-[#0b0d14] h-full">
        
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-[#0f111a]/50 backdrop-blur-xl border-b border-white/5 z-20">
          <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-all border border-white/5 group ${sidebarOpen ? 'bg-indigo-600/10 text-indigo-400' : 'bg-transparent text-gray-400 hover:text-white'}`}
                title="Toggle Sidebar"
              >
                <PanelLeftOpen size={20} className={`${sidebarOpen ? 'rotate-180' : ''} transition-transform duration-300`} />
              </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative group hidden xs:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#161a27] border border-white/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-indigo-400 fill-indigo-400/20" />
                </div>
              </div>
              <span className="font-black text-lg sm:text-xl tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-gray-500 truncate max-w-[120px] sm:max-w-none">
                Utkarsh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* Redesigned New Chat Button */}
             <button
              onClick={handleNewChat}
              className="relative group p-[1px] rounded-xl overflow-hidden shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all"
              title="New Chat Session"
            >
              {/* Animated Gradient Border Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 animate-gradient-x opacity-70 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative px-3 py-2 bg-[#0f111a]/90 backdrop-blur-xl rounded-[11px] flex items-center justify-center gap-2 group-hover:bg-[#0f111a]/60 transition-colors">
                <Plus size={18} className="text-indigo-400 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[11px]"></div>
              </div>
            </button>

            <button
              onClick={logout}
              className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center gap-2"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Chat Workspace */}
        <main className="flex-1 min-h-0 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)]">
          <ChatHero 
            ref={chatHeroRef} 
            onSaveSuccess={handleSaveSuccess} 
            onFirstMessage={() => setSidebarOpen(false)} // Keep sidebar closed on landing
          />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
