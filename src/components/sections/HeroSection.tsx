'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const roles = [
  'Software Engineer',
  'DevOps Engineer',
  'Full Stack Developer',
  'System Architect',
];

interface Project {
  _id: string;
  name: string;
  description: string;
  techStack: string[];
  status: string;
  port: string;
  githubLink: string;
  liveLink: string;
}

const statusColors: Record<string, string> = {
  running: '#00E676',
  exited: '#8B949E',
  paused: '#F0B429',
};

const getEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('docker') || n.includes('portfolio')) return '🐳';
  if (n.includes('api') || n.includes('engine')) return '⚙️';
  if (n.includes('award') || n.includes('bhadda')) return '🏆';
  if (n.includes('academy') || n.includes('learn')) return '🎓';
  if (n.includes('studio') || n.includes('design')) return '🎨';
  if (n.includes('store') || n.includes('shop')) return '🛒';
  return '🚀';
};

const fallback: Project[] = [
  { _id: 'f1', name: 'DevOS Portfolio', description: 'Full-stack portfolio OS with containerized admin dashboard and automation pipelines.', techStack: ['Next.js', 'MongoDB', 'Docker', 'Clerk'], status: 'running', port: ':3000', githubLink: 'https://github.com/Framotech', liveLink: '' },
  { _id: 'f2', name: 'Bhadda Awards System', description: 'Digital awards management platform designed for Bhadda Entertainment.', techStack: ['React', 'Node.js', 'MongoDB', 'Express'], status: 'exited', port: ':5000', githubLink: 'https://github.com/Framotech', liveLink: '' },
  { _id: 'f3', name: 'Docker Portfolio v1', description: 'Original containerized portfolio with Express backend and custom admin dashboard.', techStack: ['React', 'Express', 'MongoDB', 'Docker'], status: 'exited', port: ':4000', githubLink: 'https://github.com/Framotech', liveLink: '' },
];

// Separate card component so key-based remount triggers animation cleanly
function ContainerCard({
  project,
  serial,
  large = false,
}: {
  project: Project;
  serial: string;
  large?: boolean;
}) {
  const color = statusColors[project.status] || 'var(--green)';
  return (
    <div
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        gridColumn: large ? 'span 2' : 'span 1',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
        cursor: 'default',
        animation: 'cardIn 0.45s ease both',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border-green)';
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 14px 32px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Serial */}
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.6rem',
        color: 'var(--text3)', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginBottom: '0.6rem',
      }}>
        CONTAINER · {serial}
      </div>

      {/* Status row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '0.75rem',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontFamily: 'var(--mono)', fontSize: '0.65rem',
          color, fontWeight: 600,
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: color, boxShadow: `0 0 6px ${color}`,
            animation: project.status === 'running' ? 'pulse 2s infinite' : 'none',
          }} />
          {project.status.toUpperCase()}
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.63rem',
          color: 'var(--blue)', padding: '3px 8px',
          background: 'var(--blue-dim)',
          border: '1px solid rgba(36,150,237,0.2)', borderRadius: '4px',
        }}>
          {project.port}
        </div>
      </div>

      {/* Thumbnail */}
      <div style={{
        width: '100%',
        height: large ? '120px' : '76px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #1C2128, #0D1117)',
        marginBottom: '0.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: large ? '2.2rem' : '1.6rem',
        border: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,230,118,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,230,118,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }} />
        <span style={{ position: 'relative', zIndex: 1 }}>{getEmoji(project.name)}</span>
      </div>

      {/* Name */}
      <div style={{
        fontWeight: 700,
        fontSize: large ? '0.98rem' : '0.88rem',
        marginBottom: '0.4rem',
        color: 'var(--text)',
      }}>
        {project.name}
      </div>

      {/* Description — large card only */}
      {large && (
        <p style={{
          fontSize: '0.78rem', color: 'var(--text2)',
          lineHeight: 1.55, marginBottom: '0.75rem',
        }}>
          {project.description.slice(0, 90)}{project.description.length > 90 ? '...' : ''}
        </p>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {project.techStack.slice(0, large ? 4 : 2).map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--mono)', fontSize: '0.58rem',
            padding: '2px 7px', background: 'var(--bg3)',
            border: '1px solid var(--border)', borderRadius: '4px',
            color: 'var(--text3)', textTransform: 'uppercase',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [projects, setProjects] = useState<Project[]>(fallback);
  const [page, setPage] = useState(0); // which group of 3 to show

  // Typing animation
  useEffect(() => {
    const current = roles[roleIndex];
    let t: NodeJS.Timeout;
    if (typing) {
      if (displayed.length < current.length) {
        t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        t = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
      } else {
        t = setTimeout(() => {
          setRoleIndex(i => (i + 1) % roles.length);
          setTyping(true);
        }, 0);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, typing, roleIndex]);

  // Fetch real projects
  useEffect(() => {
    fetch('/api/projects/published')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length >= 1) setProjects(d); })
      .catch(() => {});
  }, []);

  // Auto-rotate every 4s
  useEffect(() => {
    if (projects.length <= 3) return;
    const pages = Math.ceil(projects.length / 3);
    const id = setInterval(() => setPage(p => (p + 1) % pages), 4000);
    return () => clearInterval(id);
  }, [projects]);

  // Get the 3 cards for this page
  const start = page * 3;
  const trio = [
    projects[start % projects.length],
    projects[(start + 1) % projects.length],
    projects[(start + 2) % projects.length],
  ];
  const pages = Math.ceil(projects.length / 3);

  return (
    <section className="hero-section" style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      padding: '2rem 2.5rem',
      alignItems: 'start',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Grid BG */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,230,118,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,230,118,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '5%', left: '-15%',
        width: '650px', height: '650px',
        background: 'radial-gradient(circle, rgba(0,230,118,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-5%', right: '-5%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(36,150,237,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── LEFT ── */}
      <div className="hero-copy" style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        paddingBottom: '2rem',
        animation: 'fadeUp 0.8s ease both',
      }}>

        {/* Status badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '5px 14px 5px 8px',
          background: 'var(--bg2)',
          border: '1px solid var(--border-green)',
          borderRadius: '100px',
          fontFamily: 'var(--mono)', fontSize: '0.72rem',
          color: 'var(--text2)', marginBottom: '2rem',
          width: 'fit-content',
        }}>
          <span style={{
            width: '7px', height: '7px',
            background: 'var(--green)', borderRadius: '50%',
            boxShadow: '0 0 8px var(--green)',
            animation: 'pulse 2s infinite',
          }} />
          CONTAINER STATUS:&nbsp;<b style={{ color: 'var(--green)' }}>RUNNING</b>
          &nbsp;·&nbsp;AVAILABLE FOR WORK
        </div>

        {/* Typing role */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.72rem',
          color: 'var(--green)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          minHeight: '1.2rem',
        }}>
          <span style={{ display: 'block', width: '24px', height: '1px', background: 'var(--green)', flexShrink: 0 }} />
          {displayed}
          <span style={{
            width: '2px', height: '1em',
            background: 'var(--green)', display: 'inline-block',
            animation: 'blink 1s infinite', flexShrink: 0,
          }} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 5vw, 5rem)',
          fontWeight: 700, lineHeight: 1.05,
          letterSpacing: '-0.025em', marginBottom: '1.5rem',
        }}>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{ display: 'block', animation: 'slideUp 0.7s ease both' }}>BUILD.</span>
          </span>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{ display: 'block', color: 'var(--green)', animation: 'slideUp 0.7s 0.1s ease both' }}>CONTAIN.</span>
          </span>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{ display: 'block', color: 'var(--text2)', animation: 'slideUp 0.7s 0.2s ease both' }}>DEPLOY.</span>
          </span>
        </h1>

        <p style={{
          fontSize: '1.05rem', color: 'var(--text2)',
          lineHeight: 1.75, maxWidth: '480px', marginBottom: '2.5rem',
          animation: 'fadeUp 0.8s 0.3s ease both',
        }}>
          I architect and ship production-grade systems. From containerized
          microservices to full-stack platforms — everything runs, everything scales.
        </p>

        {/* CTAs */}
        <div className="hero-actions" style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap',
          marginBottom: '3rem',
          animation: 'fadeUp 0.8s 0.4s ease both',
        }}>
          <Link href="/projects" style={{
            padding: '13px 28px',
            background: 'var(--green)', color: '#000',
            fontWeight: 700, fontSize: '0.9rem',
            borderRadius: '8px', textDecoration: 'none',
            transition: 'opacity 0.2s, transform 0.2s',
            boxShadow: '0 4px 20px var(--green-glow)',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.opacity = '0.88';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }}
          >
            View Projects →
          </Link>
          <Link href="/contact" style={{
            padding: '13px 28px',
            background: 'transparent', color: 'var(--text)',
            fontWeight: 600, fontSize: '0.9rem',
            borderRadius: '8px', textDecoration: 'none',
            border: '1px solid var(--border)',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(255,255,255,0.2)';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'var(--border)';
              el.style.transform = 'translateY(0)';
            }}
          >
            Get In Touch
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{
          display: 'flex', gap: '2.5rem',
          paddingTop: '2rem', borderTop: '1px solid var(--border)',
          animation: 'fadeUp 0.8s 0.5s ease both',
        }}>
          {[
            { val: '10+', label: 'Containers Shipped' },
            { val: '3+', label: 'Years Building' },
            { val: '100%', label: 'Open Source' },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '1.6rem',
                fontWeight: 700, lineHeight: 1, color: 'var(--text)',
              }}>
                {s.val.replace(/[+%]/g, '')}
                <span style={{ color: 'var(--green)' }}>{s.val.match(/[+%]/)?.[0]}</span>
              </div>
              <div style={{
                fontSize: '0.72rem', color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Cards ── */}
      <div className="hero-projects" style={{
        position: 'relative', zIndex: 1,
        paddingTop: '2rem',
        animation: 'fadeUp 1s 0.3s ease both',
      }}>

        {/* Pagination dots */}
        {pages > 1 && (
          <div style={{
            display: 'flex', gap: '0.4rem',
            justifyContent: 'flex-end', marginBottom: '0.75rem',
          }}>
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)} style={{
                width: i === page ? '22px' : '7px',
                height: '7px', borderRadius: '4px', border: 'none', padding: 0,
                background: i === page ? 'var(--green)' : 'var(--border)',
                cursor: 'pointer', transition: 'all 0.35s',
              }} />
            ))}
          </div>
        )}

        {/* Card grid — key on page triggers CSS animation via cardIn keyframe */}
        <div key={page} className="hero-project-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}>
          <ContainerCard
            project={trio[0]}
            serial="SRV-001"
            large
          />
          <ContainerCard project={trio[1]} serial="SRV-002" />
          <ContainerCard project={trio[2]} serial="SRV-003" />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
