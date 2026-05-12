export default function MarqueeStrip() {
  const items = [
    'BUILD', 'CONTAIN', 'DEPLOY', 'DOCKER',
    'NEXT.JS', 'NODE.JS', 'DEVOPS', 'MONGODB',
    'SYSTEM ONLINE', 'BUILD', 'CONTAIN', 'DEPLOY',
    'DOCKER', 'NEXT.JS', 'NODE.JS', 'DEVOPS',
    'MONGODB', 'SYSTEM ONLINE',
  ];

  return (
    <div style={{
      position: 'fixed',
      top: '64px',
      left: 0, right: 0,
      zIndex: 99,
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        gap: '3rem',
        animation: 'marquee 25s linear infinite',
        whiteSpace: 'nowrap',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.7rem',
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            {item} <span style={{ color: 'var(--green)' }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
