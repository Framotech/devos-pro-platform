'use client';

import { useState, useEffect, useCallback } from 'react';

interface SiteConfigForm {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  avatar: string;
  resume: string;
  github: string;
  twitter: string;
  linkedin: string;
  website: string;
  seoTitle: string;
  seoDesc: string;
  showBlog: boolean;
  showVideos: boolean;
  showCourses: boolean;
  showHireMe: boolean;
}

type SocialKey = 'github' | 'twitter' | 'linkedin' | 'website';
type FeatureKey = 'showBlog' | 'showVideos' | 'showCourses' | 'showHireMe';

const defaultForm: SiteConfigForm = {
  name: '', title: '', bio: '', email: '',
  location: '', availability: 'open',
  avatar: '', resume: '',
  github: '', twitter: '', linkedin: '', website: '',
  seoTitle: '', seoDesc: '',
  showBlog: true, showVideos: true, showCourses: true, showHireMe: true,
};

export default function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<SiteConfigForm>(defaultForm);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/config');
    const data = await res.json();
    if (data && !data.error) setForm(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadConfig = async () => { await fetchConfig(); };
    loadConfig();
  }, [fetchConfig]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

  const sectionTitle = (title: string) => (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: '0.65rem',
      color: 'var(--green)', textTransform: 'uppercase',
      letterSpacing: '0.15em', marginBottom: '1rem',
      paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)',
    }}>
      {title}
    </div>
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
      Loading settings...
    </div>
  );

  const socials: { key: SocialKey; label: string }[] = [
    { key: 'github', label: 'GitHub' },
    { key: 'twitter', label: 'Twitter / X' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'website', label: 'Website' },
  ];

  const features: { key: FeatureKey; label: string }[] = [
    { key: 'showBlog', label: 'Show Blog' },
    { key: 'showVideos', label: 'Show Videos' },
    { key: 'showCourses', label: 'Show Courses' },
    { key: 'showHireMe', label: 'Show Hire Me' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* Identity */}
        <div>
          {sectionTitle('Identity')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input style={inputStyle} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Professional Title</label>
                <input style={inputStyle} value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" style={inputStyle} value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Avatar URL</label>
                <input style={inputStyle} value={form.avatar} placeholder="https://..."
                  onChange={e => setForm({ ...form, avatar: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Resume URL</label>
                <input style={inputStyle} value={form.resume} placeholder="https://..."
                  onChange={e => setForm({ ...form, resume: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Availability</label>
              <select style={inputStyle} value={form.availability}
                onChange={e => setForm({ ...form, availability: e.target.value })}>
                <option value="open">Open to work</option>
                <option value="busy">Busy</option>
                <option value="closed">Not available</option>
              </select>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div>
          {sectionTitle('Social Links')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {socials.map(({ key, label }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div>
          {sectionTitle('SEO')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>SEO Title</label>
              <input style={inputStyle} value={form.seoTitle}
                onChange={e => setForm({ ...form, seoTitle: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>SEO Description</label>
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={form.seoDesc}
                onChange={e => setForm({ ...form, seoDesc: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Feature flags */}
        <div>
          {sectionTitle('Feature Flags')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {features.map(({ key, label }) => (
              <label key={key} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1rem', cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.checked })}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                    {form[key] ? 'Visible on public site' : 'Hidden from public site'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save */}
        <div>
          <button type="submit" disabled={saving} style={{
            padding: '13px 32px',
            background: saved ? 'var(--green-dim)' : 'var(--green)',
            color: saved ? 'var(--green)' : '#000',
            fontWeight: 700, fontSize: '0.95rem',
            borderRadius: '8px',
            border: saved ? '1px solid var(--border-green)' : 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--sans)', transition: 'all 0.3s',
          }}>
            {saving ? 'Saving...' : saved ? '✓ Saved Successfully' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}