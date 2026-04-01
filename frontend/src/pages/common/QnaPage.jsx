import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, Search, Plus, CornerDownRight, ChevronLeft } from 'lucide-react';
import BASE_URL from '../../api/config';

export default function QnaPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [view, setView] = useState('list'); // 'list', 'thread'
  const [selectedThread, setSelectedThread] = useState(null);
  
  const [showAskForm, setShowAskForm] = useState(false);
  const [askForm, setAskForm] = useState({ title: '', content: '' });
  
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async (query = '') => {
    try {
      const res = await axios.get(`${BASE_URL}/api/qna?search=${query}`);
      setThreads(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchThreads(searchTerm);
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/qna`, {
        userId: user.id,
        title: askForm.title,
        content: askForm.content
      });
      setShowAskForm(false);
      setAskForm({ title: '', content: '' });
      fetchThreads(searchTerm);
    } catch (e) { alert("Error asking question"); }
  };

  const openThread = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/qna/${id}`);
      setSelectedThread(res.data);
      setView('thread');
    } catch (e) { console.error(e); }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/qna/${selectedThread.id}/reply`, {
        userId: user.id,
        content: replyContent
      });
      setReplyContent('');
      openThread(selectedThread.id); // refresh thread
    } catch (e) { alert("Error adding reply"); }
  };


  const renderList = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
          <input 
            type="text" 
            className="input-base" 
            placeholder="Search questions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            <Search size={18} />
          </button>
        </form>
        
        <button className="btn btn-primary" onClick={() => setShowAskForm(!showAskForm)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Ask Question
        </button>
      </div>

      {showAskForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleAskQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" className="input-base" placeholder="Question Title" required value={askForm.title} onChange={e => setAskForm({...askForm, title: e.target.value})} />
            <textarea className="input-base" placeholder="Detailed description..." rows="3" required value={askForm.content} onChange={e => setAskForm({...askForm, content: e.target.value})}></textarea>
            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>Post Question</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {threads.map(thread => (
          <div key={thread.id} className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => openThread(thread.id)} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{thread.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{thread.content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>By {thread.authorName}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MessageCircle size={14} /> {thread.replyCount} Replies</span>
            </div>
          </div>
        ))}
        {threads.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No questions found. Be the first to ask!</p>}
      </div>
    </>
  );

  const renderThread = () => (
    <>
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => setView('list')}>
        <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Q&A
      </button>

      {selectedThread && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Post */}
          <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
            <h2 style={{ marginTop: 0 }}>{selectedThread.title}</h2>
            <p style={{ lineHeight: '1.6' }}>{selectedThread.content}</p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
              Posted by {selectedThread.authorName} on {new Date(selectedThread.createdAt).toLocaleDateString()}
            </div>
          </div>

          <h3 style={{ marginTop: '1rem' }}>Replies {selectedThread.replies?.length > 0 && "(" + selectedThread.replies.length + ")"}</h3>
          
          {/* Replies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedThread.replies?.map(reply => (
              <div key={reply.id} className="glass-card" style={{ padding: '1.5rem', marginLeft: '2rem', borderLeft: reply.authorRole === 'admin' ? '4px solid var(--success)' : 'none' }}>
                <p style={{ margin: '0 0 1rem 0', lineHeight: '1.5' }}>{reply.content}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CornerDownRight size={14} /> 
                  Replied by {reply.authorName} {reply.authorRole === 'admin' && <span style={{ background: 'var(--success)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem' }}>Instructor</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
            <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea className="input-base" placeholder="Write your reply here..." rows="3" required value={replyContent} onChange={e => setReplyContent(e.target.value)}></textarea>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Reply</button>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Discussion Forum</h2>
          <p style={{ color: 'var(--text-muted)' }}>Ask questions and discuss optometry concepts</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')}>
          Dashboard
        </button>
      </header>

      {view === 'list' && renderList()}
      {view === 'thread' && renderThread()}
    </div>
  );
}
