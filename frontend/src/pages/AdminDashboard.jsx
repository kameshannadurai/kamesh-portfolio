import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Folder, Cpu, Mail, Plus, Trash2, Edit, Check, CheckSquare, 
  Square, Eye, RefreshCw, Activity, Terminal, ExternalLink 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [serverStatus, setServerStatus] = useState({ database: 'Checking...', fallbackMode: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', category: 'Fullstack', 
    tags: '', imageUrl: '', githubUrl: '', liveUrl: '', featured: false
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Skill Form State
  const [skillForm, setSkillForm] = useState({
    name: '', category: 'Frontend', percentage: 80
  });
  const [editingSkillId, setEditingSkillId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Verify Auth on load
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  // Load Data
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch server status
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        const statusData = await statusRes.ok ? await statusRes.json() : {};
        setServerStatus(statusData);
      }

      // Fetch projects
      const projRes = await fetch('/api/projects');
      if (projRes.ok) setProjects(await projRes.json());

      // Fetch skills
      const skillRes = await fetch('/api/skills');
      if (skillRes.ok) setSkills(await skillRes.json());

      // Fetch messages (auth required)
      const msgRes = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.status === 401) {
        // Token expired
        localStorage.removeItem('adminToken');
        window.dispatchEvent(new Event('auth-change'));
        navigate('/admin/login');
        return;
      }
      if (msgRes.ok) setMessages(await msgRes.json());

    } catch (err) {
      console.error(err);
      setError('Could not fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  // Handle Project CRUD
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      alert('Please fill in title and description.');
      return;
    }

    const tagsArray = typeof projectForm.tags === 'string'
      ? projectForm.tags.split(',').map(t => t.trim()).filter(t => t)
      : projectForm.tags;

    const payload = {
      ...projectForm,
      tags: tagsArray
    };

    try {
      const url = editingProjectId ? `/api/projects/${editingProjectId}` : '/api/projects';
      const method = editingProjectId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setProjectForm({
          title: '', description: '', category: 'Fullstack', 
          tags: '', imageUrl: '', githubUrl: '', liveUrl: '', featured: false
        });
        setEditingProjectId(null);
        loadDashboardData();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Error saving project.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during project submission.');
    }
  };

  const editProject = (proj) => {
    setEditingProjectId(proj._id);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      tags: proj.tags.join(', '),
      imageUrl: proj.imageUrl,
      githubUrl: proj.githubUrl,
      liveUrl: proj.liveUrl,
      featured: proj.featured === true
    });
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        loadDashboardData();
      } else {
        alert('Could not delete project.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    }
  };

  // Handle Skill CRUD
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    if (!skillForm.name || skillForm.percentage === undefined) return;

    try {
      const url = editingSkillId ? `/api/skills/${editingSkillId}` : '/api/skills';
      const method = editingSkillId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skillForm)
      });

      if (response.ok) {
        setSkillForm({ name: '', category: 'Frontend', percentage: 80 });
        setEditingSkillId(null);
        loadDashboardData();
      } else {
        alert('Error saving skill.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editSkill = (sk) => {
    setEditingSkillId(sk._id);
    setSkillForm({
      name: sk.name,
      category: sk.category,
      percentage: sk.percentage
    });
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        loadDashboardData();
      } else {
        alert('Could not delete skill.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Message Operations
  const toggleMessageRead = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ readStatus: !currentStatus })
      });
      if (response.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header Dashboard section */}
        <div style={{
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }} className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={26} className="text-gradient" />
              <span>Admin Dashboard</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Manage your personal project grid, active skills catalog, and incoming inquiries.
            </p>
          </div>

          {/* Database Server Status */}
          <div className="glass-card" style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginLeft: 'auto'
          }}>
            <Activity size={18} className="text-gradient" />
            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status: </span>
              <span style={{ fontWeight: 600, color: serverStatus.fallbackMode ? 'var(--accent-cyan)' : '#4ade80' }}>
                {serverStatus.fallbackMode ? '⚠️ Fallback (JSON)' : '🟢 Connected (MongoDB)'}
              </span>
            </div>
            <button onClick={loadDashboardData} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex'
            }} title="Refresh Data">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2rem',
          gap: '0.5rem'
        }}>
          <button 
            onClick={() => { setActiveTab('projects'); setError(''); }}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'projects' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'projects' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <Folder size={16} />
            <span>Projects ({projects.length})</span>
          </button>
          <button 
            onClick={() => { setActiveTab('skills'); setError(''); }}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'skills' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'skills' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <Cpu size={16} />
            <span>Skills ({skills.length})</span>
          </button>
          <button 
            onClick={() => { setActiveTab('messages'); setError(''); }}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'messages' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'messages' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <Mail size={16} />
            <span>Messages ({messages.length})</span>
          </button>
        </div>

        {/* Tab Content panels */}
        {activeTab === 'projects' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem'
          }} className="dashboard-grid">
            
            {/* Project Form */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} className="text-gradient" />
                <span>{editingProjectId ? 'Edit Project Details' : 'Add New Portfolio Project'}</span>
              </h3>
              
              <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="admin-form-grid">
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="glass-label">Project Title *</label>
                  <input 
                    type="text" 
                    value={projectForm.title}
                    onChange={(e)=>setProjectForm({...projectForm, title: e.target.value})}
                    placeholder="E.g., Crypto Trader App"
                    required 
                    className="glass-input" 
                  />
                </div>
                
                <div>
                  <label className="glass-label">Category *</label>
                  <select 
                    value={projectForm.category}
                    onChange={(e)=>setProjectForm({...projectForm, category: e.target.value})}
                    className="glass-input"
                    style={{ background: '#0a0c16' }}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="glass-label">Tech Stack Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    value={projectForm.tags}
                    onChange={(e)=>setProjectForm({...projectForm, tags: e.target.value})}
                    placeholder="React, Node.js, Express, ChartJS"
                    className="glass-input" 
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="glass-label">Image URL</label>
                  <input 
                    type="text" 
                    value={projectForm.imageUrl}
                    onChange={(e)=>setProjectForm({...projectForm, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="glass-input" 
                  />
                </div>

                <div>
                  <label className="glass-label">GitHub Source Code URL</label>
                  <input 
                    type="text" 
                    value={projectForm.githubUrl}
                    onChange={(e)=>setProjectForm({...projectForm, githubUrl: e.target.value})}
                    placeholder="https://github.com/username/project"
                    className="glass-input" 
                  />
                </div>

                <div>
                  <label className="glass-label">Live Site URL</label>
                  <input 
                    type="text" 
                    value={projectForm.liveUrl}
                    onChange={(e)=>setProjectForm({...projectForm, liveUrl: e.target.value})}
                    placeholder="https://myproject.vercel.app"
                    className="glass-input" 
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="glass-label">Project Description *</label>
                  <textarea 
                    value={projectForm.description}
                    onChange={(e)=>setProjectForm({...projectForm, description: e.target.value})}
                    rows="4"
                    placeholder="Describe what the project does, key features, challenges solved, architecture, and technology specs..."
                    required
                    className="glass-input"
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => setProjectForm({...projectForm, featured: !projectForm.featured})}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', padding: 0 }}
                  >
                    {projectForm.featured ? <CheckSquare size={20} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
                  </button>
                  <label onClick={() => setProjectForm({...projectForm, featured: !projectForm.featured})} style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                    Promote as "Featured Project" (Will receive highlighted borders)
                  </label>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {editingProjectId ? 'Save Changes' : 'Create Project'}
                  </button>
                  {editingProjectId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({ title: '', description: '', category: 'Fullstack', tags: '', imageUrl: '', githubUrl: '', liveUrl: '', featured: false });
                      }}
                      className="btn-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Project List */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
                Existing Projects List
              </h3>
              
              {projects.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No projects registered yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {projects.map((proj) => (
                    <div 
                      key={proj._id} 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '1rem',
                        gap: '1rem'
                      }}
                      className="list-item-responsive"
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600 }}>{proj.title}</span>
                          <span style={{
                            fontSize: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            color: 'var(--accent-cyan)'
                          }}>{proj.category}</span>
                          {proj.featured && <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>[★ Featured]</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Tags: {proj.tags.join(', ')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => editProject(proj)} 
                          className="btn-secondary" 
                          style={{ padding: '0.5rem', borderRadius: '6px' }}
                          title="Edit Project"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => deleteProject(proj._id)} 
                          className="btn-primary" 
                          style={{ padding: '0.5rem', borderRadius: '6px', background: '#e63946', boxShadow: 'none' }}
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Skills */}
        {activeTab === 'skills' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem'
          }} className="dashboard-grid">
            
            {/* Skill Form */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
                {editingSkillId ? 'Edit Skill Level' : 'Add New Skill Entry'}
              </h3>
              
              <form onSubmit={handleSkillSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div style={{ flex: '2 1 250px' }}>
                  <label className="glass-label">Skill Name *</label>
                  <input 
                    type="text" 
                    value={skillForm.name}
                    onChange={(e)=>setSkillForm({...skillForm, name: e.target.value})}
                    placeholder="E.g., Docker, Python, TypeScript"
                    required 
                    className="glass-input" 
                  />
                </div>

                <div style={{ flex: '1 1 150px' }}>
                  <label className="glass-label">Category *</label>
                  <select 
                    value={skillForm.category}
                    onChange={(e)=>setSkillForm({...skillForm, category: e.target.value})}
                    className="glass-input"
                    style={{ background: '#0a0c16' }}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ flex: '1 1 120px' }}>
                  <label className="glass-label">Proficiency (%) *</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={skillForm.percentage}
                    onChange={(e)=>setSkillForm({...skillForm, percentage: parseInt(e.target.value) || 0})}
                    required 
                    className="glass-input" 
                  />
                </div>

                <div style={{ flex: '1 1 100%', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                    {editingSkillId ? 'Save Changes' : 'Register Skill'}
                  </button>
                  {editingSkillId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingSkillId(null);
                        setSkillForm({ name: '', category: 'Frontend', percentage: 80 });
                      }}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Skill list */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
                Skills Roster
              </h3>

              {skills.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No skills registered yet.</p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem'
                }}>
                  {skills.map((sk) => (
                    <div 
                      key={sk._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{sk.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {sk.category} • {sk.percentage}%
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          onClick={() => editSkill(sk)} 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem', borderRadius: '4px' }}
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => deleteSkill(sk._id)} 
                          className="btn-primary" 
                          style={{ padding: '0.4rem', borderRadius: '4px', background: '#e63946', boxShadow: 'none' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Messages */}
        {activeTab === 'messages' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
              Received Inquiries Inbox
            </h3>

            {messages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Inbox is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.map((msg) => (
                  <div 
                    key={msg._id} 
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      background: msg.readStatus ? 'rgba(255,255,255,0.01)' : 'rgba(0, 240, 255, 0.02)',
                      borderLeft: msg.readStatus ? '1px solid rgba(255, 255, 255, 0.05)' : '3px solid var(--accent-cyan)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {/* Message Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }} className="message-header">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {msg.subject}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          From: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{msg.name}</span> ({msg.email})
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(msg.date).toLocaleDateString()} at {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        
                        {/* Toggle Read */}
                        <button 
                          onClick={() => toggleMessageRead(msg._id, msg.readStatus)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', padding: 0 }}
                          title={msg.readStatus ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {msg.readStatus ? <CheckSquare size={18} /> : <Square size={18} style={{ color: 'var(--text-muted)' }} />}
                        </button>

                        {/* Delete message */}
                        <button 
                          onClick={() => deleteMessage(msg._id)}
                          style={{ background: 'none', border: 'none', color: '#e63946', cursor: 'pointer', display: 'flex', padding: 0 }}
                          title="Delete message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '0.925rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-line'
                    }}>
                      {msg.message}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Styles for responsiveness inside Dashboard */}
      <style>{`
        @media (min-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
          .admin-form-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .list-item-responsive {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .list-item-responsive > div:last-child {
            width: 100%;
            justify-content: flex-end;
          }
          .dashboard-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .dashboard-header > div:last-child {
            margin-left: 0 !important;
            width: 100%;
          }
          .message-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
