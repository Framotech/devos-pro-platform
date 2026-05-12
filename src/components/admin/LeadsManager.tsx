'use client';

import { useState, useEffect, useCallback } from 'react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: 'var(--green)',
  read: 'var(--blue)',
  replied: '#9945FF',
  archived: 'var(--text3)',
};

export default function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);

  const fetchLeads = useCallback (async () => {
    setLoading(true);
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => { 
    const loadLeads = async () => {await fetchLeads(); };
    loadLeads();
 },  [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    setSelected(null);
    fetchLeads();
  };

  return (
    <div className="admin-page-pad admin-leads-grid" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Leads list */}
      <div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.65rem',
          color: 'var(--text3)', textTransform: 'uppercase',
          letterSpacing: '0.15em', marginBottom: '1rem',
        }}>
          {leads.length} submissions
        </div>

        {loading ? (
          <div style={{ fontFamily: 'var(--mono)', color: 'var(--text3)', padding: '2rem', textAlign: 'center' }}>
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '3rem', textAlign: 'center',
            fontFamily: 'var(--mono)', color: 'var(--text3)',
          }}>
            No leads yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {leads.map(lead => (
              <div key={lead._id} onClick={() => setSelected(lead)} style={{
                background: selected?._id === lead._id ? 'var(--green-dim)' : 'var(--bg2)',
                border: `1px solid ${selected?._id === lead._id ? 'var(--border-green)' : 'var(--border)'}`,
                borderRadius: '10px', padding: '1rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{lead.name}</div>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.58rem',
                    padding: '2px 7px', borderRadius: '4px',
                    color: statusColors[lead.status],
                    background: `${statusColors[lead.status]}15`,
                    border: `1px solid ${statusColors[lead.status]}30`,
                    textTransform: 'uppercase',
                  }}>
                    {lead.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: '2px' }}>{lead.email}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>
                  {lead.subject || 'No subject'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lead detail */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '1.5rem',
        position: 'sticky', top: '1rem',
      }}>
        {!selected ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            fontFamily: 'var(--mono)', color: 'var(--text3)',
          }}>
            Select a lead to view details
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{selected.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{selected.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => deleteLead(selected._id)} style={{
                  padding: '6px 12px', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px',
                  color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem',
                  fontFamily: 'var(--sans)',
                }}>
                  Delete
                </button>
              </div>
            </div>

            {selected.subject && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Subject</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{selected.subject}</div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase' }}>Message</div>
              <div style={{
                fontSize: '0.9rem', color: 'var(--text2)',
                lineHeight: 1.7, background: 'var(--bg3)',
                padding: '1rem', borderRadius: '8px',
                border: '1px solid var(--border)',
              }}>
                {selected.message}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase' }}>Update Status</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['new', 'read', 'replied', 'archived'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)} style={{
                    padding: '7px 14px',
                    background: selected.status === s ? `${statusColors[s]}20` : 'var(--bg3)',
                    border: `1px solid ${selected.status === s ? statusColors[s] : 'var(--border)'}`,
                    borderRadius: '6px',
                    color: selected.status === s ? statusColors[s] : 'var(--text2)',
                    cursor: 'pointer', fontSize: '0.8rem',
                    fontFamily: 'var(--mono)', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
