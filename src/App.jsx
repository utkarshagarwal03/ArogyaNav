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
  HOSPITAL2_INFO, H2_INITIAL_DOCTORS, H2_LOCATIONS, H2_DEPARTMENTS, HOSPITALS, ADMIN_ROLES,
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

// Dynamic location lookup across all hospitals (used by URL QR deep-links)
function getAllLocations() {
  const locs = {};
  Object.values(HOSPITALS).forEach(h => {
    if (h.locations) Object.assign(locs, h.locations);
  });
  return locs;
}

// Dynamic department lookup across all hospitals
function getAllDepartments() {
  const depts = [];
  Object.values(HOSPITALS).forEach(h => {
    if (h.departments) depts.push(...h.departments);
  });
  return depts;
}

function getInitialState() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  try {
    const params = new URLSearchParams(window.location.search);
    const locId  = params.get('loc') || params.get('from') || params.get('location');
    const deptId = params.get('to')  || params.get('dept');
    const allLocs = getAllLocations();
    const allDepts = getAllDepartments();
    
    if (locId && allLocs[locId]) {
      const loc  = allLocs[locId];
      let   dept = null;
      if (deptId) dept = allDepts.find(d => d.id === deptId || d.shortName.toLowerCase() === deptId.toLowerCase());
      return { screen: dept ? 'navigate' : 'select', location: loc, destination: dept, isAdmin };
    }
  } catch (e) {
    console.warn('Error parsing URL parameters:', e);
  }
  return { screen: 'scan', location: null, destination: null, isAdmin };
}

import { pullAllFromCloud } from './data/firebaseSync';

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
  const [showPinModal, setShowPinModal]   = useState(initialState.isAdmin);
  const [selectedRole, setSelectedRole]   = useState('super'); // which role user is trying to log in as
  const [pinInput, setPinInput]           = useState('');
  const [pinError, setPinError]           = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(true);

  useEffect(() => {
    pullAllFromCloud().then((synced) => {
      if (synced) {
        // Re-calculate initial state now that cloud data is loaded
        const state = getInitialState();
        setScreen(state.screen);
        setLocation(state.location);
        setDestination(state.destination);
      }
      setIsCloudSyncing(false);
    });
  }, []);

  if (isCloudSyncing) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '4px solid #0077B6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>Syncing cloud data...</p>
      </div>
    );
  }

  function handlePinSubmit(e) {
    e.preventDefault();
    const expectedPin = Object.keys(ADMIN_ROLES).find(pin => {
      if (selectedRole === 'super') return ADMIN_ROLES[pin].role === 'super';
      return ADMIN_ROLES[pin].hospitalId === selectedRole;
    });
    
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


        </div>

        {/* Sub-header */}
        {(() => {
          // Resolve which hospital info to show
          let activeHospitalInfo = null;
          if (adminHospitalId) {
            activeHospitalInfo = HOSPITALS[adminHospitalId]?.info;
          } else if (currentLocation) {
            const hid = Object.keys(HOSPITALS).find(id => HOSPITALS[id]?.locations?.[currentLocation.id]);
            if (hid) activeHospitalInfo = HOSPITALS[hid].info;
          }

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
                  {activeHospitalInfo.mapsLink && (
                    <a href={activeHospitalInfo.mapsLink} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}>
                      Google Maps <ExternalLink size={10} />
                    </a>
                  )}
                  {activeHospitalInfo.osmLink && (
                    <a href={activeHospitalInfo.osmLink} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}>
                      OSM <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            );
          }

          // Generic label for public before scanning / super admin
          return (
            <div style={{
              marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, opacity: 0.85 }}>
                <span>🏥 Multi-Hospital Indoor Navigation Platform</span>
              </div>
              <div style={{ opacity: 0.7, fontSize: '0.72rem' }}>
                {Object.values(HOSPITALS).map(h => h.info.campus.split(',').pop().trim()).join(' · ')}
              </div>
            </div>
          );
        })()}
      </header>

      <StepBar currentStep={screen} />

      <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen === 'scan'     && !showPinModal && <QrScannerView onLocationScanned={handleLocationScanned} />}
        {screen === 'scan'     && showPinModal  && <div style={{ flex: 1, background: '#f8fafc' }} />}
        {screen === 'select'   && (() => {
          // Determine which hospital this location belongs to
          let activeHid = 'H1';
          if (currentLocation) {
            const foundHid = Object.keys(HOSPITALS).find(id => HOSPITALS[id]?.locations?.[currentLocation.id]);
            if (foundHid) activeHid = foundHid;
          }
          const activeDepts = HOSPITALS[activeHid]?.departments || [];
          const activeDoctors = activeHid === 'H2' ? h2Doctors : (activeHid === 'H1' ? doctors : []);
          return (
            <DestinationView
              hospitalId={activeHid}
              currentLocation={currentLocation}
              onDestinationSelected={handleDestinationSelected}
              departments={activeDepts}
              doctors={activeDoctors}
            />
          );
        })()}
        {screen === 'navigate' && (() => {
          let activeHid = 'H1';
          if (currentLocation) {
            const foundHid = Object.keys(HOSPITALS).find(id => HOSPITALS[id]?.locations?.[currentLocation.id]);
            if (foundHid) activeHid = foundHid;
          }
          return <NavigationView hospitalId={activeHid} currentLocation={currentLocation} destination={destination} onScanAgain={handleScanAgain} />;
        })()}
        {screen === 'admin'    && (
          <AdminView
            adminRole={adminRole}
            adminHospitalId={adminHospitalId}
            doctors={doctors}
            h2Doctors={h2Doctors}
            onUpdateDoctorStatus={handleUpdateDoctorStatus}
            onBackToApp={() => { 
              setAdminRole(null); 
              setAdminHospitalId(null); 
              setScreen('scan'); 
              if (window.location.pathname.startsWith('/admin') && window.history.pushState) {
                const clean = window.location.protocol + '//' + window.location.host + '/';
                window.history.pushState({ path: clean }, '', clean);
              }
            }}
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

            {/* Role selector — dynamic vertical list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '220px', overflowY: 'auto', paddingRight: 4 }}>
              {Object.keys(ADMIN_ROLES).map(pin => {
                const r = ADMIN_ROLES[pin];
                const isSuper = r.role === 'super';
                const rId = isSuper ? 'super' : r.hospitalId;
                const icon = isSuper ? '🛡️' : '🏥';
                const desc = isSuper ? 'All Hospitals · Map & QR' : (HOSPITALS[r.hospitalId]?.info?.campus || 'New Hospital');
                
                return (
                  <button
                    key={rId}
                    type="button"
                    onClick={() => { setSelectedRole(rId); setPinError(false); setPinInput(''); }}
                    style={{
                      flex: 1, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                      border: selectedRole === rId ? `2px solid ${r.color}` : '2px solid #e2e8f0',
                      background: selectedRole === rId ? `${r.color}11` : '#f8fafc',
                      color: selectedRole === rId ? r.color : '#64748b',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 12
                    }}
                  >
                    <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.label}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: 2 }}>{desc}</div>
                    </div>
                  </button>
                );
              })}
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
                  onClick={() => {
                    setShowPinModal(false);
                    if (window.location.pathname.startsWith('/admin') && window.history.pushState) {
                      const clean = window.location.protocol + '//' + window.location.host + '/';
                      window.history.pushState({ path: clean }, '', clean);
                    }
                  }}
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


          </div>
        </div>
      )}
    </div>
  );
}
