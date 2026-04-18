import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, BookOpen, Plus, FileText, Trash, 
  ChevronLeft, HelpCircle, LayoutDashboard, 
  Users, Layers, MessageSquare, Settings,
  Eye, Save, X, Edit, Sliders, Activity,
  Search, ShieldCheck, User as UserIcon, Sparkles, PlayCircle, Menu, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../../api/config';
import Footer from '../../components/Footer';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ courses: 0, tests: 0, students: 0, recentResults: [], avgScore: 0, totalAttempts: 0, uniqueStudents: 0 });
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Navigation states
  const [view, setView] = useState('overview'); // 'overview', 'courses', 'tests', 'questions', 'roster', 'analytics'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnailUrl: '' });
  
  const [showTestForm, setShowTestForm] = useState(false);
  const [testForm, setTestForm] = useState({ title: '', videoUrl: '', useAI: false });

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
      await Promise.all([fetchStats(), fetchCourses(), fetchStudents()]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchStats(), fetchCourses(), fetchStudents()]);
      toast.success('System synchronization successful.');
    } catch (e) {
      toast.error('Sync failed.');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/students`);
      setStudents(res.data);
    } catch (e) { console.error(e); }
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
    const loadId = toast.loading(testForm.useAI ? 'Synthesizing AI Module...' : 'Deploying test module...');
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/tests`, { 
        courseId: selectedCourse.id,
        title: testForm.title,
        videoUrl: testForm.videoUrl
      });
      
      const newTestId = res.data.testId;

      if (testForm.useAI) {
        setAiGenerating(true);
        try {
          await axios.post(`${BASE_URL}/api/admin/ai/generate-questions`, {
            topic: testForm.title,
            testId: newTestId,
            count: 5
          });
          toast.success('AI Assignment Generated!', { id: loadId });
        } catch (aiErr) {
          console.error(aiErr);
          toast.error('AI Generation failed, but test was created.', { id: loadId });
        } finally {
          setAiGenerating(false);
        }
      } else {
        toast.success('Module active!', { id: loadId });
      }

      setShowTestForm(false);
      setTestForm({ title: '', videoUrl: '', useAI: false });
      fetchCourses();
      fetchStats();

      // Refresh current tests view
      const updatedRes = await axios.get(`${BASE_URL}/api/admin/courses`);
      const course = updatedRes.data.find(c => c.id === selectedCourse.id);
      if (course) setSelectedCourse(course);

    } catch (error) { 
      toast.error('Error adding test', { id: loadId }); 
    }
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
          else {
            setView(id);
            setIsMobileMenuOpen(false);
          }
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          !isForum && !isExternal && activeView === id 
            ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10' 
            : 'text-text-muted hover:bg-bg-surface hover:text-text-main'
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
          <p className="text-text-muted font-bold uppercase tracking-widest text-[10px] mb-2">{label}</p>
          <h3 className="text-3xl font-black text-text-main">{value}</h3>
          {trend && <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">↑ {trend}% <span className="text-text-muted font-medium">vs last month</span></p>}
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-primary">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-white/5 flex justify-between items-center bg-bg-surface backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-text-muted hover:text-text-main hover:bg-bg-surface rounded-lg transition-colors">
             <Menu size={24} />
           </button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-black text-primary tracking-tighter text-lg uppercase leading-none">Clinical Hub</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={handleRefresh} 
             disabled={refreshing}
             className={`p-2 text-slate-400 hover:text-primary transition-all ${refreshing ? 'animate-spin' : ''}`}
           >
             <RefreshCw size={20} />
           </button>
           <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><LogOut size={20} /></button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[100] w-72 bg-bg-surface border-r border-border-main md:backdrop-blur-2xl p-6 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col h-screen ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
             <div>
                <h1 className="text-xl font-black text-primary tracking-tighter leading-none uppercase">Clinical Hub</h1>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Command Center</p>
             </div>
          </div>
          <button className="md:hidden p-2 text-text-muted hover:text-text-main" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
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
              <p className="text-sm font-bold text-text-main truncate">Dr. {user.name}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Administrator</p>
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
                   <button 
                     onClick={handleRefresh}
                     disabled={refreshing}
                     className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl font-bold border border-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                   >
                     <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /> 
                     {refreshing ? 'Syncing...' : 'Update Pulse'}
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
                    {stats.recentResults?.length > 0 ? (
                      stats.recentResults.map((res, i) => (
                        <div key={res.id} className="pt-4 first:pt-0 flex justify-between items-center">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                              <UserIcon size={18} className="text-slate-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-200">{res.studentName}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                Scored {res.score}/{res.totalQuestions} in {res.testTitle}
                              </p>
                            </div>
                          </div>
                          <span className="text-slate-500 text-xs font-medium">
                            {new Date(res.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic py-4">No recent activity detected.</p>
                    )}
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
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                               <Sparkles size={14} className="text-primary" /> AI-Powered Generation
                             </label>
                             <div 
                               onClick={() => setTestForm({...testForm, useAI: !testForm.useAI})}
                               className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${testForm.useAI ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-slate-900 border-white/5 opacity-50'}`}
                             >
                               <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${testForm.useAI ? 'bg-primary text-white' : 'bg-slate-800 text-slate-600'}`}>
                                    <Sparkles size={16} />
                                  </div>
                                  <div>
                                    <p className={`text-sm font-bold ${testForm.useAI ? 'text-white' : 'text-slate-400'}`}>Auto-Generate Questions</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Gemini AI will createMCQs based on the title</p>
                                  </div>
                               </div>
                               <div className={`w-12 h-6 rounded-full relative transition-colors ${testForm.useAI ? 'bg-primary' : 'bg-slate-800'}`}>
                                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${testForm.useAI ? 'left-7' : 'left-1'}`} />
                               </div>
                             </div>
                           </div>
                           <button type="submit" disabled={aiGenerating} className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50">
                             {aiGenerating ? 'Processing AI...' : 'Establish Blueprint'}
                           </button>
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

          {view === 'roster' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <header>
                <h2 className="text-3xl font-bold text-white tracking-tight">Student Roster</h2>
                <p className="text-slate-400 font-medium">Manage and monitor verified clinical students.</p>
              </header>

              <div className="glass-card overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Full Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Email Address</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Joined On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                              {s.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-200">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{s.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${s.isVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            {s.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {view === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <header>
                <h2 className="text-3xl font-bold text-white tracking-tight">System Performance Analysis</h2>
                <p className="text-slate-400 font-medium">Deep-dive into platform heuristics and student metrics.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="glass-card p-6 border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Average Score</p>
                   <h4 className="text-2xl font-bold text-white">{Math.round(stats.avgScore)}%</h4>
                   <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${stats.avgScore}%` }} />
                   </div>
                 </div>
                 <div className="glass-card p-6 border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Attempts</p>
                   <h4 className="text-2xl font-bold text-white">{stats.totalAttempts}</h4>
                   <p className="text-[10px] text-emerald-400 font-bold mt-1">Cross-module participation</p>
                 </div>
                 <div className="glass-card p-6 border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Completion Rate</p>
                   <h4 className="text-2xl font-bold text-white">84%</h4>
                   <p className="text-[10px] text-primary font-bold mt-1">Goal completion index</p>
                 </div>
                 <div className="glass-card p-6 border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Unique Engagements</p>
                   <h4 className="text-2xl font-bold text-white">{stats.uniqueStudents}</h4>
                   <p className="text-[10px] text-slate-500 font-bold mt-1">Total active learners</p>
                 </div>
              </div>

              <div className="glass-card p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                  <Activity size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Real-time Performance Heuristics</h3>
                  <p className="text-slate-400 max-w-lg font-medium leading-relaxed">System Analysis is dynamically calculating cross-dimensional metrics based on ongoing student interactions. View participation pulses and success distributions above.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
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

