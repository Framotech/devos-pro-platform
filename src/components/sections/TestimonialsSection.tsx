'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', role: '', company: '', rating: 5, message: '' });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/testimonials/approved')
      .then((r) => r.json())
      .then((d) => {
        setTestimonials(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.scroll-fade').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80);
            });
          }
        });
      },
      { threshold: 0.08 },
    );

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
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
      if (!res.ok) throw new Error('Failed');
      setFormStatus('success');
      setForm({ name: '', role: '', company: '', rating: 5, message: '' });
      setTimeout(() => {
        setFormStatus('idle');
        setShowForm(false);
      }, 2200);
    } catch {
      setFormStatus('error');
    }
  };

  const avgRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : '0.0';

  return (
    <>
      <section ref={sectionRef} className="section-pad testimonials-section">
        <div className="testimonials-shell">
          <div className="testimonials-head scroll-fade">
            <div>
              <div className="section-eyebrow">
                <span />
                Testimonials
              </div>
              <h2>Client proof, compact and current.</h2>
            </div>
            {testimonials.length > 0 && (
              <div className="rating-pill">
                <strong>{avgRating}</strong>
                <span>{'★'.repeat(Math.round(Number(avgRating)))}</span>
                <small>
                  {testimonials.length} review{testimonials.length !== 1 ? 's' : ''}
                </small>
              </div>
            )}
          </div>

          {loading ? (
            <div className="testimonial-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="testimonial-card skeleton" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="empty-panel">
              No testimonials yet. Be the first to share your experience.
            </div>
          ) : (
            <div className="testimonial-grid">
              {testimonials.slice(0, 6).map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className="testimonial-card scroll-fade"
                  onClick={() => setShowForm(true)}
                >
                  <div className="testimonial-card__top">
                    <div className="testimonial-avatar">
                      {item.avatar ? (
                        <img src={item.avatar} alt={item.name} loading="lazy" />
                      ) : (
                        item.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {item.role}
                        {item.company ? ` · ${item.company}` : ''}
                      </span>
                    </div>
                  </div>
                  <p>{item.message}</p>
                  <div className="testimonial-card__rating">{'★'.repeat(item.rating)}</div>
                </button>
              ))}
            </div>
          )}

          <div className="testimonials-action scroll-fade">
            <button type="button" onClick={() => setShowForm(true)}>
              Share Your Experience →
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="review-modal" onClick={() => setShowForm(false)}>
          <form
            className="review-card"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="review-card__header">
              <div>
                <span>Review Studio</span>
                <h2>Share your experience</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close review form"
              >
                x
              </button>
            </div>

            {formStatus === 'success' ? (
              <div className="review-success">
                <strong>Review submitted</strong>
                <p>Thank you. It will appear after approval.</p>
              </div>
            ) : (
              <>
                <div className="form-grid-2">
                  <Input
                    label="Name"
                    value={form.name}
                    onChange={(value) => setForm({ ...form, name: value })}
                    required
                  />
                  <Input
                    label="Role"
                    value={form.role}
                    onChange={(value) => setForm({ ...form, role: value })}
                    required
                  />
                </div>
                <Input
                  label="Company"
                  value={form.company}
                  onChange={(value) => setForm({ ...form, company: value })}
                />
                <label className="review-field">
                  Rating
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} stars
                      </option>
                    ))}
                  </select>
                </label>
                <label className="review-field">
                  Message
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    required
                    minLength={10}
                  />
                </label>
                {formStatus === 'error' && (
                  <p className="review-error">Could not submit review. Please try again.</p>
                )}
                <button className="review-submit" disabled={formStatus === 'loading'}>
                  {formStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="review-field">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </label>
  );
}
