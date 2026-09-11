import { useState } from 'react';
import { HOSPITAL_LOCATIONS, HOSPITAL_INFO, DEPARTMENTS } from '../data/hospitalData';
import { QrCode, Printer, Download, UserCheck, ShieldAlert, ArrowLeft, CheckCircle2, Clock, XCircle, Search, Sparkles } from 'lucide-react';

export default function AdminView({ doctors, onUpdateDoctorStatus, onBackToApp }) {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'doctors'
  const [baseUrl, setBaseUrl]     = useState(HOSPITAL_INFO.productionUrl || window.location.origin);
  const [searchDoc, setSearchDoc] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Filter doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(searchDoc.toLowerCase()) || doc.spec.toLowerCase().includes(searchDoc.toLowerCase());
    const matchDept   = selectedDept === 'ALL' || doc.deptId === selectedDept;
    return matchSearch && matchDept;
  });

  function handlePrint() {
    window.print();
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'available':
        return { label: 'Available', color: '#06D6A0', bg: '#e6faf5', icon: <CheckCircle2 size={14} color="#059173" /> };
      case 'in_surgery':
        return { label: 'In Surgery / OPD', color: '#f59e0b', bg: '#fef3c7', icon: <Clock size={14} color="#d97706" /> };
      case 'on_leave':
        return { label: 'On Leave', color: '#ef476f', bg: '#fde8ee', icon: <XCircle size={14} color="#c0244b" /> };
      default:
        return { label: 'Unknown', color: '#64748b', bg: '#f1f5f9', icon: null };
    }
  }

  return (
    <div className="view bottom-safe admin-container">
      {/* Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', pb: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0f172a, #0077B6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Admin Portal</h2>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {HOSPITAL_INFO.name} ({HOSPITAL_INFO.campus})
            </p>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={onBackToApp}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={16} /> Exit Admin
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs-nav" style={{ display: 'flex', gap: 8, background: 'var(--color-surface-2)', padding: 4, borderRadius: 'var(--radius-md)' }}>
        <button
          className={`admin-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
        >
          <QrCode size={16} />
          Printable Wall QR Tags
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          <UserCheck size={16} />
          Doctor Attendance
        </button>
      </div>

      {/* TAB 1: PRINTABLE QR WALL POSTERS */}
      {activeTab === 'qr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Target Domain Config Card */}
          <div className="card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="var(--color-primary)" />
              Target Website Domain for Wall QR Codes:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="url"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.88rem', outline: 'none' }}
                placeholder="https://arogya-nav.vercel.app"
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handlePrint}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Printer size={16} />
                🖨️ Print Wall Posters
              </button>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
              💡 Scanned wall codes point to <b>{baseUrl}</b> so visitors on <b>any 4G/5G mobile network</b> can open ArogyaNav directly!
            </p>
          </div>

          {/* Printable Wall Tags Grid */}
          <div className="printable-qr-grid" id="printable-area">
            {Object.values(HOSPITAL_LOCATIONS).map(loc => {
              const targetUrl = `${baseUrl.replace(/\/$/, '')}/?loc=${loc.id}`;
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(targetUrl)}`;

              return (
                <div key={loc.id} className="qr-poster-card">
                  {/* Poster Header */}
                  <div className="qr-poster-header">
                    <span className="poster-hospital">{HOSPITAL_INFO.name}</span>
                    <h3 className="poster-title">{loc.name}</h3>
                    <p className="poster-meta">{loc.floor} · {loc.wing}</p>
                  </div>

                  {/* QR Image Container */}
                  <div className="qr-image-wrapper">
                    <img src={qrImageUrl} alt={`${loc.name} QR Code`} className="qr-code-img" />
                    <span className="qr-loc-code">{loc.id}</span>
                  </div>

                  {/* Instructions Footer */}
                  <div className="qr-poster-footer">
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>
                      📷 Scan with Google Lens or Phone Camera
                    </p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                      Instant Step-by-Step Indoor Hospital Directions
                    </p>
                  </div>

                  {/* Screen-Only Download Button */}
                  <a
                    href={qrImageUrl}
                    download={`${loc.id}-${loc.name.replace(/\s+/g, '_')}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print btn btn-outline btn-sm"
                    style={{ marginTop: 8, fontSize: '0.78rem', width: '100%' }}
                  >
                    <Download size={14} /> Download Tag Image
                  </a>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: DOCTOR ATTENDANCE & AVAILABILITY */}
      {activeTab === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Controls: Search & Dept Filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} />
              <input
                type="search"
                className="search-bar"
                style={{ paddingLeft: 38, fontSize: '0.88rem', padding: '10px 10px 10px 38px' }}
                placeholder="Search doctor or specialty..."
                value={searchDoc}
                onChange={e => setSearchDoc(e.target.value)}
              />
            </div>

            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: '#fff', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <option value="ALL">All Departments ({DEPARTMENTS.length})</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.shortName}</option>
              ))}
            </select>
          </div>

          {/* Doctors List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredDoctors.map(doc => {
              const dept = DEPARTMENTS.find(d => d.id === doc.deptId);
              const statusCfg = getStatusBadge(doc.status);

              return (
                <div key={doc.id} className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>{doc.name}</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {doc.spec} · <strong style={{ color: 'var(--color-primary)' }}>{dept?.shortName}</strong>
                      </p>
                    </div>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: statusCfg.bg, color: statusCfg.color, fontSize: '0.75rem', fontWeight: 700 }}>
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Attendance Toggle Buttons */}
                  <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #f1f5f9', pt: 8 }}>
                    <button
                      className={`btn btn-sm ${doc.status === 'available' ? 'btn-accent' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem' }}
                      onClick={() => onUpdateDoctorStatus(doc.id, 'available')}
                    >
                      🟢 Available
                    </button>
                    <button
                      className={`btn btn-sm ${doc.status === 'in_surgery' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem' }}
                      onClick={() => onUpdateDoctorStatus(doc.id, 'in_surgery')}
                    >
                      🟡 In Surgery / OPD
                    </button>
                    <button
                      className={`btn btn-sm ${doc.status === 'on_leave' ? 'btn-danger' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem' }}
                      onClick={() => onUpdateDoctorStatus(doc.id, 'on_leave')}
                    >
                      🔴 On Leave
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
