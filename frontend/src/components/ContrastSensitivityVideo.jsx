import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Eye, Volume2, VolumeX, Square } from 'lucide-react';

const SCRIPT = [
  { img: 'cs_scene_foggy_road.png', duration: 5000, title: 'Hook', text: 'Can you see clearly… even when the contrast is low?', subtitle: 'Not all vision problems are about clarity…' },
  { img: 'scene_clinic.png', duration: 5000, title: 'Introduction', text: 'Welcome to the Contrast Sensitivity Test—an essential part of modern eye care.', subtitle: 'Contrast Sensitivity Test' },
  { img: 'scene_chart.png', duration: 8000, title: 'Concept Explanation', text: 'Contrast sensitivity measures how well you can distinguish objects from their background, especially when the difference between light and dark is subtle.', subtitle: 'Detecting Light vs Dark Differences' },
  { img: 'cs_scene_foggy_road.png', duration: 7000, title: 'Real-Life Importance', text: 'This ability is crucial for everyday tasks like night driving, walking in dim light, or recognizing faces in shadows.', subtitle: 'Night Vision • Low Light • Safety' },
  { img: 'scene_chart.png', duration: 10000, title: 'Test Method', text: 'Unlike standard eye charts, this test uses letters or patterns that gradually fade in contrast, not size.', subtitle: 'Letters become lighter, not smaller' },
  { img: 'scene_procedure.png', duration: 10000, title: 'Procedure', text: 'The patient reads the chart one eye at a time, identifying the faintest visible letters. The lowest visible contrast determines the score.', subtitle: 'One Eye at a Time' },
  { img: 'scene_procedure.png', duration: 10000, title: 'Clinical Insight', text: 'Reduced contrast sensitivity may indicate conditions such as cataracts, glaucoma, or retinal disorders—even when visual acuity appears normal.', subtitle: 'Early Detection Matters' },
  { img: 'cs_scene_foggy_road.png', duration: 10000, title: 'Conclusion', text: 'Contrast sensitivity testing reveals how well you truly see in the real world—beyond just reading letters on a chart.', subtitle: 'See Beyond Clarity' }
];

export default function ContrastSensitivityVideo({ onClose, onStartTest }) {
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
        >
          <X size={24} />
        </button>
        <button 
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className="absolute top-6 right-20 z-50 p-3 bg-white/10 hover:bg-primary hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
          title={isAudioEnabled ? "Mute Audio" : "Enable Audio"}
        >
          {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        {isPlaying && (
          <>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="absolute top-6 right-32 z-50 p-3 bg-white/10 hover:bg-primary hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
              title={isPaused ? "Resume Video" : "Pause Video"}
            >
              {isPaused ? <Play size={24} className="fill-current" /> : <Pause size={24} className="fill-current" />}
            </button>
            <button 
              onClick={handleStop}
              className="absolute top-6 right-[11.5rem] z-50 p-3 bg-white/10 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
              title="Stop Video"
            >
              <Square size={24} className="fill-current" />
            </button>
          </>
        )}

        {!isPlaying && currentScene === 0 && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 bg-[url('/cs_video/cs_scene_foggy_road.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 mb-8 border-t-primary animate-spin" style={{ animationDuration: '3s' }}>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                  <Eye className="text-primary animate-pulse" size={32} />
                </div>
              </div>
              <h2 className="text-4xl text-white font-black mb-4 tracking-tight">Contrast Sensitivity Test</h2>
              <p className="text-slate-400 font-medium max-w-lg mb-8">An immersive clinical module demonstrating the crucial ability to distinguish objects from their background in low-contrast conditions.</p>
              <button 
                onClick={handleStart}
                className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <Play size={24} className="fill-white" /> Start Simulation
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {(isPlaying || currentScene > 0) && (
            <motion.div 
              key={currentScene}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <motion.img 
                src={`/cs_video/${currentData.img}`}
                alt="Scene"
                className="w-full h-full object-cover"
                animate={{ scale: [1, 1.1], x: [0, -20], y: [0, -10] }}
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
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
              className="absolute bottom-10 left-10 right-10 md:bottom-16 md:left-20 md:right-20 z-30"
            >
              <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-3">
                  <h3 className="text-primary font-black uppercase tracking-[0.3em] text-sm md:text-base">{currentData.title}</h3>
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-4 py-1 rounded-lg text-sm border border-emerald-400/20">{currentData.subtitle}</span>
                </div>
                <p className="text-white text-xl md:text-3xl font-medium leading-relaxed drop-shadow-lg">{currentData.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && (
           <div className="absolute top-0 inset-x-0 h-1.5 bg-white/10 z-40">
              <motion.div 
                className="h-full bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                initial={{ width: `${progressPercent}%` }}
                animate={{ width: `${((currentScene + 1) / SCRIPT.length) * 100}%` }}
                transition={{ duration: SCRIPT[currentScene]?.duration / 1000, ease: "linear" }}
              />
           </div>
        )}

        {!isPlaying && currentScene >= SCRIPT.length && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 mb-8">
               <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </motion.div>
            <h2 className="text-4xl text-white font-black mb-4">Module Completed</h2>
            <p className="text-slate-400 font-medium mb-8">You have successfully reviewed the Contrast Sensitivity Test procedure.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleStart}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                Watch Again
              </button>
              {onStartTest && (
                <button 
                  onClick={onStartTest}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  Take Assessment
                </button>
              )}
              <button 
                onClick={onClose}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg"
              >
                Return to Clinic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
