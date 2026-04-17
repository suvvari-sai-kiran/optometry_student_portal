import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Eye, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, RotateCcw, CheckCircle2 } from 'lucide-react';

const SCRIPT = [
  { img: '/amsler_video/amsler_grid.svg', duration: 4000, title: 'Title', text: 'Amsler Grid Test', subtitle: 'Assessment of Central Vision' },
  { img: '/cs_video/scene_procedure.png', duration: 6000, title: 'Aim of the Test', text: 'The Amsler Grid Test is used to evaluate the central visual field and detect macular abnormalities.', subtitle: 'Checks Central Vision' },
  { img: '/cs_video/scene_clinic.png', duration: 8000, title: 'Test Setup', text: 'The grid is held at a normal reading distance, approximately 30 to 35 centimeters, in good lighting conditions.', subtitle: 'Distance: 30–35 cm' },
  { img: '/cs_video/scene_procedure.png', duration: 7000, title: 'Eye Occlusion', text: 'One eye is covered while the other eye focuses on the center dot.', subtitle: 'One eye at a time' },
  { img: '/amsler_video/amsler_grid.svg', duration: 7000, title: 'Fixation', text: 'The patient is instructed to look directly at the central dot without moving the eye.', subtitle: 'Focus on center' },
  { img: '/amsler_video/amsler_distorted.svg', duration: 13000, title: 'Observation', text: 'The patient observes the grid lines and reports any distortions, blurred areas, wavy lines, or missing spots.', subtitle: 'Look for distortions' },
  { img: '/cs_video/scene_procedure.png', duration: 7000, title: 'Repeat for Other Eye', text: 'The test is repeated for the other eye to compare both central visual fields.', subtitle: 'Repeat for both eyes' },
  { img: '/amsler_video/amsler_distorted.svg', duration: 13000, title: 'Interpretation', text: 'Normal vision shows straight, evenly spaced lines. Distorted or missing areas may indicate macular diseases such as age-related macular degeneration.', subtitle: 'Normal vs Abnormal' },
  { img: '/cs_video/scene_clinic.png', duration: 5000, title: 'Conclusion', text: 'The Amsler Grid Test is a simple and effective tool for early detection of central vision problems.', subtitle: 'Early Detection Matters' }
];

const ACCENT = { progress: 'bg-blue-500', glow: 'shadow-[0_0_18px_rgba(59,130,246,0.7)]', label: 'text-blue-400', labelBright: 'text-blue-500', splashBtn: 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/25', spinnerBg: 'bg-blue-500/20', spinnerBorder: 'border-blue-500/30 border-t-blue-400', noteCard: 'bg-blue-500/5 border-blue-500/15', noteIcon: 'text-blue-400' };

export default function AmslerGridVideo({ onClose, onStartTest }) {
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

  
  const handleSeek = (e) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newScene = Math.floor(percentage * SCRIPT.length);
    setCurrentScene(Math.max(0, Math.min(newScene, SCRIPT.length - 1)));
  };
const data = SCRIPT[Math.min(currentScene, SCRIPT.length - 1)];
  const isFinished = !isPlaying && currentScene >= SCRIPT.length;
  const isIdle = !isPlaying && currentScene === 0;

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col overflow-hidden">

      {/* ── Sticky Header ── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#0a0f1d]/95 backdrop-blur-sm border-b border-white/5 z-30">
        <button onClick={onClose} className="flex items-center gap-1.5 p-2 -ml-1 text-slate-400 active:text-white">
          <ChevronLeft size={20} />
          <span className="text-xs font-semibold hidden sm:block">Back</span>
        </button>
        <div className="text-center">
          <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${ACCENT.labelBright}`}>Central Vision Phase</p>
          <h1 className="text-[13px] font-bold text-white uppercase tracking-wide">Amsler Grid Test</h1>
        </div>
        <div className="flex items-center gap-1">
          {isPlaying && <>
            <button onClick={() => setIsPaused(!isPaused)} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-white/15">
              {isPaused ? <Play size={17} className="fill-current" /> : <Pause size={17} />}
            </button>
            <button onClick={handleStop} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-red-500/30">
              <Square size={17} className="fill-current" />
            </button>
          </>}
          <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-white/15">
            {isAudioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
      </div>

      {/* ── Progress Bar (flush, no gap) ── */}
      

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Image Block */}
        <div className="relative w-full bg-[#0d1117]" style={{ aspectRatio: '16/9' }}>
          <AnimatePresence>
            {isIdle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] px-6 text-center z-20">
                <div className={`w-14 h-14 ${ACCENT.spinnerBg} rounded-full flex items-center justify-center border ${ACCENT.spinnerBorder} mb-4 animate-spin`} style={{ animationDuration: '3s' }}>
                  <div className={`w-10 h-10 ${ACCENT.spinnerBg} rounded-full flex items-center justify-center animate-spin`} style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                    <Eye className={`${ACCENT.label} animate-pulse`} size={20} />
                  </div>
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 ${ACCENT.labelBright}`}>Central Vision Phase</p>
                <h2 className="text-lg sm:text-2xl text-white font-black tracking-tight uppercase italic mb-2">Amsler Grid Test</h2>
                <p className="text-slate-400 text-xs max-w-xs mb-5 leading-relaxed">Standard assessment of the central visual field for accurate detection of macular abnormalities.</p>
                <button onClick={handleStart} className={`${ACCENT.splashBtn} active:scale-95 text-white px-7 py-3 rounded-xl font-black shadow-xl text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-all`}>
                  <Play size={14} className="fill-current" /> Launch Simulation
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {(isPlaying || (currentScene > 0 && currentScene < SCRIPT.length)) && (
              <motion.div key={currentScene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }} className="absolute inset-0">
                <motion.img src={data.img} alt="Scene" className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.04] }} transition={{ duration: 13, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>

          {isPlaying && (
            <div className="absolute top-2.5 left-3 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md border border-white/10">
              <span className="text-[10px] font-bold text-white/60">{currentScene + 1} / {SCRIPT.length}</span>
            </div>
          )}
        </div>

        {/* ── Text Panel — directly below image, NO gap ── */}
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div key={`t-${currentScene}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-[#020617] px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-[0.28em] ${ACCENT.label}`}>{data.title}</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 whitespace-nowrap">{data.subtitle}</span>
              </div>
              <p className="text-white text-[15px] sm:text-lg font-bold leading-snug">{data.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Finished Screen ── */}
        {isFinished && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="px-4 pt-4 pb-6 sm:px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-emerald-500/15 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle2 size={19} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.28em]">Module Complete</p>
                <h2 className="text-lg font-black text-white">Subject Assessment</h2>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">Complete the Amsler Grid module. Validate your understanding with <strong className="text-white">10 clinical MCQs</strong>.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {[{ icon: Clock, label: 'Est. 15 mins' }, { icon: ClipboardCheck, label: '10 Questions' }, { icon: Award, label: 'Pass: 5/10' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-400">
                  <Icon size={12} className={ACCENT.label} /><span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button onClick={onStartTest} className="flex-1 bg-white text-black active:scale-[0.98] px-5 py-3.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2">
                <Play size={14} className="fill-current" /> Launch Module Test
              </button>
              <button onClick={handleStart} className="flex-1 sm:flex-none bg-white/6 text-white active:scale-[0.98] px-4 py-3.5 rounded-xl font-bold text-xs border border-white/10 flex items-center justify-center gap-2">
                <RotateCcw size={13} /> Watch Again
              </button>
            </div>
            <div className={`mt-4 p-3.5 ${ACCENT.noteCard} rounded-xl border`}>
              <h4 className="text-white font-bold text-xs mb-1 flex items-center gap-1.5"><Award size={12} className={ACCENT.noteIcon} /> Macular Note</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Amsler Grid is the gold standard for monitoring metamorphopsia. Instruct patients to report any 'waviness' immediately as it indicates subretinal fluid.</p>
            </div>
          </motion.div>
        )}

        {isIdle && <div className="px-4 pt-3 pb-4 space-y-2">{[2, 3, 2.5].map((w, i) => <div key={i} className={`h-2.5 bg-white/5 rounded-full animate-pulse`} style={{ width: `${w * 33}%` }} />)}</div>}
      </div>
    </div>
  );
}
