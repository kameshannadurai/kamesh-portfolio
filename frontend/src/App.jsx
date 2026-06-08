import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Navbar from './components/Navbar.jsx';

// Protected Route Component for Admin Dashboard
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } catch (err) {
        // Fallback check: if server is unreachable, just rely on token existence
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0c16',
        color: '#00f0ff',
        fontFamily: 'Space Grotesk'
      }}>
        <div className="accent-glow">Authenticating Admin...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Simple state sync for navbar representation
    const token = localStorage.getItem('adminToken');
    setIsAdminLoggedIn(!!token);

    // Event listener for custom storage change alerts
    const handleAuthChange = () => {
      setIsAdminLoggedIn(!!localStorage.getItem('adminToken'));
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <Router>
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Particle backgrounds placed globally */}
        <div className="bg-glow-orb orb-1"></div>
        <div className="bg-glow-orb orb-2"></div>

        <Navbar isAdmin={isAdminLoggedIn} onLogout={handleLogout} />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Catch-all redirects back to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '2rem 0',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.9rem',
          backgroundColor: 'rgba(6, 8, 18, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="container">
            <p>© {new Date().getFullYear()} Kamesh Portfolio. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Built with React, Express, and modern Glassmorphism aesthetics.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
