import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your Eye Care Assistant. Ask me about optometry calculations, formulas, or eye health!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsgs = [...messages, { role: 'user', text: input }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { messages: newMsgs });
      setMessages([...newMsgs, { role: 'assistant', text: res.data.reply }]);
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.error || "I'm having trouble connecting to the brain center right now.";
      setMessages([...newMsgs, { role: 'assistant', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            background: 'var(--primary)', color: 'white', border: 'none',
            borderRadius: '50%', width: '60px', height: '60px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)', cursor: 'pointer', zIndex: 1000,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="glass-card" style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '360px', height: '520px', display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden', backgroundColor: 'var(--bg-dark)'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--primary)', padding: '1rem', display: 'flex', 
            justifyContent: 'space-between', alignItems: 'center', color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={24} />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Eye Care Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                color: 'white', padding: '0.8rem 1rem', borderRadius: '12px',
                borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                maxWidth: '85%', fontSize: '0.9rem', lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: 'white',
                padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.9rem'
              }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Ask an optometry query..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ background: 'rgba(0,0,0,0.2)' }}
            />
            <button 
              onClick={handleSend}
              className="btn btn-primary"
              style={{ padding: '0.8rem' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
