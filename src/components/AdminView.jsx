import { useState, lazy, Suspense } from 'react';
import { HOSPITAL_LOCATIONS, HOSPITAL_INFO, DEPARTMENTS } from '../data/hospitalData';
import {
  QrCode, Printer, Download, UserCheck, ShieldAlert, ArrowLeft,
  CheckCircle2, Clock, XCircle, Search, Sparkles, Map, Crown, Building2,
} from 'lucide-react';

// Lazy-load the Konva map editor (only for Super Admin)
const MapEditorView = lazy(() => import('./MapEditorView'));

// ── Role badge config ─────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  super: {
    label: 'Super Admin',
    icon: Crown,
    color: '#0f172a',
    bg: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
    badge: '#fff',
    desc: 'Full platform access',
    defaultTab: 'qr',
  },
  hospital: {
    label: 'Hospital Admin',
    icon: Building2,
    color: '#0077B6',
    bg: 'linear-gradient(135deg, #0077B6, #00B4D8)',
    badge: '#fff',
    desc: 'Doctor & department management',
    defaultTab: 'doctors',
  },
};

// ── Status badge helper ────────────────────────────────────────────────────────
function getStatusBadge(status) {
  switch (status) {
    case 'available':
      return { label: 'Available',        color: '#06D6A0', bg: '#e6faf5', icon: <CheckCircle2 size={14} color="#059173" /> };
    case 'in_surgery':
      return { label: 'In Surgery / OPD', color: '#f59e0b', bg: '#fef3c7', icon: <Clock        size={14} color="#d97706" /> };
    case 'on_leave':
      return { label: 'On Leave',          color: '#ef476f', bg: '#fde8ee', icon: <XCircle      size={14} color="#c0244b" /> };
    default:
      return { label: 'Unknown',           color: '#64748b', bg: '#f1f5f9', icon: null };
  }
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminView({ adminRole = 'super', doctors, onUpdateDoctorStatus, onBackToApp }) {
  const cfg = ROLE_CONFIG[adminRole] || ROLE_CONFIG.super;

  // Tabs available per role
  const isSuperAdmin    = adminRole === 'super';
  const isHospitalAdmin = adminRole === 'hospital';

  const [activeTab, setActiveTab]     = useState(cfg.defaultTab);
  const [mapEditorOpen, setMapEditorOpen] = useState(false);
  const [baseUrl, setBaseUrl]         = useState(HOSPITAL_INFO.productionUrl || window.location.origin);
  const [searchDoc, setSearchDoc]     = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const RoleIcon = cfg.icon;

  // Filter doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(searchDoc.toLowerCase()) ||
                        doc.spec.toLowerCase().includes(searchDoc.toLowerCase());
    const matchDept   = selectedDept === 'ALL' || doc.deptId === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="view bottom-safe admin-container">

      {/* ── Admin Header ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)', paddingBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: cfg.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <RoleIcon size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {cfg.label}
              </h2>
              <span style={{
                fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                background: isSuperAdmin ? '#0f172a' : '#0077B6', color: '#fff', letterSpacing: '0.04em',
              }}>
                {isSuperAdmin ? 'SUPER' : 'HOSPITAL'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {HOSPITAL_INFO.name} &mdash; {cfg.desc}
            </p>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={onBackToApp}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={16} /> Logout
        </button>
      </div>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 6, background: 'var(--color-surface-2)',
        padding: 4, borderRadius: 'var(--radius-md)', flexWrap: 'wrap',
      }}>
        {/* QR Codes — Super Admin only */}
        {isSuperAdmin && (
          <button
            className={`admin-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            <QrCode size={15} /> QR Code Manager
          </button>
        )}

        {/* Doctor Attendance — both roles */}
        <button
          className={`admin-tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          <UserCheck size={15} /> Doctor Attendance
        </button>

        {/* Map Editor — Super Admin only — opens as fullscreen overlay */}
        {isSuperAdmin && (
          <button
            className="admin-tab-btn"
            onClick={() => setMapEditorOpen(true)}
            style={{ background: '#0f172a', color: '#fff', border: 'none' }}
          >
            <Map size={15} /> Open Map Editor
          </button>
        )}
      </div>

      {/* ── Hospital Admin welcome banner ─────────────────────────────────── */}
      {isHospitalAdmin && (
        <div style={{
          background: 'linear-gradient(135deg, #eff8ff, #dbeafe)',
          border: '1px solid #93c5fd', borderRadius: 10,
          padding: '10px 14px', fontSize: '0.8rem', color: '#1e40af', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Building2 size={15} color="#2563eb" />
          <span>
            You are logged in as <strong>Hospital Admin</strong>. You can manage doctor availability and attendance.
            Contact <strong>Super Admin</strong> to update the hospital map or QR codes.
          </span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: QR CODE MANAGER (Super Admin only) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'qr' && isSuperAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* URL Config */}
          <div className="card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="var(--color-primary)" />
              Target Website for Wall QR Codes
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
                onClick={() => window.print()}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Printer size={16} /> Print All
              </button>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
              Patients scan these codes on the hospital wall to open ArogyaNav and get directions automatically.
            </p>
          </div>

          {/* QR Grid */}
          <div className="printable-qr-grid" id="printable-area">
            {Object.values(HOSPITAL_LOCATIONS).map(loc => {
              const targetUrl  = `${baseUrl.replace(/\/$/, '')}/?loc=${loc.id}`;
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(targetUrl)}`;
              return (
                <div key={loc.id} className="qr-poster-card">
                  <div className="qr-poster-header">
                    <span className="poster-hospital">{HOSPITAL_INFO.name}</span>
                    <h3 className="poster-title">{loc.name}</h3>
                    <p className="poster-meta">{loc.floor} &middot; {loc.wing}</p>
                  </div>
                  <div className="qr-image-wrapper">
                    <img src={qrImageUrl} alt={`${loc.name} QR Code`} className="qr-code-img" />
                    <span className="qr-loc-code">{loc.id}</span>
                  </div>
                  <div className="qr-poster-footer">
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>
                      Scan with Camera or Google Lens
                    </p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                      Get step-by-step indoor directions
                    </p>
                  </div>
                  <a
                    href={qrImageUrl}
                    download={`${loc.id}-${loc.name.replace(/\s+/g, '_')}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print btn btn-outline btn-sm"
                    style={{ marginTop: 8, fontSize: '0.78rem', width: '100%' }}
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: DOCTOR ATTENDANCE (both roles) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Search & Filter */}
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
              {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
            </select>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'Available',    count: doctors.filter(d => d.status === 'available').length,   color: '#06D6A0', bg: '#e6faf5' },
              { label: 'In OPD / Surgery', count: doctors.filter(d => d.status === 'in_surgery').length, color: '#f59e0b', bg: '#fef3c7' },
              { label: 'On Leave',     count: doctors.filter(d => d.status === 'on_leave').length,    color: '#ef476f', bg: '#fde8ee' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, minWidth: 100, background: s.bg, border: `1px solid ${s.color}33`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Doctor cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredDoctors.map(doc => {
              const dept      = DEPARTMENTS.find(d => d.id === doc.deptId);
              const statusCfg = getStatusBadge(doc.status);
              return (
                <div key={doc.id} className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>{doc.name}</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {doc.spec} &middot; <strong style={{ color: 'var(--color-primary)' }}>{dept?.shortName}</strong>
                      </p>
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px', borderRadius: 999,
                      background: statusCfg.bg, color: statusCfg.color,
                      fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {statusCfg.icon} {statusCfg.label}
                    </span>
                  </div>

                  {/* Status toggle buttons */}
                  <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                    <button
                      className={`btn btn-sm ${doc.status === 'available' ? 'btn-accent' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                      onClick={() => onUpdateDoctorStatus(doc.id, 'available')}
                    >
                      <CheckCircle2 size={13} /> Available
                    </button>
                    <button
                      className={`btn btn-sm ${doc.status === 'in_surgery' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                      onClick={() => onUpdateDoctorStatus(doc.id, 'in_surgery')}
                    >
                      <Clock size={13} /> In OPD / Surgery
                    </button>
                    <button
                      className={`btn btn-sm ${doc.status === 'on_leave' ? 'btn-danger' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                      onClick={() => onUpdateDoctorStatus(doc.id, 'on_leave')}
                    >
                      <XCircle size={13} /> On Leave
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ MAP EDITOR — Fullscreen overlay (Super Admin only) ══════════ */}
      {mapEditorOpen && isSuperAdmin && (
        <Suspense fallback={
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 12, fontSize: '1rem', fontWeight: 600 }}>
            <div style={{ width: 26, height: 26, border: '3px solid #0077B6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Loading Map Editor...
          </div>
        }>
          <MapEditorView onClose={() => setMapEditorOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

