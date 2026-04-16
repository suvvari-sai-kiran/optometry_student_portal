import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, X, Volume2, VolumeX, 
  ChevronRight, ChevronLeft, Award, BookOpen, Clock, Settings
} from 'lucide-react';

const SCRIPT = [
  {
    title: "Introduction",
    text: "Hello everyone! Today, we are going to learn about Frame Adjustment Techniques in optical dispensing.",
    duration: 5000,
    image: "/logo.png"
  },
  {
    title: "The Aim",
    text: "Frame adjustment ensures that spectacles fit comfortably and provide proper vision alignment.",
    duration: 6000,
    image: "/logo.png"
  },
  {
    title: "Importance",
    text: "A poorly adjusted frame can cause discomfort, slipping, pressure marks, and improper vision.",
    duration: 6000,
    image: "/fat_video/bridge_adjustment.svg"
  },
  {
    title: "Initial Observation",
    text: "First, observe how the frame sits on the patient’s face. Check for tilt, uneven temples, or loose fitting.",
    duration: 7000,
    image: "/fat_video/horizontal_alignment.svg"
  },
  {
    title: "Adjusting the Bridge",
    text: "Adjust the bridge so it sits comfortably on the nose. It should not slip down or create pressure.",
    duration: 6000,
    image: "/fat_video/bridge_adjustment.svg"
  },
  {
    title: "Temple Adjustment",
    text: "The temples should follow the contour of the ears. They should not be too tight or too loose.",
    duration: 6000,
    image: "/fat_video/temple_bend.svg"
  },
  {
    title: "Frame Alignment",
    text: "Ensure the frame is level and aligned horizontally with the eyes. Both lenses should be at the same height.",
    duration: 7000,
    image: "/fat_video/horizontal_alignment.svg"
  },
  {
    title: "Pantoscopic Tilt",
    text: "Adjust the frame so that it tilts slightly inward toward the cheeks. This improves visual comfort and alignment.",
    duration: 7000,
    image: "/fat_video/pantoscopic_tilt.svg"
  },
  {
    title: "Final Comfort Check",
    text: "Ask the patient if the frame feels comfortable. Check for stability during head movement.",
    duration: 6000,
    image: "/logo.png"
  },
  {
    title: "Conclusion",
    text: "Proper frame adjustment improves comfort, fit, and vision quality. Thank you for watching!",
    duration: 6000,
    image: "/logo.png"
  }
];

const FrameAdjustmentTechniquesVideo = ({ onClose, onStartTest }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const speechRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      speakContent(SCRIPT[currentScene].text);
      const startTime = Date.now();
      const duration = SCRIPT[currentScene].duration;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / duration) * 100;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          if (currentScene < SCRIPT.length - 1) {
            setCurrentScene(prev => prev + 1);
            setProgress(0);
          } else {
            setIsPlaying(false);
            setProgress(100);
          }
        } else {
          setProgress(newProgress);
        }
      }, 50);

      return () => {
        clearInterval(interval);
        window.speechSynthesis.cancel();
      };
    }
  }, [currentScene, isPlaying]);

  const speakContent = (text) => {
    window.speechSynthesis.cancel();
    if (isMuted) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) window.speechSynthesis.cancel();
  };

  const handleReset = () => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 md:rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col aspect-[4/5] sm:aspect-video">
        
        {/* Header */}
        <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/30">
              <Settings className="text-primary size-5 md:size-6" />
            </div>
            <div>
              <h2 className="text-white text-sm md:text-xl font-black tracking-tight uppercase">Frame Adjustment</h2>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-widest uppercase">Module 4: Dispensing Optics</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scene Container */}
        <div className="flex-1 relative flex items-center justify-center bg-slate-950 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentScene}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <img 
                src={SCRIPT[currentScene].image} 
                alt={SCRIPT[currentScene].title}
                className="w-full h-full object-contain p-4 md:p-12 opacity-80"
              />
              
              {/* Overlay Text */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-20 pointer-events-none"
              >
                <div className="bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/10 max-w-3xl">
                  <h3 className="text-primary text-xs md:text-base font-black uppercase tracking-[0.3em] mb-4">{SCRIPT[currentScene].title}</h3>
                  <p className="text-white text-sm md:text-2xl font-bold leading-relaxed">{SCRIPT[currentScene].text}</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator Dots */}
          <div className="absolute bottom-32 inset-x-0 flex justify-center gap-2 z-20">
            {SCRIPT.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 md:h-1.5 transition-all duration-300 rounded-full ${idx === currentScene ? 'w-8 md:w-12 bg-primary' : 'w-2 md:w-3 bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-black/60 backdrop-blur-2xl p-4 md:p-8 border-t border-white/5 z-20">
          <div className="max-w-4xl mx-auto flex flex-col gap-4 md:gap-6">
            
            {/* Progress Bar */}
            <div className="relative h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={handleTogglePlay}
                  className="p-3 md:p-4 bg-primary hover:bg-primary/90 text-white rounded-xl md:rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button 
                  onClick={handleReset}
                  className="p-3 md:p-4 bg-white/5 hover:bg-white/10 text-white rounded-xl md:rounded-2xl transition-all border border-white/10"
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={handleToggleMute}
                  className="p-3 md:p-4 bg-white/5 hover:bg-white/10 text-white rounded-xl md:rounded-2xl transition-all border border-white/10"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              {currentScene === SCRIPT.length - 1 && progress > 90 ? (
                <button 
                  onClick={onStartTest}
                  className="px-6 md:px-10 py-3 md:py-4 bg-white text-slate-900 hover:bg-primary hover:text-white font-black rounded-xl md:rounded-2xl transition-all shadow-2xl flex items-center gap-2 md:gap-3 uppercase tracking-widest text-[10px] md:text-sm active:scale-95 group"
                >
                  Start Assessment <Award size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] md:text-xs">
                  <Clock size={14} className="text-primary" /> Scene {currentScene + 1} / {SCRIPT.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameAdjustmentTechniquesVideo;
