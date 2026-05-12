'use client';

import React, { useState, useEffect, useCallback} from 'react';


interface Revenue {
  _id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  client: string;
  project: string;
  status: string;
  date: string;
  notes: string;
}

const categories = ['freelance', 'saas', 'course', 'consulting', 'other'];
const statusColors: Record<string, string> = {
  received: 'var(--green)',
  pending: '#F0B429',
  overdue: '#ef4444',
};
const categoryColors: Record<string, string> = {
  freelance: 'var(--blue)',
  saas: '#9945FF',
  course: 'var(--green)',
  consulting: '#F0B429',
  other: 'var(--text3)',
};

export default function RevenueManager() {
  const [entries, setEntries] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', amount: 0, currency: 'USD',
    category: 'freelance', client: '', project: '',
    status: 'pending', date: new Date().toISOString().split('T')[0], notes: '',
  });

  const fetchEntries = useCallback (async () => {
    setLoading(true);
    const res = await fetch('/api/revenue');
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { 
    const loadEntries = async () => { await fetchEntries(); };
    loadEntries();
 }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/revenue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({
      title: '', amount: 0, currency: 'USD',
      category: 'freelance', client: '', project: '',
      status: 'pending', date: new Date().toISOString().split('T')[0], notes: '',
    });
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await fetch(`/api/revenue/${id}`, { method: 'DELETE' });
    fetchEntries();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/revenue/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchEntries();
  };

  const totalReceived = entries.filter(e => e.status === 'received').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = entries.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const totalOverdue = entries.filter(e => e.status === 'overdue').reduce((sum, e) => sum + e.amount, 0);

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
      {/* Revenue summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Received', value: totalReceived, color: 'var(--green)', icon: '✅' },
          { label: 'Pending', value: totalPending, color: '#F0B429', icon: '⏳' },
          { label: 'Overdue', value: totalOverdue, color: '#ef4444', icon: '⚠️' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{card.icon}</span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '0.6rem',
                color: card.color, background: `${card.color}15`,
                padding: '3px 8px', borderRadius: '4px',
                textTransform: 'uppercase',
              }}>LIVE</span>
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '1.8rem',
              fontWeight: 700, color: card.color,
            }}>
              ${card.value.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: '4px' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
          {entries.length} entries · Lifetime: ${(totalReceived + totalPending).toLocaleString()}
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + Add Entry
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
            width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>New Revenue Entry</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title} placeholder="Website redesign, Course sale..."
                  onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Amount *</label>
                  <input type="number" min={0} style={inputStyle} value={form.amount}
                    onChange={e => setForm({ ...form, amount: Number(e.target.value) })} required />
                </div>
                <div>
                  <label style={labelStyle}>Currency</label>
                  <select style={inputStyle} value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    {['USD', 'GHS', 'EUR', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Client</label>
                  <input style={inputStyle} value={form.client}
                    onChange={e => setForm({ ...form, client: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Project</label>
                  <input style={inputStyle} value={form.project}
                    onChange={e => setForm({ ...form, project: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {['pending', 'received', 'overdue'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" style={inputStyle} value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--green)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Add Entry
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 20px', background: 'var(--bg3)', color: 'var(--text2)', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Loading entries...</div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          No revenue entries yet. Add your first payment.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.map(entry => (
            <div key={entry._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = statusColors[entry.status]}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    padding: '2px 8px', borderRadius: '4px',
                    color: categoryColors[entry.category],
                    background: `${categoryColors[entry.category]}15`,
                    textTransform: 'uppercase',
                  }}>
                    {entry.category}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{entry.title}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
                  {entry.client && `Client: ${entry.client}`}
                  {entry.client && entry.project && ' · '}
                  {entry.project && `Project: ${entry.project}`}
                  {entry.date && ` · ${new Date(entry.date).toLocaleDateString()}`}
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--mono)', fontSize: '1.2rem',
                fontWeight: 700, color: statusColors[entry.status],
                minWidth: '100px', textAlign: 'right',
              }}>
                {entry.currency} {entry.amount.toLocaleString()}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  value={entry.status}
                  onChange={e => updateStatus(entry._id, e.target.value)}
                  style={{
                    padding: '5px 10px', borderRadius: '6px',
                    background: `${statusColors[entry.status]}15`,
                    border: `1px solid ${statusColors[entry.status]}30`,
                    color: statusColors[entry.status],
                    fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    textTransform: 'uppercase', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button onClick={() => handleDelete(entry._id)} style={{
                  padding: '6px 12px', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px',
                  color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--sans)',
                }}>
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
