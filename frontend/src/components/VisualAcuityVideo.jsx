import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Eye } from 'lucide-react';

const SCRIPT = [
  { img: 'va_scene_intro_1776272597620.png', duration: 7000, title: 'Introduction', text: 'Hello, and welcome. In this video, we will learn about the Visual Acuity Assessment Test, a fundamental procedure used to measure the clarity or sharpness of vision.' },
  { img: 'va_scene_intro_1776272597620.png', duration: 8000, title: 'What is Visual Acuity?', text: 'Visual acuity refers to how clearly a person can see objects at a specific distance. It helps eye care professionals determine how well the eyes are functioning and whether corrective lenses are needed.' },
  { img: 'va_scene_tools_1776272632217.png', duration: 10000, title: 'Common Tools Used', text: 'The most commonly used tool for measuring visual acuity is the Snellen chart. This chart consists of rows of letters that decrease in size from top to bottom. Other charts include the LogMAR chart and E chart.' },
  { img: 'va_scene_tools_1776272632217.png', duration: 8000, title: 'Test Setup', text: 'To perform the test, the patient is positioned at a standard distance, usually 6 meters or 20 feet, from the chart. One eye is covered while the other eye is tested.' },
  { img: 'va_scene_procedure_1776272987487.png', duration: 8000, title: 'Procedure', text: 'The patient is asked to read the smallest line of letters they can see clearly. The examiner records the results as a fraction, such as 6 over 6 or 20 over 20, which indicates normal vision.' },
  { img: 'va_scene_procedure_1776272987487.png', duration: 8000, title: 'Understanding Results', text: 'A result of 6 over 6 means the person can see clearly at 6 meters what a normal eye should see at that distance. Lower values may indicate vision problems such as myopia or hyperopia.' },
  { img: 'va_scene_intro_1776272597620.png', duration: 8000, title: 'Importance of the Test', text: 'Visual acuity testing is essential for detecting vision problems early. It is widely used in schools, clinics, and hospitals as part of routine eye examinations.' }
];

export default function VisualAcuityVideo({ onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    let timer;
    if (isPlaying && currentScene < SCRIPT.length) {
      timer = setTimeout(() => {
        setCurrentScene(prev => prev + 1);
      }, SCRIPT[currentScene].duration);
    } else if (currentScene >= SCRIPT.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentScene]);

  const handleStart = () => {
    if (currentScene >= SCRIPT.length) {
      setCurrentScene(0);
    }
    setIsPlaying(true);
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

        {!isPlaying && currentScene === 0 && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 bg-[url('/va_video/va_scene_intro_1776272597620.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 mb-8 border-t-primary animate-spin" style={{ animationDuration: '3s' }}>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                  <Eye className="text-primary animate-pulse" size={32} />
                </div>
              </div>
              <h2 className="text-4xl text-white font-black mb-4 tracking-tight">Visual Acuity Assessment Test</h2>
              <p className="text-slate-400 font-medium max-w-lg mb-8">An immersive clinical video module demonstrating the fundamentals of measuring clarity and sharpness of vision.</p>
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
                src={`/va_video/${currentData.img}`}
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
                <h3 className="text-primary font-black uppercase tracking-[0.3em] text-sm md:text-base mb-3">{currentData.title}</h3>
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
            <p className="text-slate-400 font-medium mb-8">You have successfully reviewed the Visual Acuity Assessment procedure.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleStart}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                Watch Again
              </button>
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
