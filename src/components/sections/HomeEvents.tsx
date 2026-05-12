'use client';

import { useEffect, useState } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  registrationLink: string;
  prize: string;
  tags: string[];
  status: string;
  featured: boolean;
}

const typeColors: Record<string, string> = {
  hackathon: '#9945FF',
  contest: 'var(--blue)',
  workshop: 'var(--green)',
  live: '#ef4444',
  community: '#F0B429',
  competition: 'var(--green)',
};

const typeEmojis: Record<string, string> = {
  hackathon: '🏆',
  contest: '🥇',
  workshop: '🛠️',
  live: '🔴',
  community: '👥',
  competition: '⚡',
};

const statusColors: Record<string, string> = {
  upcoming: 'var(--blue)',
  ongoing: 'var(--green)',
  ended: 'var(--text3)',
};

export default function HomeEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events/published')
      .then(r => r.json())
      .then(d => {
        setEvents(Array.isArray(d) ? d.slice(0, 3) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && events.length === 0) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section style={{
      padding: '5rem 2.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
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
            Events & Challenges
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Upcoming <span style={{ color: 'var(--green)' }}>Events</span>
          </h2>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '200px', background: 'var(--bg2)',
              border: '1px solid var(--border)', borderRadius: '12px',
              animation: 'pulse 1.5s infinite',
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {events.map(event => (
            <div key={event._id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = typeColors[event.type] || 'var(--border-green)';
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
              {/* Cover / Header */}
              <div style={{
                height: '120px',
                background: event.coverImage
                  ? `url(${event.coverImage}) center/cover`
                  : `linear-gradient(135deg, ${typeColors[event.type]}20, var(--bg3))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {!event.coverImage && (
                  <span style={{ fontSize: '2.5rem' }}>{typeEmojis[event.type] || '📅'}</span>
                )}
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  fontFamily: 'var(--mono)', fontSize: '0.6rem',
                  color: typeColors[event.type],
                  background: 'rgba(0,0,0,0.7)',
                  padding: '3px 8px', borderRadius: '4px',
                  border: `1px solid ${typeColors[event.type]}30`,
                  backdropFilter: 'blur(4px)',
                  textTransform: 'uppercase',
                }}>
                  {event.type}
                </div>
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  fontFamily: 'var(--mono)', fontSize: '0.6rem',
                  color: statusColors[event.status],
                  background: 'rgba(0,0,0,0.7)',
                  padding: '3px 8px', borderRadius: '4px',
                  backdropFilter: 'blur(4px)',
                  textTransform: 'uppercase',
                }}>
                  {event.status}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{
                  fontWeight: 700, fontSize: '0.95rem',
                  marginBottom: '0.5rem', color: 'var(--text)',
                }}>
                  {event.title}
                </h3>

                {event.description && (
                  <p style={{
                    fontSize: '0.8rem', color: 'var(--text2)',
                    lineHeight: 1.6, marginBottom: '0.75rem',
                  }}>
                    {event.description.slice(0, 80)}...
                  </p>
                )}

                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '0.65rem',
                  color: 'var(--text3)', marginBottom: '0.75rem',
                }}>
                  {formatDate(event.startDate)} → {formatDate(event.endDate)}
                  {event.isOnline ? ' · Online' : event.location ? ` · ${event.location}` : ''}
                </div>

                {event.prize && (
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '0.65rem',
                    color: '#F0B429', marginBottom: '0.75rem',
                  }}>
                    🏆 Prize: {event.prize}
                  </div>
                )}

                {event.registrationLink && (
                  <a href={event.registrationLink} target="_blank" rel="noreferrer" style={{
                    display: 'block', padding: '9px',
                    background: typeColors[event.type] || 'var(--green)',
                    color: '#000', fontWeight: 700, fontSize: '0.82rem',
                    borderRadius: '8px', textDecoration: 'none',
                    textAlign: 'center', fontFamily: 'var(--mono)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
                  >
                    Register Now →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
