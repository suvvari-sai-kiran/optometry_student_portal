import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, RotateCcw, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

const SCRIPT = [
  { img: '/cs_video/scene_procedure.png', duration: 4000, title: 'Title', text: 'Contact Lens Complications', subtitle: 'Identifying Lens-Related Problems' },
  { img: '/cs_video/scene_clinic.png', duration: 6000, title: 'Aim', text: 'This assessment identifies complications caused by improper contact lens use or poor lens fitting.', subtitle: 'Detect Eye Problems' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Common Causes', text: 'Complications may arise due to poor hygiene, improper fit, overwear, or dry eye conditions.', subtitle: 'Hygiene • Fit • Overuse' },
  { img: '/cs_video/scene_clinic.png', duration: 10000, title: 'Symptoms', text: 'Patients may experience redness, irritation, blurred vision, dryness, or discomfort.', subtitle: 'Redness • Pain • Blur' },
  { img: '/cs_video/scene_procedure.png', duration: 15000, title: 'Types of Complications', text: 'Common complications include corneal abrasion, infection, hypoxia, and allergic reactions.', subtitle: 'Multiple Conditions' },
  { img: '/cs_video/scene_clinic.png', duration: 15000, title: 'Examination', text: 'The eye is examined using a slit lamp to detect signs such as staining, deposits, or inflammation.', subtitle: 'Detailed Examination' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Interpretation', text: 'Any abnormal findings indicate the need for immediate management or discontinuation of lens use.', subtitle: 'Immediate Action' },
  { img: '/cs_video/scene_clinic.png', duration: 10000, title: 'Management', text: 'Management includes improving hygiene, changing lens type, using lubricants, or medical treatment.', subtitle: 'Treatment & Care' },
  { img: '/cs_video/scene_procedure.png', duration: 10000, title: 'Prevention', text: 'Proper lens care, regular follow-ups, and limited wearing time help prevent complications.', subtitle: 'Preventive Care' },
  { img: '/cs_video/scene_clinic.png', duration: 5000, title: 'Conclusion', text: 'Early detection and proper care ensure safe and comfortable contact lens use.', subtitle: 'Safe Vision' },
];

const A = { bar: 'bg-red-500', glow: 'shadow-[0_0_18px_rgba(239,68,68,0.7)]', lbl: 'text-red-400', bright: 'text-red-500', btn: 'bg-red-500 hover:bg-red-400 shadow-red-500/25', spin: 'bg-red-500/20', bdr: 'border-red-500/30 border-t-red-400', note: 'bg-red-500/5 border-red-500/15', nIcon: 'text-red-400' };

export default function CLComplicationsVideo({ onClose, onStartTest }) {
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
          <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${A.bright}`}>Adverse Reactions</p>
          <h1 className="text-[13px] font-bold text-white uppercase tracking-wide">CL Complications</h1>
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
                    <AlertTriangle className={`${A.lbl} animate-pulse`} size={20} />
                  </div>
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 ${A.bright}`}>Adverse Reactions</p>
                <h2 className="text-lg sm:text-2xl text-white font-black tracking-tight uppercase italic mb-2">CL Complications</h2>
                <p className="text-slate-400 text-xs max-w-xs mb-5 leading-relaxed">Clinical analysis of complications related to lens overwear, poor hygiene, and fitting anomalies.</p>
                <button onClick={handleStart} className={`${A.btn} active:scale-95 text-white px-7 py-3 rounded-xl font-black shadow-xl text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-all`}><Play size={14} className="fill-current" /> Launch Simulation</button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {(isPlaying || (currentScene > 0 && currentScene < SCRIPT.length)) && (
              <motion.div key={currentScene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0">
                <motion.img src={data.img} alt="Scene" className="w-full h-full object-cover" animate={{ scale: [1, 1.04] }} transition={{ duration: 13, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} />
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
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 whitespace-nowrap">{data.subtitle}</span>
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
            <p className="text-slate-400 text-sm leading-relaxed mb-4">Validate your knowledge on CL complications with <strong className="text-white">10 clinical MCQs</strong>.</p>
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
              <h4 className="text-white font-bold text-xs mb-1 flex items-center gap-1.5"><Award size={12} className={A.nIcon} /> Clinical Warning</h4>
              <p className="text-slate-400 text-xs leading-relaxed">In cases of Microbial Keratitis, a painful red eye with a corneal infiltrate is a medical emergency. Remove the lens immediately and refer to a corneal specialist.</p>
            </div>
          </motion.div>
        )}
        {isIdle && <div className="px-4 pt-3 pb-4 space-y-2">{[2, 3, 2.5].map((w, i) => <div key={i} className="h-2.5 bg-white/5 rounded-full animate-pulse" style={{ width: `${w * 33}%` }} />)}</div>}
      </div>
    </div>
  );
}
