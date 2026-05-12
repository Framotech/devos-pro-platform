'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      className="no-print"
      onClick={() => window.print()}
      style={{
        padding: '0.8rem 1rem',
        background: 'var(--green)',
        color: '#000',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'var(--sans)',
      }}
    >
      Download PDF
    </button>
  );
}
