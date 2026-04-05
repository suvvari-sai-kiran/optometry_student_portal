import { useState, useEffect } from 'react';
import { Plus, Users, Search, Trash, Edit, HeartPulse, Stethoscope, BriefcaseMedical, Eye, Activity, ShieldCheck, ClipboardList, Info, ArrowRight, User as UserIcon, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../../api/config';

const INITIAL_FORM = {
  name: '',
  age: '',
  gender: 'Male',
  history: '',
  test_results: {
    vision: { od: '6/6', os: '6/6', near: 'N6' },
    refraction: {
      subjective: {
        od: { sph: '', cyl: '', axis: '', add: '' },
        os: { sph: '', cyl: '', axis: '', add: '' }
      }
    },
    slitLamp: {
      od: { adnexa: 'Normal', conjunctiva: 'Clear', sclera: 'Quiet', cornea: 'Clear', iris: 'Brown, Clear', pupil: 'PERRLA (-RAPD)', ac: 'Grade 4 (Van Herick)', lens: 'Clear', fundus: 'C/D 0.3, Macula Clear' },
      os: { adnexa: 'Normal', conjunctiva: 'Clear', sclera: 'Quiet', cornea: 'Clear', iris: 'Brown, Clear', pupil: 'PERRLA (-RAPD)', ac: 'Grade 4 (Van Herick)', lens: 'Clear', fundus: 'C/D 0.3, Macula Clear' }
    },
    binocular: {
      coverTest: { uncover: 'Ortho', alternate: 'Ortho', prism: 'N/A' },
      npa: '',
      npc: '',
      aca: '',
      vergence: '',
      worth4dot: '4 dots',
      stereopsis: '',
      synoptophore: ''
    },
    diagnostics: {
      iop: { od: '', os: '' },
      tbut: { od: '', os: '' },
      color: { od: 'Ishihara 14/14', os: 'Ishihara 14/14' }
    },
    rehab: {
      aids: '',
      plan: ''
    }
  }
};

export default function PatientsView() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, clinical, binocular, diagnostics, rehab
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [search, setSearch] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Parse test_results if it's a string
        const parsedData = data.map(p => ({
          ...p,
          test_results: typeof p.test_results === 'string' ? JSON.parse(p.test_results) : (p.test_results || INITIAL_FORM.test_results)
        }));
        setPatients(parsedData);
      }
    } catch (e) {
      toast.error("Failed to load clinical records");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const formatRefraction = (val) => {
    if (!val) return '';
    if (val === '0' || val === 'Plano') return 'Plano';
    if (!val.startsWith('+') && !val.startsWith('-')) return `+${val}`;
    return val;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `${BASE_URL}/api/patients/${editId}` : `${BASE_URL}/api/patients`;
      const method = editId ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        test_results: JSON.stringify(formData.test_results)
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success(`Record ${editId ? 'synchronized' : 'published'} successfully!`);
        setIsModalOpen(false);
        setEditId(null);
        setFormData(INITIAL_FORM);
        fetchPatients();
      } else {
        toast.error("Database synchronization failed");
      }
    } catch (e) {
      toast.error("Clinical server error");
    }
  };

  const openEdit = (patient) => {
    setEditId(patient.id);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender || 'Male',
      history: patient.history || '',
      test_results: patient.test_results
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this clinical case from the registry?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success("Case removed from registry");
        fetchPatients();
      }
    } catch (e) {
      toast.error("Error removing clinical case");
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
        activeTab === id ? 'border-primary text-primary bg-primary/5' : 'border-white/5 text-slate-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full overflow-x-hidden md:pl-2">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12 w-full px-4 md:px-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-3 md:p-4 bg-primary/20 rounded-xl md:rounded-2xl border border-primary/20 shadow-xl shadow-primary/10">
            <Users className="text-primary w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Clinical Registry</h1>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary mt-1 flex items-center gap-1.5 opacity-80">
              <HeartPulse size={12} className="md:size-[14px]" /> Precision Patient Management
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative group w-full sm:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by clinician name..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-xl transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditId(null);
              setFormData(INITIAL_FORM);
              setActiveTab('basic');
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 uppercase tracking-widest text-[10px]"
          >
            <Plus size={16} /> New Clinical Case
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="text-center py-20 glass-card mx-4 md:mx-0">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium text-lg">No clinical cases indexed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 md:px-0">
          {filtered.map(patient => (
            <div key={patient.id} className="glass-card p-6 flex flex-col group hover:border-primary/30 transition-all shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-primary/20 transition-all" />
               
               <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4 relative z-10">
                 <div className="flex items-center gap-3">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-black text-primary text-xl shadow-inner group-hover:scale-105 group-hover:-rotate-3 transition-all">
                      {patient.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">{patient.name}</h3>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-slate-400 font-black uppercase tracking-tighter">AGE: {patient.age}</span>
                        <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded-md text-primary font-black uppercase tracking-tighter">{patient.gender}</span>
                     </div>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => openEdit(patient)} className="p-2.5 bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-primary rounded-xl transition-all border border-white/5"><Edit size={16} /></button>
                   <button onClick={() => handleDelete(patient.id)} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-white/5"><Trash size={16} /></button>
                 </div>
               </div>

               <div className="space-y-6 flex-1 relative z-10">
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-2"><Eye size={12} /> Clinical Summary (OD/OS)</p>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                         <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Visual Acuity</p>
                         <p className="text-xs font-mono text-white flex justify-between">
                            <span className="text-primary opacity-60">R</span> {patient.test_results.vision?.od || '6/6'}
                         </p>
                         <p className="text-xs font-mono text-white flex justify-between">
                            <span className="text-primary opacity-60">L</span> {patient.test_results.vision?.os || '6/6'}
                         </p>
                      </div>
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                         <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Diagnostic Profile</p>
                         <p className="text-[10px] text-emerald-400 font-bold truncate">IOP: {patient.test_results.diagnostics?.iop?.od || '--'}/{patient.test_results.diagnostics?.iop?.os || '--'}</p>
                         <p className="text-[10px] text-primary font-bold truncate">
                            Lens: {patient.test_results.slitLamp?.od?.lens || 'Clear'} | {patient.test_results.slitLamp?.os?.lens || 'Clear'}
                         </p>
                      </div>
                   </div>
                 </div>

                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-2"><ClipboardList size={12} /> Primary Care Plan</p>
                   <p className="text-xs text-slate-400 bg-white/5 p-4 rounded-xl italic border border-white/5 leading-relaxed">
                      {patient.test_results.rehab?.plan || patient.history || 'Routine diagnostic monitoring recommended.'}
                   </p>
                 </div>
               </div>

               <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-1.5"><Activity size={10} className="text-primary" /> Active Case</div>
                  <div className="flex items-center gap-1.5"><ShieldCheck size={10} className="text-emerald-500" /> Verified</div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Advanced Tabbed Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 shadow-3xl rounded-3xl w-full max-w-4xl my-auto"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-slate-900/50 rounded-t-3xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20">
                    <Stethoscope className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight leading-none">{editId ? 'Modify' : 'Initialize'} Patient Record</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Clinical Case Number: #{editId || 'AUTO-GEN'}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-all bg-white/10 hover:bg-red-500/20 p-2.5 rounded-xl border border-white/10 group">
                  <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                <TabButton id="basic" label="Background" icon={UserIcon} />
                <TabButton id="clinical" label="Refraction" icon={Activity} />
                <TabButton id="diagnostics" label="Slit Lamp" icon={Stethoscope} />
                <TabButton id="binocular" label="Binocular" icon={BriefcaseMedical} />
                <TabButton id="rehab" label="Plan" icon={HeartPulse} />
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-slate-950/40 rounded-b-3xl">
                
                {/* Tab: Background */}
                {activeTab === 'basic' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Case Name</label>
                          <input required type="text" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Age</label>
                             <input required type="number" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Sex</label>
                             <select className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold appearance-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                <option value="Male">M</option>
                                <option value="Female">F</option>
                                <option value="Other">O</option>
                             </select>
                           </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Medical Background / Compliant</label>
                        <textarea className="w-full h-32 bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none leading-relaxed" value={formData.history} onChange={e => setFormData({...formData, history: e.target.value})} />
                      </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                       <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl h-full flex flex-col justify-center text-center">
                          <Info className="text-primary mx-auto mb-4" size={32} />
                          <h4 className="text-white font-bold mb-2">Background Protocol</h4>
                          <p className="text-xs text-slate-400 leading-relaxed italic">Document the patient's primary complaints and systemic history including diabetes, hypertension, and current medications.</p>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Clinical Assessment */}
                {activeTab === 'clinical' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                    {/* Visual Acuity */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                        <span className="h-[1px] flex-1 bg-primary/20"></span>
                        Visual Acuity (VA)
                        <span className="h-[1px] flex-1 bg-primary/20"></span>
                      </h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Distance OD</label>
                          <input type="text" placeholder="6/6" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono" value={formData.test_results.vision.od} onChange={e => setFormData({...formData, test_results: {...formData.test_results, vision: {...formData.test_results.vision, od: e.target.value}}})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Distance OS</label>
                          <input type="text" placeholder="6/6" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono" value={formData.test_results.vision.os} onChange={e => setFormData({...formData, test_results: {...formData.test_results, vision: {...formData.test_results.vision, os: e.target.value}}})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Near Power</label>
                          <input type="text" placeholder="N6" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono" value={formData.test_results.vision.near} onChange={e => setFormData({...formData, test_results: {...formData.test_results, vision: {...formData.test_results.vision, near: e.target.value}}})} />
                        </div>
                      </div>
                    </div>

                    {/* Subjective Refraction */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-3">
                        <span className="h-[1px] flex-1 bg-emerald-500/20"></span>
                        Subjective Refraction
                        <span className="h-[1px] flex-1 bg-emerald-500/20"></span>
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {/* Right Eye */}
                         <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                            <p className="text-[10px] font-black text-primary uppercase mb-2">Right Eye (OD)</p>
                            <div className="grid grid-cols-4 gap-3">
                               <input type="text" placeholder="SPH" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.od.sph} onBlur={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, od: {...formData.test_results.refraction.subjective.od, sph: formatRefraction(e.target.value)}}}}})} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, od: {...formData.test_results.refraction.subjective.od, sph: e.target.value}}}}})} />
                               <input type="text" placeholder="CYL" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.od.cyl} onBlur={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, od: {...formData.test_results.refraction.subjective.od, cyl: formatRefraction(e.target.value)}}}}})} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, od: {...formData.test_results.refraction.subjective.od, cyl: e.target.value}}}}})} />
                               <input type="text" placeholder="AXIS" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.od.axis} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, od: {...formData.test_results.refraction.subjective.od, axis: e.target.value}}}}})} />
                               <input type="text" placeholder="ADD" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.od.add} onBlur={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, od: {...formData.test_results.refraction.subjective.od, add: formatRefraction(e.target.value)}}}}})} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, od: {...formData.test_results.refraction.subjective.od, add: e.target.value}}}}})} />
                            </div>
                         </div>
                         {/* Left Eye */}
                         <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                            <p className="text-[10px] font-black text-primary uppercase mb-2">Left Eye (OS)</p>
                            <div className="grid grid-cols-4 gap-3">
                               <input type="text" placeholder="SPH" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.os.sph} onBlur={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, os: {...formData.test_results.refraction.subjective.os, sph: formatRefraction(e.target.value)}}}}})} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, os: {...formData.test_results.refraction.subjective.os, sph: e.target.value}}}}})} />
                               <input type="text" placeholder="CYL" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.os.cyl} onBlur={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, os: {...formData.test_results.refraction.subjective.os, cyl: formatRefraction(e.target.value)}}}}})} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, os: {...formData.test_results.refraction.subjective.os, cyl: e.target.value}}}}})} />
                               <input type="text" placeholder="AXIS" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.os.axis} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, os: {...formData.test_results.refraction.subjective.os, axis: e.target.value}}}}})} />
                               <input type="text" placeholder="ADD" className="bg-black/40 border-none rounded-lg p-3 text-xs text-white text-center" value={formData.test_results.refraction.subjective.os.add} onBlur={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, os: {...formData.test_results.refraction.subjective.os, add: formatRefraction(e.target.value)}}}}})} onChange={e => setFormData({...formData, test_results: {...formData.test_results, refraction: {...formData.test_results.refraction, subjective: {...formData.test_results.refraction.subjective, os: {...formData.test_results.refraction.subjective.os, add: e.target.value}}}}})} />
                            </div>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Slit Lamp & Diagnostics */}
                {activeTab === 'diagnostics' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {/* Slit Lamp Right Eye (OD) */}
                       <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex justify-between items-center">
                            Right Eye (OD) - Slit Lamp
                            <Eye size={14} className="opacity-50" />
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Adnexa</label>
                                <input type="text" placeholder="Normal" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.adnexa} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, adnexa: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Conjunctiva</label>
                                <input type="text" placeholder="Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.conjunctiva} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, conjunctiva: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Sclera</label>
                                <input type="text" placeholder="Quiet" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.sclera} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, sclera: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Cornea</label>
                                <input type="text" placeholder="Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.cornea} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, cornea: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Iris</label>
                                <input type="text" placeholder="Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.iris} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, iris: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Pupil (PERRLA)</label>
                                <input type="text" placeholder="Yes" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.pupil} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, pupil: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Anterior Chamber</label>
                                <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.ac} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, ac: e.target.value}}}})}>
                                   <option>Grade 4 (VH)</option>
                                   <option>Grade 3 (VH)</option>
                                   <option>Grade 2 (VH)</option>
                                   <option>Grade 1 (VH)</option>
                                </select>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Lens Status</label>
                                <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.lens} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, lens: e.target.value}}}})}>
                                   <option>Clear</option>
                                   <option>NS1+</option><option>NS2+</option><option>NS3+</option>
                                   <option>Cortical</option><option>PSC</option><option>IOL</option>
                                </select>
                             </div>
                             <div className="col-span-2 space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Fundus OD</label>
                                <input type="text" placeholder="C/D 0.3, Macula Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.od.fundus} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, od: {...formData.test_results.slitLamp.od, fundus: e.target.value}}}})} />
                             </div>
                          </div>
                       </div>

                       {/* Slit Lamp Left Eye (OS) */}
                       <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex justify-between items-center">
                            Left Eye (OS) - Slit Lamp
                            <Eye size={14} className="opacity-50" />
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Adnexa</label>
                                <input type="text" placeholder="Normal" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.adnexa} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, adnexa: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Conjunctiva</label>
                                <input type="text" placeholder="Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.conjunctiva} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, conjunctiva: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Sclera</label>
                                <input type="text" placeholder="Quiet" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.sclera} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, sclera: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Cornea</label>
                                <input type="text" placeholder="Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.cornea} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, cornea: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Iris</label>
                                <input type="text" placeholder="Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.iris} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, iris: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Pupil (PERRLA)</label>
                                <input type="text" placeholder="Yes" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.pupil} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, pupil: e.target.value}}}})} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Anterior Chamber</label>
                                <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.ac} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, ac: e.target.value}}}})}>
                                   <option>Grade 4 (VH)</option>
                                   <option>Grade 3 (VH)</option>
                                   <option>Grade 2 (VH)</option>
                                   <option>Grade 1 (VH)</option>
                                </select>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Lens Status</label>
                                <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.lens} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, lens: e.target.value}}}})}>
                                   <option>Clear</option>
                                   <option>NS1+</option><option>NS2+</option><option>NS3+</option>
                                   <option>Cortical</option><option>PSC</option><option>IOL</option>
                                </select>
                             </div>
                             <div className="col-span-2 space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Fundus OS</label>
                                <input type="text" placeholder="C/D 0.3, Macula Clear" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.slitLamp.os.fundus} onChange={e => setFormData({...formData, test_results: {...formData.test_results, slitLamp: {...formData.test_results.slitLamp, os: {...formData.test_results.slitLamp.os, fundus: e.target.value}}}})} />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                       <div className="bg-orange-500/5 p-6 rounded-2xl border border-orange-500/10 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">Diagnostic Pulses</h3>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-[9px] text-slate-500 font-bold uppercase px-1">IOP (mmHg) OD/OS</label>
                                <div className="flex gap-2">
                                   <input type="number" placeholder="16" className="w-1/2 bg-slate-900 border-none rounded-xl p-3 text-xs text-white text-center" value={formData.test_results.diagnostics.iop.od} onChange={e => setFormData({...formData, test_results: {...formData.test_results, diagnostics: {...formData.test_results.diagnostics, iop: {...formData.test_results.diagnostics.iop, od: e.target.value}}}})} />
                                   <input type="number" placeholder="16" className="w-1/2 bg-slate-900 border-none rounded-xl p-3 text-xs text-white text-center" value={formData.test_results.diagnostics.iop.os} onChange={e => setFormData({...formData, test_results: {...formData.test_results, diagnostics: {...formData.test_results.diagnostics, iop: {...formData.test_results.diagnostics.iop, os: e.target.value}}}})} />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] text-slate-500 font-bold uppercase px-1">TBUT (Seconds) OD/OS</label>
                                <div className="flex gap-2">
                                   <input type="number" placeholder="12" className="w-1/2 bg-slate-900 border-none rounded-xl p-3 text-xs text-white text-center" value={formData.test_results.diagnostics.tbut.od} onChange={e => setFormData({...formData, test_results: {...formData.test_results, diagnostics: {...formData.test_results.diagnostics, tbut: {...formData.test_results.diagnostics.tbut, od: e.target.value}}}})} />
                                   <input type="number" placeholder="12" className="w-1/2 bg-slate-900 border-none rounded-xl p-3 text-xs text-white text-center" value={formData.test_results.diagnostics.tbut.os} onChange={e => setFormData({...formData, test_results: {...formData.test_results, diagnostics: {...formData.test_results.diagnostics, tbut: {...formData.test_results.diagnostics.tbut, os: e.target.value}}}})} />
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Advanced Checks</h3>
                          <div className="space-y-2">
                             <label className="text-[9px] text-slate-500 font-bold uppercase px-1">Color Vision OD/OS (Ishihara)</label>
                             <div className="flex gap-4">
                                <input type="text" placeholder="OD" className="w-full bg-slate-900 border-none rounded-xl p-3 text-xs text-white" value={formData.test_results.diagnostics.color.od} onChange={e => setFormData({...formData, test_results: {...formData.test_results, diagnostics: {...formData.test_results.diagnostics, color: {...formData.test_results.diagnostics.color, od: e.target.value}}}})} />
                                <input type="text" placeholder="OS" className="w-full bg-slate-900 border-none rounded-xl p-3 text-xs text-white" value={formData.test_results.diagnostics.color.os} onChange={e => setFormData({...formData, test_results: {...formData.test_results, diagnostics: {...formData.test_results.diagnostics, color: {...formData.test_results.diagnostics.color, os: e.target.value}}}})} />
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Binocular Vision */}
                {activeTab === 'binocular' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Cover Tests & Accommodation */}
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Cover Tests & Accommodation</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Uncover</label>
                              <input type="text" placeholder="Ortho" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.coverTest.uncover} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, coverTest: {...formData.test_results.binocular.coverTest, uncover: e.target.value}}}})} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Alternate</label>
                              <input type="text" placeholder="Ortho" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.coverTest.alternate} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, coverTest: {...formData.test_results.binocular.coverTest, alternate: e.target.value}}}})} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Prism</label>
                              <input type="text" placeholder="N/A" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.coverTest.prism} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, coverTest: {...formData.test_results.binocular.coverTest, prism: e.target.value}}}})} />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">NPA (cm)</label>
                              <input type="text" placeholder="8" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.npa} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, npa: e.target.value}}})} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">NPC (cm)</label>
                              <input type="text" placeholder="5" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.npc} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, npc: e.target.value}}})} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">AC/A Ratio</label>
                              <input type="text" placeholder="4:1" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.aca} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, aca: e.target.value}}})} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Specialized Tests */}
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Vergence & Specialized Tests</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Vergence Test</label>
                              <input type="text" placeholder="Normal" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.vergence} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, vergence: e.target.value}}})} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Stereopsis (sec arc)</label>
                              <input type="text" placeholder="40" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.stereopsis} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, stereopsis: e.target.value}}})} />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                             <div className="col-span-1 space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase">Worth 4-Dot</label>
                                <input type="text" placeholder="4 dots" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.worth4dot} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, worth4dot: e.target.value}}})} />
                             </div>
                             <div className="col-span-2 space-y-1.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase">Synoptophore</label>
                                <input type="text" placeholder="Fusion Grade II" className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-[11px] text-white" value={formData.test_results.binocular.synoptophore} onChange={e => setFormData({...formData, test_results: {...formData.test_results, binocular: {...formData.test_results.binocular, synoptophore: e.target.value}}})} />
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Rehabilitation */}
                {activeTab === 'rehab' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Prescribed Aids / Devices</label>
                        <input type="text" placeholder="3x Magnifier, Telescope, Blue-cut AR lenses..." className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold" value={formData.test_results.rehab.aids} onChange={e => setFormData({...formData, test_results: {...formData.test_results, rehab: {...formData.test_results.rehab, aids: e.target.value}}})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Clinical Plan / Follow-up Routine</label>
                        <textarea className="w-full h-40 bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-emerald-400 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all resize-none font-medium leading-relaxed" placeholder="Summarize the patient management plan and future visits..." value={formData.test_results.rehab.plan} onChange={e => setFormData({...formData, test_results: {...formData.test_results, rehab: {...formData.test_results.rehab, plan: e.target.value}}})} />
                     </div>
                  </motion.div>
                )}

                <div className="pt-10 flex justify-end gap-4 border-t border-white/5">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm">Discard</button>
                  <button type="submit" className="px-10 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all transform active:scale-95 uppercase tracking-widest text-xs flex items-center gap-3">
                    <Save size={18} /> Sync Clinical Chart
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
