import React, { useEffect } from 'react';
import { X, ExternalLink, Github, Calendar, Briefcase } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          borderRadius: '20px',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          animation: 'slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-primary)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = '#ff4d4f'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              color: 'var(--accent-cyan)'
            }}>
              {project.category}
            </span>
            {project.featured && (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'rgba(157, 78, 221, 0.1)',
                border: '1px solid rgba(157, 78, 221, 0.25)',
                padding: '0.25rem 0.75rem',
                borderRadius: '50px',
                color: 'var(--accent-purple)'
              }}>
                Featured Project
              </span>
            )}
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {project.title}
          </h2>
        </div>

        {/* Modal Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem'
        }} className="modal-grid-layout">
          
          {/* Left Side: Large Image Preview */}
          <div style={{
            width: '100%',
            height: 'clamp(200px, 35vw, 360px)',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            {project.imageUrl ? (
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #131932 0%, #0d1122 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <Briefcase size={64} />
              </div>
            )}
          </div>

          {/* Right Side: Info & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                About the Project
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {project.description}
              </p>
            </div>

            {/* Tech Stack List */}
            <div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                Technologies Used
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.tags?.map((tag, idx) => (
                  <span 
                    key={idx} 
                    style={{
                      fontSize: '0.8rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Links */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.5rem',
              marginTop: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Github size={16} />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <ExternalLink size={16} />
                  <span>Launch Live Site</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 768px) {
          .modal-grid-layout {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectModal;
