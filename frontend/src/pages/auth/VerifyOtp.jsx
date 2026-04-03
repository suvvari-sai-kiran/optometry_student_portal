import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BASE_URL from '../../api/config';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      toast.error('Email missing. Redirecting to login...');
      navigate('/login');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Account verified successfully!');
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/student');
      
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });
      toast.success('New OTP sent to your email.');
      setTimer(60);
    } catch (err) {
      toast.error('Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-premium">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-emerald-500/30">
              <ShieldCheck className="text-emerald-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
            <p className="text-slate-400 text-sm">
              We've sent a 6-digit code to <br />
              <span className="text-slate-200 font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 text-center text-3xl font-bold tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : 'Verify & Continue'}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={handleResend}
              disabled={timer > 0 || resending}
              className="flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ color: timer > 0 ? '#64748b' : '#6366f1' }}
            >
              <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
              {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
            </button>

            <Link 
              to="/login" 
              className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
