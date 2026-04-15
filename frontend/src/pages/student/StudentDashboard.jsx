import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, PlayCircle, Eye, Calculator, ChevronLeft, 
  MessageSquare, ExternalLink, CheckCircle, Info, 
  Award, LayoutDashboard, BookOpen, FileText, 
  Settings, User as UserIcon, TrendingUp, Clock,
  Play, X, Sparkles, Menu, Users, ArrowRight, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import VisualAcuityVideo from '../../components/VisualAcuityVideo';
import BASE_URL from '../../api/config';
import PatientsView from './PatientsView';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [view, setView] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalTests: 0, avgScore: 0, rank: 'Novice' });
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (location.state?.startAiQuiz) {
      startAiRandomQuiz();
    }
  }, [location.state]);

  useEffect(() => {
    if (view === 'history') {
      fetchHistoryData();
    }
  }, [view, user.id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [coursesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/student/courses`),
      ]);
      const initialCourses = coursesRes.data || [];
      const courseList = initialCourses.some(course => course.title === FEATURED_COURSE.title)
        ? initialCourses
        : [FEATURED_COURSE, ...initialCourses];
      setCourses(courseList);
      setStats({
        totalTests: 12,
        avgScore: 85,
        rank: 'Pro'
      });
    } catch (e) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/student/results/${user.id}`);
      setHistory(res.data);
    } catch (e) {
      toast.error('Error loading history');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchInitialData();
      toast.success('Synchronization complete');
    } catch (e) {
      toast.error('Sync failed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const openCourse = async (course) => {
    try {
      if (course.id === FEATURED_COURSE.id) {
        setSelectedCourse(course);
        setTests(FEATURED_TESTS);
        setView('tests');
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/student/courses/${course.id}/tests`);
      setSelectedCourse(course);
      setTests(res.data);
      setView('tests');
    } catch (e) { toast.error('Error loading tests'); }
  };

  const FEATURED_COURSE = {
    id: -1,
    title: 'Featured Tests',
    description: 'Highlighted clinical procedure videos.',
  };

  const FEATURED_TEST_TITLES = [
    'corneal reflex test',
    'worth 4 dot test',
    'maddox wing test',
    'near point accommodation'
  ];

  const FEATURED_TESTS = [
    { id: -1, title: 'Corneal reflex test', videoUrl: 'https://drive.google.com/file/d/1udoojmzFB1tksQkZs6Qadu6hRyfjbMne/view?usp=sharing' },
    { id: -2, title: 'worth 4 dot test', videoUrl: 'https://drive.google.com/file/d/10rTKFKhJ1oCP_NOdtWVa-mpaCDWqOTgv/view?usp=sharing' },
    { id: -3, title: 'maddox wing test', videoUrl: 'https://drive.google.com/file/d/16SGk5cNUEAjZRauEhkwtIE9DQgEL8rkw/view?usp=sharing' },
    { id: -4, title: 'near point accommodation', videoUrl: 'https://drive.google.com/file/d/1-RjZBOpYuezVx7d2H0wUOHiG5QMT7X3-/view?usp=sharing' }
  ];

  const visibleTests = useMemo(() => {
    return tests.filter(test => FEATURED_TEST_TITLES.includes(test.title.toLowerCase()));
  }, [tests]);

  const startVideoPhase = (test) => {
    setSelectedTest(test);
    if (test.videoUrl) {
      setView('video-phase');
    } else {
      startTest(test);
    }
  };

  const startTest = async (test) => {
    try {
      let realTest = test;
      if (!test.id || test.id < 0) {
        const resTest = await axios.get(`${BASE_URL}/api/student/tests/title`, {
          params: { title: test.title }
        });
        realTest = resTest.data;
      }
      const res = await axios.get(`${BASE_URL}/api/student/tests/${realTest.id}/questions`);
      if (!res.data || res.data.length === 0) {
        toast.error('No questions are available for this test yet.');
        return;
      }
      setSelectedTest(realTest);
      setQuestions(res.data);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setScoreData(null);
      setView('take-test');
    } catch (e) {
      console.error('[StudentDashboard] startTest error:', e?.response?.data || e.message || e);
      if (e.response?.status === 404) {
        toast.error('Test not found in the current database. Please refresh or try another module.');
      } else {
        toast.error('Error loading questions');
      }
    }
  };

  const startAiRandomQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/student/questions/random?count=10`);
      if (!res.data || res.data.length === 0) {
        toast.error("No questions found for the clinical refresher.");
        return;
      }
      setSelectedTest({ title: 'AI Clinical Practice', id: null });
      setQuestions(res.data);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setScoreData(null);
      setView('take-test');
      toast.success("AI Clinical Refresher Started!");
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: {} });
    } catch (e) {
      console.error('[AI Tutor] Startup Error:', e);
      const is404 = e.response?.status === 404;
      const msg = is404 ? "Quiz endpoint not found. Please rotate server." : `Failed to start: ${e.response?.data?.message || e.message}`;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOption) score++;
    });

    try {
      if (selectedTest?.id) {
        await axios.post(`${BASE_URL}/api/student/tests/submit`, {
          userId: user.id,
          testId: selectedTest.id,
          score,
          totalQuestions: questions.length
        });
      }
      setScoreData({ score, total: questions.length });
      setView('result');
      toast.success('Test submitted!');
    } catch (e) {
      toast.error('Error submitting test');
    }
  };

  const formatEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
  };

  const isVideoFileUrl = (url) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
  };

  const SidebarItem = ({ icon: Icon, label, id, activeView }) => {
    const isExternal = ['formulas', 'qna'].includes(id);
    return (
      <button
        onClick={() => {
          if (isExternal) navigate(`/${id}`);
          else setView(id);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          !isExternal && activeView === id 
            ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10' 
            : 'text-text-muted hover:bg-bg-surface hover:text-text-main'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
      </button>
    );
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-6 flex items-center gap-5 border border-white/5 ring-1 ring-white/5">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-20`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div>
        <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-text-main">{value}</p>
      </div>
    </div>
  );

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", id: "overview" },
    { icon: BookOpen, label: "Learning Modules", id: "courses" },
    { icon: FileText, label: "Test History", id: "history" },
    { icon: Users, label: "Patient Directory", id: "patients" },
    { icon: MessageSquare, label: "Q&A Forum", id: "qna" },
    { icon: Calculator, label: "Clinical Calculator", id: "formulas" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden px-6 py-4 border-b border-white/5 flex justify-between items-center bg-bg-surface backdrop-blur-2xl sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-text-muted hover:text-text-main hover:bg-bg-surface rounded-lg transition-colors">
             <Menu size={24} />
           </button>
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
             <span className="font-black text-primary tracking-tighter text-lg uppercase">Clinical Hub</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={handleRefresh}
             disabled={refreshing}
             className={`p-2 text-text-muted hover:text-primary transition-all ${refreshing ? 'animate-spin' : ''}`}
           >
             <RefreshCw size={20} />
           </button>
           <button onClick={handleLogout} className="p-2 -mr-2 text-text-muted hover:text-red-400 transition-colors"><LogOut size={20} /></button>
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
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Student Portal</p>
             </div>
          </div>
          <button className="md:hidden p-2 text-text-muted hover:text-text-main" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map(item => (
            <SidebarItem key={item.id} {...item} activeView={view} />
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          <button 
            onClick={() => { setView('settings'); setIsMobileMenuOpen(false); }} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'settings' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-text-muted hover:text-text-main'}`}
          >
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </button>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center overflow-hidden">
               <UserIcon className="text-accent" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-main truncate">{user.name}</p>
              <p className="text-xs text-text-muted truncate capitalize">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-h-screen overflow-y-auto custom-scrollbar p-1 md:p-10">
        <AnimatePresence mode="wait">
          {view === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 md:p-0">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Clinical Performance</h2>
                  <p className="text-slate-500 font-medium text-xs md:text-base">Real-time tracking of your module mastery.</p>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={handleRefresh}
                     disabled={refreshing}
                     className="bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 transition-all flex items-center gap-2"
                   >
                     <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                   </button>
                   <button onClick={() => setView('courses')} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] md:text-xs">
                     <Play size={16} className="fill-white" /> Continue Learning
                   </button>
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
                <StatCard icon={CheckCircle} label="Tests Completed" value={stats.totalTests} color="bg-emerald-500" />
                <StatCard icon={TrendingUp} label="Module Mastery" value={`${stats.avgScore}%`} color="bg-primary" />
                <StatCard icon={Award} label="Clinical Rank" value={stats.rank} color="bg-amber-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock size={20} className="text-primary" /> Recent Activity
                  </h3>
                  <div className="glass-card p-6 space-y-4 divide-y divide-white/5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="pt-4 first:pt-0 flex justify-between items-center">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center"><BookOpen size={18} className="text-slate-400" /></div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">Refined Subject Module {i}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Completed 2h ago</p>
                          </div>
                        </div>
                        <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-lg text-xs">8/10</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award size={20} className="text-amber-500" /> My Progress
                  </h3>
                  <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                    <div className="relative w-32 h-32 mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary" strokeDasharray={364} strokeDashoffset={364 * (1 - 0.75)} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-black text-white">75%</span>
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mastery</span>
                      </div>
                    </div>
                    <p className="text-slate-300 font-medium mb-4">You're doing great! Complete 5 more tests to reach **Expert** rank.</p>
                    <button className="text-primary font-bold text-sm hover:underline">View detailed report</button>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {view === 'courses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <header>
                <h2 className="text-3xl font-bold text-white tracking-tight">Learning Modules</h2>
                <p className="text-slate-400">Select a subject to begin your clinical preparation</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={course.id} 
                    className="glass-card overflow-hidden group border border-white/5"
                  >
                    <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden p-6 flex flex-col justify-end">
                      <div className="absolute top-4 right-4 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                        <Eye size={24} className="text-primary" />
                      </div>
                      <div className="relative z-10">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Module {idx + 1}</span>
                        <h3 className="text-xl font-bold text-white mt-1">{course.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{course.description || "In-depth clinical optometry module covering core concepts and advanced diagnostics."}</p>
                      <button 
                        onClick={() => openCourse(course)}
                        className="w-full bg-white/5 hover:bg-primary text-white font-bold py-3 rounded-xl border border-white/10 hover:border-primary transition-all flex items-center justify-center gap-2"
                      >
                        Launch Course <PlayCircle size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'tests' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <button 
                onClick={() => setView('courses')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Return to Modules</span>
              </button>

              <header>
                 <span className="text-primary text-[10px] md:text-sm font-black uppercase tracking-widest leading-none mb-2 block">{selectedCourse?.title}</span>
                 <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Available Test Modules</h2>
              </header>

              <div className="grid grid-cols-1 gap-4">
                {selectedCourse?.title?.toLowerCase()?.includes('low vision') && (
                  <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-primary/30 transition-all ring-1 ring-white/5 bg-primary/5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                         <PlayCircle className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">Visual Acuity Assessment Tutorial</h4>
                        <p className="text-xs text-slate-500 font-bold flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock size={12} /> Interactive Video</span>
                          <span className="flex items-center gap-1"><Eye size={12} /> Low Vision Fundamentals</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsVideoOpen(true)}
                      className="w-full md:w-auto bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-black px-8 py-3 rounded-xl shadow-lg flex items-center justify-center transition-all hover:scale-105"
                    >
                      Watch Tutorial
                    </button>
                  </div>
                )}
                {visibleTests.map(test => (
                  <div key={test.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-primary/30 transition-all ring-1 ring-white/5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10">
                         {test.videoUrl ? <PlayCircle className="text-accent" size={24} /> : <FileText className="text-primary" size={24} />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{test.title}</h4>
                        <p className="text-xs text-slate-500 font-bold flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock size={12} /> 15 Mins</span>
                          <span className="flex items-center gap-1"><CheckCircle size={12} /> 10 MCQs</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => startVideoPhase(test)}
                      className="w-full md:w-auto bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all font-bold px-8 py-3 rounded-xl tracking-tight"
                    >
                      Start Attempt
                    </button>
                  </div>
                ))}
                {visibleTests.length === 0 && (
                   <div className="glass-card p-12 text-center">
                     <p className="text-slate-500 font-medium italic">No highlighted tests are available for this subject yet.</p>
                   </div>
                 )}
               </div>
             </motion.div>
           )}

           {view === 'video-phase' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-4 md:space-y-8 pb-10">
                <div className="flex items-center gap-3 md:gap-4 justify-between p-2 md:p-0">
                   <button onClick={() => setView('tests')} className="p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl text-slate-400 hover:text-white transition-all"><ChevronLeft size={20} /></button>
                   <div className="text-center flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Pre-Analysis Phase</p>
                      <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">{selectedTest?.title}</h2>
                   </div>
                   <div className="w-10 h-10 md:w-12 md:h-12" /> {/* Spacer */}
                </div>

                <div className="glass-card overflow-hidden ring-4 ring-black/40">
                   <div className="aspect-video bg-black relative">
                      {isVideoFileUrl(selectedTest?.videoUrl?.split(',')[0]) ? (
                        <video 
                          className="w-full h-full"
                          controls
                          src={selectedTest?.videoUrl?.split(',')[0]}
                        />
                      ) : (
                        <iframe 
                          className="w-full h-full"
                          src={formatEmbedUrl(selectedTest?.videoUrl?.split(',')[0])}
                          frameBorder="0"
                          allowFullScreen
                        />
                      )}
                   </div>
                    <div className="p-6 md:p-10 bg-slate-900/90 border-t border-white/5 flex flex-col md:flex-row items-center gap-8 md:gap-10">
                       <div className="flex-1 space-y-4 text-center md:text-left">
                          <div>
                            <span className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Module Completion</span>
                            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
                              <BookOpen size={20} className="md:size-[24px] text-primary" /> Subject Assessment
                            </h3>
                          </div>
                          <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                            This assessment is related specifically to the clinical procedures demonstrated above. 
                            You have **10 clinical MCQs** to validate your understanding.
                          </p>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-slate-500">
                             <span className="flex items-center gap-2"><Clock size={12} className="md:size-[14px] text-primary"/> Est: 15 Mins</span>
                             <span className="flex items-center gap-2"><FileText size={12} className="md:size-[14px] text-primary"/> 10 Questions</span>
                             <span className="flex items-center gap-2"><Award size={12} className="md:size-[14px] text-primary"/> Required: 5/10</span>
                          </div>
                       </div>
                       <button 
                         onClick={() => startTest(selectedTest)}
                         className="w-full md:w-auto bg-white text-slate-950 hover:bg-primary hover:text-white font-black px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] md:text-sm group"
                       >
                          Launch Module Test <ArrowRight size={18} className="md:size-[20px] group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                </div>
             </motion.div>
          )}

          {view === 'take-test' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto p-4 md:p-0">
               <div className="mb-6 md:mb-8 flex justify-between items-end">
                  <div className="flex-1 pr-4 md:pr-6">
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1 md:mb-2 italic opacity-70">Clinical Assessment</span>
                     <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{selectedTest?.title}</h3>
                  </div>
                  <div className="text-right">
                     <span className="text-slate-400 text-[10px] font-black block mb-1 uppercase tracking-widest leading-none">Question</span>
                     <span className="text-xl md:text-2xl font-black text-white">{currentQuestionIndex + 1}<span className="text-slate-600 text-base md:text-lg"> / {questions.length}</span></span>
                  </div>
               </div>

               <div className="w-full bg-white/5 h-2 rounded-full mb-10 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-500 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
               </div>

               <div className="glass-card p-6 md:p-10 border-white/5 ring-1 ring-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 hidden md:block">
                    <FileText size={120} className="text-white" />
                  </div>
                  
                  <div className="relative z-10 space-y-8 md:space-y-12">
                    <h4 className="text-lg md:text-2xl font-bold text-white leading-tight min-h-0 md:min-h-[80px]">{questions[currentQuestionIndex].questionText}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['A', 'B', 'C', 'D'].map(opt => {
                        const optText = questions[currentQuestionIndex]["option" + opt];
                        const isSelected = answers[questions[currentQuestionIndex].id] === opt;
                        return (
                          <button 
                            key={opt}
                            onClick={() => setAnswers({ ...answers, [questions[currentQuestionIndex].id]: opt })}
                            className={`group p-4 md:p-5 rounded-xl md:rounded-2xl border text-left transition-all relative overflow-hidden ${
                              isSelected 
                                ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' 
                                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
                            }`}
                          >
                             <div className="flex gap-3 md:gap-4 items-center">
                                <span className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-xs md:text-sm ${isSelected ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 border border-white/10'}`}>{opt}</span>
                                <span className={`flex-1 text-sm md:text-base font-medium ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{optText}</span>
                             </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                       <button 
                         className="flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-all disabled:opacity-0" 
                         disabled={currentQuestionIndex === 0}
                         onClick={() => setCurrentQuestionIndex(p => p - 1)}
                       >
                         <ChevronLeft size={20} /> Previous
                       </button>
                       
                       {currentQuestionIndex < questions.length - 1 ? (
                         <button 
                           className="bg-white text-slate-900 hover:bg-primary hover:text-white px-10 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                           onClick={() => setCurrentQuestionIndex(p => p + 1)}
                           disabled={!answers[questions[currentQuestionIndex].id]}
                         >
                           Continue <PlayCircle size={18} />
                         </button>
                       ) : (
                         <button 
                           className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                           onClick={submitTest}
                           disabled={!answers[questions[currentQuestionIndex].id]}
                         >
                           Finish Attempt
                         </button>
                       )}
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {view === 'result' && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-6 md:space-y-10 py-6 md:py-10 p-4 md:p-0">
                <div className="glass-card p-6 md:p-12 text-center border-emerald-500/20 relative overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                   <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                   
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-16 md:w-24 h-16 md:h-24 bg-emerald-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 border border-emerald-500/20 shadow-inner">
                      <Award className="text-emerald-400" size={32} />
                   </motion.div>

                   <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-2">Performance Verified</p>
                   <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Result: {scoreData.score}<span className="text-slate-600 text-xl md:text-2xl"> / {scoreData.total}</span></h2>
                   
                   <div className="flex justify-center flex-wrap gap-3 md:gap-4 mb-8 md:mb-10">
                      <div className="px-5 py-3 md:px-6 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                        <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Accuracy</span>
                        <span className="text-lg md:text-xl font-bold text-white">{Math.round((scoreData.score / scoreData.total) * 100)}%</span>
                      </div>
                      <div className="px-5 py-3 md:px-6 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                        <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Status</span>
                        <span className={`text-lg md:text-xl font-bold ${scoreData.score >= (scoreData.total / 2) ? 'text-emerald-400' : 'text-red-400'}`}>
                           {scoreData.score >= (scoreData.total / 2) ? 'Mastered' : 'Needs Review'}
                        </span>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button 
                       className="bg-white text-slate-950 hover:bg-slate-200 px-10 py-4 rounded-xl font-black shadow-2xl transition-all inline-flex items-center gap-3 active:scale-95"
                       onClick={() => setView('overview')}
                     >
                       Return to Dashboard <LayoutDashboard size={18} />
                     </button>
                     <button
                       className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-black shadow-2xl transition-all inline-flex items-center gap-3 active:scale-95"
                       onClick={() => setView('history')}
                     >
                       View Test History
                     </button>
                   </div>
                </div>

                <div className="space-y-4 md:space-y-6 pt-6 md:pt-10">
                   <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3 p-4 md:p-0">
                     <BookOpen size={20} className="md:size-[24px] text-primary" /> Comprehensive Analytics
                   </h3>
                   <div className="space-y-3 md:space-y-4 px-4 md:px-0">
                     {questions.map((q, idx) => {
                       const isCorrect = answers[q.id] === q.correctOption;
                       return (
                         <div key={q.id} className={`glass-card p-6 border-l-4 ${isCorrect ? 'border-emerald-500' : 'border-red-500'} bg-white/[0.03]`}>
                            <div className="flex justify-between items-start gap-4 mb-4">
                               <p className="font-bold text-white leading-relaxed flex-1">
                                 <span className="text-slate-500 mr-2 font-black">{idx + 1}.</span> {q.questionText}
                               </p>
                               {isCorrect ? <CheckCircle className="text-emerald-500 shrink-0" size={20} /> : <X className="text-red-500 shrink-0" size={20} />}
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider">
                               <div className="px-3 py-1 bg-white/5 rounded-md border border-white/5 text-slate-400">
                                 Selection: <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>{q["option" + answers[q.id]]}</span>
                               </div>
                               {!isCorrect && (
                                 <div className="px-3 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20 text-emerald-400">
                                   Correct: {q["option" + q.correctOption]}
                                 </div>
                               )}
                            </div>
                            {q.explanation && (
                              <div className="mt-4 p-4 bg-black/30 rounded-xl border border-white/5 text-slate-400 text-[13px] leading-relaxed italic">
                                "{q.explanation}"
                              </div>
                            )}
                         </div>
                       );
                     })}
                   </div>
                </div>
             </motion.div>
          )}

          {view === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-8 p-4 md:p-0">
              <header>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Attempt History</h2>
                <p className="text-slate-500 text-sm font-medium">Review your past performance and clinical accuracy</p>
              </header>

              <div className="glass-card overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Test Title</th>
                        <th className="px-6 py-4">Score</th>
                        <th className="px-6 py-4">Accuracy</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-200">{item.testTitle || 'Clinical Evaluation'}</td>
                          <td className="px-6 py-4">
                            <span className="text-white font-black">{item.score}</span>
                            <span className="text-slate-500 text-xs"> / {item.totalQuestions}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="flex-1 h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: `${(item.score / item.totalQuestions) * 100}%` }} />
                               </div>
                               <span className="text-xs font-bold text-slate-400">{Math.round((item.score / item.totalQuestions) * 100)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${item.score >= (item.totalQuestions/2) ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {item.score >= (item.totalQuestions/2) ? 'Passed' : 'Review'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic font-medium">No test results found in your account history.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'patients' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PatientsView />
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-10">
              <header>
                <h2 className="text-3xl font-bold text-white tracking-tight">Account Settings</h2>
                <p className="text-slate-400">Manage your clinical profile and portal preferences</p>
              </header>

              <div className="glass-card p-8 border border-white/5 space-y-8">
                 <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                    <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/20 text-primary">
                       <UserIcon size={40} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{user.role} | Verified Account</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                       <p className="text-slate-200 font-medium">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Student ID</label>
                       <p className="text-slate-200 font-medium">#{user.id.toString().padStart(6, '0')}</p>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                       Update Profile
                    </button>
                    <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold border border-white/10 transition-all">
                       Change Password
                    </button>
                 </div>
              </div>

              <div className="glass-card p-6 border border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-500/5 to-transparent">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Sparkles size={24} /></div>
                    <div>
                       <p className="text-white font-bold">App Environment</p>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Version 1.2.0 (Stable)</p>
                    </div>
                 </div>
                 <button className="text-xs font-black text-blue-400 hover:underline uppercase tracking-widest">Check for Updates</button>
              </div>
            </motion.div>
          )}

          {/* Remaining Placeholder Views */}
          {(view === 'qna' || view === 'formulas') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white capitalize mb-2">{view} Module Incoming</h3>
                <p className="text-slate-500 max-w-sm font-medium leading-relaxed">This section is currently being optimized for clinical precision. Stay tuned for the update.</p>
              </div>
              <button 
                onClick={() => {
                  if (view === 'qna') navigate('/qna');
                  else if (view === 'formulas') navigate('/formulas');
                  else setView('overview');
                }}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Exit Module
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Video Modal Overlay */}
      {isVideoOpen && <VisualAcuityVideo onClose={() => setIsVideoOpen(false)} />}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background z-[2000] flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6 shadow-2xl shadow-primary/20" />
           <p className="text-slate-500 font-bold uppercase tracking-[0.2em] italic">Building your dashboard...</p>
        </div>
      )}
    </div>
  );
}

const ArrowLeft = ({ size = 20, className = "" }) => <ChevronLeft size={size} className={className} />;
