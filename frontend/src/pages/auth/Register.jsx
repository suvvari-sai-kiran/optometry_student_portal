import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Download, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../../api/config';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if (window.deferredPrompt) setIsInstallable(true);
    const handleInstallable = () => setIsInstallable(true);
    window.addEventListener('app-installable', handleInstallable);
    return () => window.removeEventListener('app-installable', handleInstallable);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, formData);
      toast.success(res.data.message);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Registration failed.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallClick = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstallable(false);
      window.deferredPrompt = null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-premium">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10">
              <ShieldCheck className="text-primary" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join EyeCare AI</h1>
            <p className="text-slate-400">Transforming Optometry with Intelligence</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="Secure Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`py-3 rounded-xl border transition-all text-sm font-medium ${formData.role === 'student' ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-900/30 border-white/5 text-slate-400 hover:border-white/20'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={`py-3 rounded-xl border transition-all text-sm font-medium ${formData.role === 'admin' ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-900/30 border-white/5 text-slate-400 hover:border-white/20'}`}
              >
                Administrator
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-4 rounded-xl shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Register Now'}
            </button>
          </form>

          <footer className="mt-8 text-center space-y-4">
            <p className="text-slate-500">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
            </p>
            
            <AnimatePresence>
              {isInstallable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="pt-4 border-t border-white/5"
                >
                  <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all font-medium text-sm"
                  >
                    <Download size={16} /> Install App
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}

