import { useState, useMemo } from 'react';
import { 
  ChevronLeft, Calculator, Calculator as CalculatorIcon, BrainCircuit, 
  Search, Filter, BookOpen, Info, Sparkles, X, ChevronRight, Hash, Activity,
  Zap, Plus, ArrowRight, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClinicalCalculators from '../../components/ClinicalCalculators';

const FORMULA_LIBRARY = [
  {
    id: 'LP',
    title: 'Lens Power Formula',
    displayFormula: 'P = 1 / f',
    category: 'Geometric',
    subTitle: 'Geometric Optics',
    description: 'Calculates the optical power (P) in dioptres given the focal length (f) in meters. Essential for lens identification.',
    calculatorId: 'LP'
  },
  {
    id: 'PR',
    title: "Prentice's Rule",
    displayFormula: '\u0394 = c × F',
    category: 'Optical',
    subTitle: 'Clinical Dispensing',
    description: 'Determines the induced prismatic effect (\u0394) given decentration (c) in cm and lens power (F) in dioptres.',
    calculatorId: 'PRENTICE'
  },
  {
    id: 'VD',
    title: 'Vertex Distance',
    displayFormula: 'F_new = F / (1 - dF)',
    category: 'Refractive',
    subTitle: 'Refraction',
    description: 'Adjusts lens power when the vertex distance (d, in meters) changes. Critical for high-power prescriptions.',
    calculatorId: 'VERTEX'
  },
  {
    id: 'ADD',
    title: 'Near Addition (Add)',
    displayFormula: 'Add = (1 / WD) - D_power',
    category: 'Refractive',
    subTitle: 'Presbyopia',
    description: "Calculates required near power based on optimal working distance (WD) and patient's distance refractive error.",
    calculatorId: 'ADD'
  },
  {
    id: 'IOL',
    title: 'IOL Power (SRK)',
    displayFormula: 'P = A - 2.5L - 0.9K',
    category: 'Surgical',
    subTitle: 'Surgical Optometry',
    description: 'Estimates Intraocular Lens power given the constant (A), axial length (L), and keratometry values (K).',
    calculatorId: 'IOL'
  },
  {
    id: 'VI',
    title: 'Vertical Imbalance',
    displayFormula: '\u0394 = c × F (Differential)',
    category: 'Optical',
    subTitle: 'Dispensing Optics',
    description: 'Calculates induced prism differences at the reading level for anisometropic patients.',
    calculatorId: 'VI'
  }
];

export default function FormulasPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('library'); // 'library', 'calculator', or 'clinical'
  const [activeTab, setActiveTab] = useState('SE');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // --- Calculator States ---
  const [seState, setSeState] = useState({ sphere: '', cylinder: '' });
  const [acaState, setAcaState] = useState({ pd: '', dn: '', df: '', a: '' });
  const [prenticeState, setPrenticeState] = useState({ c: '', f: '' });
  const [vertexState, setVertexState] = useState({ power: '', oldD: '12', newD: '0' });
  const [transState, setTransState] = useState({ sphere: '', cylinder: '', axis: '' });
  const [ampState, setAmpState] = useState({ age: '', npa: '' });
  const [lpState, setLpState] = useState({ f: '' });
  const [addState, setAddState] = useState({ wd: '', distPower: '' });
  const [iolState, setIolState] = useState({ a: '118.4', l: '', k: '' });
  const [viState, setViState] = useState({ c: '', fRight: '', fLeft: '' });

  const [result, setResult] = useState(null);
  const [insight, setInsight] = useState(null);

  // --- Filtered Data ---
  const filteredLibrary = useMemo(() => {
    return FORMULA_LIBRARY.filter(f => {
      const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             f.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'ALL' || f.category.toUpperCase() === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  // --- Calculations ---
  const calculateSE = () => {
    const s = parseFloat(seState.sphere);
    const c = parseFloat(seState.cylinder);
    if(isNaN(s) || isNaN(c)) return;
    const res = s + (c / 2);
    setResult(`SE = ${res > 0 ? '+' : ''}${res.toFixed(2)} D`);
    if (res > 0) setInsight({ type: 'info', text: "Hyperopic spherical equivalent. Monitor for latent hyperopia." });
    else setInsight({ type: 'warning', text: "Myopic spherical equivalent. Consider myopia management if progressing." });
  };

  const calculateACA = () => {
    const pd = parseFloat(acaState.pd);
    const dn = parseFloat(acaState.dn);
    const df = parseFloat(acaState.df);
    const a = parseFloat(acaState.a);
    if(isNaN(pd) || isNaN(dn) || isNaN(df) || isNaN(a)) return;
    const res = (pd / 10) + ((dn - df) / a);
    setResult(`AC/A Ratio = ${res.toFixed(2)} : 1`);
    if (res > 6) setInsight({ type: 'warning', text: "High AC/A ratio detected! Strong risk of Convergence Excess. Recommend reviewing plus lenses for near." });
    else if (res < 4) setInsight({ type: 'info', text: "Low AC/A ratio. Possible Convergence Insufficiency." });
    else setInsight({ type: 'success', text: "Normal AC/A ratio (4:1 to 6:1 range)." });
  };

  const calculatePrentice = () => {
    const c = parseFloat(prenticeState.c);
    const f = parseFloat(prenticeState.f);
    if(isNaN(c) || isNaN(f)) return;
    const res = c * f;
    setResult(`Prism = ${Math.abs(res).toFixed(2)} \u0394`);
    if (Math.abs(res) > 2) setInsight({ type: 'warning', text: "High induced prism need detected. Recommend incorporating prescribed prism directly into lens fabrication." });
    else setInsight({ type: 'info', text: "Tolerable induced prism." });
  };

  const calculateVertex = () => {
    const f1 = parseFloat(vertexState.power);
    const d1 = parseFloat(vertexState.oldD) / 1000;
    const d2 = parseFloat(vertexState.newD) / 1000;
    if(isNaN(f1) || isNaN(d1) || isNaN(d2)) return;
    const res = f1 / (1 - (d1 - d2) * f1);
    setResult(`Power at ${vertexState.newD}mm = ${res > 0 ? '+' : ''}${res.toFixed(2)} D`);
    setInsight({ type: 'success', text: `Effective power adjusted. Note: For powers > \u00B14.00D, vertex distance adjustment is clinically significant.` });
  };

  const calculateTrans = () => {
    const s = parseFloat(transState.sphere);
    const c = parseFloat(transState.cylinder);
    let a = parseFloat(transState.axis);
    if(isNaN(s) || isNaN(c) || isNaN(a)) return;
    const newS = s + c;
    const newC = -c;
    const newA = (a + 90) % 180 || 180;
    setResult(`${newS > 0 ? '+' : ''}${newS.toFixed(2)} / ${newC > 0 ? '+' : ''}${newC.toFixed(2)} x ${newA.toString().padStart(3, '0')}`);
    setInsight({ type: 'info', text: "Formula: S_new = S + C; C_new = -C; Axis = Axis + 90. Standard conversion between plus and minus cylinder forms." });
  };

  const calculateAmp = () => {
    const age = parseFloat(ampState.age);
    const npa = parseFloat(ampState.npa); // in cm
    if(isNaN(age) || isNaN(npa)) return;
    const measured = 100 / npa;
    const expected = 18.5 - (0.3 * age);
    const minimum = 15 - (0.25 * age);
    setResult(`Amp = ${measured.toFixed(2)} D`);
    if (measured < minimum) setInsight({ type: 'warning', text: `Low Amplitude! Minimum expected for age ${age} is ${minimum.toFixed(2)}D. Possible accommodative insufficiency.` });
    else setInsight({ type: 'success', text: `Normal amplitude. Average for age ${age} is ${expected.toFixed(2)}D.` });
  };

  const calculateLP = () => {
    const f = parseFloat(lpState.f);
    if (isNaN(f) || f === 0) return;
    const res = 1 / f;
    setResult(`Power (P) = ${res.toFixed(2)} D`);
    setInsight({ type: 'info', text: "Calculated using P = 1/f. Ensure focal length is in meters." });
  };

  const calculateADD = () => {
    const wd = parseFloat(addState.wd); // cm
    const dp = parseFloat(addState.distPower);
    if (isNaN(wd) || isNaN(dp)) return;
    const res = (100 / wd) - dp;
    setResult(`Required Add = ${res > 0 ? '+' : ''}${res.toFixed(2)} D`);
    setInsight({ type: 'success', text: "Near addition calculated based on working distance and distance power." });
  };

  const calculateIOL = () => {
    const { a, l, k } = iolState;
    const af = parseFloat(a);
    const lf = parseFloat(l);
    const kf = parseFloat(k);
    if (isNaN(af) || isNaN(lf) || isNaN(kf)) return;
    const res = af - (2.5 * lf) - (0.9 * kf);
    setResult(`IOL Power = ${res.toFixed(2)} D`);
    setInsight({ type: 'warning', text: "SRK Formula result. Clinical correlation with modern formulas (Barrett, Hill-RBF) recommended for extreme axial lengths." });
  };

  const calculateVI = () => {
    const c = parseFloat(viState.c);
    const fr = parseFloat(viState.fRight);
    const fl = parseFloat(viState.fLeft);
    if (isNaN(c) || isNaN(fr) || isNaN(fl)) return;
    const prismR = Math.abs(c * fr);
    const prismL = Math.abs(c * fl);
    const res = Math.abs(prismR - prismL);
    setResult(`Diff Prism = ${res.toFixed(2)} \u0394`);
    setInsight({ type: 'warning', text: "Vertical imbalance detected. Consider Slab-off prism or different lens designs for patient comfort." });
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      {/* Mobile Navigation Header */}
      <div className="md:hidden px-6 py-4 border-b border-white/5 flex justify-between items-center bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate('/profile')} className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
             <ChevronLeft size={24} />
           </button>
           <div className="flex items-center gap-2">
             <CalculatorIcon className="text-primary" size={24} />
             <span className="font-black text-white tracking-tighter text-lg">Clinical Hub</span>
           </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-12 space-y-6 md:space-y-10">
        
        {/* Desktop/Tablet Header Section */}
        <header className="space-y-6 md:space-y-8 mt-2 md:mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-all group text-[10px] md:text-sm font-black uppercase tracking-widest bg-white/5 px-3 md:px-4 py-2 rounded-full border border-white/5 w-fit"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Return to Hub
              </button>
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="p-3 md:p-4 bg-primary/20 rounded-xl md:rounded-2xl border border-primary/20 shadow-xl shadow-primary/10">
                    <CalculatorIcon size={24} className="md:size-[32px] text-primary" />
                 </div>
                 <div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter">Clinical Hub</h1>
                    <p className="text-slate-400 text-[10px] md:text-base font-medium italic opacity-80">Reference Library & Interactive Tools</p>
                 </div>
              </div>
            </div>

            <div className="flex bg-slate-900/50 p-1 rounded-xl md:p-1.5 md:rounded-2xl border border-white/5 backdrop-blur-xl w-full md:w-auto overflow-x-auto no-scrollbar">
               <button 
                 onClick={() => setView('library')}
                 className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${view === 'library' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
               >
                 <BookOpen size={14} /> Library
               </button>
               <button 
                 onClick={() => setView('clinical')}
                 className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${view === 'clinical' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
               >
                 <Calculator size={14} /> Clinical Hub
               </button>
               <button 
                 onClick={() => setView('calculator')}
                 className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${view === 'calculator' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
               >
                 <Zap size={14} /> Basic Tools
               </button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'library' ? (
            <motion.div 
              key="library"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Search & Filter Bar */}
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                 <div className="relative grow w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search principles, formulas..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-600"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-full lg:w-auto overflow-x-auto custom-scrollbar no-scrollbar">
                    {['ALL', 'OPTICAL', 'REFRACTIVE', 'SURGICAL', 'GEOMETRIC'].map(cat => (
                       <button 
                         key={cat}
                         onClick={() => setActiveCategory(cat)}
                         className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                       >
                         {cat === 'ALL' ? 'All Concepts' : cat}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                 {filteredLibrary.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-card p-0 overflow-hidden group hover:border-primary/50 transition-all border-white/5 ring-1 ring-white/5 flex flex-col h-full"
                    >
                       <div className="p-6 md:p-8 space-y-4 md:space-y-6 flex-1">
                          <div className="flex justify-between items-start">
                             <div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.subTitle}</span>
                                <h3 className="text-xl font-bold text-white mt-1 group-hover:text-primary transition-colors">{item.title}</h3>
                             </div>
                             <div className="hidden sm:block p-3 bg-white/5 rounded-xl border border-white/5 text-slate-500 group-hover:text-primary transition-colors">
                                <BookOpen size={20} />
                             </div>
                          </div>
                          
                          <div className="aspect-[2/1] bg-slate-900/80 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 shadow-inner relative group/formula">
                             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                             <span className="text-xl md:text-3xl font-mono text-emerald-400/90 tracking-tighter drop-shadow-lg">{item.displayFormula}</span>
                          </div>

                          <p className="text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-3 font-medium opacity-80">{item.description}</p>
                       </div>

                       <div className="p-4 md:p-6 bg-white/[0.02] border-t border-white/5">
                          {item.calculatorId && (
                             <button 
                               onClick={() => {
                                 setView('calculator');
                                 setActiveTab(item.calculatorId);
                               }}
                               className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white px-8 py-4 rounded-xl border border-primary/20 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
                             >
                                <Calculator size={18} /> Launch Interaction
                             </button>
                          )}
                       </div>
                    </motion.div>
                 ))}
                 {filteredLibrary.length === 0 && (
                   <div className="col-span-full py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
                         <Search size={32} />
                      </div>
                      <p className="text-slate-500 font-medium italic">No clinical matches found in the current category.</p>
                   </div>
                 )}
              </div>
            </motion.div>
          ) : view === 'clinical' ? (
            <motion.div 
               key="clinical"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
            >
               <ClinicalCalculators />
            </motion.div>
          ) : (
            <motion.div 
               key="calculator"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
               {/* Calc Sidebar */}
               <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-3 lg:sticky lg:top-24">
                  {[
                    { id: 'SE', title: 'Spherical Equivalent', cat: 'Refraction & VA', icon: Sparkles },
                    { id: 'TRANS', title: 'Power Transposition', cat: 'Optics', icon: ChevronRight },
                    { id: 'ACA', title: 'AC/A Ratio', cat: 'Binocular Vision', icon: Calculator },
                    { id: 'PRENTICE', title: "Prentice's Rule", cat: 'Prism & Lenses', icon: Hash },
                    { id: 'VERTEX', title: 'Vertex Distance', cat: 'Refraction', icon: Filter },
                    { id: 'AMP', title: 'Amplitude of Acc', cat: 'Presbyopia', icon: Info },
                    { id: 'LP', title: 'Lens Power', cat: 'Geometric Optics', icon: CalculatorIcon },
                    { id: 'ADD', title: 'Near Addition', cat: 'Presbyopia', icon: Plus },
                    { id: 'IOL', title: 'IOL Power (SRK)', cat: 'Surgery', icon: Activity },
                    { id: 'VI', title: 'Vertical Imbalance', cat: 'Dispensing', icon: AlertTriangle }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setResult(null); setInsight(null); }}
                      className={`group text-left p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all flex items-center justify-between ${activeTab === tab.id ? 'bg-primary/10 border-primary shadow-xl shadow-primary/20' : 'glass-card border-white/5 hover:border-white/20'}`}
                    >
                       <div>
                         <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 block ${activeTab === tab.id ? 'text-primary' : 'text-slate-500'}`}>{tab.cat}</span>
                         <h3 className={`text-sm md:text-lg font-bold ${activeTab === tab.id ? 'text-white' : 'text-slate-300'}`}>{tab.title}</h3>
                       </div>
                       <div className={`p-1.5 md:p-2 rounded-lg ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
                         <tab.icon size={16} className="md:size-[18px]" />
                       </div>
                    </button>
                  ))}
               </div>

               {/* Engine */}
               <div className="lg:col-span-8 glass-card p-6 md:p-12 border-white/10 min-h-[400px] md:min-h-[600px] flex flex-col">
                  <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-lg md:rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <Calculator size={20} className="md:size-[24px] text-emerald-400" />
                     </div>
                     <div>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80 leading-none mb-1">Clinical Computation</p>
                        <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase leading-tight">
                          {activeTab === 'SE' && 'SE = S + (C / 2)'}
                          {activeTab === 'TRANS' && 'Power Transposition'}
                          {activeTab === 'ACA' && 'ACA Ratio Calculation'}
                          {activeTab === 'PRENTICE' && '\u0394 = c × F'}
                          {activeTab === 'VERTEX' && 'F_new = F / (1 - dF)'}
                          {activeTab === 'AMP' && '100 / NPA (cm)'}
                          {activeTab === 'LP' && 'P = 1 / f (meters)'}
                          {activeTab === 'ADD' && 'Add = (1/WD) - D_power'}
                          {activeTab === 'IOL' && 'P = A - 2.5L - 0.9K'}
                          {activeTab === 'VI' && 'Vertical Imbalance (\u0394)'}
                        </h2>
                     </div>
                  </div>

                  <div className="space-y-8 flex-1">
                     {activeTab === 'SE' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Sphere (D)</label>
                              <input type="number" step="0.25" placeholder="-2.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-primary/50 outline-none" value={seState.sphere} onChange={e => setSeState({...seState, sphere: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Cyl (D)</label>
                              <input type="number" step="0.25" placeholder="-1.50" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-primary/50 outline-none" value={seState.cylinder} onChange={e => setSeState({...seState, cylinder: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'TRANS' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Sphere</label>
                              <input type="number" step="0.25" placeholder="+2.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={transState.sphere} onChange={e => setTransState({...transState, sphere: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Cylinder</label>
                              <input type="number" step="0.25" placeholder="-1.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={transState.cylinder} onChange={e => setTransState({...transState, cylinder: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Axis (\u00B0)</label>
                              <input type="number" placeholder="180" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={transState.axis} onChange={e => setTransState({...transState, axis: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'ACA' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">PD (mm)</label>
                              <input type="number" placeholder="60" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2" value={acaState.pd} onChange={e => setAcaState({...acaState, pd: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Near Phoria</label>
                              <input type="number" placeholder="+4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2" value={acaState.dn} onChange={e => setAcaState({...acaState, dn: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Dist Phoria</label>
                              <input type="number" placeholder="-2" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2" value={acaState.df} onChange={e => setAcaState({...acaState, df: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Acc (A)</label>
                              <input type="number" step="0.25" placeholder="2.50" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2" value={acaState.a} onChange={e => setAcaState({...acaState, a: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'VERTEX' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Power (D)</label>
                              <input type="number" step="0.25" placeholder="+10.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={vertexState.power} onChange={e => setVertexState({...vertexState, power: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Original d (mm)</label>
                              <input type="number" placeholder="12" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={vertexState.oldD} onChange={e => setVertexState({...vertexState, oldD: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">New d (mm)</label>
                              <input type="number" placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={vertexState.newD} onChange={e => setVertexState({...vertexState, newD: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'AMP' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Patient Age</label>
                              <input type="number" placeholder="25" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={ampState.age} onChange={e => setAmpState({...ampState, age: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Push-up NPA (cm)</label>
                              <input type="number" placeholder="8.5" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={ampState.npa} onChange={e => setAmpState({...ampState, npa: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'PRENTICE' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Decentration c (cm)</label>
                              <input type="number" step="0.1" placeholder="0.5" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={prenticeState.c} onChange={e => setPrenticeState({...prenticeState, c: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Power F (D)</label>
                              <input type="number" step="0.25" placeholder="+4.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={prenticeState.f} onChange={e => setPrenticeState({...prenticeState, f: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'LP' && (
                        <div className="grid grid-cols-1 gap-8 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Focal Length f (meters)</label>
                              <input type="number" step="0.01" placeholder="0.5" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={lpState.f} onChange={e => setLpState({...lpState, f: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'ADD' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Working Dist (cm)</label>
                              <input type="number" placeholder="40" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={addState.wd} onChange={e => setAddState({...addState, wd: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Distance Power (D)</label>
                              <input type="number" step="0.25" placeholder="+1.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={addState.distPower} onChange={e => setAddState({...addState, distPower: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'IOL' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">A-Constant</label>
                              <input type="number" step="0.1" placeholder="118.4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={iolState.a} onChange={e => setIolState({...iolState, a: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Axial Length (mm)</label>
                              <input type="number" step="0.01" placeholder="23.50" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={iolState.l} onChange={e => setIolState({...iolState, l: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Keratometry K (D)</label>
                              <input type="number" step="0.25" placeholder="44.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={iolState.k} onChange={e => setIolState({...iolState, k: e.target.value})} />
                           </div>
                        </div>
                     )}

                     {activeTab === 'VI' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Decentration (cm)</label>
                              <input type="number" step="0.1" placeholder="1.0" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={viState.c} onChange={e => setViState({...viState, c: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Right Lens F (D)</label>
                              <input type="number" step="0.25" placeholder="+2.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={viState.fRight} onChange={e => setViState({...viState, fRight: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Left Lens F (D)</label>
                              <input type="number" step="0.25" placeholder="+4.00" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white" value={viState.fLeft} onChange={e => setViState({...viState, fLeft: e.target.value})} />
                           </div>
                        </div>
                     )}

                     <div className="pt-6">
                        <button 
                          className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto px-10 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
                          onClick={() => {
                             if(activeTab === 'SE') calculateSE();
                             if(activeTab === 'ACA') calculateACA();
                             if(activeTab === 'PRENTICE') calculatePrentice();
                             if(activeTab === 'VERTEX') calculateVertex();
                             if(activeTab === 'TRANS') calculateTrans();
                             if(activeTab === 'AMP') calculateAmp();
                             if(activeTab === 'LP') calculateLP();
                             if(activeTab === 'ADD') calculateADD();
                             if(activeTab === 'IOL') calculateIOL();
                             if(activeTab === 'VI') calculateVI();
                          }}
                        >
                          Calculate Clinical Result <ArrowRight size={18} />
                        </button>
                     </div>

                     <AnimatePresence>
                        {result && (
                           <motion.div 
                             initial={{ opacity: 0, y: 30 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="space-y-8 pt-10 border-t border-white/10 mt-10"
                           >
                             <div className="p-8 bg-slate-900 border border-white/10 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all"><Calculator size={100} /></div>
                                <p className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-500 mb-3">Diagnostic Analysis</p>
                                <p className="text-4xl md:text-5xl font-mono text-white font-black tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{result}</p>
                             </div>

                             {insight && (
                                <div className={`p-8 rounded-3xl border flex items-start gap-6 backdrop-blur-xl ${
                                   insight.type === 'warning' ? 'bg-red-500/10 border-red-500/20' : 
                                   insight.type === 'info' ? 'bg-blue-500/10 border-blue-500/20' : 
                                   'bg-emerald-500/10 border-emerald-500/20'
                                }`}>
                                   <div className={`p-4 rounded-2xl ${
                                      insight.type === 'warning' ? 'bg-red-500/20 text-red-400' : 
                                      insight.type === 'info' ? 'bg-blue-500/20 text-blue-400' : 
                                      'bg-emerald-500/20 text-emerald-400'
                                   }`}>
                                      <BrainCircuit size={32} />
                                   </div>
                                   <div>
                                      <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${
                                         insight.type === 'warning' ? 'text-red-500' : 
                                         insight.type === 'info' ? 'text-blue-500' : 
                                         'text-emerald-500'
                                      }`}>AI Clinical Recommendation</p>
                                      <p className={`text-lg font-bold leading-relaxed ${
                                         insight.type === 'warning' ? 'text-red-100' : 
                                         insight.type === 'info' ? 'text-blue-100' : 
                                         'text-emerald-100'
                                      }`}>{insight.text}</p>
                                   </div>
                                </div>
                             )}
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Knowledge Banner */}
        <footer className="pt-20">
           <div className="glass-card p-10 md:p-14 border-white/10 relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-accent/5">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Sparkles size={200} /></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                 <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="bg-primary/20 text-primary w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 mx-auto md:mx-0">Advanced Learning</div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">Advance your clinical knowledge.</h2>
                    <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">Our AI Tutor is trained on over 5,000 clinical cases. Ask about real-world applications of these formulas or request a practice patient scenario.</p>
                 </div>
                 <button 
                   onClick={() => navigate('/student', { state: { startAiQuiz: true } })}
                   className="flex-shrink-0 bg-white text-slate-950 hover:bg-primary hover:text-white px-10 py-5 rounded-2xl font-black transition-all shadow-2xl flex items-center gap-3 group active:scale-95"
                 >
                    Launch AI Tutor <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </footer>
      </div>


      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
