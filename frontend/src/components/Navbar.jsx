import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Lock, LogOut, LayoutDashboard, Terminal } from 'lucide-react';

const Navbar = ({ isAdmin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (anchorId) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + anchorId);
    } else {
      const element = document.getElementById(anchorId.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
      background: isScrolled ? 'rgba(10, 12, 22, 0.85)' : 'transparent',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700
        }}>
          <Terminal size={22} className="text-gradient" />
          <span>KAMESH<span className="text-gradient">.dev</span></span>
        </Link>

        {/* Desktop Menu */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '2.5rem'
        }} className="desktop-menu-container">
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2rem'
          }}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: location.pathname === '/' ? 'var(--text-secondary)' : 'var(--text-muted)',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    padding: '0.25rem 0',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-cyan)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={onLogout} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#e63946', boxShadow: 'none' }}>
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/admin/login" style={{
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)'; e.currentTarget.style.borderColor = 'var(--accent-cyan)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; }}
              title="Admin Login"
              >
                <Lock size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'block'
          }}
          className="mobile-menu-trigger"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          background: 'rgba(10, 12, 22, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 99
        }}>
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            listStyle: 'none',
            gap: '1.25rem'
          }}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            marginTop: '0.5rem'
          }}>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="btn-primary" style={{ justifyContent: 'center', background: '#e63946' }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setIsOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>
                <Lock size={16} />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Media Query Injection style blocks to toggle mobile/desktop navbar display cleanly */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-menu-container {
            display: flex !important;
          }
          .mobile-menu-trigger {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
