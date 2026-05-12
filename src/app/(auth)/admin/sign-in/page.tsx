import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

const systemChecks = [
  { label: 'Identity gateway', value: 'Clerk secured', tone: 'var(--green)' },
  { label: 'Database core', value: 'Protected admin data', tone: 'var(--blue)' },
  { label: 'Access mode', value: 'Administrator only', tone: '#F0B429' },
];

const accessScopes = ['Projects CMS', 'Lead inbox', 'Revenue OS', 'Studio assets'];

export default function AdminSignInPage() {
  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel--intro" aria-labelledby="admin-access-title">
        <Link href="/" className="auth-brand" aria-label="Return to Framo homepage">
          <span className="auth-brand__mark">FR</span>
          <span>
            framo<span>·</span>dev
            <small>admin control room</small>
          </span>
        </Link>

        <div className="auth-intro">
          <div className="auth-kicker">
            <span />
            Secure console
          </div>
          <h1 id="admin-access-title">Administrator access for the Framo operating system.</h1>
          <p>
            Manage portfolio content, leads, courses, studio work, and business signals from
            one protected control surface.
          </p>
        </div>

        <div className="auth-terminal" aria-label="System access status">
          <div className="auth-terminal__bar">
            <span />
            <span />
            <span />
          </div>
          <div className="auth-terminal__body">
            <p><strong>$</strong> boot admin-gateway --mode secure</p>
            <p><strong>status</strong> identity challenge required</p>
            <p><strong>scope</strong> content · crm · revenue · settings</p>
          </div>
        </div>

        <div className="auth-checks">
          {systemChecks.map(check => (
            <div key={check.label}>
              <span style={{ background: check.tone, boxShadow: `0 0 10px ${check.tone}` }} />
              <div>
                <small>{check.label}</small>
                <strong>{check.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-panel auth-panel--form" aria-label="Admin sign in form">
        <div className="auth-card">
          <div className="auth-card__header">
            <div>
              <span>Admin OS</span>
              <h2>Sign in to continue</h2>
            </div>
            <div className="auth-live">
              <span />
              Live
            </div>
          </div>

          <SignIn
            routing="hash"
            forceRedirectUrl="/admin/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#00E676',
                colorBackground: '#161B22',
                colorText: '#E6EDF3',
                colorTextSecondary: '#8B949E',
                colorInputBackground: '#1C2128',
                colorInputText: '#E6EDF3',
                colorDanger: '#ef4444',
                borderRadius: '10px',
                fontFamily: 'var(--sans)',
              },
              elements: {
                rootBox: 'auth-clerk-root',
                cardBox: 'auth-clerk-card',
                card: 'auth-clerk-card',
                header: 'auth-clerk-hidden',
                footer: 'auth-clerk-footer',
                socialButtonsBlockButton: 'auth-clerk-social',
                formButtonPrimary: 'auth-clerk-primary',
                formFieldInput: 'auth-clerk-input',
                formFieldLabel: 'auth-clerk-label',
                identityPreview: 'auth-clerk-identity',
                formFieldAction: 'auth-clerk-link',
                footerActionLink: 'auth-clerk-link',
              },
            }}
          />

          <div className="auth-scopes" aria-label="Protected admin areas">
            {accessScopes.map(scope => (
              <span key={scope}>{scope}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
