'use client';

import { useState, useEffect, useCallback } from 'react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
}

const categories = ['Frontend', 'Backend', 'DevOps', 'Database', 'Blockchain', 'Design', 'Tools'];

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({
    name: '', category: 'Frontend', level: 3, icon: '', order: 0,
  });

  const fetchSkills = useCallback  (async () => {
    setLoading(true);
    const res = await fetch('/api/skills');
    const data = await res.json();
    setSkills(data);
    setLoading(false);
  }, []);

  useEffect(() => { 
    const loadSkills = async () => { await fetchSkills(); };
    loadSkills();
 }, [fetchSkills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/skills/${editing._id}` : '/api/skills';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    fetchSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon, order: skill.order });
    setShowForm(true);
  };

  const resetForm = () => setForm({ name: '', category: 'Frontend', level: 3, icon: '', order: 0 });

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

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
          {skills.length} skills registered
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--sans)',
        }}>
          + Add Skill
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '480px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Skill' : 'New Skill'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Icon (emoji)</label>
                  <input style={inputStyle} value={form.icon} placeholder="⚛️" onChange={e => setForm({ ...form, icon: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Level (1-5)</label>
                  <input type="number" min={1} max={5} style={inputStyle} value={form.level} onChange={e => setForm({ ...form, level: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Order</label>
                <input type="number" style={inputStyle} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--green)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  {editing ? 'Update Skill' : 'Add Skill'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 20px', background: 'var(--bg3)', color: 'var(--text2)', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skills by category */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Loading skills...</div>
      ) : skills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          No skills yet. Click &quot;Add Skill&quot; to get started.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {categories.filter(cat => grouped[cat]?.length > 0).map(cat => (
            <div key={cat}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
                {cat} ({grouped[cat].length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {grouped[cat].map(skill => (
                  <div key={skill._id} style={{
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: '10px', padding: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{skill.icon || '🔧'}</span>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{skill.name}</div>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '3px' }}>
                          {[1,2,3,4,5].map(i => (
                            <div key={i} style={{
                              width: '8px', height: '3px', borderRadius: '2px',
                              background: i <= skill.level ? 'var(--green)' : 'var(--bg3)',
                            }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button onClick={() => handleEdit(skill)} style={{ padding: '4px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--sans)' }}>Edit</button>
                      <button onClick={() => handleDelete(skill._id)} style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--sans)' }}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
