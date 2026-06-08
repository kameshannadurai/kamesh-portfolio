import React, { useState } from 'react';
import { Send, Check, Mail, MapPin, Sparkles, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

    // Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Auto reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(data.message || 'Error occurred while delivering message.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ position: 'relative' }}>
      <div className="container" style={{ maxWidth: '950px' }}>
        <h2 className="section-title">Get In Touch</h2>

        {/* Contact Layout grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          marginTop: '1rem'
        }} className="contact-grid-layout">
          
          {/* Info Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} className="text-gradient" />
                <span>Let's collaborate!</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Have an exciting project you need help with, or looking for a developer to join your engineering team? I'm always open to discussing new opportunities, full-time positions, or consulting contracts. Drop a message!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(0, 240, 255, 0.05)',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)'
                }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Me</div>
                  <a href="mailto:kamesh@example.com" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }} onMouseOver={(e)=>e.target.style.color='var(--accent-cyan)'} onMouseOut={(e)=>e.target.style.color='var(--text-primary)'}>
                    kamesh@example.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(157, 78, 221, 0.05)',
                  border: '1px solid rgba(157, 78, 221, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-purple)'
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Bangalore, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            {success ? (
              /* Success Animation Screen */
              <div style={{
                height: '100%',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                animation: 'scaleIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  border: '2px solid var(--accent-cyan)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 0 15px var(--accent-cyan-glow)'
                }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>
                  Message Transmitted!
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', fontSize: '0.95rem' }}>
                  Thank you for reaching out. I've received your query and will reply shortly.
                </p>
              </div>
            ) : (
              /* Actual Form Elements */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
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
                    fontSize: '0.9rem'
                  }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-double-col">
                  <div>
                    <label className="glass-label">Full Name <span style={{ color: 'var(--accent-cyan)' }}>*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      required 
                      className="glass-input" 
                    />
                  </div>
                  <div>
                    <label className="glass-label">Email Address <span style={{ color: 'var(--accent-cyan)' }}>*</span></label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com" 
                      required 
                      className="glass-input" 
                    />
                  </div>
                </div>

                <div>
                  <label className="glass-label">Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Freelance Project Inquiry" 
                    className="glass-input" 
                  />
                </div>

                <div>
                  <label className="glass-label">Your Message <span style={{ color: 'var(--accent-cyan)' }}>*</span></label>
                  <textarea 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    rows="5" 
                    placeholder="Hello! I would love to build a website with you..." 
                    required 
                    className="glass-input"
                    style={{ resize: 'vertical' }}
                  ></textarea>
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
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (min-width: 768px) {
          .contact-grid-layout {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
        @media (max-width: 480px) {
          .form-double-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
