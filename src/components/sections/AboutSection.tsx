'use client';

import { useEffect, useRef } from 'react';

const stats = [
  { val: '9+', label: 'Years in Tech' },
  { val: '3', label: 'Disciplines Mastered' },
  { val: '10+', label: 'Projects Shipped' },
  { val: 'MSc', label: 'MBTM Candidate' },
];

const tags = [
  'Full Stack Development',
  'Docker & DevOps',
  'System Architecture',
  'Blockchain',
  'Graphic Design',
  'Supply Chain Tech',
  'Next.js',
  'Node.js',
  'MongoDB',
  'UI/UX',
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-pad" style={{
      padding: '6rem 2.5rem',
      position: 'relative',
      borderTop: '1px solid var(--border)',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: 0, right: '10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(36,150,237,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="about-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '5rem',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* LEFT */}
        <div>
          {/* Label */}
          <div className="scroll-fade" style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.72rem',
            color: 'var(--green)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ display: 'block', width: '24px', height: '1px', background: 'var(--green)' }} />
            About Me
          </div>

          {/* Heading */}
          <h2 className="scroll-fade" style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '2rem',
          }}>
            From Vision<br />
            <span style={{ color: 'var(--green)' }}>to Production</span>
          </h2>

          {/* Bio paragraphs */}
          {[
            "I've spent the last decade at the intersection of technology and systems thinking, from mastering visual communication through graphic design, to studying blockchain architecture and participating in live crypto ecosystems, to building full-stack production systems today.",
            "My path has never been linear, it's been intentional. Every discipline I've touched has sharpened how I see problems and build solutions. I have a natural eye for design, a systems-level mind for architecture, and the drive to make complex things feel simple.",
            "Currently pursuing a Master's in Business and Technology Management in Supply Chain, I bring both technical depth and business context to everything I build. I don't just write code, I think about scale, operations, and impact.",
            "Based in Accra, Ghana. Available for contracts, freelance, and remote collaboration globally.",
          ].map((para, i) => (
            <p key={i} className="scroll-fade" style={{
              fontSize: '1rem',
              color: 'var(--text2)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
            }}>
              {para}
            </p>
          ))}

          {/* Tags */}
          <div className="scroll-fade" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '2rem',
          }}>
            {tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.68rem',
                padding: '5px 12px',
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                color: 'var(--text2)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLSpanElement).style.borderColor = 'var(--border-green)';
                  (e.currentTarget as HTMLSpanElement).style.color = 'var(--green)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLSpanElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLSpanElement).style.color = 'var(--text2)';
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Stats grid */}
          <div className="scroll-fade about-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            {stats.map(s => (
              <div key={s.label} style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-green)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--green)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  {s.val}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="scroll-fade" style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              color: 'var(--text3)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              Career Timeline
            </div>

            {[
              { year: '2016', label: 'Graphic Design', color: 'var(--blue)' },
              { year: '2018', label: 'Blockchain & Crypto', color: '#9945FF' },
              { year: '2024', label: 'Software Engineering', color: 'var(--green)' },
              { year: '2025', label: 'MBTM Masters (ongoing)', color: 'var(--green)' },
            ].map((item, i, arr) => (
              <div key={item.year} style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                marginBottom: i < arr.length - 1 ? '1rem' : 0,
              }}>
                {/* Line + dot */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <div style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 6px ${item.color}`,
                    flexShrink: 0,
                    marginTop: '4px',
                  }} />
                  {i < arr.length - 1 && (
                    <div style={{
                      width: '1px',
                      height: '24px',
                      background: 'var(--border)',
                    }} />
                  )}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.65rem',
                    color: item.color,
                    marginBottom: '2px',
                  }}>
                    {item.year}
                  </div>
                  <div style={{
                    fontSize: '0.88rem',
                    color: 'var(--text)',
                    fontWeight: 500,
                  }}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="scroll-fade" style={{
            display: 'flex',
            gap: '1rem',
          }}>
            <a href="/contact" style={{
              flex: 1,
              padding: '13px',
              background: 'var(--green)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}>
              Work With Me
            </a>
            <a href="#" style={{
              flex: 1,
              padding: '13px',
              background: 'transparent',
              color: 'var(--text)',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid var(--border)',
              transition: 'all 0.2s',
            }}>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
