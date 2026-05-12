import PublicLayout from '@/components/shared/PublicLayout';

export default function CommunityPage() {
  return (
    <PublicLayout>
      <section style={{
        minHeight: '80vh', padding: '4rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        maxWidth: '800px', margin: '0 auto', textAlign: 'center',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--green)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
            Coming Soon
            <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700, letterSpacing: '-0.02em',
            lineHeight: 1.1, marginBottom: '1.5rem',
          }}>
            Framo <span style={{ color: 'var(--green)' }}>Community</span>
          </h1>

          <p style={{
            fontSize: '1.1rem', color: 'var(--text2)',
            lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 2.5rem',
          }}>
            A dedicated space for developers, students, and builders to connect,
            collaborate, and grow together. Discussions, live sessions, workshops,
            and community support — all in one place.
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1rem',
            justifyContent: 'center', marginBottom: '3rem',
          }}>
            {[
              { icon: '💬', label: 'Community Chat' },
              { icon: '🎓', label: 'Student Support' },
              { icon: '🔴', label: 'Live Sessions' },
              { icon: '🛠️', label: 'Workshops' },
              { icon: '👥', label: 'Peer Collaboration' },
              { icon: '🏆', label: 'Challenges' },
            ].map(item => (
              <div key={item.label} style={{
                padding: '10px 18px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '0.88rem', color: 'var(--text2)',
              }}>
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>

          {/* Notify form */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border-green)',
            borderRadius: '16px', padding: '2rem',
          }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text3)',
              textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem',
            }}>
              Get notified when we launch
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '440px', margin: '0 auto' }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: '8px', color: 'var(--text)',
                  fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--sans)',
                }}
              />
              <button style={{
                padding: '12px 20px', background: 'var(--green)',
                color: '#000', fontWeight: 700, fontSize: '0.9rem',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', whiteSpace: 'nowrap',
              }}>
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
