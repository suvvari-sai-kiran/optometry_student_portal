import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Component } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FormulasPage from './pages/common/FormulasPage';
import QnaPage from './pages/common/QnaPage';
import ChatAssistant from './components/ChatAssistant';

/* Global Error Boundary — prevents blank-screen crashes */
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[App] Render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f172a', color: '#f1f5f9', fontFamily: 'sans-serif', gap: 16
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Something went wrong</h2>
          <p style={{ color: '#94a3b8', maxWidth: 400, textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const AuthRoute = ({ children, requireRole }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (requireRole && user?.role !== requireRole) {
      const target = user?.role === 'admin' ? '/admin' : '/student';
      return <Navigate to={target} replace />;
    }
    return children;
  };

  return (
    <AppErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background text-slate-200 selection:bg-primary/30">
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }
          }} />

          {/* Floating AI Chat — always mounted, never navigates */}
          <ChatAssistant />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            <Route path="/formulas" element={<FormulasPage />} />
            <Route path="/qna" element={<QnaPage />} />

            <Route
              path="/student/*"
              element={
                <AuthRoute requireRole="student">
                  <StudentDashboard />
                </AuthRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <AuthRoute requireRole="admin">
                  <AdminDashboard />
                </AuthRoute>
              }
            />

            <Route
              path="/"
              element={
                token ? (
                  user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </AppErrorBoundary>
  );
}

export default App;
