import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Eye, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, Maximize2 } from 'lucide-react';

const SCRIPT = [
  { img: '/cs_video/scene_clinic.png', duration: 7000, title: 'Introduction', text: 'Hello everyone! Today, we are going to learn about Optical Center Alignment in a simple and easy way.', subtitle: 'Welcome' },
  { img: '/cs_video/scene_procedure.png', duration: 8000, title: 'Definition', text: 'First, let’s understand what the optical center is. The optical center is the point in a lens where light passes without bending. Looking through this point gives clear and comfortable vision.', subtitle: 'Light pass without bending' },
  { img: '/va_video/va_scene_intro_1776272597620.png', duration: 10000, title: 'Importance', text: 'Now, why is alignment important? If the optical center is not aligned with the eyes, it can cause blurred vision, eye strain, and headaches.', subtitle: 'Avoid Eye Strain' },
  { img: '/oca_video/pd_measurement.svg', duration: 8000, title: 'Step 1: PD Measurement', text: 'Step one is measuring the pupillary distance, or PD. This is the distance between the centers of the two pupils.', subtitle: 'Measure Pupillary Distance' },
  { img: '/oca_video/marking.svg', duration: 7000, title: 'Step 2: Marking', text: 'Next, the optical center is marked on the lenses based on the PD and frame size.', subtitle: 'Marking the Lens' },
  { img: '/oca_video/alignment_ok.svg', duration: 7000, title: 'Step 3: Alignment', text: 'The lenses are then fitted into the frame so that the optical centers align exactly with the patient’s pupils.', subtitle: 'Perfect Alignment' },
  { img: '/cs_video/scene_clinic.png', duration: 7000, title: 'Step 4: Verification', text: 'Finally, the patient wears the spectacles, and we check for clear vision and comfort.', subtitle: 'Patient Comfort Check' },
  { img: '/oca_video/alignment_error.svg', duration: 10000, title: 'Incorrect Alignment', text: 'If alignment is incorrect, it may cause distortion and discomfort due to unwanted prism effects.', subtitle: 'Warning: Prism Effects' },
  { img: '/cs_video/scene_clinic.png', duration: 7000, title: 'Conclusion', text: 'So, proper optical center alignment is essential for accurate and comfortable vision correction.', subtitle: 'Clear Vision Correction' },
  { img: '/va_video/va_scene_intro_1776272597620.png', duration: 5000, title: 'Ending', text: 'Thank you for watching!', subtitle: 'See You Next Time' }
];

export default function OpticalCenterAlignmentVideo({ onClose, onStartTest }) {
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
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isPlaying, isPaused, currentScene, isAudioEnabled]);

  const handleReplay = () => {
    setCurrentScene(0);
    setIsPlaying(true);
    setIsPaused(false);
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
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-0.5">Clinical Module</span>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
            Clinical Hub
          </h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="relative w-full aspect-[4/5] sm:aspect-video md:max-w-6xl md:rounded-3xl overflow-hidden md:ring-1 md:ring-white/10 md:shadow-2xl shadow-blue-500/10 shrink-0">
        {/* Desktop Close Button */}
        <button 
          onClick={onClose}
          className="hidden md:flex absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all text-white/70"
        >
          <X size={24} />
        </button>

        <AnimatePresence mode="wait">
          {!isPlaying && currentScene === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20">
                <Eye size={40} className="text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">Optical Center Alignment</h2>
              <p className="text-slate-400 max-w-lg mb-10 text-lg font-medium">Essential techniques for achieving accurate and comfortable vision correction by perfect lens alignment.</p>
              <button 
                onClick={() => setIsPlaying(true)}
                className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center gap-4 text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/20"
              >
                Launch Simulation <Play size={20} className="fill-current" />
              </button>
            </motion.div>
          ) : currentScene >= SCRIPT.length ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20">
                <Award size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">Module Complete</h2>
              <p className="text-slate-400 max-w-lg mb-10 text-lg">You have completed the Optical Center Alignment tutorial. Ready to test your knowledge?</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={onStartTest}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/20"
                >
                  Launch Module Test <ClipboardCheck size={20} />
                </button>
                <button 
                  onClick={handleReplay}
                  className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest border border-white/10"
                >
                  Replay Content
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {isPlaying && currentScene < SCRIPT.length && (
          <div className="relative h-full flex flex-col">
            {/* Visual Content Layer */}
            <div className="absolute inset-0">
               <motion.img 
                 key={currentScene}
                 src={currentData.img}
                 initial={{ scale: 1.1, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            {/* Content UI Layer */}
            <div className="relative z-10 h-full p-8 flex flex-col justify-end">
               <div className="max-w-3xl">
                  <motion.div
                    key={`header-${currentScene}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <Clock size={16} className="text-blue-400" />
                    </div>
                    <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em]">{currentData.subtitle}</span>
                  </motion.div>
                  
                  <motion.h3 
                    key={`title-${currentScene}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase"
                  >
                    {currentData.title}
                  </motion.h3>

                  <motion.p
                    key={`text-${currentScene}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium"
                  >
                    {currentData.text}
                  </motion.p>
               </div>

               {/* Video Controls */}
               <div className="mt-10 flex items-center justify-between gap-6 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsPaused(!isPaused)}
                      className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-2xl hover:scale-105 transition-all"
                    >
                      {isPaused ? <Play size={24} className="fill-current" /> : <Pause size={24} className="fill-current" />}
                    </button>
                    <div className="w-px h-8 bg-white/10" />
                    <button 
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isAudioEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">
                      <span>Progress</span>
                      <span>Scene {currentScene + 1} of {SCRIPT.length}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={onClose}
                    className="hidden sm:flex w-12 h-12 items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
                  >
                    <Maximize2 size={24} />
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Tips Layer */}
      <div className="hidden md:flex flex-wrap justify-center gap-8 mt-12 max-w-5xl">
         {[
           { icon: Eye, title: 'Alignment', desc: 'Lenses must match pupils' },
           { icon: Square, title: 'Prism', desc: 'Misalignment causes prism' },
           { icon: Award, title: 'Comfort', desc: 'Reduces strain and headaches' }
         ].map((tip, i) => (
           <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 px-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                 <tip.icon className="text-blue-400" size={20} />
              </div>
              <div>
                 <h4 className="text-white font-bold text-sm tracking-tight">{tip.title}</h4>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{tip.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
