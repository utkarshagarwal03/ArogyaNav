import { useState, useEffect } from 'react';
import './index.css';
import QrScannerView    from './components/QrScannerView';
import DestinationView  from './components/DestinationView';
import NavigationView   from './components/NavigationView';
import AiChatbot        from './components/AiChatbot';
import { HOSPITAL_LOCATIONS, DEPARTMENTS, HOSPITAL_INFO } from './data/hospitalData';
import { QrCode, MapPin, Navigation, Check, ExternalLink } from 'lucide-react';

const STEPS = [
  { id: 'scan',    label: 'Scan',        icon: QrCode },
  { id: 'select',  label: 'Destination', icon: MapPin },
  { id: 'navigate',label: 'Navigate',    icon: Navigation },
];

function StepBar({ currentStep }) {
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
    const locId = params.get('loc') || params.get('from') || params.get('location');
    const deptId = params.get('to') || params.get('dept');

    if (locId && HOSPITAL_LOCATIONS[locId]) {
      const loc = HOSPITAL_LOCATIONS[locId];
      let dept = null;
      if (deptId) {
        dept = DEPARTMENTS.find(d => d.id === deptId || d.shortName.toLowerCase() === deptId.toLowerCase());
      }
      return {
        screen: dept ? 'navigate' : 'select',
        location: loc,
        destination: dept
      };
    }
  } catch (e) {
    console.warn('Error parsing URL parameters:', e);
  }
  return { screen: 'scan', location: null, destination: null };
}

export default function App() {
  const [initialState]                = useState(getInitialState);
  const [screen, setScreen]           = useState(initialState.screen);
  const [currentLocation, setLocation] = useState(initialState.location);
  const [destination, setDestination]  = useState(initialState.destination);

  function handleLocationScanned(loc) {
    setLocation(loc);
    setScreen('select');
  }

  function handleDestinationSelected(dept) {
    setDestination(dept);
    setScreen('navigate');
  }

  function handleAiDestinationSelect(dept) {
    if (!currentLocation) {
      setLocation(HOSPITAL_LOCATIONS['LOC-A1']);
    }
    setDestination(dept);
    setScreen('navigate');
  }

  function handleScanAgain() {
    // Clear URL parameters without reloading page
    if (window.history.pushState) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: cleanUrl }, '', cleanUrl);
    }
    setLocation(null);
    setDestination(null);
    setScreen('scan');
  }

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="header-logo" aria-hidden="true">🏥</div>
          <div className="header-brand">
            <h1>ArogyaNav</h1>
            <p>Smart Indoor Navigation</p>
          </div>
        </div>

        {/* Hospital Location Sub-header */}
        <div style={{
          marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <span>📍 {HOSPITAL_INFO.name} ({HOSPITAL_INFO.campus})</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={HOSPITAL_INFO.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}
            >
              Google Maps <ExternalLink size={10} />
            </a>
            <a
              href={HOSPITAL_INFO.osmLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'underline', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 3 }}
            >
              OSM <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </header>

        {/* Step Progress */}
        <StepBar currentStep={screen} />

        {/* Main Content */}
        <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {screen === 'scan' && (
            <QrScannerView onLocationScanned={handleLocationScanned} />
          )}
          {screen === 'select' && (
            <DestinationView
              currentLocation={currentLocation}
              onDestinationSelected={handleDestinationSelected}
            />
          )}
          {screen === 'navigate' && (
            <NavigationView
              currentLocation={currentLocation}
              destination={destination}
              onScanAgain={handleScanAgain}
            />
          )}
        </main>

        {/* AI Assistant Chatbot */}
        <AiChatbot
          currentLocation={currentLocation}
          onSelectDestination={handleAiDestinationSelect}
        />
      </div>
  );
}
