'use client';

import { useState, useEffect, useCallback } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  registrationLink: string;
  prize: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  status: string;
}

const eventTypes = ['hackathon', 'contest', 'workshop', 'live', 'community', 'competition'];

const typeColors: Record<string, string> = {
  hackathon: '#9945FF',
  contest: 'var(--blue)',
  workshop: 'var(--green)',
  live: '#ef4444',
  community: '#F0B429',
  competition: 'var(--green)',
};

const typeEmojis: Record<string, string> = {
  hackathon: '🏆',
  contest: '🥇',
  workshop: '🛠️',
  live: '🔴',
  community: '👥',
  competition: '⚡',
};

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', type: 'hackathon',
    coverImage: '', startDate: '', endDate: '',
    location: '', isOnline: true, registrationLink: '',
    prize: '', tags: '', published: false, featured: false,
    status: 'upcoming',
  });

  const fetchEvents = useCallback(async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      await fetchEvents();
    };
    void loadEvents();
  }, [fetchEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/events/${editing._id}` : '/api/events';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setEditing(event);
    setForm({
      title: event.title, description: event.description,
      type: event.type, coverImage: event.coverImage,
      startDate: event.startDate?.split('T')[0] || '',
      endDate: event.endDate?.split('T')[0] || '',
      location: event.location, isOnline: event.isOnline,
      registrationLink: event.registrationLink, prize: event.prize,
      tags: event.tags.join(', '), published: event.published,
      featured: event.featured, status: event.status,
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    title: '', description: '', type: 'hackathon',
    coverImage: '', startDate: '', endDate: '',
    location: '', isOnline: true, registrationLink: '',
    prize: '', tags: '', published: false, featured: false,
    status: 'upcoming',
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

  const statusColors: Record<string, string> = {
    upcoming: 'var(--blue)',
    ongoing: 'var(--green)',
    ended: 'var(--text3)',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
          {events.length} events · {events.filter(e => e.published).length} published
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + Add Event
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
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Event' : 'New Event'}</h2>
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
                  <label style={labelStyle}>Type *</label>
                  <select style={inputStyle} value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}>
                    {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
                <label style={labelStyle}>Cover Image URL</label>
                <input style={inputStyle} value={form.coverImage} placeholder="https://..."
                  onChange={e => setForm({ ...form, coverImage: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Start Date *</label>
                  <input type="date" style={inputStyle} value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>End Date *</label>
                  <input type="date" style={inputStyle} value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={form.location} placeholder="Accra, Ghana or Online"
                    onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Prize / Reward</label>
                  <input style={inputStyle} value={form.prize} placeholder="$1000, Certificate..."
                    onChange={e => setForm({ ...form, prize: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Registration Link</label>
                <input style={inputStyle} value={form.registrationLink} placeholder="https://..."
                  onChange={e => setForm({ ...form, registrationLink: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input style={inputStyle} value={form.tags} placeholder="React, Docker, Design"
                  onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}>
                    {['upcoming', 'ongoing', 'ended'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isOnline}
                    onChange={e => setForm({ ...form, isOnline: e.target.checked })} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Online event</span>
                </label>
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
                  flex: 1, padding: '12px', background: 'var(--green)',
                  color: '#000', fontWeight: 700, borderRadius: '8px',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>
                  {editing ? 'Update Event' : 'Create Event'}
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

      {/* Events list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)',
        }}>
          No events yet. Create your first event.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {events.map(event => (
            <div key={event._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = typeColors[event.type] || 'var(--border-green)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            >
              {/* Icon */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: `${typeColors[event.type]}15`,
                border: `1px solid ${typeColors[event.type]}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', flexShrink: 0,
              }}>
                {typeEmojis[event.type] || '📅'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    color: typeColors[event.type],
                    background: `${typeColors[event.type]}15`,
                    padding: '2px 8px', borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}>
                    {event.type}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{event.title}</span>
                  {event.featured && (
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: '0.6rem',
                      color: '#F0B429', background: 'rgba(240,180,41,0.1)',
                      padding: '2px 8px', borderRadius: '4px',
                    }}>FEATURED</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
                  {new Date(event.startDate).toLocaleDateString()} →{' '}
                  {new Date(event.endDate).toLocaleDateString()}
                  {event.location && ` · ${event.location}`}
                  {event.prize && ` · Prize: ${event.prize}`}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.6rem',
                  padding: '3px 8px', borderRadius: '4px',
                  color: statusColors[event.status],
                  background: `${statusColors[event.status]}15`,
                  border: `1px solid ${statusColors[event.status]}30`,
                  textTransform: 'uppercase',
                }}>
                  {event.status}
                </span>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.6rem',
                  padding: '3px 8px', borderRadius: '4px',
                  background: event.published ? 'var(--green-dim)' : 'var(--bg3)',
                  color: event.published ? 'var(--green)' : 'var(--text3)',
                  border: `1px solid ${event.published ? 'var(--border-green)' : 'var(--border)'}`,
                }}>
                  {event.published ? 'LIVE' : 'DRAFT'}
                </span>
                <button onClick={() => handleEdit(event)} style={{
                  padding: '7px 14px', background: 'var(--bg3)',
                  border: '1px solid var(--border)', borderRadius: '6px',
                  color: 'var(--text2)', cursor: 'pointer',
                  fontSize: '0.82rem', fontFamily: 'var(--sans)',
                }}>Edit</button>
                <button onClick={() => handleDelete(event._id)} style={{
                  padding: '7px 14px', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px',
                  color: '#ef4444', cursor: 'pointer',
                  fontSize: '0.82rem', fontFamily: 'var(--sans)',
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
