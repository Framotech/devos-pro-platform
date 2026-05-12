'use client';

type DashboardStats = {
  projects: number;
  leads: number;
  newLeads: number;
  posts: number;
  testimonials: number;
};

type Lead = {
  _id: string;
  name: string;
  email: string;
  status: string;
};

const statCards = (stats: DashboardStats) => [
  {
    label: 'Total Projects',
    value: stats.projects,
    icon: '🐳',
    color: 'var(--blue)',
    sub: 'Deployed containers',
  },
  {
    label: 'Total Leads',
    value: stats.leads,
    icon: '📬',
    color: 'var(--green)',
    sub: `${stats.newLeads} new unread`,
  },
  {
    label: 'Blog Posts',
    value: stats.posts,
    icon: '📝',
    color: '#9945FF',
    sub: 'Published articles',
  },
  {
    label: 'Pending Reviews',
    value: stats.testimonials,
    icon: '⭐',
    color: '#F0B429',
    sub: 'Awaiting approval',
  },
];

export default function DashboardClient({
  stats,
  recentLeads,
}: {
  stats: DashboardStats;
  recentLeads: Lead[];
}) {
  return (
    <div className="admin-page-pad" style={{ padding: '2rem' }}>
      {/* Stat cards */}
      <div className="admin-stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {statCards(stats).map(card => (
          <div key={card.label} style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = card.color;
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--border)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '1rem',
            }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'var(--bg3)', borderRadius: '8px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.2rem',
              }}>
                {card.icon}
              </div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '0.6rem',
                color: card.color, textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: `${card.color}15`,
                padding: '3px 8px', borderRadius: '4px',
              }}>
                LIVE
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '2rem',
              fontWeight: 700, color: 'var(--text)', lineHeight: 1,
              marginBottom: '4px',
            }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions + Recent leads */}
      <div className="admin-dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '1rem',
      }}>
        {/* Quick actions */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.5rem',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.65rem',
            color: 'var(--text3)', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: '1.25rem',
          }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Add New Project', href: '/admin/projects', color: 'var(--blue)' },
              { label: 'Write Blog Post', href: '/admin/blog', color: '#9945FF' },
              { label: 'View New Leads', href: '/admin/leads', color: 'var(--green)' },
              { label: 'Approve Reviews', href: '/admin/testimonials', color: '#F0B429' },
              { label: 'Update Settings', href: '/admin/settings', color: 'var(--text2)' },
            ].map(action => (
              <a key={action.label} href={action.href} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.88rem',
                color: 'var(--text2)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = action.color;
                  el.style.color = 'var(--text)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.color = 'var(--text2)';
                }}
              >
                {action.label}
                <span style={{ color: action.color }}>→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.5rem',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '1.25rem',
          }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '0.65rem',
              color: 'var(--text3)', textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}>
              Recent Leads
            </div>
            <a href="/admin/leads" style={{
              fontFamily: 'var(--mono)', fontSize: '0.65rem',
              color: 'var(--green)', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              View All →
            </a>
          </div>

          {recentLeads.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '2rem',
              color: 'var(--text3)', fontSize: '0.88rem',
              fontFamily: 'var(--mono)',
            }}>
              No leads yet. Share your portfolio!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentLeads.map((lead: Lead) => (
                <div key={lead._id} style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px',
                      background: 'var(--green-dim)',
                      border: '1px solid var(--border-green)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--mono)', fontSize: '0.72rem',
                      color: 'var(--green)', fontWeight: 700,
                    }}>
                      {lead.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                        {lead.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                        {lead.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: '0.6rem',
                      padding: '3px 8px', borderRadius: '4px',
                      textTransform: 'uppercase',
                      background: lead.status === 'new' ? 'var(--green-dim)' : 'var(--bg2)',
                      color: lead.status === 'new' ? 'var(--green)' : 'var(--text3)',
                      border: `1px solid ${lead.status === 'new' ? 'var(--border-green)' : 'var(--border)'}`,
                    }}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
