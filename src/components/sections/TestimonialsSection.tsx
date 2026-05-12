'use client';

import { useState, useEffect, useRef } from 'react';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  message: string;
  avatar: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '', role: '', company: '', rating: 5, message: '',
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/testimonials/approved')
      .then(r => r.json())
      .then(d => {
        setTestimonials(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [testimonials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormStatus('success');
        setForm({ name: '', role: '', company: '', rating: 5, message: '' });
        setTimeout(() => { setFormStatus('idle'); setShowForm(false); }, 3000);
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)',
    fontSize: '0.88rem', fontFamily: 'var(--sans)', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : '0.0';

  return (
    <>
      <section style={{
        padding: '5rem 2.5rem',
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          {/* Header */}
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--green)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
            Testimonials
            <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem',
          }}>
            What People <span style={{ color: 'var(--green)' }}>Say</span>
          </h2>

          {/* Rating summary */}
          {testimonials.length > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '3rem',
            }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '2rem',
                fontWeight: 700, color: '#F0B429',
              }}>
                {avgRating}
              </div>
              <div>
                <div style={{ color: '#F0B429', fontSize: '1.1rem', letterSpacing: '2px' }}>
                  {'★'.repeat(Math.round(Number(avgRating)))}
                  {'☆'.repeat(5 - Math.round(Number(avgRating)))}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text3)' }}>
                  {testimonials.length} review{testimonials.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}

          {/* Carousel */}
          {loading ? (
            <div style={{
              height: '200px', background: 'var(--bg3)', borderRadius: '16px',
              animation: 'pulse 1.5s infinite',
            }} />
          ) : testimonials.length === 0 ? (
            <div style={{
              padding: '3rem', background: 'var(--bg3)', borderRadius: '16px',
              border: '1px solid var(--border)', color: 'var(--text3)',
              fontFamily: 'var(--mono)', marginBottom: '2rem',
            }}>
              No testimonials yet. Be the first to share your experience.
            </div>
          ) : (
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              {/* Cards */}
              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border-green)',
                borderRadius: '16px', padding: '2.5rem',
                transition: 'all 0.5s ease',
              }}>
                <div style={{ fontSize: '3rem', color: 'var(--green)', marginBottom: '1rem', opacity: 0.3 }}>
                  &quot;
                </div>
                <p style={{
                  fontSize: '1.05rem', color: 'var(--text)',
                  lineHeight: 1.8, marginBottom: '1.5rem', fontStyle: 'italic',
                }}>
                  {testimonials[current]?.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'var(--green-dim)', border: '2px solid var(--border-green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontSize: '1rem',
                    color: 'var(--green)', fontWeight: 700,
                  }}>
                    {testimonials[current]?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {testimonials[current]?.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                      {testimonials[current]?.role}
                      {testimonials[current]?.company && ` @ ${testimonials[current].company}`}
                    </div>
                  </div>
                  <div style={{ color: '#F0B429', fontSize: '1rem', marginLeft: '0.5rem' }}>
                    {'★'.repeat(testimonials[current]?.rating || 5)}
                  </div>
                </div>
              </div>

              {/* Dots */}
              {testimonials.length > 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  gap: '0.5rem', marginTop: '1.25rem',
                }}>
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)} style={{
                      width: i === current ? '24px' : '8px',
                      height: '8px', borderRadius: '4px', border: 'none',
                      background: i === current ? 'var(--green)' : 'var(--border)',
                      cursor: 'pointer', transition: 'all 0.3s',
                      padding: 0,
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <button onClick={() => setShowForm(true)} style={{
            padding: '12px 28px',
            background: 'transparent',
            color: 'var(--green)', fontWeight: 600,
            fontSize: '0.9rem', borderRadius: '8px',
            border: '1px solid var(--border-green)',
            cursor: 'pointer', fontFamily: 'var(--sans)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'var(--green-dim)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'transparent';
            }}
          >
            Share Your Experience →
          </button>
        </div>
      </section>

      {/* Review modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '520px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1.5rem',
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Share Your Experience</h2>
              <button onClick={() => setShowForm(false)} style={{
                background: 'none', border: 'none', color: 'var(--text2)',
                fontSize: '1.4rem', cursor: 'pointer',
              }}>✕</button>
            </div>

            {formStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontWeight: 700, color: 'var(--green)', marginBottom: '0.5rem' }}>
                  Review Submitted
                </h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
                  Thank you! Your review will appear after approval.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block', fontFamily: 'var(--mono)', fontSize: '0.62rem',
                      color: 'var(--text3)', textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginBottom: '6px',
                    }}>Name *</label>
                    <input style={inputStyle} value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border-green)'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
                      required />
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontFamily: 'var(--mono)', fontSize: '0.62rem',
                      color: 'var(--text3)', textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginBottom: '6px',
                    }}>Role *</label>
                    <input style={inputStyle} value={form.role} placeholder="CEO, Developer..."
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border-green)'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
                      required />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    color: 'var(--text3)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '6px',
                  }}>Company</label>
                  <input style={inputStyle} value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border-green)'}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'} />
                </div>

                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    color: 'var(--text3)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '8px',
                  }}>Rating</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '1.6rem', padding: '0',
                          color: star <= form.rating ? '#F0B429' : 'var(--text3)',
                          transition: 'color 0.1s, transform 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    color: 'var(--text3)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '6px',
                  }}>Your Review *</label>
                  <textarea style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }}
                    value={form.message}
                    placeholder="Share your experience..."
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border-green)'}
                    onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'}
                    required />
                </div>

                <button type="submit" disabled={formStatus === 'loading'} style={{
                  padding: '13px', background: formStatus === 'loading' ? 'var(--bg3)' : 'var(--green)',
                  color: formStatus === 'loading' ? 'var(--text2)' : '#000',
                  fontWeight: 700, fontSize: '0.9rem', borderRadius: '8px', border: 'none',
                  cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--sans)', transition: 'all 0.2s',
                }}>
                  {formStatus === 'loading' ? 'Submitting...' : 'Submit Review →'}
                </button>

                {formStatus === 'error' && (
                  <p style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center' }}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}