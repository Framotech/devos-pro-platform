'use client';

import { useState, useEffect, useCallback } from 'react';

interface Experience {
  _id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  technologies: string[];
  current: boolean;
  order: number;
}

export default function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({
    role: '', company: '', location: '',
    startDate: '', endDate: 'Present',
    highlights: '', technologies: '', current: false, order: 0,
  });

  const fetchItems = useCallback( async () => {
    setLoading(true);
    const res = await fetch('/api/experience');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { 
    const loadItems = async () => { await fetchItems(); };
    loadItems();
  }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      highlights: form.highlights.split('\n').filter(Boolean),
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
    };
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/experience/${editing._id}` : '/api/experience';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const handleEdit = (item: Experience) => {
    setEditing(item);
    setForm({
      role: item.role, company: item.company,
      location: item.location, startDate: item.startDate,
      endDate: item.endDate, highlights: item.highlights.join('\n'),
      technologies: (item.technologies || []).join(', '),
      current: item.current, order: item.order,
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    role: '', company: '', location: '',
    startDate: '', endDate: 'Present',
    highlights: '', technologies: '', current: false, order: 0,
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
          {items.length} experience entries
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + Add Experience
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Experience' : 'New Experience'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Role *</label>
                  <input style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Company *</label>
                  <input style={inputStyle} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input style={inputStyle} placeholder="Jan 2024" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input style={inputStyle} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} disabled={form.current} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.current} onChange={e => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Current position</span>
              </label>
              <div>
                <label style={labelStyle}>Highlights (one per line)</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  placeholder="Built X that improved Y by Z..."
                  value={form.highlights}
                  onChange={e => setForm({ ...form, highlights: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Technologies (comma separated)</label>
                <input style={inputStyle} value={form.technologies} placeholder="Next.js, Docker, MongoDB"
                  onChange={e => setForm({ ...form, technologies: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--green)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  {editing ? 'Update' : 'Add Experience'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 20px', background: 'var(--bg3)', color: 'var(--text2)', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          No experience entries yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(item => (
            <div key={item._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.5rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.role}</div>
                    {item.current && (
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: '0.6rem',
                        padding: '2px 8px', borderRadius: '4px',
                        background: 'var(--green-dim)', color: 'var(--green)',
                        border: '1px solid var(--border-green)',
                      }}>CURRENT</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text2)', marginBottom: '4px' }}>
                    {item.company} {item.location && `· ${item.location}`}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--text3)' }}>
                    {item.startDate} — {item.endDate}
                  </div>
                  {item.highlights.length > 0 && (
                    <ul style={{ marginTop: '0.75rem', paddingLeft: '1rem' }}>
                      {item.highlights.map((h, i) => (
                        <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '2px' }}>{h}</li>
                      ))}
                    </ul>
                  )}
                  {item.technologies?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {item.technologies.map(tech => (
                        <span key={tech} style={{
                          fontFamily: 'var(--mono)', fontSize: '0.6rem',
                          padding: '3px 8px', background: 'var(--bg3)',
                          border: '1px solid var(--border)', borderRadius: '4px',
                          color: 'var(--text2)', textTransform: 'uppercase',
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button onClick={() => handleEdit(item)} style={{ padding: '8px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--sans)' }}>Edit</button>
                  <button onClick={() => handleDelete(item._id)} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--sans)' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
