import { Send, Mic, MicOff, Paperclip } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setText } from "../redux/slice";

export default function ChatInputDock({ onSend, disabled }) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const dispatch = useDispatch();

  const textFromStore = useSelector((state) => state.user.text);

  useEffect(() => {
    if (textFromStore) {
      setInput(textFromStore);
      dispatch(setText(""));
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [textFromStore, dispatch]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput(currentTranscript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-4 px-2">
      <div className="relative bg-[#161a27] border border-white/10 rounded-2xl shadow-2xl p-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-300">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Send a message to Utkarsh..."
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-gray-100 placeholder:text-gray-600 py-3.5 px-4 resize-none outline-none text-[15px] max-h-[200px] custom-scroll font-medium md:font-semibold"
        />
        <div className="flex items-center justify-between px-2 pt-1 border-t border-white/5 mt-1">
          <div className="flex gap-1">
             <button className="p-2.5 hover:bg-white/5 rounded-xl text-gray-500 hover:text-gray-300 transition-colors" title="Attach transmission">
              <Paperclip size={18} />
            </button>
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all ${
                isListening ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/10" : "hover:bg-white/5 text-gray-500"
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
              input.trim() && !disabled 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 active:scale-95" 
                : "bg-white/5 text-gray-600"
            }`}
          >
            <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}
