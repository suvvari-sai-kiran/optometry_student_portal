import { useState, useEffect } from 'react';
import { Plus, Users, Search, Trash, Edit, HeartPulse, Stethoscope, BriefcaseMedical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../../api/config';

export default function PatientsView() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', history: '', test_results: '' });
  const [search, setSearch] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setPatients(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load patients");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `${BASE_URL}/api/patients/${editId}` : `${BASE_URL}/api/patients`;
      const method = editId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(`Patient ${editId ? 'updated' : 'added'} successfully!`);
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ name: '', age: '', history: '', test_results: '' });
        fetchPatients();
      } else {
        toast.error("Failed to save patient");
      }
    } catch (e) {
      console.error(e);
      toast.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient record?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success("Patient deleted");
        fetchPatients();
      }
    } catch (e) {
      toast.error("Error deleting patient");
    }
  };

  const openEdit = (patient) => {
    setEditId(patient.id);
    setFormData({ 
      name: patient.name, 
      age: patient.age, 
      history: patient.history || '', 
      test_results: patient.test_results || ''
    });
    setIsModalOpen(true);
  };

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full overflow-x-hidden md:pl-2">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12 w-full px-4 md:px-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-3 md:p-4 bg-primary/20 rounded-xl md:rounded-2xl border border-primary/20 shadow-xl shadow-primary/10">
            <Users className="text-primary w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Patient Directory</h1>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary mt-1 flex items-center gap-1.5 opacity-80">
              <HeartPulse size={12} className="md:size-[14px]" /> Clinical Records Management
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative group w-full sm:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter patients by name..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-xl transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditId(null);
              setFormData({ name: '', age: '', history: '', test_results: '' });
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 uppercase tracking-widest text-[10px]"
          >
            <Plus size={16} /> New Clinical Record
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="text-center py-20 glass-card mx-4 md:mx-0">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium text-lg">No clinical matches found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
          {filtered.map(patient => (
            <div key={patient.id} className="glass-card p-6 flex flex-col group hover:border-primary/30 transition-all shadow-xl">
               <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white text-lg shadow-inner group-hover:scale-110 transition-transform">
                      {patient.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-lg leading-none">{patient.name}</h3>
                     <span className="text-xs text-slate-500 font-medium">Age: {patient.age}</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => openEdit(patient)} className="p-2 bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-primary rounded-lg transition-colors"><Edit size={16} /></button>
                   <button onClick={() => handleDelete(patient.id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><Trash size={16} /></button>
                 </div>
               </div>

               <div className="space-y-4 flex-1">
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-1"><Stethoscope size={10} /> Medical History</p>
                   <p className="text-sm text-slate-300 bg-black/20 p-3 rounded-lg min-h-[60px] line-clamp-2">{patient.history || 'No history recorded.'}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 mb-1"><BriefcaseMedical size={10} /> Test Results / RX</p>
                   <p className="text-sm text-emerald-400/80 bg-emerald-500/5 p-3 rounded-lg min-h-[60px] font-mono whitespace-pre-wrap">{patient.test_results || 'No test results.'}</p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-primary"/> {editId ? 'Edit' : 'New'} Patient Record</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg">×</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-950/50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Patient Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Age</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Patient History</label>
                  <textarea 
                    className="w-full h-24 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                    value={formData.history}
                    onChange={e => setFormData({...formData, history: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Test Results & Rx</label>
                  <textarea 
                    className="w-full h-24 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-emerald-400 font-mono focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                    value={formData.test_results}
                    onChange={e => setFormData({...formData, test_results: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">Save Record</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
