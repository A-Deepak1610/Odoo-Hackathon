import React from 'react';
import { Wrench, Plus, ChevronRight } from 'lucide-react';

const Maintenance = () => {
  const statsCards = [
    { label: 'Total Requests', value: '128', subtitle: 'This month', color: '#1e3a8a', bg: '#eff6ff' },
    { label: 'In Progress', value: '12', subtitle: 'Being worked on', color: '#b45309', bg: '#fef3c7' },
    { label: 'Resolved', value: '94', subtitle: 'Successfully fixed', color: '#16a34a', bg: '#ecfdf5' },
    { label: 'Avg. Time', value: '2.3d', subtitle: 'Days to resolve', color: '#7c3aed', bg: '#f3e8ff' },
  ];

  const mockMaintenance = [
    { id: 'MNT-4021', asset: 'HVAC System Unit B', issue: 'Not cooling properly', reportedBy: 'Facilities', priority: 'High', stage: 'In Progress', progress: 60 },
    { id: 'MNT-4022', asset: 'Delivery Van #4', issue: 'Brake pad replacement', reportedBy: 'Logistics', priority: 'Medium', stage: 'Technician Assigned', progress: 40 },
    { id: 'MNT-4023', asset: 'Projector A1', issue: 'Bulb burned out', reportedBy: 'Marketing', priority: 'Low', stage: 'Pending', progress: 20 },
    { id: 'MNT-4024', asset: 'MacBook Pro 16"', issue: 'Keyboard keys sticky', reportedBy: 'Sarah Jenkins', priority: 'Medium', stage: 'Resolved', progress: 100 },
  ];

  const getPriorityColor = (priority) => {
    if (priority === 'High') return { bg: '#fef2f2', text: '#dc2626' };
    if (priority === 'Medium') return { bg: '#fef3c7', text: '#b45309' };
    return { bg: '#dcfce7', text: '#15803d' };
  };

  const getStageColor = (stage) => {
    if (stage === 'In Progress') return { bg: '#fef3c7', text: '#b45309' };
    if (stage === 'Resolved') return { bg: '#dcfce7', text: '#15803d' };
    if (stage === 'Technician Assigned') return { bg: '#dbeafe', text: '#1d4ed8' };
    return { bg: '#f1f5f9', text: '#475569' };
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* ── PAGE HEADER ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 8px 0', color: '#1e293b' }}>Maintenance Requests</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Track repair requests, assign technicians, and monitor maintenance workflows.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 18px', background: '#1e3a8a', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={16} />
          Raise Request
        </button>
      </div>

      {/* ── STAT CARDS (4-col) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {statsCards.map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* ── MAINTENANCE CARDS ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockMaintenance.map((req) => {
          const priorityColor = getPriorityColor(req.priority);
          const stageColor = getStageColor(req.stage);
          return (
            <div key={req.id} style={{
              background: 'white', border: '1px solid #e2e8f0',
              borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#1e3a8a';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-start' }}>
                {/* Left: Asset & Issue */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#1e3a8a', fontWeight: 600 }}>{req.id}</span>
                    <span style={{
                      background: stageColor.bg, color: stageColor.text,
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                    }}>
                      {req.stage}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{req.asset}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 6px 0' }}>{req.issue}</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Reported by {req.reportedBy}</p>
                </div>

                {/* Center: Priority & Progress */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      background: priorityColor.bg, color: priorityColor.text,
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                    }}>
                      {req.priority}
                    </span>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>Workflow Progress: {req.progress}%</div>
                    <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#1e3a8a', width: `${req.progress}%`, borderRadius: '2px', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>

                {/* Right: Action */}
                <button style={{
                  background: 'white', border: '1px solid #e2e8f0',
                  width: '32px', height: '32px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s', color: '#64748b',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#1e3a8a';
                  e.currentTarget.style.color = '#1e3a8a';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#64748b';
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Maintenance;
