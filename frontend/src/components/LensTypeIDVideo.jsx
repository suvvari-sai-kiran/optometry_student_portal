import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Eye, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, Maximize2, Binary } from 'lucide-react';

const SCRIPT = [
  { img: '/cs_video/scene_procedure.png', duration: 4000, title: 'Title', text: 'Lens Type Identification', subtitle: 'Mapping Spectacle Lenses' },
  { img: '/cs_video/scene_clinic.png', duration: 6000, title: 'Aim of the Test', text: 'This tutorial demonstrates how to accurately identify lens types including Single Vision, Bifocals, and Progressives.', subtitle: 'Verify Lens Type' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Single Vision Lenses', text: 'Single vision lenses have a uniform power across the entire surface and are used to correct one distance (near or far).', subtitle: 'Uniform Power' },
  { img: '/cs_video/scene_clinic.png', duration: 10000, title: 'Bifocal Lenses', text: 'Bifocals feature a visible segment line dividing the lens into distance and near focal zones.', subtitle: 'Visible Dividing Line' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Progressive Addition Lenses', text: 'Progressives provide multiple focal points without visible lines, offering a gradual transition from far to near.', subtitle: 'PAL (No Line)' },
  { img: '/cs_video/scene_clinic.png', duration: 10000, title: 'Spherical vs Cylindrical', text: 'Rotating the lens helps identify astigmatism correction; cylindrical lenses show image distortion when rotated.', subtitle: 'Rotation Test' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Plus Lenses', text: 'Plus lenses magnify objects and show "against-motion" when moved across a line or target.', subtitle: 'Magnification & Against-Motion' },
  { img: '/cs_video/scene_clinic.png', duration: 10000, title: 'Minus Lenses', text: 'Minus lenses minify objects and show "with-motion" when moved across a line or target.', subtitle: 'Minification & With-Motion' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Material Identification', text: 'Check for material indicators like weight, thickness, and edge reflections to distinguish plastic, glass, or polycarbonate.', subtitle: 'Material Check' },
  { img: '/cs_video/scene_clinic.png', duration: 5000, title: 'Conclusion', text: 'Correct lens identification is critical for verifying prescriptions and ensuring patient adaptation.', subtitle: 'Precise Lens Mapping' }
];

export default function LensTypeIDVideo({ onClose, onStartTest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    let timer;
    if (isPlaying && !isPaused && currentScene < SCRIPT.length) {
      timer = setTimeout(() => {
        setCurrentScene(prev => prev + 1);
      }, SCRIPT[currentScene].duration);
    } else if (currentScene >= SCRIPT.length) {
      setIsPlaying(false);
      setIsPaused(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, isPaused, currentScene]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
    }
  }, [isPaused]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      if (isPlaying && !isPaused && isAudioEnabled && currentScene < SCRIPT.length) {
        const utterance = new SpeechSynthesisUtterance(SCRIPT[currentScene].text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
    
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentScene, isAudioEnabled]);

  const handleStart = () => {
    if (currentScene >= SCRIPT.length) {
      setCurrentScene(0);
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentScene(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const currentData = SCRIPT[currentScene] || SCRIPT[SCRIPT.length - 1];
  const progressPercent = ((currentScene) / SCRIPT.length) * 100;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col md:items-center md:justify-center bg-[#020617] md:bg-black/95 md:backdrop-blur-xl overflow-y-auto md:overflow-hidden font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0f1d]">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">Clinical Module</span>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">Clinical Hub</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="relative w-full aspect-video md:max-w-6xl md:rounded-3xl overflow-hidden md:ring-1 md:ring-white/10 md:shadow-2xl shadow-blue-500/10 shrink-0">
        <button 
          onClick={onClose}
          className="hidden md:flex absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
        >
          <X size={24} />
        </button>

        <button 
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className="absolute top-6 right-6 md:right-20 z-50 p-3 bg-white/10 hover:bg-blue-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
          title={isAudioEnabled ? "Mute Audio" : "Enable Audio"}
        >
          {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        {isPlaying && (
          <>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="absolute top-6 right-20 md:right-32 z-50 p-3 bg-white/10 hover:bg-blue-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
              title={isPaused ? "Resume Video" : "Pause Video"}
            >
              {isPaused ? <Play size={24} className="fill-current" /> : <Pause size={24} className="fill-current" />}
            </button>
            <button 
              onClick={handleStop}
              className="absolute top-6 right-32 md:right-[11.5rem] z-50 p-3 bg-white/10 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
              title="Stop Video"
            >
              <Square size={24} className="fill-current" />
            </button>
          </>
        )}

        {!isPlaying && currentScene === 0 && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 bg-[url('/cs_video/scene_clinic.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30 mb-8 border-t-blue-400 animate-spin" style={{ animationDuration: '3s' }}>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                  <Binary className="text-blue-400 animate-pulse" size={32} />
                </div>
              </div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Dispensing Optics Suite</span>
              <h2 className="text-2xl md:text-5xl text-white font-black mb-4 tracking-tighter uppercase italic">Lens Type Identification</h2>
              <p className="text-slate-400 font-medium max-w-lg mb-10 leading-relaxed text-sm md:text-base">Comprehensive clinical guide to identifying and verifying different types of ophthalmic lenses.</p>
              <button 
                onClick={handleStart}
                className="group bg-blue-500 hover:bg-white hover:text-blue-500 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs md:text-sm"
              >
                Launch Simulation <Play size={20} className="group-hover:fill-current" />
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {(isPlaying || (currentScene > 0 && currentScene < SCRIPT.length)) && (
            <motion.div 
              key={currentScene}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center bg-white"
            >
              <motion.img 
                src={currentData.img}
                alt="Scene"
                className="w-full h-full object-contain"
                animate={{ scale: [1, 1.1], x: [0, -20], y: [0, -10] }}
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPlaying && (
            <motion.div 
              key={`text-${currentScene}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 z-30"
            >
              <div className="bg-black/60 backdrop-blur-2xl p-6 md:p-10 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-4 mb-4">
                  <h3 className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs italic">Clinical Step {currentScene + 1}: {currentData.title}</h3>
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-0.5 rounded-lg text-[10px] border border-emerald-400/20">{currentData.subtitle}</span>
                </div>
                <p className="text-white text-lg md:text-3xl font-bold leading-tight md:leading-snug tracking-tight">{currentData.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && (
           <div className="absolute top-0 inset-x-0 h-1 bg-white/5 z-40">
              <motion.div 
                className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                initial={{ width: `${progressPercent}%` }}
                animate={{ width: `${((currentScene + 1) / SCRIPT.length) * 100}%` }}
                transition={{ duration: SCRIPT[currentScene]?.duration / 1000, ease: "linear" }}
              />
           </div>
        )}
      </div>

      {!isPlaying && currentScene >= SCRIPT.length && (
        <div className="w-full md:max-w-6xl md:mt-6 bg-[#0a0f1d] md:rounded-[2.5rem] overflow-hidden flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="w-full md:hidden aspect-video relative overflow-hidden bg-slate-800">
             <img src={SCRIPT[SCRIPT.length-1].img} className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white shadow-2xl">
                   <Play size={32} className="fill-current ml-1" />
                </div>
             </div>
          </div>

          <div className="w-full p-8 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between gap-12">
            <div className="flex-1">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Module Completion</span>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0 mx-auto md:mx-0 shadow-inner">
                  <ClipboardCheck size={28} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Subject Assessment</h2>
              </div>
              <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-2xl mb-10">
                This assessment validates your proficiency in identifying and verifying various types of ophthalmic lenses according to clinical standards. You have **10 clinical MCQs** to answer.
              </p>

              <div className="grid grid-cols-2 lg:flex items-center gap-6 md:gap-10 mb-10 text-slate-400">
                 <div className="flex items-center gap-3">
                   <Clock size={16} className="text-blue-500" />
                   <span className="text-xs font-bold uppercase tracking-wider">EST: 15 MINS</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <ClipboardCheck size={16} className="text-blue-500" />
                   <span className="text-xs font-bold uppercase tracking-wider">10 QUESTIONS</span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onStartTest}
                  className="w-full md:w-auto bg-white text-black hover:bg-slate-200 px-12 py-5 rounded-2xl font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Launch Module Test <Play size={20} className="fill-current" />
                </button>
                <button 
                  onClick={handleStart}
                  className="w-full md:w-auto bg-white/5 text-white hover:bg-white/10 px-8 py-5 rounded-2xl font-bold transition-all border border-white/5"
                >
                  Watch Again
                </button>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0">
              <div className="glass-card p-6 bg-blue-500/5 border-blue-500/20 rounded-3xl">
                <h4 className="text-white font-bold mb-2 italic flex items-center gap-2">
                  <Award size={16} className="text-blue-400" /> Clinical Pearl
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">To differentiate between SV and Progressive lenses, observe the side distortion; PALs show wavy distortions on the nasal and temporal sides when panned across a straight edge.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
