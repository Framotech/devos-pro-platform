'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Studio', href: '/studio' },
    { label: 'Academy', href: '/academy' },
    { label: 'Blog', href: '/blog' },
    { label: 'Resume', href: '/resume' },
  ];

  return (
    <nav className="site-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', height: '64px',
      background: scrolled ? 'rgba(13,17,23,0.95)' : 'rgba(13,17,23,0.8)',
      backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
      transition: 'background 0.3s',
    }}>

      {/* Logo */}
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        textDecoration: 'none', color: 'var(--text)',
      }}>
        <div style={{
          width: '32px', height: '32px', background: 'var(--green)', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 700, color: '#000', fontFamily: 'var(--mono)',
        }}>FR</div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
          framo<span style={{ color: 'var(--green)' }}>.</span>dev
        </span>
      </Link>

      {/* Navigation */}
      <button
        type="button"
        className="site-nav__toggle"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(open => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={menuOpen ? 'site-nav__links site-nav__links--open' : 'site-nav__links'} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', listStyle: 'none' }}>
        {links.map(link => {
          const active = pathname === link.href;
          const hovering = hovered === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                onMouseEnter={() => setHovered(link.href)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'block', textDecoration: 'none',
                  fontSize: '0.9rem', fontWeight: 500,
                  padding: '6px 14px', borderRadius: '6px',
                  transition: 'all 0.2s',
                  color: active || hovering ? 'var(--text)' : 'var(--text2)',
                  background: hovering ? 'var(--bg3)' : 'transparent',
                  border: hovering
                    ? '1px solid var(--border)'
                    : active
                    ? '1px solid transparent'
                    : '1px solid transparent',
                  borderBottom: active && !hovering
                    ? '1px solid var(--green)'
                    : hovering
                    ? '1px solid var(--border)'
                    : '1px solid transparent',
                }}
              >
                {link.label}
              </Link>
            </li>
          );
        })}

        {/* Hire Me CTA */}
        <li>
          <Link
            href="/contact"
            className="site-nav__cta"
            onClick={() => setMenuOpen(false)}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.opacity = '0.85';
              el.style.transform = 'translateY(-1px)';
              el.style.boxShadow = '0 4px 15px var(--green-glow)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
            }}
            style={{
              display: 'block', padding: '8px 20px',
              background: 'var(--green)', color: '#000',
              fontWeight: 700, fontSize: '0.9rem',
              borderRadius: '8px', textDecoration: 'none',
              marginLeft: '0.5rem', transition: 'all 0.2s',
            }}
          >
            Hire Me →
          </Link>
        </li>
      </ul>
    </nav>
  );
}
