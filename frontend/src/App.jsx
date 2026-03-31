import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FormulasPage from './pages/common/FormulasPage';
import QnaPage from './pages/common/QnaPage';
import Chatbot from './components/Chatbot';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const AuthRoute = ({ children, requireRole }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (requireRole && user?.role !== requireRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        <Chatbot />
        {/* We can place a Navbar component here later */}
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

          {/* Fallback route */}
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
  );
}

export default App;
