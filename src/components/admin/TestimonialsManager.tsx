'use client';

import { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  message: string;
  approved: boolean;
  featured: boolean;
}

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', role: '', company: '',
    rating: 5, message: '', approved: false, featured: false,
  });

  

  const fetchItems = useCallback (async () => {
    setLoading(true);
    const res = await fetch('/api/testimonials');
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
    await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: '', role: '', company: '', rating: 5, message: '', approved: false, featured: false });
    fetchItems();
  };

  const toggleApprove = async (id: string, approved: boolean) => {
    await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !approved }),
    });
    fetchItems();
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !featured }),
    });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    fetchItems();
  };

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
          {items.filter(i => !i.approved).length} pending approval
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + Add Testimonial
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
            width: '100%', maxWidth: '500px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Testimonial</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Role *</label>
                  <input style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input style={inputStyle} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Rating (1-5)</label>
                  <input type="number" min={1} max={5} style={inputStyle} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.approved} onChange={e => setForm({ ...form, approved: e.target.checked })} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Approved</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Featured</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--green)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Add Testimonial
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
          No testimonials yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => (
            <div key={item._id} style={{
              background: 'var(--bg2)', border: `1px solid ${item.approved ? 'var(--border-green)' : 'var(--border)'}`,
              borderRadius: '12px', padding: '1.25rem',
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{item.role} {item.company && `@ ${item.company}`}</div>
                  <div style={{ color: '#F0B429' }}>{'★'.repeat(item.rating)}</div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{item.message}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => toggleApprove(item._id, item.approved)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: item.approved ? 'var(--green-dim)' : 'var(--bg3)',
                  color: item.approved ? 'var(--green)' : 'var(--text2)',
                  fontSize: '0.75rem', fontFamily: 'var(--sans)',
                }}>
                  {item.approved ? '✓ Approved' : 'Approve'}
                </button>
                <button onClick={() => toggleFeatured(item._id, item.featured)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer',
                  background: item.featured ? 'rgba(249,196,0,0.1)' : 'var(--bg3)',
                  color: item.featured ? '#F0B429' : 'var(--text2)',
                  fontSize: '0.75rem', fontFamily: 'var(--sans)',
                }}>
                  {item.featured ? '★ Featured' : 'Feature'}
                </button>
                <button onClick={() => handleDelete(item._id)} style={{
                  padding: '6px 12px', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px',
                  color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--sans)',
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
