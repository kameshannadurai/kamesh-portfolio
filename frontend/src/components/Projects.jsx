import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Folder, RefreshCw } from 'lucide-react';
import ProjectModal from './ProjectModal.jsx';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to retrieve project list');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', 'Frontend', 'Backend', 'Fullstack'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  // Trim text helper
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Projects Showcase</h2>

        {/* Filter Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={filter === cat ? 'btn-primary' : 'btn-secondary'}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.9rem',
                borderRadius: '50px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Loading/Error States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <RefreshCw className="animate-spin" size={18} />
            <span>Loading projects...</span>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ff4d4f' }}>
            <p>Could not load projects: {error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <Folder size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No projects found in this category yet.</p>
          </div>
        ) : (
          /* Projects Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {filteredProjects.map((project) => (
              <div 
                key={project._id}
                onClick={() => setSelectedProject(project)}
                className={`glass-card ${project.featured ? 'featured-card' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  border: project.featured ? '1px solid rgba(157, 78, 221, 0.3)' : '1px solid var(--glass-border)'
                }}
              >
                {/* Project Image Panel */}
                <div style={{
                  height: '180px',
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    /* Elegant Canvas Fallback when image is empty */
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #131932 0%, #0d1122 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)'
                    }}>
                      <Folder size={36} />
                    </div>
                  )}

                  {/* Category Badge overlay */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: 'rgba(10, 12, 22, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    color: 'var(--accent-cyan)'
                  }}>
                    {project.category}
                  </span>
                </div>

                {/* Card Info Body */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-display)'
                  }}>
                    {project.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem',
                    lineHeight: 1.5,
                    flex: 1
                  }}>
                    {truncate(project.description, 110)}
                  </p>

                  {/* Tech Tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '1.25rem'
                  }}>
                    {project.tags?.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx} 
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags?.length > 3 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* External Links */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '1rem',
                    marginTop: 'auto'
                  }}>
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          transition: 'var(--transition-fast)'
                        }}
                        onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-cyan)'}
                        onMouseOut={(e)=>e.currentTarget.style.color='var(--text-secondary)'}
                      >
                        <Github size={14} />
                        <span>Source</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          transition: 'var(--transition-fast)'
                        }}
                        onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-cyan)'}
                        onMouseOut={(e)=>e.currentTarget.style.color='var(--text-secondary)'}
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Project Detail Modal */}
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
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

export default Projects;
