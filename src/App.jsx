import { useState, useEffect } from 'react';
import './index.css';
import QrScannerView    from './components/QrScannerView';
import DestinationView  from './components/DestinationView';
import NavigationView   from './components/NavigationView';
import AiChatbot        from './components/AiChatbot';
import AdminView        from './components/AdminView';
import { HOSPITAL_LOCATIONS, DEPARTMENTS, HOSPITAL_INFO, INITIAL_DOCTORS, injectGraphStore } from './data/hospitalData';
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
// Super Admin  PIN: 1234  — full access (QR Codes + Map Editor)
// Hospital Admin PIN: 5678 — daily ops  (Doctor Attendance)
const ADMIN_ROLES = {
  '1234': { role: 'super',    label: 'Super Admin',    color: '#0f172a' },
  '5678': { role: 'hospital', label: 'Hospital Admin', color: '#0077B6' },
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

function getInitialState() {
  try {
    const params = new URLSearchParams(window.location.search);
    const locId  = params.get('loc') || params.get('from') || params.get('location');
    const deptId = params.get('to')  || params.get('dept');
    if (locId && HOSPITAL_LOCATIONS[locId]) {
      const loc  = HOSPITAL_LOCATIONS[locId];
      let   dept = null;
      if (deptId) dept = DEPARTMENTS.find(d => d.id === deptId || d.shortName.toLowerCase() === deptId.toLowerCase());
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

  // Admin auth state
  const [adminRole, setAdminRole]     = useState(null);   // null | 'super' | 'hospital'
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('super'); // which role user is trying to log in as
  const [pinInput, setPinInput]       = useState('');
  const [pinError, setPinError]       = useState(false);

  function handleAdminClick() {
    if (screen === 'admin') {
      setAdminRole(null);
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
    const correctPin = selectedRole === 'super' ? '1234' : '5678';
    if (pinInput === correctPin) {
      setAdminRole(selectedRole);
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
  function handleUpdateDoctorStatus(docId, status) {
    setDoctors(prev => prev.map(doc => doc.id === docId ? { ...doc, status } : doc));
  }
  function handleScanAgain() {
    if (window.history.pushState) {
      const clean = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.pushState({ path: clean }, '', clean);
    }
    setLocation(null); setDestination(null); setScreen('scan');
  }

  const roleLabel = adminRole ? ADMIN_ROLES[adminRole === 'super' ? '1234' : '5678']?.label : null;

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
        <div style={{
          marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <span>📍 {HOSPITAL_INFO.name} ({HOSPITAL_INFO.campus})</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={HOSPITAL_INFO.mapsLink} target="_blank" rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}>
              Google Maps <ExternalLink size={10} />
            </a>
            <a href={HOSPITAL_INFO.osmLink} target="_blank" rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}>
              OSM <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </header>

      <StepBar currentStep={screen} />

      <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen === 'scan'     && <QrScannerView onLocationScanned={handleLocationScanned} />}
        {screen === 'select'   && <DestinationView currentLocation={currentLocation} onDestinationSelected={handleDestinationSelected} doctors={doctors} />}
        {screen === 'navigate' && <NavigationView currentLocation={currentLocation} destination={destination} onScanAgain={handleScanAgain} />}
        {screen === 'admin'    && (
          <AdminView
            adminRole={adminRole}
            doctors={doctors}
            onUpdateDoctorStatus={handleUpdateDoctorStatus}
            onBackToApp={() => { setAdminRole(null); setScreen('scan'); }}
          />
        )}
      </main>

      <AiChatbot currentLocation={currentLocation} onSelectDestination={handleAiDestinationSelect} doctors={doctors} />

      {/* Admin Login Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 20, maxWidth: 400, width: '100%', padding: 24,
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

            {/* Role selector */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'super',    label: 'Super Admin',    desc: 'Map Editor & QR Codes', icon: '🛡️' },
                { id: 'hospital', label: 'Hospital Admin', desc: 'Doctor Attendance',      icon: '🏥' },
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setSelectedRole(r.id); setPinError(false); setPinInput(''); }}
                  style={{
                    flex: 1, padding: '12px 8px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                    border: selectedRole === r.id ? '2px solid #0077B6' : '2px solid #e2e8f0',
                    background: selectedRole === r.id ? '#eff8ff' : '#f8fafc',
                    color: selectedRole === r.id ? '#0077B6' : '#64748b',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{r.label}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.75, marginTop: 2 }}>{r.desc}</div>
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
                placeholder={`Enter ${selectedRole === 'super' ? 'Super Admin' : 'Hospital Admin'} PIN`}
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
              Super Admin PIN: 1234 &nbsp;|&nbsp; Hospital Admin PIN: 5678
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
