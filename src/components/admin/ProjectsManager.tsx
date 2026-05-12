'use client';

import { useState, useEffect, useCallback } from 'react';

interface Project {
  _id: string;
  name: string;
  slug?: string;
  image: string;
  description: string;
  techStack: string[];
  status: string;
  port: string;
  published: boolean;
  featured: boolean;
  githubLink: string;
  liveLink: string;
  order: number;

}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    name: '', slug: '', image: '', description: '',
    githubLink: '', liveLink: '', techStack: '',
    status: 'running', port: ':3000',
    published: false, featured: false, order: 0,
  });

  const fetchProjects = useCallback (async () => {
    setLoading(true);
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => { 
    const loadProjects = async() => {await fetchProjects(); };
    loadProjects();
 }, [fetchProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
    };
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/projects/${editing._id}` : '/api/projects';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm({
      name: project.name,
      slug: project.slug || '',
      image: project.image || '',
      description: project.description,
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      techStack: project.techStack.join(', '),
      status: project.status,
      port: project.port,
      published: project.published,
      featured: project.featured,
      order: project.order || 0,
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    name: '', slug: '', image: '', description: '',
    githubLink: '', liveLink: '', techStack: '',
    status: 'running', port: ':3000',
    published: false, featured: false, order: 0,
  });

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)',
    fontSize: '0.88rem', fontFamily: 'var(--sans)', outline: 'none',
  };

  const labelStyle = {
    display: 'block' as const,
    fontFamily: 'var(--mono)', fontSize: '0.62rem',
    color: 'var(--text3)', textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', marginBottom: '6px',
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.72rem',
          color: 'var(--text3)',
        }}>
          {projects.length} containers registered
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--sans)',
        }}>
          + New Project
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '600px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1.5rem',
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {editing ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background: 'none', border: 'none',
                color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer',
              }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Slug *</label>
                  <input style={inputStyle} value={form.slug} placeholder="my-project"
                    onChange={e => setForm({ ...form, slug: e.target.value })} required />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Image URL</label>
                <input style={inputStyle} value={form.image} placeholder="https://..."
                  onChange={e => setForm({ ...form, image: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div>
                <label style={labelStyle}>Tech Stack (comma separated)</label>
                <input style={inputStyle} value={form.techStack} placeholder="Next.js, MongoDB, Docker"
                  onChange={e => setForm({ ...form, techStack: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>GitHub Link</label>
                  <input style={inputStyle} value={form.githubLink}
                    onChange={e => setForm({ ...form, githubLink: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Live Link</label>
                  <input style={inputStyle} value={form.liveLink}
                    onChange={e => setForm({ ...form, liveLink: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="running">Running</option>
                    <option value="exited">Exited</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Port</label>
                  <input style={inputStyle} value={form.port}
                    onChange={e => setForm({ ...form, port: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Order</label>
                  <input type="number" style={inputStyle} value={form.order}
                    onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Published</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Featured</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{
                  flex: 1, padding: '12px',
                  background: 'var(--green)', color: '#000',
                  fontWeight: 700, borderRadius: '8px',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>
                  {editing ? 'Update Project' : 'Create Project'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding: '12px 20px',
                  background: 'var(--bg3)', color: 'var(--text2)',
                  borderRadius: '8px', border: '1px solid var(--border)',
                  cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects table */}
      {loading ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          fontFamily: 'var(--mono)', color: 'var(--text3)',
        }}>
          Loading containers...
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '12px', color: 'var(--text3)',
          fontFamily: 'var(--mono)',
        }}>
          No projects yet. Click &quot;New Project&quot; to add one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {projects.map(project => (
            <div key={project._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '1rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                {/* Status dot */}
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: project.status === 'running' ? 'var(--green)' : 'var(--text3)',
                  boxShadow: project.status === 'running' ? '0 0 6px var(--green)' : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '6px' }}>
                    {project.description.slice(0, 80)}...
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {project.techStack.slice(0, 4).map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'var(--mono)', fontSize: '0.58rem',
                        padding: '2px 6px', background: 'var(--bg3)',
                        border: '1px solid var(--border)', borderRadius: '4px',
                        color: 'var(--text3)', textTransform: 'uppercase',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.62rem',
                  padding: '3px 8px', borderRadius: '4px',
                  background: project.published ? 'var(--green-dim)' : 'var(--bg3)',
                  color: project.published ? 'var(--green)' : 'var(--text3)',
                  border: `1px solid ${project.published ? 'var(--border-green)' : 'var(--border)'}`,
                }}>
                  {project.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
                {project.featured && (
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    padding: '3px 8px', borderRadius: '4px',
                    background: 'rgba(249,196,0,0.1)',
                    color: '#F0B429', border: '1px solid rgba(249,196,0,0.2)',
                  }}>
                    FEATURED
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(project)} style={{
                  padding: '8px 16px', background: 'var(--bg3)',
                  border: '1px solid var(--border)', borderRadius: '6px',
                  color: 'var(--text2)', cursor: 'pointer', fontSize: '0.82rem',
                  fontFamily: 'var(--sans)', transition: 'all 0.2s',
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(project._id)} style={{
                  padding: '8px 16px', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px',
                  color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem',
                  fontFamily: 'var(--sans)', transition: 'all 0.2s',
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
