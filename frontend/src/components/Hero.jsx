import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, FileText, ChevronDown } from 'lucide-react';
import ParticleBackground from './ParticleBackground.jsx';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const words = ['Full-Stack Developer', 'React Specialist', 'Backend Architect', 'Creative Problem Solver'];
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer;

    if (isDeleting) {
      // Deleting letters
      timer = setTimeout(() => {
        setTypedText(currentWord.substring(0, typedText.length - 1));
      }, 50);
    } else {
      // Typing letters
      timer = setTimeout(() => {
        setTypedText(currentWord.substring(0, typedText.length + 1));
      }, 100);
    }

    // Adjust typing speed based on state
    if (!isDeleting && typedText === currentWord) {
      // Pause at full word
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, wordIndex]);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home"
      className="section" 
      style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0 3rem 0'
      }}
    >
      <ParticleBackground />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Greeting Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(157, 78, 221, 0.1)',
            border: '1px solid rgba(157, 78, 221, 0.25)',
            borderRadius: '50px',
            padding: '0.4rem 1rem',
            marginBottom: '2rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--accent-purple)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00f0ff',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--accent-cyan)'
            }}></span>
            <span>Available for Hire & Projects</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.1,
            fontWeight: 700,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-display)'
          }}>
            Hi, I'm <span className="text-gradient">Kamesh</span>
          </h1>

          {/* Typewriter Subheadline */}
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            minHeight: '3.5rem',
            fontFamily: 'var(--font-display)'
          }}>
            I am a <span style={{ color: 'var(--accent-cyan)' }} className="accent-glow">{typedText}</span>
            <span style={{ 
              borderRight: '2px solid var(--accent-cyan)', 
              animation: 'blink 0.75s step-end infinite',
              marginLeft: '2px'
            }}></span>
          </h2>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: 1.7,
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto'
          }}>
            I craft clean, premium full-stack web applications with high-fidelity animations, robust backends, and responsive frontend architecture.
          </p>

          {/* Call to Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <button onClick={() => handleScroll('projects')} className="btn-primary">
              View My Work
            </button>
            <button onClick={() => handleScroll('contact')} className="btn-secondary">
              <Mail size={16} />
              <span>Get In Touch</span>
            </button>
          </div>

          {/* Social Links & CV */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-cyan)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-secondary)'}>
              <Github size={22} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-cyan)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-secondary)'}>
              <Linkedin size={22} />
            </a>
            <a href="mailto:contact@example.com" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-cyan)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-secondary)'}>
              <Mail size={22} />
            </a>
            <span style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }}></span>
            <a href="#" style={{ 
              color: 'var(--accent-cyan)', 
              textDecoration: 'none', 
              fontSize: '0.95rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition-fast)'
            }} 
            onMouseOver={(e)=>e.currentTarget.style.textShadow='0 0 8px var(--accent-cyan-glow)'} 
            onMouseOut={(e)=>e.currentTarget.style.textShadow='none'}
            onClick={(e) => { e.preventDefault(); alert("CV Download placeholder - add resume.pdf to public folder to link."); }}
            >
              <FileText size={18} />
              <span>Download CV</span>
            </a>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => handleScroll('skills')}
          style={{
            position: 'absolute',
            bottom: '-2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            animation: 'bounce 2s infinite'
          }}
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: var(--accent-cyan); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-8px) translateX(-50%);
          }
          60% {
            transform: translateY(-4px) translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
