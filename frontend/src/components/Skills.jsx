import React, { useState, useEffect } from 'react';
import { Cpu, Layout, Database, Settings, RefreshCw } from 'lucide-react';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (!response.ok) throw new Error('Failed to retrieve skills list');
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Icon mapping helper for categories
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Frontend':
        return <Layout className="text-gradient" size={20} />;
      case 'Backend':
        return <Cpu className="text-gradient" size={20} />;
      case 'Database':
        return <Database className="text-gradient" size={20} />;
      default:
        return <Settings className="text-gradient" size={20} />;
    }
  };

  // Group skills by category
  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'];
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="section" style={{ backgroundColor: 'rgba(6, 8, 18, 0.4)' }}>
      <div className="container">
        <h2 className="section-title">Skills &amp; Expertise</h2>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <RefreshCw className="animate-spin" size={18} />
            <span>Loading skills data...</span>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ff4d4f' }}>
            <p>Could not load skills: {error}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginTop: '1rem'
          }}>
            {categories.map((category) => {
              const categorySkills = groupedSkills[category] || [];
              if (categorySkills.length === 0) return null;

              return (
                <div key={category} className="glass-card" style={{ padding: '2rem' }}>
                  {/* Category Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingBottom: '0.75rem'
                  }}>
                    {getCategoryIcon(category)}
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                      {category}
                    </h3>
                  </div>

                  {/* Skill Progress Bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {categorySkills.map((skill) => (
                      <div key={skill._id || skill.name}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.4rem',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}>
                          <span style={{ color: 'var(--text-primary)' }}>{skill.name}</span>
                          <span style={{ color: 'var(--accent-cyan)' }}>{skill.percentage}%</span>
                        </div>
                        {/* Progress Bar Track */}
                        <div style={{
                          height: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          {/* Progress Bar Fill */}
                          <div style={{
                            height: '100%',
                            width: `${skill.percentage}%`,
                            background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))',
                            borderRadius: '10px',
                            boxShadow: '0 0 8px var(--accent-cyan-glow)',
                            transition: 'width 1.5s ease-out'
                          }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Skills;
