import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, RotateCcw, CheckCircle2, Eye, Wrench } from 'lucide-react';

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

const A = { bar: 'bg-emerald-500', glow: 'shadow-[0_0_18px_rgba(16,185,129,0.7)]', lbl: 'text-emerald-400', bright: 'text-emerald-500', btn: 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25', spin: 'bg-emerald-500/20', bdr: 'border-emerald-500/30 border-t-emerald-400', note: 'bg-emerald-500/5 border-emerald-500/15', nIcon: 'text-emerald-400' };

export default function FrameAdjustmentTechniquesVideo({ onClose, onStartTest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    let t;
    if (isPlaying && !isPaused && currentScene < SCRIPT.length) {
      t = setTimeout(() => setCurrentScene(p => p + 1), SCRIPT[currentScene].duration);
    } else if (currentScene >= SCRIPT.length) { setIsPlaying(false); setIsPaused(false); }
    return () => clearTimeout(t);
  }, [isPlaying, isPaused, currentScene]);

  useEffect(() => {
    if ('speechSynthesis' in window) isPaused ? speechSynthesis.pause() : speechSynthesis.resume();
  }, [isPaused]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    if (isPlaying && !isPaused && isAudioEnabled && currentScene < SCRIPT.length) {
      const u = new SpeechSynthesisUtterance(SCRIPT[currentScene].text);
      u.rate = 0.95; speechSynthesis.speak(u);
    }
    return () => speechSynthesis.cancel();
  }, [isPlaying, currentScene, isAudioEnabled]);

  const handleStart = () => { if (currentScene >= SCRIPT.length) setCurrentScene(0); setIsPlaying(true); setIsPaused(false); };
  const handleStop = () => { setIsPlaying(false); setIsPaused(false); setCurrentScene(0); speechSynthesis.cancel(); };
  const data = SCRIPT[Math.min(currentScene, SCRIPT.length - 1)];
  const isFinished = !isPlaying && currentScene >= SCRIPT.length;
  const isIdle = !isPlaying && currentScene === 0;

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#0a0f1d]/95 backdrop-blur-sm border-b border-white/5 z-30">
        <button onClick={onClose} className="flex items-center gap-1.5 p-2 -ml-1 text-slate-400 active:text-white"><ChevronLeft size={20} /></button>
        <div className="text-center">
          <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${A.bright}`}>Dispensing Phase</p>
          <h1 className="text-[13px] font-bold text-white uppercase tracking-wide">Frame Adjustment</h1>
        </div>
        <div className="flex items-center gap-1">
          {isPlaying && <>
            <button onClick={() => setIsPaused(!isPaused)} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-white/15">{isPaused ? <Play size={17} className="fill-current" /> : <Pause size={17} />}</button>
            <button onClick={handleStop} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-red-500/30"><Square size={17} className="fill-current" /></button>
          </>}
          <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-white/15">{isAudioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
        </div>
      </div>

      {isPlaying && (
        <div className="shrink-0 h-[3px] bg-white/8">
          <motion.div className={`h-full ${A.bar} ${A.glow}`} initial={{ width: `${(currentScene / SCRIPT.length) * 100}%` }} animate={{ width: `${((currentScene + 1) / SCRIPT.length) * 100}%` }} transition={{ duration: (SCRIPT[currentScene]?.duration ?? 5000) / 1000, ease: 'linear' }} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="relative w-full bg-[#0d1117]" style={{ aspectRatio: '16/9' }}>
          <AnimatePresence>
            {isIdle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] px-6 text-center z-20">
                <div className={`w-14 h-14 ${A.spin} rounded-full flex items-center justify-center border ${A.bdr} mb-4 animate-spin`} style={{ animationDuration: '3s' }}>
                  <div className={`w-10 h-10 ${A.spin} rounded-full flex items-center justify-center animate-spin`} style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                    <Wrench className={`${A.lbl} animate-pulse`} size={20} />
                  </div>
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 ${A.bright}`}>Dispensing Phase</p>
                <h2 className="text-lg sm:text-2xl text-white font-black tracking-tight uppercase italic mb-2">Frame Adjustment</h2>
                <p className="text-slate-400 text-xs max-w-xs mb-5 leading-relaxed">Clinical module exploring manipulation techniques to achieve the perfect patient fit.</p>
                <button onClick={handleStart} className={`${A.btn} active:scale-95 text-[#0f172a] px-7 py-3 rounded-xl font-black shadow-xl text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-all`}><Play size={14} className="fill-current" /> Launch Simulation</button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {(isPlaying || (currentScene > 0 && currentScene < SCRIPT.length)) && (
              <motion.div key={currentScene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0">
                <motion.img src={data.img || data.image} alt="Scene" className="w-full h-full object-cover" animate={{ scale: [1, 1.04] }} transition={{ duration: 13, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
          {isPlaying && <div className="absolute top-2.5 left-3 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md border border-white/10"><span className="text-[10px] font-bold text-white/60">{currentScene + 1} / {SCRIPT.length}</span></div>}
        </div>

        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div key={`t-${currentScene}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="bg-[#020617] px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-[0.28em] ${A.lbl}`}>{data.title}</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 whitespace-nowrap">{data.subtitle || "Manipulation Technique"}</span>
              </div>
              <p className="text-white text-[15px] sm:text-lg font-bold leading-snug">{data.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {isFinished && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="px-4 pt-4 pb-6 sm:px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-emerald-500/15 rounded-lg flex items-center justify-center shrink-0"><CheckCircle2 size={19} className="text-emerald-400" /></div>
              <div><p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.28em]">Module Complete</p><h2 className="text-lg font-black text-white">Subject Assessment</h2></div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">Validate your knowledge on frame adjustment with <strong className="text-white">10 clinical MCQs</strong>.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {[{ icon: Clock, label: 'Est. 15 mins' }, { icon: ClipboardCheck, label: '10 Questions' }, { icon: Award, label: 'Pass: 5/10' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-400"><Icon size={12} className={A.lbl} /><span className="text-[10px] font-bold uppercase tracking-wide">{label}</span></div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button onClick={onStartTest} className="flex-1 bg-white text-black active:scale-[0.98] px-5 py-3.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2"><Play size={14} className="fill-current" /> Launch Module Test</button>
              <button onClick={handleStart} className="flex-1 sm:flex-none bg-white/6 text-white active:scale-[0.98] px-4 py-3.5 rounded-xl font-bold text-xs border border-white/10 flex items-center justify-center gap-2"><RotateCcw size={13} /> Watch Again</button>
            </div>
            <div className={`mt-4 p-3.5 ${A.note} rounded-xl border`}>
              <h4 className="text-white font-bold text-xs mb-1 flex items-center gap-1.5"><Award size={12} className={A.nIcon} /> Dispensing Tip</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Heating plastic frames makes them pliable; over-bending can snap them. Pantoscopic tilt should be adjusted to 8-12 degrees for standard vision optimization.</p>
            </div>
          </motion.div>
        )}
        {isIdle && <div className="px-4 pt-3 pb-4 space-y-2">{[2, 3, 2.5].map((w, i) => <div key={i} className="h-2.5 bg-white/5 rounded-full animate-pulse" style={{ width: `${w * 33}%` }} />)}</div>}
      </div>
    </div>
  );
}
