import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Eye, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, Maximize2 } from 'lucide-react';

const SCRIPT = [
  { img: '/cs_video/scene_procedure.png', duration: 4000, title: 'Title', text: 'Contact Lens Power Calculation', subtitle: 'From Spectacles to Contact Lenses' },
  { img: '/cs_video/scene_clinic.png', duration: 6000, title: 'Aim of the Calculation', text: 'This calculation determines the correct power of contact lenses based on spectacle prescription.', subtitle: 'Accurate Vision Correction' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Key Concept', text: 'Unlike glasses, contact lenses sit directly on the eye. This changes the effective power, especially for higher prescriptions.', subtitle: 'Vertex Distance Matters' },
  { img: '/cs_video/scene_clinic.png', duration: 10000, title: 'Vertex Distance Concept', text: 'Vertex distance is the space between the spectacle lens and the eye, usually around 12 to 14 millimeters.', subtitle: '12–14 mm distance' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Formula', text: 'The formula Fc = Fs / (1 - d * Fs) is used to convert spectacle power into contact lens power.', subtitle: 'Power Conversion Formula' },
  { img: '/cs_video/scene_clinic.png', duration: 15000, title: 'Example Calculation', text: 'For example, a spectacle power of -8.00 D is adjusted using vertex distance (0.012m) to get -7.27 D.', subtitle: 'Step-by-Step Adjustment' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Final Result', text: 'The calculated value is rounded to the nearest available contact lens power (0.25 D steps).', subtitle: 'Rounded Value' },
  { img: '/cs_video/scene_clinic.png', duration: 10000, title: 'Clinical Importance', text: 'Accurate calculation ensures clear vision and comfort while wearing contact lenses.', subtitle: 'Clear & Comfortable Vision' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'When It Matters', text: 'Vertex correction is especially important for prescriptions greater than plus or minus four diopters.', subtitle: 'High Power Correction' },
  { img: '/cs_video/scene_clinic.png', duration: 5000, title: 'Conclusion', text: 'Contact lens power calculation is essential for precise and effective vision correction.', subtitle: 'Precision Matters' }
];

export default function ContactLensPowerVideo({ onClose, onStartTest }) {
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
    <div className="fixed inset-0 z-[200] flex flex-col md:items-center md:justify-center bg-[#020617] md:bg-black/95 md:backdrop-blur-xl overflow-y-auto">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0f1d]">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-0.5">Clinical Module</span>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">Clinical Hub</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="relative w-full aspect-[4/5] sm:aspect-video md:max-w-6xl md:rounded-3xl overflow-hidden md:ring-1 md:ring-white/10 md:shadow-2xl shadow-indigo-500/10 shrink-0">
        <button 
          onClick={onClose}
          className="hidden md:flex absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
        >
          <X size={24} />
        </button>

        <button 
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className="absolute top-6 right-6 md:right-20 z-50 p-3 bg-white/10 hover:bg-emerald-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
          title={isAudioEnabled ? "Mute Audio" : "Enable Audio"}
        >
          {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        {isPlaying && (
          <>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="absolute top-6 right-20 md:right-32 z-50 p-3 bg-white/10 hover:bg-emerald-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
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
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 bg-[url('/cs_video/scene_procedure.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 mb-8 border-t-emerald-400 animate-spin" style={{ animationDuration: '3s' }}>
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                  <Eye className="text-emerald-400 animate-pulse" size={32} />
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Refractive Mathematics</span>
              <h2 className="text-2xl md:text-5xl text-white font-black mb-4 tracking-tighter uppercase italic">CL Power Calculation</h2>
              <p className="text-slate-400 font-medium max-w-lg mb-10 leading-relaxed text-sm md:text-base">An immersive clinical module demonstrating the precise conversion of spectacle prescriptions to contact lens powers using vertex distance.</p>
              <button 
                onClick={handleStart}
                className="group bg-emerald-500 hover:bg-white hover:text-emerald-500 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-emerald-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs md:text-sm"
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
                  <h3 className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs italic">Stage {currentScene + 1}: {currentData.title}</h3>
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
                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
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
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 mx-auto md:mx-0 shadow-inner">
                  <ClipboardCheck size={28} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Subject Assessment</h2>
              </div>
              <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-2xl mb-10">
                This assessment is related specifically to the Contact Lens Power Calculation procedures demonstrated above. You have **10 clinical MCQs** to validate your understanding.
              </p>

              <div className="grid grid-cols-2 lg:flex items-center gap-6 md:gap-10 mb-10 text-slate-400">
                 <div className="flex items-center gap-3">
                   <Clock size={16} className="text-emerald-500" />
                   <span className="text-xs font-bold uppercase tracking-wider">EST: 15 MINS</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <ClipboardCheck size={16} className="text-emerald-500" />
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
              <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20 rounded-3xl">
                <h4 className="text-white font-bold mb-2 italic flex items-center gap-2">
                  <Award size={16} className="text-emerald-400" /> Optical Note
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">Vertex distance effects become clinically significant at +/- 4.00 D. For myopes, the CL power is always less minus than spectacles, while for hyperopes, it is more plus.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
