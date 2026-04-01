import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Download } from 'lucide-react';
import BASE_URL from '../../api/config';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // PWA Install State
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if the prompt was already stashed before component mounted
    if (window.deferredPrompt) {
      setIsInstallable(true);
    }
    
    // Listen for the custom event or native event
    const handleInstallable = (e) => {
      setIsInstallable(true);
    };
    
    window.addEventListener('app-installable', handleInstallable);
    return () => window.removeEventListener('app-installable', handleInstallable);
  }, []);

  const handleInstallClick = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      window.deferredPrompt = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, formData);
      const { token, user } = res.data;
      
      // Store auth data directly for immediate login
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
      
      // Force refresh or window redirect if needed to update App state
      window.location.reload(); 

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join Optometry Learning</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-muted)' }} />
            <input 
              type="text" className="input-base" placeholder="Full Name" style={{ paddingLeft: '3rem' }}
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-muted)' }} />
            <input 
              type="email" className="input-base" placeholder="Email ID" style={{ paddingLeft: '3rem' }}
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-muted)' }} />
            <input 
              type="password" className="input-base" placeholder="Password" style={{ paddingLeft: '3rem' }}
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required 
            />
          </div>
          
          <select 
            className="input-base" 
            value={formData.role} 
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ appearance: 'none' }}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
        </p>
        
        {isInstallable && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              onClick={handleInstallClick}
              className="btn btn-secondary" 
              style={{ width: '100%', background: 'var(--success)', color: 'white', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Download size={18} /> Download App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
