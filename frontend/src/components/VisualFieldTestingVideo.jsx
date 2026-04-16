import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Eye, Volume2, VolumeX, Square } from 'lucide-react';

const SCRIPT = [
  { img: '/vf_video/vf_diagram.svg', duration: 4000, title: 'Title', text: 'Visual Field Testing', subtitle: 'Assessment of Peripheral Vision' },
  { img: '/vf_video/vf_diagram.svg', duration: 6000, title: 'Aim of the Test', text: 'Visual field testing measures the full area a person can see, including central and peripheral vision.', subtitle: 'Central + Peripheral Vision' },
  { img: '/vf_video/vf_result.svg', duration: 8000, title: 'Importance', text: 'This test helps detect vision loss caused by eye and neurological conditions such as glaucoma or optic nerve damage.', subtitle: 'Detects Vision Loss' },
  { img: '/vf_video/vf_perimetry.svg', duration: 10000, title: 'Types of Testing', text: 'There are different methods of visual field testing, including confrontation testing, automated perimetry, and tangent screen testing.', subtitle: 'Multiple Methods' },
  { img: '/vf_video/vf_perimetry.svg', duration: 10000, title: 'Automated Perimetry Setup', text: 'In automated perimetry, the patient places their chin on a rest and focuses on a central target inside a dome-shaped instrument.', subtitle: 'Focus on central target' },
  { img: '/vf_video/vf_stimulus.svg', duration: 12000, title: 'Procedure', text: 'Lights of varying intensity appear in different areas. The patient presses a button each time a light is seen.', subtitle: 'Press when light is seen' },
  { img: '/vf_video/vf_result.svg', duration: 10000, title: 'Recording Results', text: 'The machine records responses and maps the visual field, highlighting areas of normal and reduced sensitivity.', subtitle: 'Visual Field Map' },
  { img: '/vf_video/vf_result.svg', duration: 10000, title: 'Interpretation', text: 'Dark or missing areas on the map may indicate visual field defects or disease progression.', subtitle: 'Detects Defects' },
  { img: '/cs_video/scene_clinic.png', duration: 5000, title: 'Conclusion', text: 'Visual field testing is essential for early diagnosis and monitoring of eye conditions.', subtitle: 'Essential Eye Test' }
];

export default function VisualFieldTestingVideo({ onClose, onStartTest }) {
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
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 bg-[url('/vf_video/vf_diagram.svg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" />
            <div className="relative z-10 flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30 mb-8 border-t-purple-400 animate-spin" style={{ animationDuration: '3s' }}>
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                  <Eye className="text-purple-400 animate-pulse" size={32} />
                </div>
              </div>
              <h2 className="text-4xl text-white font-black mb-4 tracking-tight">Visual Field Testing Tutorial</h2>
              <p className="text-slate-400 font-medium max-w-lg mb-8">An immersive clinical module demonstrating the standard assessment of the full visual field and automated perimetry mapping.</p>
              <button 
                onClick={handleStart}
                className="bg-purple-500 hover:bg-purple-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-purple-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
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
                animate={currentData.img.includes('svg') ? { scale: [1, 1.05] } : { scale: [1, 1.1], x: [0, -20], y: [0, -10] }}
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
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
                  <h3 className="text-purple-400 font-black uppercase tracking-[0.3em] text-sm md:text-base">{currentData.title}</h3>
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
                className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
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
            <p className="text-slate-400 font-medium mb-8">You have successfully reviewed the Visual Field Testing procedure.</p>
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
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg"
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
