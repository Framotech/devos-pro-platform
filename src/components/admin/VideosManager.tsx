'use client';

import { useState, useEffect, useCallback } from 'react';

interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  category: string;
  description: string;
  duration: string;
  isFeatured: boolean;
  published: boolean;
  views: number;
}

export default function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState({
    title: '', youtubeId: '', category: 'Tutorial',
    description: '', duration: '', isFeatured: false, published: false,
  });

 

  const fetchVideos = useCallback (async () => {
    setLoading(true);
    const res = await fetch('/api/videos');
    const data = await res.json();
    setVideos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
      const loadVideos = async () => { await fetchVideos(); };
      loadVideos();
    }, [fetchVideos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/videos/${editing._id}` : '/api/videos';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    fetchVideos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    await fetch(`/api/videos/${id}`, { method: 'DELETE' });
    fetchVideos();
  };

  const handleEdit = (video: Video) => {
    setEditing(video);
    setForm({
      title: video.title, youtubeId: video.youtubeId,
      category: video.category, description: video.description,
      duration: video.duration, isFeatured: video.isFeatured,
      published: video.published,
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    title: '', youtubeId: '', category: 'Tutorial',
    description: '', duration: '', isFeatured: false, published: false,
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
          {videos.length} videos · {videos.filter(v => v.published).length} published
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + Add Video
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
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Video' : 'Add Video'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>YouTube ID *</label>
                  <input style={inputStyle} value={form.youtubeId} placeholder="dQw4w9WgXcQ"
                    onChange={e => setForm({ ...form, youtubeId: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Duration</label>
                  <input style={inputStyle} value={form.duration} placeholder="12:34"
                    onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Tutorial', 'Project', 'Talk', 'Review', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              {/* Preview */}
              {form.youtubeId && (
                <div>
                  <label style={labelStyle}>Thumbnail Preview</label>
                  <img
                    src={`https://img.youtube.com/vi/${form.youtubeId}/mqdefault.jpg`}
                    alt="thumbnail"
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Published</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Featured</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--green)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  {editing ? 'Update Video' : 'Add Video'}
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
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Loading videos...</div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          No videos yet. Add your first YouTube video.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {videos.map(video => (
            <div key={video._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  style={{ width: '100%', display: 'block', opacity: 0.8 }}
                />
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  fontFamily: 'var(--mono)', fontSize: '0.6rem',
                  background: 'rgba(0,0,0,0.8)', color: 'var(--text)',
                  padding: '2px 6px', borderRadius: '4px',
                }}>
                  {video.duration}
                </div>
                {video.isFeatured && (
                  <div style={{
                    position: 'absolute', top: '8px', left: '8px',
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    background: 'var(--green)', color: '#000',
                    padding: '2px 6px', borderRadius: '4px', fontWeight: 700,
                  }}>
                    FEATURED
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>{video.title}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--text3)', marginBottom: '0.75rem' }}>
                  {video.category} · {video.views} views
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    padding: '2px 8px', borderRadius: '4px',
                    background: video.published ? 'var(--green-dim)' : 'var(--bg3)',
                    color: video.published ? 'var(--green)' : 'var(--text3)',
                    border: `1px solid ${video.published ? 'var(--border-green)' : 'var(--border)'}`,
                  }}>
                    {video.published ? 'LIVE' : 'DRAFT'}
                  </span>
                  <button onClick={() => handleEdit(video)} style={{ padding: '3px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--sans)' }}>Edit</button>
                  <button onClick={() => handleDelete(video._id)} style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--sans)' }}>Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
