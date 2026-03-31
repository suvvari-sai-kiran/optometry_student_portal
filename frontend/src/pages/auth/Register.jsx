import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
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
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
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
      </div>
    </div>
  );
}
