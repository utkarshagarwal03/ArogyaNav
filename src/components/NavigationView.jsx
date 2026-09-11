import { useState, useEffect } from 'react';
import { generateRoute, HOSPITAL_INFO } from '../data/hospitalData';
import {
  ArrowUp, ArrowLeft, ArrowRight, CheckCircle,
  Clock, Ruler, QrCode, ChevronDown, ChevronUp, ExternalLink, MapPin
} from 'lucide-react';

const DIRECTION_CONFIG = {
  straight: { icon: <ArrowUp size={46} color="#fff" />, label: 'Go Straight', bg: 'linear-gradient(160deg,#0077B6,#0096c7)' },
  left:     { icon: <ArrowLeft size={46} color="#fff" />, label: 'Turn Left',  bg: 'linear-gradient(160deg,#00B4D8,#0077B6)' },
  right:    { icon: <ArrowRight size={46} color="#fff" />, label: 'Turn Right', bg: 'linear-gradient(160deg,#00B4D8,#0077B6)' },
  arrived:  { icon: <CheckCircle size={46} color="#fff" />, label: 'You Have Arrived!', bg: 'linear-gradient(160deg,#06D6A0,#059173)' },
};

export default function NavigationView({ currentLocation, destination, onScanAgain }) {
  const [loading, setLoading]   = useState(true);
  const [route, setRoute]       = useState(null);
  const [stepIdx, setStepIdx]   = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API latency
    const t = setTimeout(() => {
      const result = generateRoute(currentLocation, destination);
      setRoute(result);
      setStepIdx(0);
      setLoading(false);
    }, 1400);
    return () => clearTimeout(t);
  }, [currentLocation, destination]);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <p className="spinner-text">Calculating the best route to<br /><strong>{destination.name}</strong>…</p>
      </div>
    );
  }

  const currentStep = route.steps[stepIdx];
  const dirCfg = DIRECTION_CONFIG[currentStep.direction] || DIRECTION_CONFIG.straight;
  const isLast = stepIdx === route.steps.length - 1;
  const isFirst = stepIdx === 0;

  return (
    <div className="view bottom-safe">
      {/* Destination Header */}
      <div className="nav-dest-card">
        <div className="nav-dest-icon">{destination.icon}</div>
        <div className="nav-dest-info">
          <h2>{destination.name}</h2>
          <p>{destination.floor} · {destination.wing}</p>
        </div>
      </div>

      {/* Hospital Campus Map Bar */}
      <div style={{
        background: 'var(--color-surface-2)', border: '1px solid #b3d9f5', borderRadius: 'var(--radius-md)',
        padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontWeight: 600 }}>
          <MapPin size={14} />
          <span>{HOSPITAL_INFO.name}, {HOSPITAL_INFO.campus}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={HOSPITAL_INFO.mapsLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
            Google Maps <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Meta chips */}
      <div className="nav-meta">
        <div className="nav-meta-chip">
          <Ruler size={16} color="var(--color-primary)" />
          <span>{route.totalDistance}</span>
        </div>
        <div className="nav-meta-chip">
          <Clock size={16} color="var(--color-primary)" />
          <span>{route.estimatedTime}</span>
        </div>
        <div className="nav-meta-chip" style={{ background: 'var(--color-surface-2)', border: '2px solid #b3d9f5', color: 'var(--color-primary)' }}>
          <span>Step {stepIdx + 1}/{route.steps.length}</span>
        </div>
      </div>

      {/* Direction Card */}
      <div className="direction-card">
        <div className="direction-arrow-box" style={{ background: dirCfg.bg }}>
          <div className={`direction-arrow ${currentStep.direction === 'arrived' ? 'pulse' : ''}`}>
            {dirCfg.icon}
          </div>
          <p className="direction-label">{dirCfg.label}</p>
          {currentStep.distance !== '0m' && (
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
              for {currentStep.distance}
            </p>
          )}
        </div>

        {/* Step Instruction */}
        <div style={{ padding: '18px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.4 }}>
            {currentStep.instruction}
          </p>
        </div>

        {/* Prev / Next */}
        <div style={{ display: 'flex', borderTop: '1px solid var(--color-border)' }}>
          <button
            className="btn btn-ghost btn-sm"
            disabled={isFirst}
            onClick={() => setStepIdx(i => i - 1)}
            style={{ flex: 1, borderRadius: 0, opacity: isFirst ? 0.4 : 1, borderRight: '1px solid var(--color-border)' }}
            aria-label="Previous step"
          >
            ← Prev
          </button>
          {!isLast ? (
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setStepIdx(i => i + 1)}
              style={{ flex: 1, borderRadius: 0 }}
              aria-label="Next step"
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-ghost btn-sm"
              disabled
              style={{ flex: 1, borderRadius: 0, color: 'var(--color-accent-dark)', fontWeight: 700 }}
            >
              Arrived ✓
            </button>
          )}
        </div>
      </div>

      {/* All Steps Toggle */}
      <div className="direction-card" style={{ overflow: 'hidden' }}>
        <button
          className="btn btn-ghost"
          style={{ borderRadius: 0, justifyContent: 'space-between', padding: '14px 18px', fontSize: '0.92rem' }}
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
        >
          <span style={{ fontWeight: 700 }}>All Steps ({route.steps.length})</span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expanded && (
          <div className="steps-list">
            {route.steps.map((s, i) => (
              <div
                key={i}
                className={`step-entry ${i === stepIdx ? 'current' : i < stepIdx ? 'done' : ''}`}
                onClick={() => setStepIdx(i)}
                role="button"
                aria-label={`Go to step ${i + 1}`}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setStepIdx(i)}
              >
                <div className="step-num">{i < stepIdx ? '✓' : i + 1}</div>
                <p className="step-text">{s.instruction}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scan Again */}
      <button className="btn btn-outline" onClick={onScanAgain} id="scan-again-btn">
        <QrCode size={20} />
        Scan Again / New Route
      </button>
    </div>
  );
}
