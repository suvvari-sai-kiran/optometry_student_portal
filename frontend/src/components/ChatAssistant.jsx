import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Paperclip, Trash2 } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../api/config';

/**
 * ChatAssistant Component - Completely rebuilt from scratch using Axios
 * Features: Multi-modal support, clipboard paste, auto-scroll, loading states.
 */
export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your Eye Care Assistant. Ask me about optometry calculations, formulas, or eye health!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, imagePreview]);

  const handleImageSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Only images are supported.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setSelectedImage({
        data: e.target.result,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            handleImageSelect(items[i].getAsFile());
            break;
        }
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = { role: 'user', text: input };
    const currentMsgs = [...messages, userMessage];
    const imageToSend = selectedImage;

    setMessages(currentMsgs);
    setInput('');
    clearImage();
    setIsLoading(true);

    try {
      // POST request to backend with 10s timeout via controller
      const res = await axios.post(`${BASE_URL}/api/chat`, { 
        messages: currentMsgs,
        image: imageToSend
      });
      
      setMessages([...currentMsgs, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = "I'm having trouble connecting to the brain center right now.";
      setMessages([...currentMsgs, { role: 'assistant', text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            background: 'var(--primary)', color: 'white', border: 'none',
            borderRadius: '50%', width: '60px', height: '60px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)', cursor: 'pointer', zIndex: 1000
          }}
        >
          <MessageSquare size={28} />
        </button>
      )}

      {isOpen && (
        <div className="glass-card chat-assistant-panel" style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '380px', height: '550px', display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden', backgroundColor: 'var(--bg-dark)'
        }}>
          <header style={{
            background: 'var(--primary)', padding: '1rem', display: 'flex', 
            justifyContent: 'space-between', alignItems: 'center', color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Eye Care Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </header>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                color: 'white', padding: '0.8rem 1.2rem', borderRadius: '14px',
                maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.6rem 1rem', borderRadius: '12px' }}>
                Brain center thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {imagePreview && (
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
               <img src={imagePreview} alt="Preview" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '8px', border: '1px solid var(--primary)' }} />
               <button onClick={clearImage} style={{ position: 'absolute', top: '0.5rem', left: '85px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '50%', color: '#ef4444', cursor: 'pointer' }}>
                 <Trash2 size={16} />
               </button>
            </div>
          )}

          <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="file" ref={fileInputRef} onChange={(e) => handleImageSelect(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Ask an optometry query..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              onPaste={handlePaste}
              style={{ background: 'rgba(0,0,0,0.2)', flex: 1 }}
            />
            <button onClick={handleSend} disabled={isLoading} className="btn btn-primary" style={{ padding: '0.8rem' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
