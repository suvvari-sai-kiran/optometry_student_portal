import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Square, ChevronLeft, Clock, ClipboardCheck, Award, RotateCcw, CheckCircle2, Eye } from 'lucide-react';

const SCRIPT = [
  { img: '/cs_video/scene_chart.png', duration: 3000, title: 'Binocular Vision Test', text: 'Worth Four Dot Test.', subtitle: 'Title' },
  { img: '/cs_video/scene_clinic.png', duration: 4000, title: '', text: 'Used to assess binocular vision and suppression.', subtitle: 'Fusion / Suppression' },
  { img: '/cs_video/scene_procedure.png', duration: 5000, title: '', text: 'Patient wears red and green glasses.', subtitle: 'Red-Green Filter' },
  { img: '/cs_video/scene_chart.png', duration: 6000, title: '', text: 'The patient looks at four dots: one red, two green, and one white.', subtitle: '4 Dot Pattern' },
  { img: '/cs_video/scene_clinic.png', duration: 6000, title: '', text: 'Seeing four dots indicates normal binocular vision.', subtitle: 'Fusion' },
  { img: '/cs_video/scene_chart.png', duration: 8000, title: '', text: 'Seeing only two or three dots indicates suppression.', subtitle: 'Suppression' },
  { img: '/cs_video/scene_chart.png', duration: 8000, title: 'Diplopia', text: 'Seeing five dots indicates double vision.', subtitle: 'Evaluation' },
  { img: '/cs_video/scene_procedure.png', duration: 6000, title: '', text: 'Test is performed at both distance and near.', subtitle: 'Distance & Near' },
  { img: '/cs_video/scene_chart.png', duration: 8000, title: '', text: 'Four dots is normal. Less indicates suppression. Five indicates diplopia.', subtitle: 'Interpretation' },
  { img: '/cs_video/scene_clinic.png', duration: 6000, title: '', text: 'Simple and effective binocular vision test.', subtitle: 'Worth Test' }
];

const A = { bar: 'bg-emerald-500', glow: 'shadow-[0_0_18px_rgba(16,185,129,0.7)]', lbl: 'text-emerald-400', bright: 'text-emerald-500', btn: 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25', spin: 'bg-emerald-500/20', bdr: 'border-emerald-500/30 border-t-emerald-400', note: 'bg-emerald-500/5 border-emerald-500/15', nIcon: 'text-emerald-400' };

export default function WorthFourDotTestVideo({ onClose, onStartTest }) {
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
      <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#0a0f1d]/95 backdrop-blur-sm border-b border-white/5 z-30">
        <button onClick={onClose} className="flex items-center gap-1.5 p-2 -ml-1 text-slate-400 active:text-white"><ChevronLeft size={20} /></button>
        <div className="text-center">
          <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${A.bright}`}>Diagnostic Phase</p>
          <h1 className="text-[13px] font-bold text-white uppercase tracking-wide">Worth Four Dot Test</h1>
        </div>
        <div className="flex items-center gap-1">
          {isPlaying && <>
            <button onClick={() => setIsPaused(!isPaused)} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-white/15">{isPaused ? <Play size={17} className="fill-current" /> : <Pause size={17} />}</button>
            <button onClick={handleStop} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-red-500/30"><Square size={17} className="fill-current" /></button>
          </>}
          <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className="p-2 rounded-lg bg-white/8 text-slate-300 active:bg-white/15">{isAudioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative w-full bg-[#0d1117] flex flex-col" style={{ aspectRatio: '16/9' }}>
          <AnimatePresence>
            {isIdle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] px-6 text-center z-20">
                <div className={`w-14 h-14 ${A.spin} rounded-full flex items-center justify-center border ${A.bdr} mb-4 animate-spin`} style={{ animationDuration: '3s' }}>
                  <div className={`w-10 h-10 ${A.spin} rounded-full flex items-center justify-center animate-spin`} style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                    <Eye className={`${A.lbl} animate-pulse`} size={20} />
                  </div>
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 ${A.bright}`}>Diagnostic Phase</p>
                <h2 className="text-lg sm:text-2xl text-white font-black tracking-tight uppercase italic mb-2">Worth 4-Dot Test</h2>
                <p className="text-slate-400 text-xs max-w-xs mb-5 leading-relaxed">Clinical module demonstrating binocular vision fusion, suppression, and diplopia testing.</p>
                <button onClick={handleStart} className={`${A.btn} active:scale-95 text-[#0f172a] px-7 py-3 rounded-xl font-black shadow-xl text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-all`}><Play size={14} className="fill-current" /> Launch Simulation</button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            {(isPlaying || (currentScene > 0 && currentScene < SCRIPT.length)) && (
              <motion.div key={currentScene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0 overflow-hidden flex flex-col justify-end">
                <motion.img src={data.img || data.image} alt="Scene" className="absolute inset-0 w-full h-full object-cover z-0" animate={{ scale: [1, 1.04] }} transition={{ duration: 13, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/20 to-transparent z-10" />
                
                {isPlaying && data.title && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-20 pb-8 px-6 text-center w-full"
                  >
                    <span className="text-lg sm:text-2xl font-black text-white bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl tracking-wide uppercase block w-fit mx-auto">
                      {data.title}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {isPlaying && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-4 bg-black/80 flex z-[60] group cursor-pointer border-t border-white/10"
              onClick={handleSeek}
              title="Click to skip"
            >
              {SCRIPT.map((scene, idx) => (
                <div key={idx} className="flex-1 h-full border-r border-black/40 relative group/seek">
                  {idx < currentScene && <div className={`absolute inset-0 ${A.bar}`} />}
                  {idx === currentScene && (
                    <motion.div 
                      className={`absolute left-0 top-0 bottom-0 ${A.bar} ${A.glow}`}
                      initial={{ width: 0 }} 
                      animate={{ width: '100%' }} 
                      transition={{ duration: (scene.duration ?? 5000) / 1000, ease: 'linear' }} 
                    />
                  )}
                  <div className="absolute inset-0 hover:bg-white/30 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div key={`t-${currentScene}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="bg-[#020617] px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-[0.28em] ${A.lbl}`}>{data.subtitle}</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 whitespace-nowrap">Clinical Step</span>
              </div>
              <p className="text-white text-[15px] sm:text-lg font-bold leading-snug">{data.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {isFinished && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="px-4 pt-4 pb-6 sm:px-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-emerald-500/15 rounded-lg flex items-center justify-center shrink-0"><CheckCircle2 size={19} className="text-emerald-400" /></div>
              <div><p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.28em]">Module Complete</p><h2 className="text-lg font-black text-white">Subject Assessment</h2></div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">Validate your knowledge on the Worth 4-dot procedure and binocular suppression with <strong className="text-white">10 clinical MCQs</strong>.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {[{ icon: Clock, label: 'Est. 10 mins' }, { icon: ClipboardCheck, label: '10 Questions' }, { icon: Award, label: 'Pass: 5/10' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-400"><Icon size={12} className={A.lbl} /><span className="text-[10px] font-bold uppercase tracking-wide">{label}</span></div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button onClick={onStartTest} className="flex-1 bg-white text-black active:scale-[0.98] px-5 py-3.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2"><Play size={14} className="fill-current" /> Launch Module Test</button>
              <button onClick={handleStart} className="flex-1 sm:flex-none bg-white/6 text-white active:scale-[0.98] px-4 py-3.5 rounded-xl font-bold text-xs border border-white/10 flex items-center justify-center gap-2"><RotateCcw size={13} /> Watch Again</button>
            </div>
            <div className={`mt-4 p-3.5 ${A.note} rounded-xl border`}>
              <h4 className="text-white font-bold text-xs mb-1 flex items-center gap-1.5"><Eye size={12} className={A.nIcon} /> Pro Tips</h4>
              <ul className="text-slate-400 text-xs leading-relaxed list-disc list-inside mt-2 space-y-1">
                 <li>Ensure the red filter is correctly over the right eye.</li>
                 <li>Perform the test in low room illumination.</li>
                 <li>Record the distance (near or far) during documentation.</li>
              </ul>
            </div>
          </motion.div>
        )}
        {isIdle && <div className="px-4 pt-3 pb-4 space-y-2">{[2, 3, 2.5].map((w, i) => <div key={i} className="h-2.5 bg-white/5 rounded-full animate-pulse" style={{ width: `${w * 33}%` }} />)}</div>}
      </div>
    </div>
  );
}
