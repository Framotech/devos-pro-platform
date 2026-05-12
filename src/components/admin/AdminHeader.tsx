export default function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-header" style={{
      padding: '1.5rem 2rem',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div className="admin-header__copy">
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.65rem',
          color: 'var(--text3)', textTransform: 'uppercase',
          letterSpacing: '0.15em', marginBottom: '4px',
        }}>
          Admin OS · Control Room
        </div>
        <h1 style={{
          fontSize: '1.4rem', fontWeight: 700,
          letterSpacing: '-0.01em', color: 'var(--text)',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="admin-header__action">{action}</div>}
    </div>
  );
}
