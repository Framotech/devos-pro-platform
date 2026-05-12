'use client';

import { useEffect, useRef, useState } from 'react';

interface StudioItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  coverImage: string;
  images: string[];
  figmaLink: string;
  behanceLink: string;
  dribbbleLink: string;
  liveLink: string;
  featured: boolean;
}

const categories = ['All', 'UI Design', 'Web Graphics', 'Branding', 'Motion'];

const categoryColors: Record<string, string> = {
  'UI Design': 'var(--blue)',
  'Web Graphics': 'var(--green)',
  'Branding': '#9945FF',
  'Motion': '#F0B429',
};

const categoryEmojis: Record<string, string> = {
  'UI Design': '🖥️',
  'Web Graphics': '🎨',
  'Branding': '✏️',
  'Motion': '🎬',
};

export default function StudioSection() {
  const [items, setItems] = useState<StudioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<StudioItem | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/studio/published')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.scroll-fade').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [items]);

  const filtered = filter === 'All'
    ? items
    : items.filter(i => i.category === filter);

  return (
    <section ref={sectionRef} className="section-pad" style={{
      padding: '4rem 2.5rem 6rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.72rem',
          color: 'var(--green)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
          Design Work
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700, letterSpacing: '-0.02em',
              lineHeight: 1.1, marginBottom: '0.75rem',
            }}>
              Framo <span style={{ color: 'var(--green)' }}>Studio</span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.7 }}>
              UI design, web graphics, branding and motion work.
              Where code meets visual craft.
            </p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '6px 14px', borderRadius: '6px',
                border: filter === cat
                  ? `1px solid ${categoryColors[cat] || 'var(--border-green)'}`
                  : '1px solid var(--border)',
                background: filter === cat
                  ? `${categoryColors[cat] || 'var(--green)'}15`
                  : 'transparent',
                color: filter === cat
                  ? (categoryColors[cat] || 'var(--green)')
                  : 'var(--text2)',
                fontFamily: 'var(--mono)', fontSize: '0.68rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
          Loading studio work...
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '5rem',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '16px', fontFamily: 'var(--mono)', color: 'var(--text3)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
          No {filter === 'All' ? '' : filter} work published yet.
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="responsive-card-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }}>
          {filtered.map(item => (
            <div key={item._id} className="scroll-fade" style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '12px', overflow: 'hidden',
              cursor: 'pointer', transition: 'all 0.3s',
            }}
              onClick={() => setSelected(item)}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = categoryColors[item.category] || 'var(--border-green)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--border)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Cover image */}
              <div style={{
                height: '220px', background: 'var(--bg3)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                  />
                ) : (
                  <>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `
                        linear-gradient(rgba(0,230,118,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,230,118,0.03) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px',
                    }} />
                    <span style={{ fontSize: '3rem', position: 'relative', zIndex: 1 }}>
                      {categoryEmojis[item.category] || '🎨'}
                    </span>
                  </>
                )}

                {/* Category badge */}
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  fontFamily: 'var(--mono)', fontSize: '0.62rem',
                  color: categoryColors[item.category],
                  background: 'rgba(0,0,0,0.75)',
                  padding: '4px 10px', borderRadius: '4px',
                  border: `1px solid ${categoryColors[item.category]}30`,
                  backdropFilter: 'blur(4px)',
                }}>
                  {item.category.toUpperCase()}
                </div>

                {/* Featured badge */}
                {item.featured && (
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    background: 'var(--green)', color: '#000',
                    padding: '3px 8px', borderRadius: '4px', fontWeight: 700,
                  }}>
                    FEATURED
                  </div>
                )}

                {/* View overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.3s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '0'}
                >
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.8rem',
                    color: 'var(--green)', fontWeight: 600,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                  }}>
                    View Work →
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{
                  fontWeight: 700, fontSize: '1rem',
                  marginBottom: '0.4rem', color: 'var(--text)',
                }}>
                  {item.title}
                </h3>

                {item.description && (
                  <p style={{
                    fontSize: '0.82rem', color: 'var(--text2)',
                    lineHeight: 1.6, marginBottom: '0.75rem',
                  }}>
                    {item.description.slice(0, 80)}{item.description.length > 80 ? '...' : ''}
                  </p>
                )}

                {/* Tools */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {item.tools.map(tool => (
                    <span key={tool} style={{
                      fontFamily: 'var(--mono)', fontSize: '0.6rem',
                      padding: '3px 8px', background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px', color: 'var(--text2)',
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>

                {/* External links */}
                <div style={{
                  display: 'flex', gap: '0.75rem',
                  paddingTop: '0.75rem', borderTop: '1px solid var(--border)',
                }}>
                  {item.figmaLink && (
                    <a href={item.figmaLink} target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontFamily: 'var(--mono)', fontSize: '0.68rem',
                        color: 'var(--blue)', textDecoration: 'none',
                        fontWeight: 600, textTransform: 'uppercase',
                      }}>
                      Figma →
                    </a>
                  )}
                  {item.behanceLink && (
                    <a href={item.behanceLink} target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontFamily: 'var(--mono)', fontSize: '0.68rem',
                        color: '#6366f1', textDecoration: 'none',
                        fontWeight: 600, textTransform: 'uppercase',
                      }}>
                      Behance →
                    </a>
                  )}
                  {item.dribbbleLink && (
                    <a href={item.dribbbleLink} target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontFamily: 'var(--mono)', fontSize: '0.68rem',
                        color: '#ea4c89', textDecoration: 'none',
                        fontWeight: 600, textTransform: 'uppercase',
                      }}>
                      Dribbble →
                    </a>
                  )}
                  {item.liveLink && (
                    <a href={item.liveLink} target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontFamily: 'var(--mono)', fontSize: '0.68rem',
                        color: 'var(--green)', textDecoration: 'none',
                        fontWeight: 600, textTransform: 'uppercase',
                      }}>
                      Live →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem',
        }} onClick={() => setSelected(null)}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '16px', maxWidth: '800px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.65rem',
                  color: categoryColors[selected.category],
                  background: `${categoryColors[selected.category]}15`,
                  padding: '3px 10px', borderRadius: '4px',
                  textTransform: 'uppercase',
                }}>
                  {selected.category}
                </span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: 'none', border: 'none',
                color: 'var(--text2)', fontSize: '1.4rem', cursor: 'pointer',
              }}>✕</button>
            </div>

            {/* Cover */}
            {selected.coverImage && (
              <img src={selected.coverImage} alt={selected.title}
                style={{ width: '100%', display: 'block' }} />
            )}

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              {selected.description && (
                <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {selected.description}
                </p>
              )}

              {/* Tools */}
              {selected.tools.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    color: 'var(--text3)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '0.5rem',
                  }}>
                    Tools used
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selected.tools.map(tool => (
                      <span key={tool} style={{
                        fontFamily: 'var(--mono)', fontSize: '0.72rem',
                        padding: '5px 12px', background: 'var(--bg3)',
                        border: '1px solid var(--border)', borderRadius: '6px',
                        color: 'var(--text2)',
                      }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional images */}
              {selected.images.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    color: 'var(--text3)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '0.75rem',
                  }}>
                    Gallery
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {selected.images.map((img, i) => (
                      <img key={i} src={img} alt={`${selected.title} ${i + 1}`}
                        style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)' }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {selected.figmaLink && (
                  <a href={selected.figmaLink} target="_blank" rel="noreferrer" style={{
                    padding: '10px 20px', background: 'var(--blue-dim)',
                    border: '1px solid rgba(36,150,237,0.3)',
                    borderRadius: '8px', color: 'var(--blue)',
                    textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
                    fontFamily: 'var(--mono)',
                  }}>
                    Open in Figma →
                  </a>
                )}
                {selected.behanceLink && (
                  <a href={selected.behanceLink} target="_blank" rel="noreferrer" style={{
                    padding: '10px 20px', background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '8px', color: '#6366f1',
                    textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
                    fontFamily: 'var(--mono)',
                  }}>
                    View on Behance →
                  </a>
                )}
                {selected.dribbbleLink && (
                  <a href={selected.dribbbleLink} target="_blank" rel="noreferrer" style={{
                    padding: '10px 20px', background: 'rgba(234,76,137,0.1)',
                    border: '1px solid rgba(234,76,137,0.3)',
                    borderRadius: '8px', color: '#ea4c89',
                    textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
                    fontFamily: 'var(--mono)',
                  }}>
                    View on Dribbble →
                  </a>
                )}
                {selected.liveLink && (
                  <a href={selected.liveLink} target="_blank" rel="noreferrer" style={{
                    padding: '10px 20px', background: 'var(--green-dim)',
                    border: '1px solid var(--border-green)',
                    borderRadius: '8px', color: 'var(--green)',
                    textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
                    fontFamily: 'var(--mono)',
                  }}>
                    View Live →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
