'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [systemMessage, setSystemMessage] = useState('');

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrors({});
    setSystemMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        if (typeof data.error === 'object') {
          setErrors(data.error); // Handles Zod validation errors
        } else {
          setSystemMessage(data.error || 'Transmission failure'); // Handles duplicate/DB errors
        }
      }
    } catch (err) {
      console.error("Transmission Error:", err);
      setStatus('error');
      setSystemMessage('Network error: Check connection.');
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%', padding: '12px 16px', background: 'var(--bg3)',
    border: `1px solid ${hasError ? '#ff4444' : 'var(--border)'}`, 
    borderRadius: '8px', color: 'var(--text)',
    fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s',
  });

  const labelStyle = {
    display: 'block', fontFamily: 'var(--mono)', fontSize: '0.65rem',
    color: 'var(--text3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    marginBottom: '6px',
  };

  return (
    <motion.div
      className="contact-section"
      initial="hidden" animate="visible" variants={containerVars}
      style={{ 
        maxWidth: '1200px', width: '100%', margin: '0 auto', 
        padding: '1.5rem 1.5rem', minHeight: '85vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}
    >
      {/* Header */}
      <motion.div variants={itemVars} style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Let&#39;s <span style={{ color: 'var(--green)' }}>Connect</span>
        </h1>
      </motion.div>

      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Info Column */}
        <motion.div variants={itemVars} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-green)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--green)', fontWeight: 600 }}>AVAILABLE FOR COLLAB</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.5 }}>Ready for production-grade projects. Based in Tarkwa, Ghana.</p>
          </div>

          {[
            { label: 'Location', value: 'Tarkwa, Ghana', icon: '📍' },
            { label: 'GitHub', value: 'github.com/Framotech', icon: '🐙' },
            { label: 'Response', value: 'Within 24h', icon: '⚡' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--bg3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{item.icon}</div>
              <div>
                <div style={labelStyle}>{item.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 500 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Form Column */}
        <motion.div className="contact-form-card" variants={itemVars} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', 
            borderRadius: '16px', padding: '2rem', marginTop: '-2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>TERMINAL · STATUS: ACTIVE</span>
            {systemMessage && <span style={{ color: '#ff4444' }}>{systemMessage}</span>}
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontWeight: 800, color: 'var(--green)' }}>TRANSMISSION SUCCESSFUL</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.5rem' }}>I will review your message and respond within 24 hours.</p>
              <button onClick={() => setStatus('idle')} style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input style={inputStyle(!!errors.name)} placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  {errors.name && <p style={{ color: '#ff4444', fontSize: '0.6rem', marginTop: '4px' }}>{errors.name[0]}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" style={inputStyle(!!errors.email)} placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  {errors.email && <p style={{ color: '#ff4444', fontSize: '0.6rem', marginTop: '4px' }}>{errors.email[0]}</p>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <input style={inputStyle(false)} placeholder="Project inquiry..." value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea style={{ ...inputStyle(!!errors.message), minHeight: '120px', resize: 'none' }} placeholder="Tell me about your mission..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                {errors.message && <p style={{ color: '#ff4444', fontSize: '0.6rem', marginTop: '4px' }}>{errors.message[0]}</p>}
              </div>
              
              <button type="submit" disabled={status === 'loading'} style={{
                padding: '12px', 
                background: status === 'error' ? '#ff4444' : (status === 'loading' ? 'var(--bg3)' : 'var(--green)'),
                color: '#000', fontWeight: 800, borderRadius: '8px', border: 'none', 
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem', transition: 'all 0.3s'
              }}>
                {status === 'loading' ? 'TRANSMITTING...' : status === 'error' ? 'RETRY TRANSMISSION' : 'SEND MESSAGE →'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
