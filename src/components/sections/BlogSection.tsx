'use client';

import { useEffect, useRef, useState } from 'react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  body: string;
  coverImage: string;
  category: string;
  published: boolean;
  tags: string[];
  readTime: number;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  Blog: 'var(--green)',
  Article: 'var(--blue)',
  Event: '#F0B429',
  Hackathon: '#9945FF',
  Tutorial: 'var(--green)',
  Development: 'var(--blue)',
  Design: '#ea4c89',
};

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{ height: '160px', background: 'var(--bg3)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ height: '16px', background: 'var(--bg3)', borderRadius: '4px', marginBottom: '8px', width: '40%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '18px', background: 'var(--bg3)', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '12px', background: 'var(--bg3)', borderRadius: '4px', width: '80%', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        const published = Array.isArray(data) ? data.filter((p: Post) => p.published) : [];
        setPosts(published);
        const cats = ['All', ...Array.from(new Set(published.map((p: Post) => p.category)))];
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.scroll-fade').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 120);
          });
        }
      });
    }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [posts]);

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  const getDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <section ref={sectionRef} style={{
      padding: '4rem 2.5rem 6rem',
      maxWidth: '1200px', margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--green)',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
          Knowledge Base
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Thoughts & <span style={{ color: 'var(--green)' }}>Writings</span>
          </h1>

          {/* Dynamic category filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
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
                transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '5rem',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '16px', fontFamily: 'var(--mono)', color: 'var(--text3)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
          {filter === 'All' ? 'No posts published yet.' : `No ${filter} posts yet.`}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {filtered.map(post => (
            <article key={post._id} className="scroll-fade" style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', overflow: 'hidden',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedPost(post)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPost(post);
                }
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = categoryColors[post.category] || 'var(--border-green)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Thumbnail */}
              <div style={{
                height: '160px', background: 'var(--bg3)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `linear-gradient(rgba(0,230,118,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.03) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }} />
                    <span style={{ fontSize: '2.5rem', position: 'relative', zIndex: 1 }}>📝</span>
                  </>
                )}
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  fontFamily: 'var(--mono)', fontSize: '0.65rem',
                  color: categoryColors[post.category] || 'var(--green)',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 10px', borderRadius: '4px',
                  backdropFilter: 'blur(4px)',
                  border: `1px solid ${categoryColors[post.category] || 'var(--green)'}33`,
                }}>
                  {post.category.toUpperCase()}
                </div>
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  fontFamily: 'var(--mono)', fontSize: '0.62rem',
                  color: 'var(--text3)', background: 'rgba(0,0,0,0.6)',
                  padding: '4px 8px', borderRadius: '4px',
                }}>
                  {getDate(post.createdAt)}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{
                  fontWeight: 700, fontSize: '0.95rem',
                  lineHeight: 1.4, marginBottom: '0.6rem', color: 'var(--text)',
                }}>
                  {post.title}
                </h3>
                <p style={{
                  fontSize: '0.82rem', color: 'var(--text2)',
                  lineHeight: 1.65, marginBottom: '1rem',
                }}>
                  {post.body ? post.body.slice(0, 100).replace(/[#*`]/g, '') + '...' : 'Read more...'}
                </p>

                {post.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'var(--mono)', fontSize: '0.6rem',
                        padding: '3px 8px', background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px', color: 'var(--text2)', textTransform: 'uppercase',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text3)' }}>
                    {post.readTime} min read
                  </span>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.72rem',
                    color: 'var(--green)', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    Read →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedPost && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 380,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.25rem',
        }} onClick={() => setSelectedPost(null)}>
          <article style={{
            width: 'min(820px, 100%)',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
          }} onClick={e => e.stopPropagation()}>
            {selectedPost.coverImage && (
              <img src={selectedPost.coverImage} alt={selectedPost.title} style={{
                width: '100%',
                maxHeight: '360px',
                objectFit: 'cover',
                display: 'block',
              }} />
            )}
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '0.65rem',
                    color: categoryColors[selectedPost.category] || 'var(--green)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: '0.75rem',
                  }}>
                    {selectedPost.category} · {selectedPost.readTime} min read
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.25rem)', lineHeight: 1.1 }}>
                    {selectedPost.title}
                  </h2>
                </div>
                <button onClick={() => setSelectedPost(null)} style={{
                  flex: '0 0 auto',
                  width: '38px', height: '38px',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: '8px', color: 'var(--text2)',
                  cursor: 'pointer', fontSize: '1.1rem',
                }}>✕</button>
              </div>
              <div style={{
                whiteSpace: 'pre-wrap',
                color: 'var(--text2)',
                lineHeight: 1.8,
                fontSize: '0.96rem',
              }}>
                {selectedPost.body || 'Article content is not available yet.'}
              </div>
              <a
                href={`/blog/${selectedPost.slug}`}
                style={{
                  display: 'inline-flex',
                  marginTop: '1.5rem',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.72rem',
                  color: 'var(--green)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Open article page →
              </a>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
