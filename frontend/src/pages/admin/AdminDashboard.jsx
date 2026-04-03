import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, BookOpen, Plus, FileText, Trash, 
  ChevronLeft, HelpCircle, LayoutDashboard, 
  Users, Layers, MessageSquare, Settings,
  Eye, Save, X, Edit, Sliders, Activity,
  Search, ShieldCheck, User as UserIcon, Sparkles, PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../../api/config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ courses: 0, tests: 0, students: 0 });
  const [courses, setCourses] = useState([]);
  
  // Navigation states
  const [view, setView] = useState('overview'); // 'overview', 'courses', 'tests', 'questions'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnailUrl: '' });
  
  const [showTestForm, setShowTestForm] = useState(false);
  const [testForm, setTestForm] = useState({ title: '', videoUrl: '' });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: ''
  });
  
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStats(), fetchCourses()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/stats`);
      setStats(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/courses`);
      setCourses(res.data);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Admin logged out');
    navigate('/login');
  };

  // --- CRUD HELPERS ---
  const handleAddCourse = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Creating course...');
    try {
      await axios.post(`${BASE_URL}/api/admin/courses`, courseForm);
      setShowCourseForm(false);
      setCourseForm({ title: '', description: '', thumbnailUrl: '' });
      fetchCourses();
      fetchStats();
      toast.success('Course published!', { id: loadId });
    } catch (error) { toast.error('Error adding course', { id: loadId }); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete course and all its tests?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/courses/${id}`);
      fetchCourses();
      fetchStats();
      toast.success('Course retracted');
    } catch (e) { toast.error("Error deleting course"); }
  };

  const handleAddTest = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Deploying test module...');
    try {
      await axios.post(`${BASE_URL}/api/admin/tests`, { ...testForm, courseId: selectedCourse.id });
      setShowTestForm(false);
      setTestForm({ title: '', videoUrl: '' });
      fetchCourses(); 
      
      const updatedSelect = { ...selectedCourse };
      if (!updatedSelect.tests) updatedSelect.tests = [];
      updatedSelect.tests.push({ title: testForm.title, videoUrl: testForm.videoUrl, id: Date.now() });
      setSelectedCourse(updatedSelect);
      fetchStats();
      toast.success('Module active!', { id: loadId });
    } catch (error) { toast.error('Error adding test', { id: loadId }); }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Delete test?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/tests/${id}`);
      fetchCourses();
      const updatedSelect = { ...selectedCourse };
      updatedSelect.tests = updatedSelect.tests.filter(t => t.id !== id);
      setSelectedCourse(updatedSelect);
      fetchStats();
      toast.success('Test removed');
    } catch (e) { toast.error("Error deleting test"); }
  };

  const fetchQuestions = async (testId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/tests/${testId}/questions`);
      setQuestions(res.data);
    } catch(e) { console.error(e); }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Syncing question database...');
    try {
      await axios.post(`${BASE_URL}/api/admin/questions`, { ...questionForm, testId: selectedTest.id });
      setShowQuestionForm(false);
      setQuestionForm({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: '' });
      fetchQuestions(selectedTest.id);
      toast.success('Database updated!', { id: loadId });
    } catch (error) { toast.error("Error adding question", { id: loadId }); }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Delete question?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/questions/${id}`);
      fetchQuestions(selectedTest.id);
      toast.success('Entry deleted');
    } catch (e) { toast.error("Error deleting question"); }
  };

  const SidebarItem = ({ icon: Icon, label, id, activeView }) => {
    const isForum = id === 'moderation';
    const isExternal = id === 'analytics' || id === 'roster';
    return (
      <button
        onClick={() => {
          if (isForum) navigate(`/qna`);
          else if (!isExternal) setView(id);
          else toast.info(`${label} module coming soon!`);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          !isForum && !isExternal && activeView === id 
            ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10' 
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
      </button>
    );
  };

  const StatCard = ({ icon: Icon, label, value, trend }) => (
    <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">{label}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
          {trend && <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">↑ {trend}% <span className="text-slate-500 font-medium">vs last month</span></p>}
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-primary">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-slate-950/50 border-r border-white/5 backdrop-blur-2xl p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
            <ShieldCheck className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight">EyeCare Admin</h1>
            <p className="text-[10px] text-primary uppercase tracking-widest font-black">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Overview" id="overview" activeView={view} />
          <SidebarItem icon={Layers} label="Course Editor" id="courses" activeView={view} />
          <SidebarItem icon={Users} label="Student Roster" id="roster" activeView={view} />
          <SidebarItem icon={MessageSquare} label="Forum Moderation" id="moderation" activeView={view} />
          <SidebarItem icon={Activity} label="System Analytics" id="analytics" activeView={view} />
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
               <UserIcon className="text-accent" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Dr. {user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Administrator</p>
            </div>
            <button onClick={handleLogout} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-h-screen overflow-y-auto custom-scrollbar p-6 md:p-10">
        <AnimatePresence mode="wait">
          {view === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Executive Dashboard</h2>
                  <p className="text-slate-400 font-medium italic">Monitor clinical learning progression across the portal.</p>
                </div>
                <div className="flex gap-4">
                   <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl font-bold border border-white/10 transition-all flex items-center gap-2">
                     <FileText size={18} /> Export Stats
                   </button>
                   <button onClick={() => setView('courses')} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all transform active:scale-95 flex items-center gap-2">
                    <Plus size={18} /> New Module
                   </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={BookOpen} label="Clinical Courses" value={stats.courses} trend="12" />
                <StatCard icon={FileText} label="Test Blueprints" value={stats.tests} trend="5" />
                <StatCard icon={Users} label="Active Clinicians" value={stats.students} trend="24" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Recent Platform Pulses
                  </h3>
                  <div className="glass-card p-6 space-y-4 divide-y divide-white/5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="pt-4 first:pt-0 flex justify-between items-center">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center"><UserIcon size={18} className="text-slate-400" /></div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">New Student Registered</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">User ID: STU-20{i}04</p>
                          </div>
                        </div>
                        <span className="text-slate-500 text-xs font-medium">Just now</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders size={20} className="text-accent" /> Quick Config
                  </h3>
                  <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                      <Settings className="text-accent animate-spin-slow" size={32} />
                    </div>
                    <p className="text-slate-300 font-medium mb-6">Manage global application parameters, clinical criteria, and system heuristics.</p>
                    <button onClick={() => navigate('/admin/settings')} className="text-accent font-black text-xs uppercase tracking-widest hover:underline border border-accent/20 px-6 py-2 rounded-lg">Open Terminal</button>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {view === 'courses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Course Architecture</h2>
                  <p className="text-slate-400">Design and deploy specialized clinical learning pathways.</p>
                </div>
                <div className="relative group">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                   <input type="text" placeholder="Filter subjects..." className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all" />
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowCourseForm(!showCourseForm)}
                  className="glass-card border-dashed border-2 border-white/10 flex flex-col items-center justify-center min-h-[300px] hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-500 hover:text-white"
                >
                  <div className="p-4 rounded-full bg-white/5 mb-4"><Plus size={32} /></div>
                  <span className="font-bold tracking-tight">Establish New Pathway</span>
                </motion.button>
                
                {courses.map(course => (
                  <div key={course.id} className="glass-card overflow-hidden flex flex-col group border border-white/5">
                    <div className="p-6 flex-1">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <BookOpen size={24} />
                          </div>
                          <button onClick={() => handleDeleteCourse(course.id)} className="text-slate-600 hover:text-red-400 p-2 transition-colors"><Trash size={18} /></button>
                       </div>
                       <h4 className="text-xl font-bold text-white mb-2">{course.title}</h4>
                       <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{course.description}</p>
                    </div>
                    <div className="p-6 bg-slate-900/50 border-t border-white/5 flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{course.tests?.length || 0} Test Modules</span>
                       <button 
                         onClick={() => { setSelectedCourse(course); setView('tests'); }}
                         className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                       >
                         Manage <Edit size={14} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Form Modal */}
              <AnimatePresence>
                {showCourseForm && (
                  <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card w-full max-w-lg p-8 shadow-2xl ring-1 ring-white/10">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-white tracking-tight">New Course Pathway</h3>
                        <button onClick={() => setShowCourseForm(false)} className="text-slate-400 hover:text-white"><X /></button>
                      </div>
                      <form onSubmit={handleAddCourse} className="space-y-6">
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pathway Title</label>
                           <input 
                             type="text" 
                             className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" 
                             placeholder="e.g. Clinical Low Vision Diagnostics" 
                             value={courseForm.title} 
                             onChange={e => setCourseForm({...courseForm, title: e.target.value})} 
                             required
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Path description</label>
                           <textarea 
                             className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner min-h-[120px]" 
                             placeholder="Provide a clinical summary of this learning pathway..." 
                             value={courseForm.description} 
                             onChange={e => setCourseForm({...courseForm, description: e.target.value})} 
                             required
                           />
                         </div>
                         <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs">
                           Deploy Pathway <Save size={18} />
                         </button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {view === 'tests' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               <button 
                onClick={() => setView('courses')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Return to Course Editor</span>
              </button>

              <header className="flex justify-between items-end">
                <div>
                   <span className="text-primary text-sm font-black uppercase tracking-widest leading-none mb-2 block">{selectedCourse?.title}</span>
                   <h2 className="text-3xl font-bold text-white tracking-tight">Test Module Registry</h2>
                </div>
                <button onClick={() => setShowTestForm(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Plus size={18} /> Establish Module
                </button>
              </header>

              <div className="space-y-4">
                {selectedCourse?.tests?.map(test => (
                  <div key={test.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/30 transition-all border border-white/5 ring-1 ring-white/5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 text-primary">
                         {test.videoUrl ? <PlayCircle className="text-accent" size={24} /> : <FileText size={24} />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{test.title}</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dynamic MCQ Module</span>
                           {test.videoUrl && <span className="w-1 h-1 bg-slate-700 rounded-full" />}
                           {test.videoUrl && <span className="text-[10px] text-accent font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-md ring-1 ring-accent/10">AV Resource Linked</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => { setSelectedTest(test); fetchQuestions(test.id); setView('questions'); }}
                         className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-xl border border-white/10 transition-all flex items-center gap-2"
                       >
                         Edit MCQs <ArrowRight size={16} />
                       </button>
                       <button onClick={() => handleDeleteTest(test.id)} className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash size={20} /></button>
                    </div>
                  </div>
                ))}
                {(!selectedCourse?.tests || selectedCourse.tests.length === 0) && (
                  <div className="glass-card p-12 text-center">
                    <p className="text-slate-500 font-medium italic">No test blueprints found for this course.</p>
                  </div>
                )}
              </div>

              {/* Test Form Modal */}
              <AnimatePresence>
                {showTestForm && (
                   <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card w-full max-w-lg p-8 shadow-2xl ring-1 ring-white/10">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-bold text-white tracking-tight">New Test Blueprint</h3>
                          <button onClick={() => setShowTestForm(false)} className="text-slate-400 hover:text-white"><X /></button>
                        </div>
                        <form onSubmit={handleAddTest} className="space-y-6">
                           <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Blueprint Title</label>
                             <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" placeholder="e.g. Primary Visual Cortex Analysis" value={testForm.title} onChange={e => setTestForm({...testForm, title: e.target.value})} required/>
                           </div>
                           <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Video Resource (Youtube URL)</label>
                             <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" placeholder="https://youtube.com/watch?v=..." value={testForm.videoUrl} onChange={e => setTestForm({...testForm, videoUrl: e.target.value})} />
                             <p className="text-[10px] text-slate-500 font-medium mt-1">Leave empty if no video demonstration is required.</p>
                           </div>
                           <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all uppercase tracking-[0.2em] text-xs">Establish Blueprint</button>
                        </form>
                     </motion.div>
                   </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {view === 'questions' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-10">
               <button onClick={() => setView('tests')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                 <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                 <span>Return to Module Registry</span>
               </button>

               <header className="flex justify-between items-end">
                  <div>
                    <span className="text-accent text-sm font-black uppercase tracking-widest leading-none mb-2 block">Test Blueprint: {selectedTest?.title}</span>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Question Database</h2>
                  </div>
                  <button onClick={() => setShowQuestionForm(true)} className="bg-accent text-slate-900 px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-accent/20 uppercase tracking-widest text-[10px]">
                    <Plus size={18} /> New Entry
                  </button>
               </header>

               <div className="space-y-6">
                 {questions.map((q, idx) => (
                   <div key={q.id} className="glass-card p-8 border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <HelpCircle size={80} />
                      </div>
                      <div className="flex justify-between items-start gap-6 relative z-10">
                         <div className="flex-1">
                            <h4 className="text-xl font-bold text-white leading-relaxed mb-8 flex items-baseline gap-4">
                               <span className="text-slate-600 font-black text-2xl shrink-0 italic">{idx + 1}</span>
                               {q.questionText}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {['A', 'B', 'C', 'D'].map(opt => {
                                 const isCorrect = q.correctOption === opt;
                                 return (
                                   <div key={opt} className={`p-4 rounded-xl border flex items-center gap-3 ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600'}`}>{opt}</span>
                                      <span className="font-medium text-sm">{q["option" + opt]}</span>
                                   </div>
                                 );
                               })}
                            </div>
                            {q.explanation && (
                               <div className="mt-8 p-4 bg-black/40 rounded-2xl border border-white/5 flex gap-4">
                                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><HelpCircle className="text-slate-500" size={18} /></div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Clinical Explanation</p>
                                     <p className="text-slate-400 text-sm italic leading-relaxed">{q.explanation}</p>
                                  </div>
                               </div>
                            )}
                         </div>
                         <button onClick={() => handleDeleteQuestion(q.id)} className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash size={20} /></button>
                      </div>
                   </div>
                 ))}
                 {questions.length === 0 && (
                   <div className="glass-card p-16 text-center">
                     <HelpCircle size={48} className="text-slate-800 mx-auto mb-4" />
                     <p className="text-slate-500 font-medium italic">Database is currently empty. Add questions to activate this module.</p>
                   </div>
                 )}
               </div>

               {/* Question Form Modal */}
               <AnimatePresence>
                  {showQuestionForm && (
                     <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-2xl p-8 shadow-2xl ring-1 ring-white/10 custom-scrollbar max-h-[90vh] overflow-y-auto">
                           <div className="flex justify-between items-center mb-8">
                             <h3 className="text-2xl font-bold text-white tracking-tight">New Database Entry</h3>
                             <button onClick={() => setShowQuestionForm(false)} className="text-slate-400 hover:text-white"><X /></button>
                           </div>
                           <form onSubmit={handleAddQuestion} className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Question Content</label>
                                <textarea className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner min-h-[100px]" placeholder="State the question clearly..." value={questionForm.questionText} onChange={e => setQuestionForm({...questionForm, questionText: e.target.value})} required />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map(opt => (
                                  <div key={opt} className="space-y-2 relative">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Option {opt}</label>
                                    <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" placeholder={`Response ${opt}...`} value={questionForm["option" + opt]} onChange={e => setQuestionForm({...questionForm, ["option" + opt]: e.target.value})} required/>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Select Verified Correct Logic</label>
                                <div className="grid grid-cols-4 gap-2">
                                   {['A', 'B', 'C', 'D'].map(opt => (
                                     <button 
                                       key={opt}
                                       type="button"
                                       onClick={() => setQuestionForm({...questionForm, correctOption: opt})}
                                       className={`py-3 rounded-xl font-bold tracking-widest transition-all border ${questionForm.correctOption === opt ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10'}`}
                                     >
                                       {opt}
                                     </button>
                                   ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Clinical Reasoning (Optional)</label>
                                <textarea className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner min-h-[80px]" placeholder="Explain why the selected option is correct..." value={questionForm.explanation} onChange={e => setQuestionForm({...questionForm, explanation: e.target.value})} />
                              </div>
                              <button type="submit" className="w-full bg-accent text-slate-900 font-black py-4 rounded-xl shadow-xl shadow-accent/20 transition-all uppercase tracking-[0.2em] text-xs">Commit to Database</button>
                           </form>
                        </motion.div>
                     </div>
                  )}
               </AnimatePresence>
             </motion.div>
          )}

          {/* Placeholder Views for Admin */}
          {(view === 'roster' || view === 'analytics') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white capitalize mb-2">{view} Module Incoming</h3>
                <p className="text-slate-500 max-w-sm font-medium leading-relaxed">We are currently fine-tuning this management module for clinical deployments.</p>
              </div>
              <button 
                onClick={() => setView('overview')}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Exit Module
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background z-[3000] flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
           <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs italic">Syncing Administrative Nodes...</p>
        </div>
      )}
    </div>
  );
}

const ArrowRight = ({ size = 20, className = "" }) => <ChevronLeft size={size} className={className + " rotate-180"} />;
const ArrowLeft = ({ size = 20, className = "" }) => <ChevronLeft size={size} className={className} />;

