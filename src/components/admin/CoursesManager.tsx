'use client';

import { useState, useEffect, useCallback } from 'react';

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  link: string;
  techStack: string[];
  description: string;
  duration: string;
  level: string;
  published: boolean;
  tags: string[];
}

export default function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({
    title: '', thumbnail: '', price: 0, link: '',
    techStack: '', description: '', duration: '',
    level: 'Beginner', published: false, tags: '',
  });

  const fetchCourses = useCallback (async () => {
    setLoading(true);
    const res = await fetch('/api/courses');
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadCourses = async () => { await fetchCourses(); };
    loadCourses();
  }, [fetchCourses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/courses/${editing._id}` : '/api/courses';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    fetchCourses();
  };

  const handleEdit = (course: Course) => {
    setEditing(course);
    setForm({
      title: course.title, thumbnail: course.thumbnail,
      price: course.price, link: course.link,
      techStack: course.techStack.join(', '),
      description: course.description, duration: course.duration,
      level: course.level, published: course.published,
      tags: course.tags.join(', '),
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    title: '', thumbnail: '', price: 0, link: '',
    techStack: '', description: '', duration: '',
    level: 'Beginner', published: false, tags: '',
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

  const levelColors: Record<string, string> = {
    Beginner: 'var(--green)',
    Intermediate: 'var(--blue)',
    Advanced: '#F0B429',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
          {courses.length} courses · {courses.filter(c => c.published).length} published
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} style={{
          padding: '10px 20px', background: 'var(--green)',
          color: '#000', fontWeight: 700, fontSize: '0.88rem',
          borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>
          + Add Course
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
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Thumbnail URL</label>
                  <input style={inputStyle} value={form.thumbnail} placeholder="https://..."
                    onChange={e => setForm({ ...form, thumbnail: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Course Link *</label>
                  <input style={inputStyle} value={form.link} placeholder="https://..."
                    onChange={e => setForm({ ...form, link: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Price ($)</label>
                  <input type="number" min={0} style={inputStyle} value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div>
                  <label style={labelStyle}>Duration</label>
                  <input style={inputStyle} value={form.duration} placeholder="8 hours"
                    onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Level</label>
                  <select style={inputStyle} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Tech Stack (comma separated)</label>
                  <input style={inputStyle} value={form.techStack} placeholder="React, Node.js"
                    onChange={e => setForm({ ...form, techStack: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input style={inputStyle} value={form.tags} placeholder="web, backend"
                    onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Published</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--green)', color: '#000', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  {editing ? 'Update Course' : 'Add Course'}
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
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Loading courses...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          No courses yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {courses.map(course => (
            <div key={course._id} style={{
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
                    color: levelColors[course.level],
                    background: `${levelColors[course.level]}15`,
                    border: `1px solid ${levelColors[course.level]}30`,
                  }}>
                    {course.level.toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 700 }}>{course.title}</span>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.72rem',
                    color: course.price === 0 ? 'var(--green)' : 'var(--text)',
                    fontWeight: 700,
                  }}>
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                  {course.duration} · {course.techStack.join(', ')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.62rem',
                  padding: '3px 8px', borderRadius: '4px',
                  background: course.published ? 'var(--green-dim)' : 'var(--bg3)',
                  color: course.published ? 'var(--green)' : 'var(--text3)',
                  border: `1px solid ${course.published ? 'var(--border-green)' : 'var(--border)'}`,
                }}>
                  {course.published ? 'LIVE' : 'DRAFT'}
                </span>
                <button onClick={() => handleEdit(course)} style={{ padding: '8px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--sans)' }}>Edit</button>
                <button onClick={() => handleDelete(course._id)} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--sans)' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
