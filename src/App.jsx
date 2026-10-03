import { useState, useEffect } from 'react';
import './index.css';
import QrScannerView    from './components/QrScannerView';
import DestinationView  from './components/DestinationView';
import NavigationView   from './components/NavigationView';
import AiChatbot        from './components/AiChatbot';
import AdminView        from './components/AdminView';
import {
  HOSPITAL_LOCATIONS, DEPARTMENTS, HOSPITAL_INFO,
  INITIAL_DOCTORS, injectGraphStore,
  HOSPITAL2_INFO, H2_INITIAL_DOCTORS, H2_LOCATIONS, H2_DEPARTMENTS, HOSPITALS,
} from './data/hospitalData';
import * as mapGraphStore from './data/mapGraphStore';
import { QrCode, MapPin, Navigation, Check, ExternalLink, ShieldAlert } from 'lucide-react';

// Inject Dijkstra graph store into hospitalData so generateRoute uses it
injectGraphStore(mapGraphStore);

const STEPS = [
  { id: 'scan',     label: 'Scan',        icon: QrCode },
  { id: 'select',   label: 'Destination', icon: MapPin },
  { id: 'navigate', label: 'Navigate',    icon: Navigation },
];

// Admin role config
// Super Admin         PIN: 1234 — full access to ALL hospitals (QR Codes + Map Editor)
// Hospital 1 Admin    PIN: 5678 — Manipal Hospital daily ops (Doctor Attendance)
// Hospital 2 Admin    PIN: 9012 — Apollo Hospitals daily ops (Doctor Attendance)
const ADMIN_ROLES = {
  '1234': { role: 'super',     label: 'Super Admin',              color: '#0f172a', hospitalId: null },
  '5678': { role: 'hospital',  label: 'Hospital Admin (Manipal)', color: '#0077B6', hospitalId: 'H1' },
  '9012': { role: 'hospital',  label: 'Hospital Admin (Apollo)',  color: '#059173', hospitalId: 'H2' },
};

function StepBar({ currentStep }) {
  if (currentStep === 'admin') return null;
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="step-bar" role="navigation" aria-label="Progress">
      {STEPS.map((step, idx) => {
        const status = idx < currentIdx ? 'done' : idx === currentIdx ? 'active' : '';
        const Icon = step.icon;
        return (
          <div key={step.id} className={`step-item ${status}`} aria-current={status === 'active' ? 'step' : undefined}>
            <div className="step-circle">
              {status === 'done' ? <Check size={14} /> : <Icon size={14} />}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Merged location lookup across both hospitals (used by URL QR deep-links)
const ALL_LOCATIONS = { ...HOSPITAL_LOCATIONS, ...H2_LOCATIONS };
// Merged department lookup across both hospitals
const ALL_DEPARTMENTS = [...DEPARTMENTS, ...H2_DEPARTMENTS];

function getInitialState() {
  try {
    const params = new URLSearchParams(window.location.search);
    const locId  = params.get('loc') || params.get('from') || params.get('location');
    const deptId = params.get('to')  || params.get('dept');
    if (locId && ALL_LOCATIONS[locId]) {
      const loc  = ALL_LOCATIONS[locId];
      let   dept = null;
      if (deptId) dept = ALL_DEPARTMENTS.find(d => d.id === deptId || d.shortName.toLowerCase() === deptId.toLowerCase());
      return { screen: dept ? 'navigate' : 'select', location: loc, destination: dept };
    }
  } catch (e) {
    console.warn('Error parsing URL parameters:', e);
  }
  return { screen: 'scan', location: null, destination: null };
}

export default function App() {
  const [initialState]                 = useState(getInitialState);
  const [screen, setScreen]            = useState(initialState.screen);
  const [currentLocation, setLocation] = useState(initialState.location);
  const [destination, setDestination]  = useState(initialState.destination);
  const [doctors, setDoctors]          = useState(INITIAL_DOCTORS);
  const [h2Doctors, setH2Doctors]      = useState(H2_INITIAL_DOCTORS);

  // Admin auth state
  const [adminRole, setAdminRole]         = useState(null);   // null | 'super' | 'hospital'
  const [adminHospitalId, setAdminHospitalId] = useState(null); // null | 'H1' | 'H2'
  const [showPinModal, setShowPinModal]   = useState(false);
  const [selectedRole, setSelectedRole]   = useState('super'); // which role user is trying to log in as
  const [pinInput, setPinInput]           = useState('');
  const [pinError, setPinError]           = useState(false);

  function handleAdminClick() {
    if (screen === 'admin') {
      setAdminRole(null);
      setAdminHospitalId(null);
      setScreen('scan');
    } else {
      if (adminRole) {
        setScreen('admin');
      } else {
        setShowPinModal(true);
        setPinInput('');
        setPinError(false);
        setSelectedRole('super');
      }
    }
  }

  function handlePinSubmit(e) {
    e.preventDefault();
    // Map role card → expected PIN
    const PIN_MAP = { super: '1234', h1admin: '5678', h2admin: '9012' };
    const expectedPin = PIN_MAP[selectedRole];
    if (pinInput === expectedPin) {
      const matched = ADMIN_ROLES[pinInput];
      setAdminRole(matched.role);
      setAdminHospitalId(matched.hospitalId);
      setShowPinModal(false);
      setScreen('admin');
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  function handleLocationScanned(loc)    { setLocation(loc); setScreen('select'); }
  function handleDestinationSelected(d)  { setDestination(d); setScreen('navigate'); }
  function handleAiDestinationSelect(d)  {
    if (!currentLocation) setLocation(HOSPITAL_LOCATIONS['LOC-A1']);
    setDestination(d);
    setScreen('navigate');
  }

  // Update doctor status — routes to correct hospital's state
  function handleUpdateDoctorStatus(docId, status, hospitalId) {
    if (hospitalId === 'H2') {
      setH2Doctors(prev => prev.map(doc => doc.id === docId ? { ...doc, status } : doc));
    } else {
      setDoctors(prev => prev.map(doc => doc.id === docId ? { ...doc, status } : doc));
    }
  }

  function handleScanAgain() {
    if (window.history.pushState) {
      const clean = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.pushState({ path: clean }, '', clean);
    }
    setLocation(null); setDestination(null); setScreen('scan');
  }

  // Determine label for header button
  const matchedRole = Object.values(ADMIN_ROLES).find(r =>
    r.role === adminRole && r.hospitalId === adminHospitalId
  );
  const roleLabel = matchedRole?.label ?? null;

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header" role="banner">
        <div className="header-inner" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="header-logo" aria-hidden="true">🏥</div>
            <div className="header-brand">
              <h1>ArogyaNav</h1>
              <p>Smart Indoor Navigation</p>
            </div>
          </div>

          <button
            onClick={handleAdminClick}
            style={{
              background: screen === 'admin' ? '#fff' : 'rgba(255,255,255,0.2)',
              color: screen === 'admin' ? 'var(--color-primary)' : '#fff',
              border: 'none', borderRadius: 20, padding: '6px 12px',
              fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
            }}
          >
            <ShieldAlert size={14} />
            {screen === 'admin' ? 'Back to App' : (roleLabel ? `${roleLabel}` : 'Admin Login')}
          </button>
        </div>

        {/* Sub-header */}
        {(() => {
          // Resolve which hospital info to show
          const activeHospitalInfo = adminHospitalId
            ? (adminHospitalId === 'H1' ? HOSPITAL_INFO : HOSPITAL2_INFO)
            : (screen === 'admin' && adminRole === 'super' ? null : null);

          if (activeHospitalInfo) {
            return (
              <div style={{
                marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <span>📍 {activeHospitalInfo.name} ({activeHospitalInfo.campus})</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={activeHospitalInfo.mapsLink} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}>
                    Google Maps <ExternalLink size={10} />
                  </a>
                  <a href={activeHospitalInfo.osmLink} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}>
                    OSM <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            );
          }

          // Generic label for public / super admin (no single hospital)
          return (
            <div style={{
              marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, opacity: 0.85 }}>
                <span>🏥 Multi-Hospital Indoor Navigation Platform</span>
              </div>
              <div style={{ opacity: 0.7, fontSize: '0.72rem' }}>
                Bengaluru · Chennai
              </div>
            </div>
          );
        })()}
      </header>

      <StepBar currentStep={screen} />

      <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen === 'scan'     && <QrScannerView onLocationScanned={handleLocationScanned} />}
        {screen === 'select'   && (() => {
          // Determine which hospital this location belongs to
          const isH2Loc = currentLocation?.id?.startsWith('H2-');
          const activeDepts = isH2Loc ? (HOSPITALS.H2.departments || []) : DEPARTMENTS;
          const activeDoctors = isH2Loc ? h2Doctors : doctors;
          return (
            <DestinationView
              currentLocation={currentLocation}
              onDestinationSelected={handleDestinationSelected}
              departments={activeDepts}
              doctors={activeDoctors}
            />
          );
        })()}
        {screen === 'navigate' && <NavigationView currentLocation={currentLocation} destination={destination} onScanAgain={handleScanAgain} />}
        {screen === 'admin'    && (
          <AdminView
            adminRole={adminRole}
            adminHospitalId={adminHospitalId}
            doctors={doctors}
            h2Doctors={h2Doctors}
            onUpdateDoctorStatus={handleUpdateDoctorStatus}
            onBackToApp={() => { setAdminRole(null); setAdminHospitalId(null); setScreen('scan'); }}
          />
        )}
      </main>

      <AiChatbot currentLocation={currentLocation} onSelectDestination={handleAiDestinationSelect} doctors={[...doctors, ...h2Doctors]} />

      {/* Admin Login Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 20, maxWidth: 440, width: '100%', padding: 24,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {/* Icon + Title */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0f172a, #0077B6)',
                margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldAlert size={28} color="#fff" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Admin Login</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Select your role and enter the PIN
              </p>
            </div>

            {/* Role selector — 3 cards */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'super',    label: 'Super Admin',    desc: 'All Hospitals · Map & QR', icon: '🛡️', accent: '#0f172a' },
                { id: 'h1admin',  label: 'Manipal Admin',  desc: 'Manipal Hospital, BLR',    icon: '🏥', accent: '#0077B6' },
                { id: 'h2admin',  label: 'Apollo Admin',   desc: 'Apollo Hospitals, Chennai', icon: '🏨', accent: '#059173' },
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setSelectedRole(r.id); setPinError(false); setPinInput(''); }}
                  style={{
                    flex: 1, padding: '10px 6px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                    border: selectedRole === r.id ? `2px solid ${r.accent}` : '2px solid #e2e8f0',
                    background: selectedRole === r.id ? `${r.accent}11` : '#f8fafc',
                    color: selectedRole === r.id ? r.accent : '#64748b',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{r.label}</div>
                  <div style={{ fontSize: '0.66rem', opacity: 0.75, marginTop: 2 }}>{r.desc}</div>
                </button>
              ))}
            </div>

            {/* PIN form */}
            <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                autoFocus
                onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                placeholder={
                  selectedRole === 'super'   ? 'Enter Super Admin PIN'        :
                  selectedRole === 'h1admin' ? 'Enter Manipal Admin PIN'      :
                                              'Enter Apollo Admin PIN'
                }
                style={{
                  padding: '12px 16px', fontSize: '1.2rem', textAlign: 'center',
                  letterSpacing: '0.3em', borderRadius: 12, outline: 'none',
                  border: pinError ? '2px solid #ef476f' : '2px solid #cbd5e1',
                }}
              />
              {pinError && (
                <p style={{ margin: 0, color: '#ef476f', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center' }}>
                  Incorrect PIN. Please try again.
                </p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-ghost"
                  onClick={() => setShowPinModal(false)}
                  style={{ flex: 1, padding: 12, fontSize: '0.88rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary"
                  disabled={!pinInput.trim()}
                  style={{ flex: 1, padding: 12, fontSize: '0.88rem' }}>
                  Login
                </button>
              </div>
            </form>

            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>
              Super Admin: <strong>1234</strong> &nbsp;|&nbsp; Manipal Admin: <strong>5678</strong> &nbsp;|&nbsp; Apollo Admin: <strong>9012</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
