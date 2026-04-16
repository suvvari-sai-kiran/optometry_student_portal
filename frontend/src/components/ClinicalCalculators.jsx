import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Zap, Eye, Binary, Layers, Scissors, Info, Sparkles, RefreshCw, PlaySquare, Glasses } from 'lucide-react';
import VisualAcuityVideo from './VisualAcuityVideo';
import KeratometryReadingVideo from './KeratometryReadingVideo';
import ContactLensPowerVideo from './ContactLensPowerVideo';
import BaseCurveSelectionVideo from './BaseCurveSelectionVideo';
import LensFittingAssessmentVideo from './LensFittingAssessmentVideo';
import TearFilmEvaluationVideo from './TearFilmEvaluationVideo';
import SlitLampExamCLVideo from './SlitLampExamCLVideo';
import RGPSoftLensIDVideo from './RGPSoftLensIDVideo';
import CLComplicationsVideo from './CLComplicationsVideo';
import FrameSelectionVideo from './FrameSelectionVideo';
import LensTypeIDVideo from './LensTypeIDVideo';
import OpticalCenterAlignmentVideo from './OpticalCenterAlignmentVideo';
import LensThicknessCalculationVideo from './LensThicknessCalculationVideo';

const CATEGORIES = [
  { id: 'lowvision', name: 'Low Vision', icon: Eye },
  { id: 'cl', name: 'Contact Lens', icon: Layers },
  { id: 'dispensing', name: 'Dispensing', icon: Glasses },
  { id: 'optics', name: 'Optics & Physics', icon: Binary }
];

export default function ClinicalCalculators() {
  const [category, setCategory] = useState('lowvision');
  const [results, setResults] = useState({});
  const [insights, setInsights] = useState({});
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isFSVideoOpen, setIsFSVideoOpen] = useState(false);
  const [isLensTypeVideoOpen, setIsLensTypeVideoOpen] = useState(false);
  const [isKRVideoOpen, setIsKRVideoOpen] = useState(false);
  const [isCLPowerVideoOpen, setIsCLPowerVideoOpen] = useState(false);
  const [isBCVideoOpen, setIsBCVideoOpen] = useState(false);
  const [isLFVideoOpen, setIsLFVideoOpen] = useState(false);
  const [isTFVideoOpen, setIsTFVideoOpen] = useState(false);
  const [isSLEVideoOpen, setIsSLEVideoOpen] = useState(false);
  const [isLensIDVideoOpen, setIsLensIDVideoOpen] = useState(false);
  const [isCompVideoOpen, setIsCompVideoOpen] = useState(false);
  const [isOCAVideoOpen, setIsOCAVideoOpen] = useState(false);
  const [isLTCVideoOpen, setIsLTCVideoOpen] = useState(false);

  const handleCalculate = (id, logic) => {
    const { res, text } = logic();
    setResults(prev => ({ ...prev, [id]: res }));
    setInsights(prev => ({ ...prev, [id]: text }));
  };

  // --- Calculator Logic Engines ---
  
  // 1. Low Vision
  const [lvMag, setLvMag] = useState({ present: '', target: '' });
  const [lvEvp, setLvEvp] = useState({ wd: '' });
  const [lvKest, setLvKest] = useState({ va: '0.1' });

  const calcMag = () => {
    const m = (parseFloat(lvMag.present) / parseFloat(lvMag.target)).toFixed(2);
    return { res: `${m}x`, text: `Patient requires a ${m}x magnification system to achieve their goal vision.` };
  };
  const calcEVP = () => {
    const evp = (100 / parseFloat(lvEvp.wd)).toFixed(2);
    return { res: `+${evp} D`, text: `For a working distance of ${lvEvp.wd}cm, an equivalent power of +${evp}D is required.` };
  };
  const calcKest = () => {
    const add = (1 / parseFloat(lvKest.va)).toFixed(2);
    return { res: `+${add} D`, text: `Based on Distance VA of ${lvKest.va}, Kestenbaum's rule estimates a near add of +${add}D.` };
  };

  // 2. Contact Lens
  const [clTear, setClTear] = useState({ trialBC: '', corneaK: '' });
  const [clK, setClK] = useState({ radius: '' });
  const [clVertex, setClVertex] = useState({ rx: '', dist: '12' });
  
  const calcTear = () => {
    const p = (parseFloat(clTear.trialBC) - parseFloat(clTear.corneaK)).toFixed(2);
    const sign = p > 0 ? '+' : '';
    return { res: `${sign}${p} D`, text: `The fluid lens (tear layer) contributes ${sign}${p}D to the final lens system.` };
  };
  const calcKConv = () => {
    const d = (337.5 / parseFloat(clK.radius)).toFixed(2);
    return { res: `${d} D`, text: `A corneal radius of ${clK.radius}mm corresponds to ${d} Diopters of power.` };
  };
  const calcVertex = () => {
    const fs = parseFloat(clVertex.rx);
    const d = parseFloat(clVertex.dist) / 1000; // mm to m
    const fc = fs / (1 - d * fs);
    const rounded = (Math.round(fc * 4) / 4).toFixed(2);
    const sign = fc > 0 ? '+' : '';
    return { res: `${sign}${rounded} D`, text: `Initial calc: ${fc.toFixed(2)}D. Clinically adjusted to the nearest 0.25D: ${sign}${rounded}D.` };
  };

  // 3. Surgical (Munnerlyn)
  const [surgMun, setSurgMun] = useState({ rx: '', dia: '' });
  const calcMun = () => {
    const a = ((parseFloat(surgMun.rx) * Math.pow(parseFloat(surgMun.dia), 2)) / 3).toFixed(1);
    return { res: `${Math.abs(a)} \u03BCm`, text: `Ablation depth for a ${surgMun.dia}mm zone and ${surgMun.rx}D correction is approximately ${Math.abs(a)} microns.` };
  };

  // 4. Optics & Physics
  const [optMirror, setOptMirror] = useState({ u: '', v: '' });
  const [optPrism, setOptPrism] = useState({ n: '1.523', a: '' });

  const calcMirror = () => {
    const f = (1 / ((1/parseFloat(optMirror.u)) + (1/parseFloat(optMirror.v)))).toFixed(2);
    return { res: `f = ${f} cm`, text: `The focal length required for these object/image distances is ${f}cm.` };
  };
  const calcPrism = () => {
    const d = ((parseFloat(optPrism.n) - 1) * parseFloat(optPrism.a)).toFixed(2);
    return { res: `${d}\u00B0`, text: `The angle of deviation for a refractive index of ${optPrism.n} and apical angle ${optPrism.a}\u00B0 is ${d}\u00B0.` };
  };

  // 5. Dispensing (Lens Thickness)
  const [dispThick, setDispThick] = useState({ p: '', d: '' });
  const calcThick = () => {
    const t = ((Math.abs(parseFloat(dispThick.p)) * Math.pow(parseFloat(dispThick.d)/10, 2)) / 3).toFixed(2);
    return { res: `${t} mm`, text: `Estimated additional thickness due to ${dispThick.p}D power and ${dispThick.d}mm diameter is approximately ${t}mm.` };
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${
              category === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <cat.icon size={16} /> {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Category: LOW VISION */}
        {category === 'lowvision' && (
          <>
            <div className="md:col-span-2 lg:col-span-3 mb-2">
               <button 
                 onClick={() => setIsVideoOpen(true)}
                 className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-black px-8 py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-4 transition-all transform active:scale-95 uppercase tracking-widest text-sm"
               >
                 <PlaySquare size={24} /> Play Visual Acuity Video
               </button>
            </div>
            <CalcCard 
              id="lv_mag" title="Magnification (M)" formula="M = VA_1 / VA_2"
              inputs={[
                { label: 'Present Denom', val: lvMag.present, set: (v)=>setLvMag({...lvMag, present: v}), unit: '6/' },
                { label: 'Target Denom', val: lvMag.target, set: (v)=>setLvMag({...lvMag, target: v}), unit: '6/' }
              ]}
              onCalc={() => handleCalculate('lv_mag', calcMag)}
              result={results.lv_mag} insight={insights.lv_mag}
            />
            <CalcCard 
              id="lv_evp" title="Equivalent Viewing Power" formula="EVP = 100 / WD"
              inputs={[{ label: 'Working Dist', val: lvEvp.wd, set: (v)=>setLvEvp({...lvEvp, wd: v}), unit: 'cm' }]}
              onCalc={() => handleCalculate('lv_evp', calcEVP)}
              result={results.lv_evp} insight={insights.lv_evp}
            />
            <CalcCard 
              id="lv_kest" title="Kestenbaum\u2019s Rule" formula="ADD = 1 / VA_dec"
              inputs={[{ label: 'Distance VA (Decimal)', val: lvKest.va, set: (v)=>setLvKest({...lvKest, va: v}), unit: 'dec' }]}
              onCalc={() => handleCalculate('lv_kest', calcKest)}
              result={results.lv_kest} insight={insights.lv_kest}
            />
          </>
        )}

        {/* Category: CONTACT LENS */}
        {category === 'cl' && (
          <>
            <div className="md:col-span-2 lg:col-span-3 mb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
               <button 
                 onClick={() => setIsKRVideoOpen(true)}
                 className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Keratometry Video
               </button>
               <button 
                 onClick={() => setIsCLPowerVideoOpen(true)}
                 className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> CL Power Video
               </button>
               <button 
                 onClick={() => setIsBCVideoOpen(true)}
                 className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Base Curve Video
               </button>
               <button 
                 onClick={() => setIsLFVideoOpen(true)}
                 className="bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Fitting Assessment Video
               </button>
               <button 
                 onClick={() => setIsTFVideoOpen(true)}
                 className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Tear Film Video
               </button>
               <button 
                 onClick={() => setIsSLEVideoOpen(true)}
                 className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Slit Lamp Video
               </button>
               <button 
                 onClick={() => setIsLensIDVideoOpen(true)}
                 className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> RGP vs Soft ID Video
               </button>
               <button 
                 onClick={() => setIsCompVideoOpen(true)}
                 className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> CL Complications Video
               </button>
            </div>
            <CalcCard 
              id="cl_tear" title="Tear Lens Power" formula="Tear = BC - Cornea K"
              inputs={[
                { label: 'Trial Base Curve', val: clTear.trialBC, set: (v)=>setClTear({...clTear, trialBC: v}), unit: 'D' },
                { label: 'Corneal K', val: clTear.corneaK, set: (v)=>setClTear({...clTear, corneaK: v}), unit: 'D' }
              ]}
              onCalc={() => handleCalculate('cl_tear', calcTear)}
              result={results.cl_tear} insight={insights.cl_tear}
            />
            <CalcCard 
              id="cl_k" title="K-Reading Conversion" formula="D = 337.5 / r"
              inputs={[{ label: 'Radius', val: clK.radius, set: (v)=>setClK({...clK, radius: v}), unit: 'mm' }]}
              onCalc={() => handleCalculate('cl_k', calcKConv)}
              result={results.cl_k} insight={insights.cl_k}
            />
            <CalcCard 
              id="cl_vertex" title="Vertex Distance" formula="Fc = Fs / (1 - d \u00D7 Fs)"
              inputs={[
                { label: 'Spectacle Power', val: clVertex.rx, set: (v)=>setClVertex({...clVertex, rx: v}), unit: 'D' },
                { label: 'Vertex Dist', val: clVertex.dist, set: (v)=>setClVertex({...clVertex, dist: v}), unit: 'mm' }
              ]}
              onCalc={() => handleCalculate('cl_vertex', calcVertex)}
              result={results.cl_vertex} insight={insights.cl_vertex}
            />
          </>
        )}

        {/* Category: SURGICAL */}
        {category === 'surgical' && (
          <>
            <CalcCard 
              id="surg_mun" title="Munnerlyn Formula" formula="Depth = (R \u00D7 D\u00B2) / 3"
              inputs={[
                { label: 'Refractive Error', val: surgMun.rx, set: (v)=>setSurgMun({...surgMun, rx: v}), unit: 'D' },
                { label: 'Zone Diameter', val: surgMun.dia, set: (v)=>setSurgMun({...surgMun, dia: v}), unit: 'mm' }
              ]}
              onCalc={() => handleCalculate('surg_mun', calcMun)}
              result={results.surg_mun} insight={insights.surg_mun}
            />
          </>
        )}

        {/* Category: DISPENSING */}
        {category === 'dispensing' && (
          <>
            <div className="md:col-span-2 lg:col-span-3 mb-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                 onClick={() => setIsFSVideoOpen(true)}
                 className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Frame Selection Video
               </button>
               <button 
                 onClick={() => setIsLensTypeVideoOpen(true)}
                 className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Lens Type ID Video
               </button>
               <button 
                 onClick={() => setIsOCAVideoOpen(true)}
                 className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Optical Center Alignment
               </button>
               <button 
                 onClick={() => setIsLTCVideoOpen(true)}
                 className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest text-[10px]"
               >
                 <PlaySquare size={20} /> Lens Thickness Video
               </button>
            </div>
            <CalcCard 
              id="disp_thick" title="Lens Thickness Estimate" formula="t \u2248 (P \u00D7 (D/10)\u00B2) / 3"
              inputs={[
                { label: 'Lens Power', val: dispThick.p, set: (v)=>setDispThick({...dispThick, p: v}), unit: 'D' },
                { label: 'Diameter', val: dispThick.d, set: (v)=>setDispThick({...dispThick, d: v}), unit: 'mm' }
              ]}
              onCalc={() => handleCalculate('disp_thick', calcThick)}
              result={results.disp_thick} insight={insights.disp_thick}
            />
          </>
        )}

        {/* Category: OPTICS */}
        {category === 'optics' && (
          <>
            <CalcCard 
              id="opt_mir" title="Mirror Formula" formula="1/f = 1/v + 1/u"
              inputs={[
                { label: 'Object Dist (u)', val: optMirror.u, set: (v)=>setOptMirror({...optMirror, u: v}), unit: 'cm' },
                { label: 'Image Dist (v)', val: optMirror.v, set: (v)=>setOptMirror({...optMirror, v: v}), unit: 'cm' }
              ]}
              onCalc={() => handleCalculate('opt_mir', calcMirror)}
              result={results.opt_mir} insight={insights.opt_mir}
            />
            <CalcCard 
              id="opt_pri" title="Prism Deviation" formula="d = (n-1) \u00D7 A"
              inputs={[
                { label: 'Refractive Index (n)', val: optPrism.n, set: (v)=>setOptPrism({...optPrism, n: v}), unit: 'index' },
                { label: 'Apical Angle (A)', val: optPrism.a, set: (v)=>setOptPrism({...optPrism, a: v}), unit: '\u00B0' }
              ]}
              onCalc={() => handleCalculate('opt_pri', calcPrism)}
              result={results.opt_pri} insight={insights.opt_pri}
            />
          </>
        )}

      </div>
      {isVideoOpen && <VisualAcuityVideo onClose={() => setIsVideoOpen(false)} />}
      {isKRVideoOpen && <KeratometryReadingVideo onClose={() => setIsKRVideoOpen(false)} onStartTest={() => setIsKRVideoOpen(false)} />}
      {isCLPowerVideoOpen && <ContactLensPowerVideo onClose={() => setIsCLPowerVideoOpen(false)} onStartTest={() => setIsCLPowerVideoOpen(false)} />}
      {isBCVideoOpen && <BaseCurveSelectionVideo onClose={() => setIsBCVideoOpen(false)} onStartTest={() => setIsBCVideoOpen(false)} />}
      {isLFVideoOpen && <LensFittingAssessmentVideo onClose={() => setIsLFVideoOpen(false)} onStartTest={() => setIsLFVideoOpen(false)} />}
      {isTFVideoOpen && <TearFilmEvaluationVideo onClose={() => setIsTFVideoOpen(false)} onStartTest={() => setIsTFVideoOpen(false)} />}
      {isSLEVideoOpen && <SlitLampExamCLVideo onClose={() => setIsSLEVideoOpen(false)} onStartTest={() => setIsSLEVideoOpen(false)} />}
      {isLensIDVideoOpen && <RGPSoftLensIDVideo onClose={() => setIsLensIDVideoOpen(false)} onStartTest={() => setIsLensIDVideoOpen(false)} />}
      {isCompVideoOpen && <CLComplicationsVideo onClose={() => setIsCompVideoOpen(false)} onStartTest={() => setIsCompVideoOpen(false)} />}
      {isFSVideoOpen && <FrameSelectionVideo onClose={() => setIsFSVideoOpen(false)} onStartTest={() => setIsFSVideoOpen(false)} />}
      {isLensTypeVideoOpen && <LensTypeIDVideo onClose={() => setIsLensTypeVideoOpen(false)} onStartTest={() => setIsLensTypeVideoOpen(false)} />}
      {isOCAVideoOpen && <OpticalCenterAlignmentVideo onClose={() => setIsOCAVideoOpen(false)} onStartTest={() => setIsOCAVideoOpen(false)} />}
      {isLTCVideoOpen && <LensThicknessCalculationVideo onClose={() => setIsLTCVideoOpen(false)} onStartTest={() => setIsLTCVideoOpen(false)} />}
    </div>
  );
}

function CalcCard({ title, formula, inputs, onCalc, result, insight }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col group hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Calculator size={20} /></div>
        <div>
          <h3 className="font-bold text-primary text-sm tracking-tight">{title}</h3>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{formula}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {inputs.map((inp, idx) => (
          <div key={idx} className="relative group/input">
            <label className="text-[9px] font-black uppercase tracking-widest text-primary/70 mb-1 block px-1">{inp.label}</label>
            <div className="flex items-center">
              <input 
                type="number" 
                value={inp.val} 
                onChange={(e) => inp.set(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-700 font-mono"
                placeholder="0.00"
              />
              <span className="absolute right-4 text-[10px] font-bold text-slate-500 uppercase">{inp.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onCalc}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
      >
        <Zap size={14} /> Calculate Endpoint
      </button>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            className="mt-6 pt-6 border-t border-white/5 space-y-4"
          >
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Computed Result</p>
              <h4 className="text-2xl font-black text-primary tracking-tighter">{result}</h4>
            </div>
            {insight && (
              <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <Sparkles className="text-primary shrink-0" size={14} />
                <p className="text-[11px] text-slate-400 italic leading-relaxed">{insight}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
