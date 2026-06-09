import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, LogIn, ArrowLeft, Terminal, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: 'admin', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect straight to dashboard
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        // Sync app auth state
        window.dispatchEvent(new Event('auth-change'));
        navigate('/admin/dashboard');
      } else {
        throw new Error(data.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      position: 'relative'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        
        {/* Back Link */}
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          transition: 'var(--transition-fast)'
        }}
        onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-cyan)'}
        onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
            color: 'var(--accent-cyan)',
            marginBottom: '1rem'
          }}>
            <Lock size={20} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Enter keys to unlock portfolio manager.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(230, 57, 70, 0.1)',
            border: '1px solid rgba(230, 57, 70, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#e63946',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="glass-label">Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <User size={16} />
              </span>
              <input 
                type="text" 
                name="username" 
                value={formData.username}
                onChange={handleChange}
                required 
                className="glass-input" 
                style={{ paddingLeft: '2.5rem' }} 
              />
            </div>
          </div>

          <div>
            <label className="glass-label">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required 
                className="glass-input" 
                style={{ paddingLeft: '2.5rem' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                <span>Unlocking...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Verify Access</span>
              </>
            )}
          </button>
        </form>



      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
