'use client';

import { useEffect, useRef, useState } from 'react';

interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  techStack: string[];
  status: string;
  port: string;
  published: boolean;
  featured: boolean;
  githubLink: string;
  liveLink: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  running: '#00E676',
  exited: '#8B949E',
  paused: '#F0B429',
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects/published')
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
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
              setTimeout(() => el.classList.add('visible'), i * 120);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [projects]);

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.status.toLowerCase() === filter.toLowerCase());

  const getSerial = (index: number) => `SRV-00${index + 1}`;
  const getEmoji = (name: string) => {
    if (name.toLowerCase().includes('docker')) return '🐳';
    if (name.toLowerCase().includes('api')) return '⚙️';
    if (name.toLowerCase().includes('award')) return '🏆';
    if (name.toLowerCase().includes('academy')) return '🎓';
    return '🚀';
  };
  const getDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };

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
          Deployed Containers
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Featured <span style={{ color: 'var(--green)' }}>Projects</span>
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Running', 'Exited'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 14px', borderRadius: '6px',
                border: filter === f ? '1px solid var(--border-green)' : '1px solid var(--border)',
                background: filter === f ? 'var(--green-dim)' : 'transparent',
                color: filter === f ? 'var(--green)' : 'var(--text2)',
                fontFamily: 'var(--mono)', fontSize: '0.68rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{
          textAlign: 'center', padding: '4rem',
          fontFamily: 'var(--mono)', color: 'var(--text3)',
        }}>
          Fetching containers...
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '12px', fontFamily: 'var(--mono)', color: 'var(--text3)',
        }}>
          No projects deployed yet.
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="responsive-card-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }}>
          {filtered.map((project, index) => (
            <div key={project._id} className="scroll-fade" style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '12px', overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--border-green)';
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
              {/* Thumbnail */}
              <div style={{
                height: '180px', background: 'var(--bg3)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '3rem',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `
                    linear-gradient(rgba(0,230,118,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,230,118,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }} />
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  fontFamily: 'var(--mono)', fontSize: '0.65rem',
                  background: 'rgba(0,0,0,0.6)', color: 'var(--text2)',
                  padding: '4px 8px', borderRadius: '4px',
                  backdropFilter: 'blur(4px)',
                }}>
                  {getDate(project.createdAt)}
                </div>
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontFamily: 'var(--mono)', fontSize: '0.65rem',
                  color: statusColors[project.status],
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 8px', borderRadius: '4px',
                  backdropFilter: 'blur(4px)',
                }}>
                  <span style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: statusColors[project.status],
                    animation: project.status === 'running' ? 'pulse 2s infinite' : 'none',
                  }} />
                  {project.status.toUpperCase()}
                </div>
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {getEmoji(project.name)}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '0.75rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    CONTAINER · {getSerial(index)}
                  </div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '0.62rem',
                    color: 'var(--blue)', padding: '2px 7px',
                    background: 'var(--blue-dim)',
                    border: '1px solid rgba(36,150,237,0.2)', borderRadius: '4px',
                  }}>
                    {project.port}
                  </div>
                </div>

                <h3 style={{
                  fontWeight: 700, fontSize: '1rem',
                  marginBottom: '0.5rem', color: 'var(--text)',
                }}>
                  {project.name}
                </h3>

                <p style={{
                  fontSize: '0.82rem', color: 'var(--text2)',
                  lineHeight: 1.65, marginBottom: '1rem',
                }}>
                  {project.description}
                </p>

                <div style={{
                  display: 'flex', flexWrap: 'wrap',
                  gap: '0.4rem', marginBottom: '1.25rem',
                }}>
                  {project.techStack.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'var(--mono)', fontSize: '0.6rem',
                      padding: '3px 8px', background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px', color: 'var(--text2)',
                      textTransform: 'uppercase',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex', gap: '0.75rem',
                  paddingTop: '1rem', borderTop: '1px solid var(--border)',
                }}>
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" style={{
                      fontFamily: 'var(--mono)', fontSize: '0.72rem',
                      color: 'var(--green)', textDecoration: 'none',
                      fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      GitHub →
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer" style={{
                      fontFamily: 'var(--mono)', fontSize: '0.72rem',
                      color: 'var(--text2)', textDecoration: 'none',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
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
    </section>
  );
}
