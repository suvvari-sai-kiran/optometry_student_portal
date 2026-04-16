import { useState, useRef, useEffect, Component } from 'react';
import { MessageSquare, X, Send, Bot, Paperclip, Sparkles, User, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../api/config';

/* ─── Error Boundary ─────────────────────────────────────────── */
class ChatErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[ChatAssistant] Render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-8 right-8 w-80 p-6 rounded-2xl bg-slate-900 border border-red-500/30 shadow-2xl z-[9999] flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="text-red-400" size={32} />
          <p className="text-white font-bold">Chat failed to load</p>
          <p className="text-slate-400 text-sm">{this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Safe Markdown renderer ─────────────────────────────────── */
function SafeMarkdown({ text }) {
  if (!text) return null;
  try {
    // Bold **text**
    let parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span className="whitespace-pre-wrap leading-relaxed text-sm">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
          }
          // Handle line breaks
          return part.split('\n').map((line, j, arr) => (
            <span key={`${i}-${j}`}>
              {/* Bullet points */}
              {line.startsWith('- ') || line.startsWith('• ')
                ? <span className="flex gap-2 mt-1"><span className="text-primary mt-0.5">•</span><span>{line.slice(2)}</span></span>
                : line.startsWith('### ')
                ? <strong className="block text-white font-bold mt-2">{line.slice(4)}</strong>
                : line.startsWith('## ')
                ? <strong className="block text-white font-semibold mt-2">{line.slice(3)}</strong>
                : line
              }
              {j < arr.length - 1 && <br />}
            </span>
          ));
        })}
      </span>
    );
  } catch {
    return <span className="text-sm whitespace-pre-wrap">{text}</span>;
  }
}

/* ─── Typing Indicator ───────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-accent rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      <span className="text-xs text-slate-400 font-medium ml-2">EyeCare AI is thinking...</span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
function ChatAssistantInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '### Welcome to EyeCare AI! 👁️\n\nI can help you with:\n- **Optometry Calculations** (Vertex Distance, Transposition)\n- **Clinical Signs** & Diagnosis\n- **Lens Power** analysis\n\nHow can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isLoading, isOpen]);

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setSelectedImage({ data: e.target.result, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    // Skip initial assistant greeting to satisfy Gemini API rule
    const apiHistory = newMessages.filter((m, idx) => !(idx === 0 && m.role === 'assistant'));

    setMessages(newMessages);
    setInput('');
    const currentImage = selectedImage;
    clearImage();
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/chat`, {
        messages: apiHistory,
        image: currentImage
      });
      const reply = res.data?.reply || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error('[ChatAssistant] API error:', err);
      const errMsg = err.response?.data?.message || 'Connection error. Please try again.';
      toast.error('AI connection lost. Retrying...');
      setMessages(prev => [...prev, { role: 'assistant', text: `_${errMsg}_` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      text: '### Welcome to EyeCare AI! 👁️\n\nI can help you with:\n- **Optometry Calculations** (Vertex Distance, Transposition)\n- **Clinical Signs** & Diagnosis\n- **Lens Power** analysis\n\nHow can I assist you today?'
    }]);
  };

  return (
    <>
      {/* ── Toggle Button ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-toggle-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chat Assistant"
            style={{ zIndex: 9998 }}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer ring-4 ring-primary/20"
          >
            <Sparkles className="text-white" size={26} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/30 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 80, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ zIndex: 9999, transformOrigin: 'bottom right' }}
            className="fixed bottom-8 right-8 w-[92vw] md:w-[420px] flex flex-col overflow-hidden shadow-2xl"
            aria-label="EyeCare AI Chat"
          >
            {/* Glassmorphic container */}
            <div
              className="flex flex-col h-[580px] max-h-[85vh] rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)',
              }}
            >
              {/* ── Header ──────────────────────────────────── */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary/90 to-violet-600/90 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">EyeCare AI</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    className="p-2 hover:bg-white/15 rounded-lg transition-colors text-white/60 hover:text-white text-xs font-bold"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                    className="p-2 hover:bg-white/15 rounded-lg transition-colors"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* ── Messages ────────────────────────────────── */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 ${
                          msg.role === 'user'
                            ? 'bg-primary/30 text-primary'
                            : 'bg-violet-500/20 text-violet-400'
                        }`}
                      >
                        {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20'
                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        <SafeMarkdown text={msg.text} />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Loading dots */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Image Preview ────────────────────────────── */}
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mx-4 mb-1"
                >
                  <div className="relative inline-flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl">
                    <img src={imagePreview} alt="Attached" className="w-14 h-14 rounded-lg object-cover ring-1 ring-primary/40" />
                    <span className="text-xs text-slate-400">Image attached</span>
                    <button
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-400 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Input Bar ───────────────────────────────── */}
              <div className="px-4 py-4 border-t border-white/8 bg-slate-900/40">
                <div className="flex items-center gap-2">
                  {/* Attach image */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach image"
                    className="p-2.5 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex-shrink-0"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Text input */}
                  <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
                    placeholder="Ask about eye care, formulas..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />

                  {/* Send */}
                  <button
                    onClick={handleSend}
                    disabled={isLoading || (!input.trim() && !selectedImage)}
                    className="p-2.5 bg-primary hover:bg-primary/85 text-white rounded-xl shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 text-center mt-2 font-medium">
                  Powered by Gemini AI · CLINICAL HUB
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Exported wrapper with Error Boundary ───────────────────── */
export default function ChatAssistant() {
  return (
    <ChatErrorBoundary>
      <ChatAssistantInner />
    </ChatErrorBoundary>
  );
}
