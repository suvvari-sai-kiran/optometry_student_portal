import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Eye, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, RotateCcw, CheckCircle2 } from 'lucide-react';

const SCRIPT = [
  { img: '/mag_video/mag_lens_text.svg', duration: 4000, title: 'Title', text: 'Magnification Calculation in Optometry', subtitle: 'Understanding Image Enlargement' },
  { img: '/mag_video/mag_compare.svg', duration: 6000, title: 'Aim of the Test', text: 'This test is used to calculate how much an optical system enlarges an image compared to its actual size.', subtitle: 'Measures Image Magnification' },
  { img: '/mag_video/mag_compare.svg', duration: 10000, title: 'Basic Concept', text: 'Magnification is the ratio of the image size to the object size. It helps determine how clearly a patient can see small details.', subtitle: 'Image Size / Object Size' },
  { img: '/mag_video/mag_formula.svg', duration: 10000, title: 'Formula', text: 'This is the basic formula used to calculate magnification.', subtitle: 'M = Image Size / Object Size' },
  { img: '/mag_video/mag_formula.svg', duration: 15000, title: 'Example Calculation', text: 'For example, if the image size is 10 units and the object size is 2 units, the magnification is 5 times.', subtitle: 'Example: 10 / 2 = 5x' },
  { img: '/mag_video/mag_patient.svg', duration: 10000, title: 'Clinical Application', text: 'Magnification is important in prescribing low vision aids such as magnifiers and telescopic lenses.', subtitle: 'Low Vision Aids' },
  { img: '/mag_video/mag_tradeoff.svg', duration: 10000, title: 'Interpretation', text: 'Higher magnification improves visibility of small objects, but may reduce the field of view.', subtitle: 'Trade-off: Size vs Field' },
  { img: '/mag_video/mag_patient.svg', duration: 5000, title: 'Conclusion', text: 'Magnification calculation helps optimize visual aids for better clarity and patient comfort.', subtitle: 'Improved Vision' }
];

const ACCENT = {
  progress: 'bg-rose-500',
  glow: 'shadow-[0_0_20px_rgba(244,63,94,0.8)]',
  label: 'text-rose-500',
  icon: 'text-rose-400',
  badgeBg: 'bg-rose-500/10',
  splashBtn: 'bg-rose-500 hover:bg-rose-400',
  spinnerBorder: 'border-rose-500/30 border-t-rose-400',
  spinnerBg: 'bg-rose-500/20',
  noteCard: 'bg-rose-500/5 border-rose-500/15',
  noteIcon: 'text-rose-400',
  statsIcon: 'text-rose-400',
};

export default function MagnificationCalculationVideo({ onClose, onStartTest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    let timer;
    if (isPlaying && !isPaused && currentScene < SCRIPT.length) {
      timer = setTimeout(() => setCurrentScene(prev => prev + 1), SCRIPT[currentScene].duration);
    } else if (currentScene >= SCRIPT.length) {
      setIsPlaying(false);
      setIsPaused(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, isPaused, currentScene]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      isPaused ? window.speechSynthesis.pause() : window.speechSynthesis.resume();
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
    return () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [isPlaying, currentScene, isAudioEnabled]);

  const handleStart = () => {
    if (currentScene >= SCRIPT.length) setCurrentScene(0);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentScene(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const currentData = SCRIPT[Math.min(currentScene, SCRIPT.length - 1)];
  const progressPercent = (currentScene / SCRIPT.length) * 100;
  const isFinished = !isPlaying && currentScene >= SCRIPT.length;
  const isIdle = !isPlaying && currentScene === 0;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#020617] overflow-hidden">

      {/* ── Top Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f1d] border-b border-white/5 shrink-0">
        <button onClick={onClose} className="flex items-center gap-2 p-2 -ml-1 text-slate-400 active:text-white transition-colors">
          <ChevronLeft size={22} />
          <span className="text-xs font-semibold text-slate-400 hidden sm:block">Back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.25em]">Calculation Module</span>
          <h1 className="text-sm font-bold text-white tracking-wider uppercase">Magnification Test</h1>
        </div>
        <div className="flex items-center gap-1">
          {isPlaying && (
            <>
              <button onClick={() => setIsPaused(!isPaused)} className="p-2 rounded-xl bg-white/8 text-slate-300 active:bg-white/15 transition-colors" title={isPaused ? 'Resume' : 'Pause'}>
                {isPaused ? <Play size={18} className="fill-current" /> : <Pause size={18} />}
              </button>
              <button onClick={handleStop} className="p-2 rounded-xl bg-white/8 text-slate-300 active:bg-red-500/30 transition-colors" title="Stop">
                <Square size={18} className="fill-current" />
              </button>
            </>
          )}
          <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className="p-2 rounded-xl bg-white/8 text-slate-300 active:bg-white/15 transition-colors" title={isAudioEnabled ? 'Mute' : 'Unmute'}>
            {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {isPlaying && (
        <div className="h-1 bg-white/5 shrink-0">
          <motion.div
            className={`h-full ${ACCENT.progress} ${ACCENT.glow}`}
            initial={{ width: `${progressPercent}%` }}
            animate={{ width: `${((currentScene + 1) / SCRIPT.length) * 100}%` }}
            transition={{ duration: (SCRIPT[currentScene]?.duration ?? 5000) / 1000, ease: 'linear' }}
          />
        </div>
      )}

      {/* ── Video Area ── */}
      <div className="relative w-full bg-[#020617] shrink-0" style={{ aspectRatio: '16/9', maxHeight: '55vh' }}>

        {/* Idle Splash */}
        <AnimatePresence>
          {isIdle && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#020617]"
            >
              <div className="relative flex flex-col items-center text-center px-6">
                <div className={`w-16 h-16 ${ACCENT.spinnerBg} rounded-full flex items-center justify-center border ${ACCENT.spinnerBorder} mb-5 animate-spin`} style={{ animationDuration: '3s' }}>
                  <div className={`w-12 h-12 ${ACCENT.spinnerBg} rounded-full flex items-center justify-center animate-spin`} style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                    <Eye className={`${ACCENT.icon} animate-pulse`} size={24} />
                  </div>
                </div>
                <span className={`text-[9px] font-black ${ACCENT.label} uppercase tracking-[0.35em] mb-2`}>Calculation Module</span>
                <h2 className="text-xl sm:text-3xl text-white font-black mb-3 tracking-tight uppercase italic">Magnification Test</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs mb-6 leading-relaxed">Immersive clinical module demonstrating image enlargement math, optical formulae, and low vision prescriptions.</p>
                <button onClick={handleStart} className={`group ${ACCENT.splashBtn} active:scale-95 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl transition-all flex items-center gap-3 uppercase tracking-[0.15em] text-xs`}>
                  <Play size={16} className="fill-current" /> Launch Simulation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene Image */}
        <AnimatePresence mode="wait">
          {(isPlaying || (currentScene > 0 && currentScene < SCRIPT.length)) && (
            <motion.div key={currentScene} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} className="absolute inset-0 flex items-center justify-center bg-white">
              <motion.img src={currentData.img} alt="Scene" className="w-full h-full object-contain" animate={{ scale: [1, 1.04] }} transition={{ duration: 14, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene counter */}
        {isPlaying && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
            <span className="text-[10px] font-bold text-white/70">{currentScene + 1} / {SCRIPT.length}</span>
          </div>
        )}
      </div>

      {/* ── Info Panel Below Video ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div key={`info-${currentScene}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${ACCENT.label}`}>Theoretical Concept · {currentData.title}</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20 whitespace-nowrap">{currentData.subtitle}</span>
              </div>
              <p className="text-white text-base sm:text-xl font-bold leading-snug">{currentData.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Finished screen */}
        {isFinished && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={22} className="text-emerald-400" />
              </div>
              <div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] block">Module Complete</span>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">Subject Assessment</h2>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              You have completed the Magnification Calculation module. Now validate your understanding with <strong className="text-white">10 clinical MCQs</strong>.
            </p>
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-400"><Clock size={13} className={ACCENT.statsIcon} /><span className="text-[10px] font-bold uppercase tracking-wider">Est. 15 mins</span></div>
              <div className="flex items-center gap-1.5 text-slate-400"><ClipboardCheck size={13} className={ACCENT.statsIcon} /><span className="text-[10px] font-bold uppercase tracking-wider">10 Questions</span></div>
              <div className="flex items-center gap-1.5 text-slate-400"><Award size={13} className={ACCENT.statsIcon} /><span className="text-[10px] font-bold uppercase tracking-wider">Pass: 5/10</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onStartTest} className="flex-1 bg-white text-black hover:bg-slate-100 active:scale-[0.98] px-6 py-4 rounded-2xl font-black tracking-wider uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-xl">
                <Play size={16} className="fill-current" /> Launch Module Test
              </button>
              <button onClick={handleStart} className="flex-1 sm:flex-none bg-white/6 hover:bg-white/10 text-white active:scale-[0.98] px-5 py-4 rounded-2xl font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-2">
                <RotateCcw size={14} /> Watch Again
              </button>
            </div>
            <div className={`mt-5 p-4 ${ACCENT.noteCard} rounded-2xl border`}>
              <h4 className="text-white font-bold text-xs mb-1.5 flex items-center gap-1.5">
                <Award size={13} className={ACCENT.noteIcon} /> Optical Note
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">Remember that linear magnification and angular magnification are different. For low vision aids, we primarily focus on relative distance magnification.</p>
            </div>
          </motion.div>
        )}

        {isIdle && (
          <div className="p-5 flex flex-col gap-3">
            <div className="h-3 bg-white/5 rounded-full w-2/3 animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full w-4/5 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
