'use client';

import { useState, useEffect, useCallback } from 'react';


interface StudioItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  coverImage: string;
  images: string[];
  figmaLink: string;
  behanceLink: string;
  dribbbleLink: string;
  liveLink: string;
  published: boolean;
  featured: boolean;
  order: number;
}

const categories = ['UI Design', 'Web Graphics', 'Branding', 'Motion'];

const categoryColors: Record<string, string> = {
  'UI Design': 'var(--blue)',
  'Web Graphics': 'var(--green)',
  'Branding': '#9945FF',
  'Motion': '#F0B429',
};

export default function StudioManager() {
  const [items, setItems] = useState<StudioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StudioItem | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', category: 'UI Design',
    tools: '', coverImage: '', images: '',
    figmaLink: '', behanceLink: '', dribbbleLink: '', liveLink: '',
    published: false, featured: false, order: 0,
  });

  

  const fetchItems = useCallback (async () => {
    setLoading(true);
    const res = await fetch('/api/studio');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
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
      tools: form.tools.split(',').map(t => t.trim()).filter(Boolean),
      images: form.images.split('\n').map(i => i.trim()).filter(Boolean),
    };
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/studio/${editing._id}` : '/api/studio';
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
    if (!confirm('Delete this piece?')) return;
    await fetch(`/api/studio/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const handleEdit = (item: StudioItem) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description,
      category: item.category, tools: item.tools.join(', '),
      coverImage: item.coverImage, images: item.images.join('\n'),
      figmaLink: item.figmaLink, behanceLink: item.behanceLink,
      dribbbleLink: item.dribbbleLink, liveLink: item.liveLink,
      published: item.published, featured: item.featured, order: item.order,
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    title: '', description: '', category: 'UI Design',
    tools: '', coverImage: '', images: '',
    figmaLink: '', behanceLink: '', dribbbleLink: '', liveLink: '',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
          {items.length} pieces · {items.filter(i => i.published).length} published
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + Add Design Work
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
            width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {editing ? 'Edit Design Work' : 'New Design Work'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select style={inputStyle} value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>Tools Used (comma separated)</label>
                <input style={inputStyle} value={form.tools}
                  placeholder="Figma, Illustrator, Photoshop"
                  onChange={e => setForm({ ...form, tools: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>Cover Image URL</label>
                <input style={inputStyle} value={form.coverImage}
                  placeholder="https://..."
                  onChange={e => setForm({ ...form, coverImage: e.target.value })} />
                {form.coverImage && (
                  <img src={form.coverImage} alt="preview"
                    style={{ width: '100%', borderRadius: '8px', marginTop: '8px', border: '1px solid var(--border)' }}
                    onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </div>

              <div>
                <label style={labelStyle}>Additional Images (one URL per line)</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}
                  value={form.images} placeholder="https://image1.jpg&#10;https://image2.jpg"
                  onChange={e => setForm({ ...form, images: e.target.value })} />
              </div>

              {/* Links */}
              <div style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1rem',
              }}>
                <div style={{ ...labelStyle, marginBottom: '1rem' }}>External Links</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Figma</label>
                    <input style={inputStyle} value={form.figmaLink} placeholder="https://figma.com/..."
                      onChange={e => setForm({ ...form, figmaLink: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Behance</label>
                    <input style={inputStyle} value={form.behanceLink} placeholder="https://behance.net/..."
                      onChange={e => setForm({ ...form, behanceLink: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Dribbble</label>
                    <input style={inputStyle} value={form.dribbbleLink} placeholder="https://dribbble.com/..."
                      onChange={e => setForm({ ...form, dribbbleLink: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Live / Demo</label>
                    <input style={inputStyle} value={form.liveLink} placeholder="https://..."
                      onChange={e => setForm({ ...form, liveLink: e.target.value })} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                <div>
                  <label style={labelStyle}>Order</label>
                  <input type="number" style={inputStyle} value={form.order}
                    onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{
                  flex: 1, padding: '12px', background: 'var(--green)',
                  color: '#000', fontWeight: 700, borderRadius: '8px',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>
                  {editing ? 'Update' : 'Add to Studio'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding: '12px 20px', background: 'var(--bg3)',
                  color: 'var(--text2)', borderRadius: '8px',
                  border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
          Loading studio work...
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          No design work yet. Add your first piece.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {items.map(item => (
            <div key={item._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', overflow: 'hidden',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = categoryColors[item.category] || 'var(--border-green)';
                el.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--border)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Cover */}
              <div style={{
                height: '160px', background: 'var(--bg3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2.5rem' }}>🎨</span>
                )}
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  fontFamily: 'var(--mono)', fontSize: '0.6rem',
                  color: categoryColors[item.category],
                  background: 'rgba(0,0,0,0.7)',
                  padding: '3px 8px', borderRadius: '4px',
                  border: `1px solid ${categoryColors[item.category]}30`,
                }}>
                  {item.category.toUpperCase()}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: '0.75rem' }}>
                  {item.tools.slice(0, 3).join(' · ')}
                </div>

                {/* External links */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {item.figmaLink && (
                    <a href={item.figmaLink} target="_blank" rel="noreferrer" style={{
                      fontFamily: 'var(--mono)', fontSize: '0.58rem',
                      padding: '2px 8px', background: 'rgba(36,150,237,0.1)',
                      border: '1px solid rgba(36,150,237,0.2)',
                      borderRadius: '4px', color: 'var(--blue)', textDecoration: 'none',
                    }}>Figma</a>
                  )}
                  {item.behanceLink && (
                    <a href={item.behanceLink} target="_blank" rel="noreferrer" style={{
                      fontFamily: 'var(--mono)', fontSize: '0.58rem',
                      padding: '2px 8px', background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '4px', color: '#6366f1', textDecoration: 'none',
                    }}>Behance</a>
                  )}
                  {item.dribbbleLink && (
                    <a href={item.dribbbleLink} target="_blank" rel="noreferrer" style={{
                      fontFamily: 'var(--mono)', fontSize: '0.58rem',
                      padding: '2px 8px', background: 'rgba(234,76,137,0.1)',
                      border: '1px solid rgba(234,76,137,0.2)',
                      borderRadius: '4px', color: '#ea4c89', textDecoration: 'none',
                    }}>Dribbble</a>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    padding: '2px 8px', borderRadius: '4px',
                    background: item.published ? 'var(--green-dim)' : 'var(--bg3)',
                    color: item.published ? 'var(--green)' : 'var(--text3)',
                    border: `1px solid ${item.published ? 'var(--border-green)' : 'var(--border)'}`,
                  }}>
                    {item.published ? 'LIVE' : 'DRAFT'}
                  </span>
                  <button onClick={() => handleEdit(item)} style={{
                    padding: '4px 10px', background: 'var(--bg3)',
                    border: '1px solid var(--border)', borderRadius: '4px',
                    color: 'var(--text2)', cursor: 'pointer',
                    fontSize: '0.75rem', fontFamily: 'var(--sans)',
                  }}>Edit</button>
                  <button onClick={() => handleDelete(item._id)} style={{
                    padding: '4px 10px', background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px',
                    color: '#ef4444', cursor: 'pointer',
                    fontSize: '0.75rem', fontFamily: 'var(--sans)',
                  }}>Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
