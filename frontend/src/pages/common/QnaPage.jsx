import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MessageCircle, Search, Plus, CornerDownRight, 
  ChevronLeft, User, Send, Clock, Filter, 
  ShieldCheck, MessageSquare, ArrowRight,
  TrendingUp, Award, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../../api/config';
import Footer from '../../components/Footer';

export default function QnaPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState('list'); // 'list', 'thread'
  const [selectedThread, setSelectedThread] = useState(null);
  
  const [showAskForm, setShowAskForm] = useState(false);
  const [askForm, setAskForm] = useState({ title: '', content: '' });
  
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/qna?search=${query}`);
      setThreads(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchThreads(searchTerm);
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Publishing your inquiry...');
    try {
      await axios.post(`${BASE_URL}/api/qna`, {
        userId: user.id,
        title: askForm.title,
        content: askForm.content
      });
      setShowAskForm(false);
      setAskForm({ title: '', content: '' });
      fetchThreads(searchTerm);
      toast.success('Question live in the forum!', { id: loadId });
    } catch (e) { toast.error("Error asking question", { id: loadId }); }
  };

  const openThread = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/qna/${id}`);
      setSelectedThread(res.data);
      setView('thread');
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Syncing response...');
    try {
      await axios.post(`${BASE_URL}/api/qna/${selectedThread.id}/reply`, {
        userId: user.id,
        content: replyContent
      });
      setReplyContent('');
      openThread(selectedThread.id); 
      toast.success('Response shared!', { id: loadId });
    } catch (e) { toast.error("Error adding reply", { id: loadId }); }
  };

  const Avatar = ({ name, role, size = "md" }) => {
    const initials = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
    const isAdmin = role === 'admin';
    const sizeMap = {
      sm: "w-8 h-8 text-[10px]",
      md: "w-10 h-10 text-xs",
      lg: "w-12 h-12 text-sm"
    };

    return (
      <div className={`${sizeMap[size]} rounded-xl flex items-center justify-center font-bold relative shrink-0 transition-transform hover:scale-105 ${isAdmin ? 'bg-primary text-white ring-2 ring-primary/20' : 'bg-white/5 text-slate-400 border border-white/10 shadow-inner'}`}>
        {initials}
        {isAdmin && (
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-background shadow-lg">
             <ShieldCheck size={8} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  const ThreadCard = ({ thread }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => openThread(thread.id)}
      className="glass-card p-6 cursor-pointer group border border-white/5 hover:border-primary/20 transition-all flex gap-5"
    >
      <Avatar name={thread.authorName} role={user.role} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate pr-4 leading-tight">{thread.title}</h3>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md shrink-0 border border-white/5">
             <Clock size={10} className="inline mr-1" /> {new Date(thread.createdAt).toLocaleDateString()}
           </span>
        </div>
        <p className="text-slate-400 text-sm italic line-clamp-2 leading-relaxed mb-4">{thread.content}</p>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">By {thread.authorName}</span>
              <span className="w-1 h-1 bg-slate-800 rounded-full" />
              <span className="text-xs font-medium text-primary flex items-center gap-1"><MessageCircle size={12} /> {thread.replyCount} Discussions</span>
           </div>
           <ArrowRight size={16} className="text-slate-600 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 md:p-12">
      <div className="w-full max-w-5xl space-y-12 pb-20">
        
        {/* Forum Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in relative z-10">
           <div className="space-y-4">
             <button 
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest"
             >
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               Dashboard
             </button>
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10">
                   <MessageSquare size={28} className="text-primary" />
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">The Optic Forum</h2>
               </div>
               <p className="text-slate-400 font-medium italic">Share knowledge, ask clinical questions, and collaborative with pears.</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-64 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search threads..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              />
            </div>
            <button 
              onClick={() => setShowAskForm(!showAskForm)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} /> New Thread
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
               key="list"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="space-y-8"
            >
              {/* Quick Stats Banner */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-y border-white/5 py-4 animate-fade-in [animation-delay:300ms]">
                 <div className="flex items-center gap-6 divide-x divide-white/5">
                    <div className="flex items-center gap-2"><TrendingUp size={16} className="text-emerald-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trending Topics</span></div>
                    <div className="pl-6 flex items-center gap-2"><Award size={16} className="text-amber-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Instructors</span></div>
                    <div className="pl-6 flex items-center gap-2"><Zap size={16} className="text-primary" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-black italic">{threads.length} Total Threads</span></div>
                 </div>
                 <div className="flex items-center gap-2 text-slate-600">
                    <Filter size={14} /> <span className="text-xs font-bold uppercase tracking-widest">Sort: Recent</span>
                 </div>
              </div>

              {showAskForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 border-primary/30 relative overflow-hidden group">
                   <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                      <Plus size={200} />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Initiate Clinical Thread</h3>
                   <form onSubmit={handleAskQuestion} className="space-y-6 relative z-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Inquiry Title</label>
                        <input type="text" className="input-base" placeholder="Summarize your clinical challenge..." required value={askForm.title} onChange={e => setAskForm({...askForm, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Clinical Context</label>
                        <textarea className="input-base min-h-[150px]" placeholder="Provide patient history, findings, or specific theoretical doubts..." required value={askForm.content} onChange={e => setAskForm({...askForm, content: e.target.value})}></textarea>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <button type="submit" className="flex-1 bg-primary text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 tracking-widest uppercase text-[10px] flex items-center justify-center gap-2">Post Public Inquiry <Send size={14} /></button>
                        <button type="button" onClick={() => setShowAskForm(false)} className="px-10 bg-white/5 text-slate-500 hover:text-white font-black rounded-xl transition-all uppercase text-[10px] tracking-widest">Discard</button>
                      </div>
                   </form>
                </motion.div>
              )}

              <div className="space-y-4">
                {threads.map(thread => <ThreadCard key={thread.id} thread={thread} />)}
                {threads.length === 0 && !loading && (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                     <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 shadow-inner">
                        <MessageSquare size={32} />
                     </div>
                     <div>
                       <p className="text-slate-400 font-bold italic">The forum is currently silent.</p>
                       <p className="text-slate-600 text-sm max-w-xs">Be the pioneer and initiate a discussion to help your community grow.</p>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
               key="thread"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
            >
              <button 
                onClick={() => setView('list')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Return to Index
              </button>

              {selectedThread && (
                <div className="space-y-12">
                   {/* Main Question Post */}
                   <div className="relative group">
                     {/* Thread connector line */}
                     <div className="absolute left-[20px] top-full bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent z-0 opacity-20" />
                     
                     <div className="glass-card p-10 border-primary/20 relative z-10 shadow-2xl shadow-primary/5">
                        <div className="flex gap-6 items-start mb-8">
                           <Avatar name={selectedThread.authorName} role="student" size="lg" />
                           <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                 <h2 className="text-3xl font-black text-white italic tracking-tight">{selectedThread.title}</h2>
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(selectedThread.createdAt).toDateString()}</span>
                              </div>
                              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                 <User size={12} className="text-primary" /> {selectedThread.authorName} <span className="w-1 h-1 bg-slate-700 rounded-full" /> Clinical Inquirer
                              </p>
                           </div>
                        </div>
                        <div className="bg-black/20 rounded-2xl p-8 border border-white/5">
                           <p className="text-slate-300 text-lg leading-relaxed italic">{selectedThread.content}</p>
                        </div>
                     </div>
                   </div>

                   {/* Discussion Section */}
                   <div className="space-y-8 pl-8 md:pl-20 relative">
                     <div className="absolute left-[-4px] top-[-50px] bottom-0 w-0.5 bg-slate-800 z-0" />
                     
                     <h3 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
                        <Zap size={20} className="text-amber-500" /> Professional Discussions
                        {selectedThread.replies?.length > 0 && <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] text-slate-500 font-black">{selectedThread.replies.length} Responses</span>}
                     </h3>

                     <div className="space-y-6">
                        {selectedThread.replies?.map((reply, i) => (
                           <motion.div 
                             initial={{ opacity: 0, x: -10 }} 
                             animate={{ opacity: 1, x: 0 }} 
                             transition={{ delay: i * 0.1 }}
                             key={reply.id} 
                             className="glass-card p-8 border-white/5 relative group hover:border-white/10 transition-all shadow-xl"
                           >
                              <div className="flex gap-5 items-start mb-4">
                                 <Avatar name={reply.authorName} role={reply.authorRole} />
                                 <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                       <span className="text-sm font-bold text-white">{reply.authorName}</span>
                                       {reply.authorRole === 'admin' && (
                                         <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg shadow-emerald-500/10">Clinical Instructor</span>
                                       )}
                                       <span className="text-[10px] text-slate-600 font-bold ml-auto">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-60">
                                       <CornerDownRight size={10} /> Syncing from Terminal Node
                                    </div>
                                 </div>
                              </div>
                              <p className="text-slate-300 leading-relaxed pl-[60px] text-sm md:text-base border-l-2 border-primary/10">{reply.content}</p>
                           </motion.div>
                        ))}
                     </div>

                     {/* Reply Terminal */}
                     <div className="pt-10">
                        <div className="glass-card p-4 bg-primary/5 border-primary/20 shadow-2xl shadow-primary/5">
                           <form onSubmit={handleReply} className="flex gap-4 items-end">
                              <div className="flex-1">
                                 <textarea 
                                   className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner min-h-[100px] custom-scrollbar" 
                                   placeholder="Contribute to the clinical discussion..." 
                                   required 
                                   value={replyContent} 
                                   onChange={e => setReplyContent(e.target.value)}
                                 ></textarea>
                              </div>
                              <button type="submit" className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0 group">
                                 <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </button>
                           </form>
                        </div>
                     </div>
                   </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[2000] flex flex-col items-center justify-center">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Accessing Neural Forum Nodes...</p>
        </div>
      )}
      <Footer />
    </div>
  );
}

