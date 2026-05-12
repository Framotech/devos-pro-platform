'use client';

import { useState, useEffect, useRef } from 'react';

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  level: string;
  duration: string;
  description: string;
  techStack: string[];
  link: string;
  published: boolean;
}

interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  category: string;
  duration: string;
  description: string;
  isFeatured: boolean;
  published: boolean;
}

const levelColors: Record<string, string> = {
  Beginner: 'var(--green)',
  Intermediate: 'var(--blue)',
  Advanced: '#F0B429',
};

function SkeletonCard({ height = 180 }: { height?: number }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{ height, background: 'var(--bg3)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ height: '16px', background: 'var(--bg3)', borderRadius: '4px', marginBottom: '8px', width: '60%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '12px', background: 'var(--bg3)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function AcademySection() {
  const [activeTab, setActiveTab] = useState('Courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(d => {
        setCourses(Array.isArray(d) ? d.filter((c: Course) => c.published) : []);
        setLoadingCourses(false);
      })
      .catch(() => setLoadingCourses(false));

    fetch('/api/videos')
      .then(r => r.json())
      .then(d => {
        setVideos(Array.isArray(d) ? d.filter((v: Video) => v.published) : []);
        setLoadingVideos(false);
      })
      .catch(() => setLoadingVideos(false));
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
  }, [courses, videos, activeTab]);

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
          Learning Hub
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Framo <span style={{ color: 'var(--green)' }}>Academy</span>
          </h1>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '0.25rem',
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '4px',
          }}>
            {['Courses', 'Videos'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px', borderRadius: '6px', border: 'none',
                background: activeTab === tab ? 'var(--green)' : 'transparent',
                color: activeTab === tab ? '#000' : 'var(--text2)',
                fontWeight: activeTab === tab ? 700 : 500,
                fontFamily: 'var(--sans)', fontSize: '0.88rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {tab} {tab === 'Courses' && !loadingCourses && `(${courses.length})`}
                {tab === 'Videos' && !loadingVideos && `(${videos.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses */}
      {activeTab === 'Courses' && (
        <>
          {loadingCourses ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '5rem',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '16px', fontFamily: 'var(--mono)', color: 'var(--text3)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎓</div>
              No courses published yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {courses.map(course => (
                <div key={course._id} className="scroll-fade" style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s ease',
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <div style={{
                          position: 'absolute', inset: 0,
                          backgroundImage: `linear-gradient(rgba(0,230,118,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.03) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px',
                        }} />
                        <span style={{ fontSize: '3rem', position: 'relative', zIndex: 1 }}>🎓</span>
                      </>
                    )}
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      fontFamily: 'var(--mono)', fontSize: '0.62rem',
                      color: levelColors[course.level] || 'var(--green)',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '3px 8px', borderRadius: '4px',
                      border: `1px solid ${levelColors[course.level] || 'var(--green)'}33`,
                    }}>
                      {course.level.toUpperCase()}
                    </div>
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      fontFamily: 'var(--mono)', fontSize: '0.72rem',
                      color: course.price === 0 ? 'var(--green)' : 'var(--text)',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '3px 8px', borderRadius: '4px', fontWeight: 700,
                    }}>
                      {course.price === 0 ? 'FREE' : `$${course.price}`}
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                      {course.title}
                    </h3>
                    {course.description && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {course.description.slice(0, 80)}...
                      </p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {course.techStack.slice(0, 3).map(tag => (
                        <span key={tag} style={{
                          fontFamily: 'var(--mono)', fontSize: '0.6rem',
                          padding: '3px 8px', background: 'var(--bg3)',
                          border: '1px solid var(--border)', borderRadius: '4px',
                          color: 'var(--text2)', textTransform: 'uppercase',
                        }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      paddingTop: '1rem', borderTop: '1px solid var(--border)',
                    }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text3)' }}>
                        {course.duration}
                      </span>
                      <a href={course.link} target="_blank" rel="noreferrer" style={{
                        fontFamily: 'var(--mono)', fontSize: '0.72rem',
                        color: 'var(--green)', textDecoration: 'none',
                        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        View Course →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Videos */}
      {activeTab === 'Videos' && (
        <>
          {loadingVideos ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} height={160} />)}
            </div>
          ) : videos.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '5rem',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '16px', fontFamily: 'var(--mono)', color: 'var(--text3)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎥</div>
              No videos published yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {videos.map(video => (
                <div key={video._id} className="scroll-fade" style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s ease',
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
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      style={{ width: '100%', display: 'block', opacity: 0.85, transition: 'opacity 0.3s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.opacity = '1'}
                      onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.opacity = '0.85'}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', background: 'var(--green)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1rem', color: '#000',
                        boxShadow: '0 4px 16px rgba(0,230,118,0.4)',
                      }}>▶</div>
                    </div>
                    {video.isFeatured && (
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        fontFamily: 'var(--mono)', fontSize: '0.6rem',
                        background: 'var(--green)', color: '#000',
                        padding: '3px 8px', borderRadius: '4px', fontWeight: 700,
                      }}>FEATURED</div>
                    )}
                    <div style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      fontFamily: 'var(--mono)', fontSize: '0.65rem',
                      background: 'rgba(0,0,0,0.8)', color: 'var(--text)',
                      padding: '3px 8px', borderRadius: '4px',
                    }}>{video.duration}</div>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '0.62rem',
                      color: 'var(--blue)', textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginBottom: '0.5rem',
                    }}>
                      {video.category}
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                      {video.title}
                    </h3>
                    {video.description && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {video.description.slice(0, 80)}...
                      </p>
                    )}
                    <a
                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank" rel="noreferrer"
                      style={{
                        fontFamily: 'var(--mono)', fontSize: '0.72rem',
                        color: 'var(--green)', textDecoration: 'none',
                        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}
                    >
                      Watch Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}