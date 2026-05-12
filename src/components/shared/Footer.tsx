'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg)',
      padding: '3rem 2.5rem 2rem',
    }}>
      <div className="site-footer__grid" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '3rem',
        marginBottom: '3rem',
      }}>
        {/* Brand */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '1rem',
          }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'var(--green)', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: '#000',
            }}>FR</div>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--text)',
            }}>
              framo<span style={{ color: 'var(--green)' }}>.</span>dev
            </span>
          </div>
          <p style={{
            fontSize: '0.85rem', color: 'var(--text2)',
            lineHeight: 1.7, maxWidth: '260px', marginBottom: '1.25rem',
          }}>
            Production-grade systems for modern infrastructure.
          </p>
          {/* Status */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--text3)',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--green)', boxShadow: '0 0 6px var(--green)',
              animation: 'pulse 2s infinite',
            }} />
            All systems operational
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.65rem',
            color: 'var(--text3)', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: '1rem',
          }}>
            Navigation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: 'Studio', href: '/studio' },
              { label: 'Academy', href: '/academy' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
              { label: 'Community', href: '/community' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: '0.88rem', color: 'var(--text2)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--green)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text2)'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Work */}
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.65rem',
            color: 'var(--text3)', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: '1rem',
          }}>
            Work
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'DevOS Portfolio', href: '/projects' },
              { label: 'Bhadda Awards', href: '/projects' },
              { label: 'Docker Portfolio v1', href: '/projects' },
              { label: 'GitHub', href: 'https://github.com/Framotech' },
            ].map(link => (
              <Link key={link.label} href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                style={{
                  fontSize: '0.88rem', color: 'var(--text2)',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--green)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text2)'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.65rem',
            color: 'var(--text3)', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: '1rem',
          }}>
            Connect
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Hire Me', href: '/contact' },
              { label: 'LinkedIn', href: '#' },
              { label: 'Twitter / X', href: '#' },
              { label: 'Email Me', href: 'mailto:francis@framo.dev' },
            ].map(link => (
              <Link key={link.label} href={link.href} style={{
                fontSize: '0.88rem', color: 'var(--text2)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--green)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text2)'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        paddingTop: '2rem', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--text3)',
        }}>
          @ {year} Francis Amoako.
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--text3)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--green)', animation: 'pulse 2s infinite',
          }} />
          Accra, Ghana
        </div>
      </div>
    </footer>
  );
}
