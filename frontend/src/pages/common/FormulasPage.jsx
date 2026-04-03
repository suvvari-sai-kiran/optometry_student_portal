import { useState, useMemo } from 'react';
import { 
  BookOpen, PlayCircle, X, ExternalLink, Search, 
  ChevronLeft, Copy, Check, Calculator, Eye,
  Sparkles, Info, ArrowRight, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function FormulasPage() {
  const navigate = useNavigate();
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const formulas = [
    {
      id: 1,
      title: "Lens Power Formula",
      category: "Geometric Optics",
      formula: "P = 1 / f",
      desc: "Calculates the optical power (P) in dioptres given the focal length (f) in meters. Essential for lens identification.",
      videoId: "w-XgXADoBeU",
      fullUrl: "https://www.youtube.com/watch?v=w-XgXADoBeU"
    },
    {
      id: 2,
      title: "Prentice's Rule",
      category: "Clinical Dispensing",
      formula: "Δ = c × F",
      desc: "Determines the induced prismatic effect (Δ) given decentration (c) in cm and lens power (F) in dioptres.",
      videoId: "LAx3w6WM-g0",
      fullUrl: "https://www.youtube.com/watch?v=LAx3w6WM-g0"
    },
    {
      id: 3,
      title: "Vertex Distance",
      category: "Refraction",
      formula: "F_new = F / (1 - dF)",
      desc: "Adjusts lens power when the vertex distance (d, in meters) changes. Critical for high-power prescriptions.",
      videoId: "w-XgXADoBeU",
      fullUrl: "https://www.youtube.com/watch?v=w-XgXADoBeU"
    },
    {
      id: 4,
      title: "Near Addition (Add)",
      category: "Presbyopia",
      formula: "Add = (1 / WD) - D_power",
      desc: "Calculates required near power based on optimal working distance (WD) and patient's distance refractive error.",
      videoId: "dfwcu944LVc",
      fullUrl: "https://www.youtube.com/watch?v=dfwcu944LVc"
    },
    {
      id: 5,
      title: "IOL Power (SRK)",
      category: "Surgical Optometry",
      formula: "P = A - 2.5L - 0.9K",
      desc: "Estimates Intraocular Lens power given the constant (A), axial length (L), and keratometry values (K).",
      videoId: "5CrgALxvzUE",
      fullUrl: "https://www.youtube.com/watch?v=5CrgALxvzUE"
    },
    {
      id: 6,
      title: "Vertical Imbalance",
      category: "Dispensing Optics",
      formula: "Δ = c × F (Differential)",
      desc: "Calculates induced prism differences at the reading level for anisometropic patients.",
      videoId: "x5TekSxNaJs",
      fullUrl: "https://www.youtube.com/watch?v=x5TekSxNaJs"
    }
  ];

  const filteredFormulas = useMemo(() => {
    return formulas.filter(f => 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Formula copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeFormula = formulas.find(f => f.videoId === activeVideoId);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
          <div className="space-y-4">
             <button 
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest"
             >
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               Return to Hub
             </button>
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10">
                   <Calculator size={28} className="text-primary" />
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tighter">Clinical Formulas</h2>
               </div>
               <p className="text-slate-400 font-medium italic">High-precision reference for optical mathematics and clinical diagnostics.</p>
             </div>
          </div>

          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search principles, formulas..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-xl transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-3 animate-fade-in [animation-delay:200ms]">
          {['All Concepts', 'Optical', 'Refractive', 'Surgical', 'Geometric'].map((cat, i) => (
             <button key={cat} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-[0.15em] border transition-all ${i === 0 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/10'}`}>
               {cat}
             </button>
          ))}
        </div>

        {/* Formula Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredFormulas.map((item, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id} 
                className="glass-card group border border-white/5 hover:border-primary/30 flex flex-col p-8 relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                   <Calculator size={160} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1 block">{item.category}</span>
                      <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                    </div>
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                       <BookOpen size={18} className="text-slate-500" />
                    </div>
                  </div>

                  <div className="relative bg-black/40 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[100px] shadow-inner group/code">
                    <span className="font-mono text-2xl text-emerald-400 tracking-wider text-center">{item.formula}</span>
                    <button 
                      onClick={() => copyToClipboard(item.formula, item.id)}
                      className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${copiedId === item.id ? 'bg-emerald-500 text-white' : 'opacity-0 group-hover/code:opacity-100 bg-white/10 text-slate-400 hover:text-white'}`}
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                  <p className="text-slate-400 text-[13px] leading-relaxed italic">{item.desc}</p>

                  <button 
                    onClick={() => setActiveVideoId(item.videoId)}
                    className="w-full bg-white/5 hover:bg-primary text-white border border-white/10 hover:border-primary font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Watch Derivation <PlayCircle size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredFormulas.length === 0 && (
          <div className="py-20 text-center animate-fade-in">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Search size={32} className="text-slate-700" />
             </div>
             <p className="text-slate-500 font-medium italic">No clinical principles match your query: "{searchQuery}"</p>
          </div>
        )}

        {/* Global CTA */}
        {filteredFormulas.length > 0 && (
          <div className="glass-card p-10 mt-20 border-primary/20 bg-gradient-to-r from-primary/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex gap-6 items-start">
                <div className="p-4 bg-primary/20 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10"><Sparkles className="text-primary" size={32} /></div>
                <div>
                   <h4 className="text-2xl font-bold text-white mb-2">Advance your knowledge.</h4>
                   <p className="text-slate-400 max-w-md">Our AI Tutor is trained on over 5,000 clinical cases. Ask about real-world applications of these formulas.</p>
                </div>
             </div>
             <button onClick={() => navigate('/chat')} className="whitespace-nowrap px-10 py-5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all transform active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs">
                Launch AI Assistant <ArrowRight size={18} />
             </button>
          </div>
        )}
      </div>

      {/* Modern Video Overlay */}
      <AnimatePresence>
        {activeVideoId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setActiveVideoId(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl glass-card overflow-hidden shadow-2xl border border-white/10 ring-4 ring-black/40"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 bg-slate-900 border-b border-white/5 flex justify-between items-center group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110">
                       <Calculator className="text-primary" size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Tutorial Series</p>
                       <h3 className="text-lg font-bold text-white tracking-tight uppercase">{activeFormula?.title}</h3>
                    </div>
                 </div>
                 <button 
                   onClick={() => setActiveVideoId(null)}
                   className="p-3 bg-white/5 hover:bg-red-400/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="aspect-video bg-black relative">
                {/* Loader Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0&modestbranding=1&autoplay=1`}
                  className="w-full h-full relative z-10"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="p-10 bg-slate-900/90 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md w-fit">
                      <Info size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Clinical Tip</span>
                   </div>
                   <p className="text-slate-400 text-sm leading-relaxed font-medium">Use the **Source Link** if you need to access supplementary comments or transcripts on the official platform.</p>
                </div>
                <a 
                  href={activeFormula?.fullUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 uppercase tracking-widest text-[10px]"
                >
                  <ExternalLink size={16} /> Open YouTube
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

