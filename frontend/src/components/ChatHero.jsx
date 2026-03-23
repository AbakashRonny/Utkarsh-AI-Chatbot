import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Send, Bot, User, Heart, Loader2, Copy, Check, Zap, Code, Shield, Brain, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch } from "react-redux";
import { setText } from "../redux/slice";
import ChatInputDock from "./ChatInputDock";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute right-3 top-3 z-10">
        <button
          onClick={copyToClipboard}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md transition-all border border-white/10"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
        </button>
      </div>
      <pre className="bg-[#050608] rounded-2xl p-6 overflow-x-auto border border-white/5 shadow-2xl">
        <code className="text-sm font-mono leading-relaxed text-indigo-100">{children}</code>
      </pre>
    </div>
  );
};

const ChatHero = forwardRef(({ onSaveSuccess }, ref) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConvId, setCurrentConvId] = useState(null);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const pool = [
      { icon: <Zap size={18} className="text-yellow-400" />, text: "Analyze the current propulsion physics" },
      { icon: <Code size={18} className="text-indigo-400" />, text: "Draft a modern React framework" },
      { icon: <Brain size={18} className="text-purple-400" />, text: "Explain cognitive bias in AI" },
      { icon: <Shield size={18} className="text-emerald-400" />, text: "Simulate a cybersecurity audit" },
      { icon: <Bot size={18} className="text-blue-400" />, text: "Write a poem about neural networks" },
      { icon: <Code size={18} className="text-orange-400" />, text: "Optimize this SQL query for speed" },
      { icon: <Sparkles size={18} className="text-pink-400" />, text: "Imagine a futuristic Martian city" },
      { icon: <Shield size={18} className="text-red-400" />, text: "Find vulnerabilities in this code" }
    ];
    // Shuffle and pick 4
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 4));
  }, []);

  useImperativeHandle(ref, () => ({
    resetChat: () => {
      setMessages([]);
      setCurrentConvId(null);
    },
    setConversationId: (id) => setCurrentConvId(id),
    loadConversation: (chatData) => {
      try {
        const loadedMsgs = typeof chatData.conversation === 'string' 
          ? JSON.parse(chatData.conversation) 
          : chatData.conversation;
        setMessages(loadedMsgs);
        setCurrentConvId(chatData.id);
      } catch (e) {
        console.error("Failed to parse conversation", e);
      }
    }
  }));

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsTyping(true);

    let activeConvId = currentConvId;

    if (token) {
        try {
            const initialSaveRes = await fetch("https://utkarsh-ai-chatbot.onrender.com/api/save-conversation", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                conversation: newMessages,
                timestamp: new Date().toISOString(),
                title: messages.length === 0 ? text.substring(0, 45) : null,
                conversation_id: activeConvId
              }),
            });
            const initialSaveData = await initialSaveRes.json();
            if (initialSaveData.success && initialSaveData.conversation_id) {
                activeConvId = initialSaveData.conversation_id;
                setCurrentConvId(activeConvId);
                if (onSaveSuccess) onSaveSuccess(); 
            }
        } catch (e) {
            console.error("Initial save failed", e);
        }
    }

    try {
      const response = await fetch("https://utkarsh-ai-chatbot.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      const assistantMsg = { role: "assistant", content: data.reply };
      const updatedMessages = [...newMessages, assistantMsg];
      
      setMessages(updatedMessages);

      if (token) {
        const finalSaveRes = await fetch("https://utkarsh-ai-chatbot.onrender.com/api/save-conversation", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            conversation: updatedMessages,
            timestamp: new Date().toISOString(),
            title: null, 
            conversation_id: activeConvId
          }),
        });
        const finalSaveData = await finalSaveRes.json();
        if (finalSaveData.success) {
            if (onSaveSuccess) onSaveSuccess();
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Protocol interrupted. Transmission lost." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto overflow-hidden relative">
      <div 
        ref={chatContainerRef}
        className={`flex-1 ${messages.length === 0 ? 'overflow-y-hidden' : 'overflow-y-auto'} custom-scroll px-3 sm:px-4 md:px-12 py-6 sm:py-10 lg:py-16 scroll-smooth`}
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[70%] sm:min-h-[60vh] text-center pt-8 sm:pt-0"
            >
              {/* Unique Animated Logo */}
              <div className="relative mb-6 sm:mb-8 group">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-4 bg-indigo-500 rounded-full blur-2xl"
                />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#161a27] rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl shadow-indigo-600/20 group-hover:border-indigo-500/50 transition-colors duration-500">
                  <Sparkles size={36} className="text-indigo-500 sm:size-[44px] fill-indigo-500/10 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-3 sm:mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-gray-600">
                Utkarsh
              </h1>
              <p className="text-gray-500 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[9px] sm:text-xs mb-8 sm:mb-12 px-4 leading-relaxed">
                Unified Intelligence Interface
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl px-4">
                {suggestions.map((item, i) => (
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    key={i}
                    onClick={() => dispatch(setText(item.text))}
                    className="flex items-center gap-3 sm:gap-4 text-left bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-sm text-gray-400 transition-all hover:border-indigo-500/30 group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0f111a] flex items-center justify-center group-hover:bg-indigo-600/10 shrink-0 transition-colors">{item.icon}</div>
                    <span className="font-semibold line-clamp-1">{item.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-12 max-w-4xl mx-auto">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex gap-5 group ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center shrink-0 mt-2 shadow-2xl ring-1 ring-white/10 ${
                    msg.role === "user" ? "bg-indigo-600 text-white" : "bg-[#161a27] text-indigo-400"
                  }`}>
                    {msg.role === "user" ? <User size={20} /> : <Bot size={22} />}
                  </div>
                  
                  <div className={`flex flex-col flex-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`text-[10px] font-black text-gray-600 mb-2 uppercase tracking-[0.2em] px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                      {msg.role === "user" ? "Operator" : "Utkarsh Network"}
                    </div>
                    <div className={`prose prose-invert max-w-none text-[15px] md:text-[16px] leading-[1.8] px-6 py-4 md:px-7 md:py-5 rounded-[2rem] shadow-2xl transition-all ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-indigo-700 to-purple-800 text-white rounded-tr-none shadow-indigo-600/20" 
                        : "bg-[#161a27]/80 border border-white/5 backdrop-blur-xl rounded-tl-none text-indigo-50/90"
                    }`}>
                      {msg.role === "assistant" ? (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code: ({ node, inline, children, ...props }) => 
                              inline ? <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">{children}</code> : <CodeBlock>{children}</CodeBlock>,
                            p: ({children}) => <p className="mb-5 last:mb-0">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-6 mb-5 space-y-2 marker:text-indigo-400">{children}</ul>,
                            h2: ({children}) => <h2 className="text-xl font-black mb-4 text-white tracking-wide uppercase border-b border-white/5 pb-2">{children}</h2>
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-6 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#161a27] ring-1 ring-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                    <Loader2 size={18} className="animate-spin relative z-10" />
                  </div>
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[2rem] rounded-tl-none flex gap-2 h-12 items-center justify-center animate-in fade-in duration-500">
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-10" />
      </div>

      <div className="shrink-0 relative z-10 p-4">
        <ChatInputDock onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
});

ChatHero.displayName = "ChatHero";
export default ChatHero;
