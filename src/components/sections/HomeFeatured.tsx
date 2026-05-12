'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  description: string;
  techStack: string[];
  status: string;
  githubLink: string;
  liveLink: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  price: number;
  techStack: string[];
  link: string;
}

interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  category: string;
  duration: string;
  description: string;
}

const statusColors: Record<string, string> = {
  running: 'var(--green)',
  exited: 'var(--text3)',
  paused: '#F0B429',
};

const levelColors: Record<string, string> = {
  Beginner: 'var(--green)',
  Intermediate: 'var(--blue)',
  Advanced: '#F0B429',
};

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{ height: '180px', background: 'var(--bg3)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ height: '16px', background: 'var(--bg3)', borderRadius: '4px', marginBottom: '8px', width: '60%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '12px', background: 'var(--bg3)', borderRadius: '4px', marginBottom: '6px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '12px', background: 'var(--bg3)', borderRadius: '4px', width: '80%', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function HomeFeatured() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAcademy, setLoadingAcademy] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects/published')
      .then(r => r.json())
      .then(d => { setProjects(Array.isArray(d) ? d.slice(0, 3) : []); setLoadingProjects(false); })
      .catch(() => setLoadingProjects(false));

    Promise.all([
      fetch('/api/courses').then(r => r.json()),
      fetch('/api/videos').then(r => r.json()),
    ]).then(([c, v]) => {
      setCourses(Array.isArray(c) ? c.filter((x: Course) => x).slice(0, 2) : []);
      setVideos(Array.isArray(v) ? v.filter((x: Video) => x).slice(0, 2) : []);
      setLoadingAcademy(false);
    }).catch(() => setLoadingAcademy(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.scroll-fade').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 100);
          });
        }
      });
    }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [projects, courses, videos]);

  return (
    <div ref={sectionRef} style={{ borderTop: '1px solid var(--border)' }}>

      {/* Featured Projects */}
      <section style={{ padding: '5rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--green)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
              Deployed Containers
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
              Featured <span style={{ color: 'var(--green)' }}>Projects</span>
            </h2>
          </div>
          <Link href="/projects" style={{
            fontFamily: 'var(--mono)', fontSize: '0.75rem',
            color: 'var(--green)', textDecoration: 'none',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            View All →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {loadingProjects ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : projects.length === 0 ? (
            <div style={{
              gridColumn: 'span 3', textAlign: 'center', padding: '3rem',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', fontFamily: 'var(--mono)', color: 'var(--text3)',
            }}>
              No projects published yet.
            </div>
          ) : (
            projects.map(project => (
              <div key={project._id} className="scroll-fade" style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s',
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
                <div style={{
                  height: '160px', background: 'var(--bg3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `linear-gradient(rgba(0,230,118,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.03) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }} />
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    fontFamily: 'var(--mono)', fontSize: '0.6rem',
                    color: statusColors[project.status],
                    background: 'rgba(0,0,0,0.6)', padding: '3px 8px',
                    borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: statusColors[project.status],
                      animation: project.status === 'running' ? 'pulse 2s infinite' : 'none',
                    }} />
                    {project.status.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '2.5rem', position: 'relative', zIndex: 1 }}>🐳</span>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{project.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {project.description.slice(0, 80)}...
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
                    {project.techStack.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'var(--mono)', fontSize: '0.58rem',
                        padding: '2px 7px', background: 'var(--bg3)',
                        border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text3)',
                        textTransform: 'uppercase',
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" style={{
                        fontFamily: 'var(--mono)', fontSize: '0.68rem',
                        color: 'var(--green)', textDecoration: 'none', fontWeight: 600,
                      }}>GitHub →</a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" style={{
                        fontFamily: 'var(--mono)', fontSize: '0.68rem',
                        color: 'var(--text2)', textDecoration: 'none',
                      }}>Live →</a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Academy Preview */}
      <section style={{
        padding: '5rem 2.5rem',
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--green)',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
                Learning Hub
              </div>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1,
              }}>
                Framo <span style={{ color: 'var(--green)' }}>Academy</span>
              </h2>
            </div>
            <Link href="/academy" style={{
              fontFamily: 'var(--mono)', fontSize: '0.75rem',
              color: 'var(--green)', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Courses column */}
            <div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem',
              }}>
                Courses
              </div>
              {loadingAcademy ? (
                [1, 2].map(i => <div key={i} style={{ height: '80px', background: 'var(--bg3)', borderRadius: '10px', marginBottom: '0.75rem', animation: 'pulse 1.5s infinite' }} />)
              ) : courses.length === 0 ? (
                <div style={{ padding: '2rem', background: 'var(--bg3)', borderRadius: '10px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                  No courses published yet.
                </div>
              ) : (
                courses.map(course => (
                  <a key={course._id} href={course.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
                    >
                      <div style={{
                        width: '44px', height: '44px', background: 'var(--bg3)',
                        borderRadius: '8px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                      }}>🎓</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '3px' }}>
                          {course.title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: '0.6rem',
                            color: levelColors[course.level] || 'var(--green)',
                          }}>
                            {course.level}
                          </span>
                          <span style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>·</span>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text3)' }}>
                            {course.duration}
                          </span>
                          <span style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>·</span>
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: '0.6rem',
                            color: course.price === 0 ? 'var(--green)' : 'var(--text)',
                            fontWeight: 700,
                          }}>
                            {course.price === 0 ? 'FREE' : `$${course.price}`}
                          </span>
                        </div>
                      </div>
                      <span style={{ color: 'var(--green)', fontSize: '1rem' }}>→</span>
                    </div>
                  </a>
                ))
              )}
            </div>

            {/* Videos column */}
            <div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem',
              }}>
                Latest Videos
              </div>
              {loadingAcademy ? (
                [1, 2].map(i => <div key={i} style={{ height: '80px', background: 'var(--bg3)', borderRadius: '10px', marginBottom: '0.75rem', animation: 'pulse 1.5s infinite' }} />)
              ) : videos.length === 0 ? (
                <div style={{ padding: '2rem', background: 'var(--bg3)', borderRadius: '10px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                  No videos published yet.
                </div>
              ) : (
                videos.map(video => (
                  <a key={video._id} href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '10px', marginBottom: '0.75rem', overflow: 'hidden',
                      display: 'flex', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
                    >
                      <div style={{ width: '100px', position: 'relative', flexShrink: 0 }}>
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={video.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.4)',
                        }}>
                          <span style={{ color: 'var(--green)', fontSize: '1rem' }}>▶</span>
                        </div>
                      </div>
                      <div style={{ padding: '0.75rem', flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.4 }}>
                          {video.title}
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text3)' }}>
                          {video.category} · {video.duration}
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
