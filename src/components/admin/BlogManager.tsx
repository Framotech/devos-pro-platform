'use client';

import { useState, useEffect, useCallback } from 'react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  body: string;
  coverImage: string;
  category: string;
  externalLink: string;
  published: boolean;
  tags: string[];
  readTime: number;
}

const categories = ['Blog', 'Article', 'Event', 'Hackathon'];

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', body: '', coverImage: '',
    category: 'Blog', externalLink: '',
    published: false, tags: '', readTime: 5,
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadPosts = async () => { await fetchPosts(); };
    loadPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/posts/${editing._id}` : '/api/posts';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title, slug: post.slug, body: post.body,
      coverImage: post.coverImage, category: post.category,
      externalLink: post.externalLink, published: post.published,
      tags: post.tags.join(', '), readTime: post.readTime,
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    title: '', slug: '', body: '', coverImage: '',
    category: 'Blog', externalLink: '',
    published: false, tags: '', readTime: 5,
  });

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

  const categoryColors: Record<string, string> = {
    Blog: 'var(--green)',
    Article: 'var(--blue)',
    Event: '#F0B429',
    Hackathon: '#9945FF',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
          {posts.length} posts · {posts.filter(p => p.published).length} published
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + New Post
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
            width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
                  required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Slug *</label>
                  <input style={inputStyle} value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Cover Image URL</label>
                <input style={inputStyle} value={form.coverImage} placeholder="https://..."
                  onChange={e => setForm({ ...form, coverImage: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Body (Markdown supported)</label>
                <textarea style={{ ...inputStyle, minHeight: '180px', resize: 'vertical', fontFamily: 'var(--mono)', fontSize: '0.82rem' }}
                  value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input style={inputStyle} value={form.tags} placeholder="Next.js, Docker, DevOps"
                    onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Read Time (minutes)</label>
                  <input type="number" style={inputStyle} value={form.readTime}
                    onChange={e => setForm({ ...form, readTime: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>External Link (optional)</label>
                <input style={inputStyle} value={form.externalLink} placeholder="https://..."
                  onChange={e => setForm({ ...form, externalLink: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Published</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--green)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  {editing ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 20px', background: 'var(--bg3)', color: 'var(--text2)', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          No posts yet. Click &quot;New Post&quot; to write your first one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {posts.map(post => (
            <div key={post._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    padding: '2px 8px', borderRadius: '4px',
                    color: categoryColors[post.category] || 'var(--green)',
                    background: `${categoryColors[post.category] || 'var(--green)'}15`,
                    border: `1px solid ${categoryColors[post.category] || 'var(--green)'}30`,
                  }}>
                    {post.category.toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{post.title}</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text3)' }}>
                  /{post.slug} · {post.readTime} min read
                </div>
                {post.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '6px' }}>
                    {post.tags.slice(0, 4).map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'var(--mono)', fontSize: '0.58rem',
                        padding: '2px 6px', background: 'var(--bg3)',
                        border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text3)',
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.62rem',
                  padding: '3px 8px', borderRadius: '4px',
                  background: post.published ? 'var(--green-dim)' : 'var(--bg3)',
                  color: post.published ? 'var(--green)' : 'var(--text3)',
                  border: `1px solid ${post.published ? 'var(--border-green)' : 'var(--border)'}`,
                }}>
                  {post.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
                <button onClick={() => handleEdit(post)} style={{ padding: '8px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--sans)' }}>Edit</button>
                <button onClick={() => handleDelete(post._id)} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--sans)' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
