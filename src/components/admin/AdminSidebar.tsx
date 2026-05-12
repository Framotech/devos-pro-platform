'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: '⚡' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: '🐳' },
      { label: 'Studio', href: '/admin/studio', icon: '🎨' },
      { label: 'Blog Posts', href: '/admin/blog', icon: '📝' },
      { label: 'Skills', href: '/admin/skills', icon: '🛠️' },
      { label: 'Experience', href: '/admin/experience', icon: '📅' },
      { label: 'Videos', href: '/admin/videos', icon: '🎥' },
      { label: 'Courses', href: '/admin/courses', icon: '🎓' },
      { label: 'Testimonials', href: '/admin/testimonials', icon: '⭐' },
      { label: 'Revenue OS', href: '/admin/revenue', icon: '💰' },
    ],
  },
  {
    label: 'Data',
    items: [
      { label: 'Leads / CRM', href: '/admin/leads', icon: '📬' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="admin-sidebar" style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: '260px',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div className="admin-sidebar__brand" style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--green)', borderRadius: '6px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 700, color: '#000',
          flexShrink: 0,
        }}>FR</div>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.8rem',
            color: 'var(--text)', fontWeight: 600,
          }}>
            framo<span style={{ color: 'var(--green)' }}>.</span>dev
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.6rem',
            color: 'var(--text3)', textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Admin OS
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="admin-sidebar__status" style={{
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontFamily: 'var(--mono)', fontSize: '0.65rem',
        color: 'var(--text3)',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 6px var(--green)',
          animation: 'pulse 2s infinite',
        }} />
        ALL SYSTEMS OPERATIONAL
      </div>

      {/* Nav */}
      <nav className="admin-sidebar__nav" style={{ flex: 1, padding: '1rem 0' }}>
        {navGroups.map(group => (
          <div className="admin-sidebar__group" key={group.label} style={{ marginBottom: '0.5rem' }}>
            <div className="admin-sidebar__label" style={{
              padding: '0.5rem 1.5rem',
              fontFamily: 'var(--mono)', fontSize: '0.6rem',
              color: 'var(--text3)', textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}>
              {group.label}
            </div>
            {group.items.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-sidebar__link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 1.5rem',
                    margin: '1px 0.5rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--green)' : 'var(--text2)',
                    background: active ? 'var(--green-dim)' : 'transparent',
                    border: active ? '1px solid var(--border-green)' : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = 'var(--bg3)';
                      el.style.color = 'var(--text)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = 'transparent';
                      el.style.color = 'var(--text2)';
                    }
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="admin-sidebar__user" style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <UserButton />
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
            {user?.firstName ?? 'Francis'} {user?.lastName ?? 'Amoako'}
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.62rem',
            color: 'var(--text3)', textTransform: 'uppercase',
          }}>
            Administrator
          </div>
        </div>
      </div>
    </aside>
  );
}
