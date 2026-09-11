import { useRef, useEffect, useState } from 'react';
import { HOSPITAL_LOCATIONS } from '../data/hospitalData';
import { Camera, CheckCircle, AlertCircle, Info, QrCode } from 'lucide-react';

export default function QrScannerView({ onLocationScanned }) {
  const [feedback, setFeedback]       = useState(null);
  const [scanning, setScanning]       = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Track whether a scan is already in progress (prevents double-fire)
  const scannedRef  = useRef(false);
  // Hold the Html5Qrcode instance for cleanup
  const scannerRef  = useRef(null);
  // Prevent StrictMode double-init
  const initDoneRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access requires HTTPS or localhost on mobile. Use Demo mode below.');
      return;
    }

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (!mounted) return;
      try {
        const scannerElement = document.getElementById('arogyanav-qr-reader');
        if (!scannerElement) return;

        const scanner = new Html5Qrcode('arogyanav-qr-reader');
        scannerRef.current = scanner;

        scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (!scannedRef.current) handleScan(decodedText);
          },
          () => {} // per-frame miss — ignore
        ).then(() => {
          if (mounted) setScanning(true);
        }).catch((err) => {
          console.warn('Camera unavailable:', err?.message || err);
          if (mounted) {
            setCameraError('Camera access denied or unavailable. Use Demo mode or Google Lens testing below.');
          }
        });
      } catch (err) {
        console.warn('Scanner init error:', err?.message || err);
        if (mounted) {
          setCameraError('Could not initialise the scanner. Use Demo mode below.');
        }
      }
    }).catch((err) => {
      console.warn('Module load error:', err);
      if (mounted) {
        setCameraError('Scanner module failed to load. Use Demo mode below.');
      }
    });

    return () => {
      mounted = false;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {}).finally(() => {
              scannerRef.current = null;
            });
          } else {
            scannerRef.current = null;
          }
        } catch (e) {
          scannerRef.current = null;
        }
      }
    };
  }, []); // runs once on mount

  // ─── Core scan handler ────────────────────────────────────────────────
  function handleScan(rawText) {
    scannedRef.current = true;

    let locId = rawText.trim();
    // Support URL QR codes (e.g. https://arogyanav.app/?loc=LOC-A1)
    if (locId.includes('?') || locId.startsWith('http')) {
      try {
        const parsedUrl = new URL(locId.startsWith('http') ? locId : `http://dummy.com/${locId}`);
        const extracted = parsedUrl.searchParams.get('loc') || parsedUrl.searchParams.get('from') || parsedUrl.searchParams.get('location');
        if (extracted) locId = extracted;
      } catch (e) {
        console.warn('Could not parse scanned URL:', e);
      }
    }

    const location = HOSPITAL_LOCATIONS[locId];
    if (location) {
      setFeedback({ type: 'success', message: `📍 Detected: ${location.name}` });
      // Wait briefly so user can see the success state, then navigate
      setTimeout(() => {
        onLocationScanned(location); // <-- no mountedRef guard — always call it
      }, 800);
    } else {
      setFeedback({ type: 'error', message: 'Invalid QR code. Please scan a valid ArogyaNav tag.' });
      setTimeout(() => {
        scannedRef.current = false;
        setFeedback(null);
      }, 2500);
    }
  }

  function handleDemoScan() {
    if (scannedRef.current) return;
    handleScan('LOC-A1');
  }

  const [showQrModal, setShowQrModal] = useState(false);
  const networkHost = window.location.hostname === 'localhost' ? '10.183.1.42' : window.location.hostname;
  const baseUrl = `${window.location.protocol}//${networkHost}:5173`;
  const showPlaceholder = !!cameraError;

  return (
    <div className="view">
      {/* Title */}
      <div>
        <h2 className="view-title">Scan Your Location</h2>
        <p className="view-subtitle">
          Point your camera at an ArogyaNav QR tag, or scan using Google Lens on your phone.
        </p>
      </div>

      {/* Camera feed — or placeholder when camera is unavailable */}
      <div
        className="scanner-wrapper"
        style={showPlaceholder ? {
          background: 'linear-gradient(160deg, #0a1929, #0d2d4a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16, minHeight: 280,
        } : {}}
      >
        {!showPlaceholder ? (
          <>
            <div id="arogyanav-qr-reader" style={{ width: '100%', height: '100%' }} />
            <div className="scanner-overlay">
              <div className="scanner-frame">
                <span />
                <div className="scan-line" />
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 14, padding: 28, textAlign: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(144,224,239,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <QrCode size={40} color="#90E0EF" />
            </div>
            <p style={{ color: '#90E0EF', fontSize: '1rem', fontWeight: 700 }}>
              Camera Unavailable
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.5 }}>
              Use the Demo button or test Google Lens scanning below
            </p>
          </div>
        )}
      </div>

      {/* "Align code" tip when live camera is running */}
      {scanning && !feedback && (
        <p className="scanner-tip">🔍 Align the QR code within the frame</p>
      )}

      {/* Camera error banner */}
      {cameraError && (
        <div className="scan-feedback error">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.85rem' }}>{cameraError}</span>
        </div>
      )}

      {/* Scan result (success / invalid) */}
      {feedback && (
        <div className={`scan-feedback ${feedback.type}`}>
          {feedback.type === 'success'
            ? <CheckCircle size={22} />
            : <AlertCircle size={22} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Info tip + External Scanner Notice + Action buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="scan-feedback info" style={{ fontSize: '0.82rem', padding: '12px 14px', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={18} style={{ flexShrink: 0 }} />
            <strong style={{ fontSize: '0.85rem' }}>External Camera / Google Lens Support</strong>
          </div>
          <span style={{ opacity: 0.9 }}>
            Scan hospital wall tags using <b>Google Lens</b> or your phone camera to jump straight into navigation over Wi-Fi!
          </span>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => setShowQrModal(true)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', fontWeight: 600 }}
        >
          <QrCode size={18} />
          📷 Show Google Lens Test QR Tags
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-primary pulse"
            onClick={handleDemoScan}
            id="demo-scan-btn"
            style={{ flex: 1 }}
            aria-label="Simulate a QR code scan for demonstration"
          >
            <Camera size={18} />
            Demo Scan
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => {
              window.location.search = '?from=LOC-A1&to=DEPT-001';
            }}
            style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }}
            title="Test scanning a QR code that directly targets Emergency Dept"
          >
            🚀 Test Direct Link
          </button>
        </div>
      </div>

      {/* Google Lens Printable QR Codes Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{
            background: 'white', color: '#1e293b', borderRadius: 16,
            maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto',
            padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
            display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', pb: 12 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>📱 Google Lens Wall QR Tags</h3>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Ensure your phone is on the same Wi-Fi as your computer. Scan any tag with <b>Google Lens</b> or your camera app!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Tag 1 */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, textAlign: 'center', background: '#f8fafc' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0284c7' }}>Main Entrance (LOC-A1)</strong>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${baseUrl}/?loc=LOC-A1`)}`}
                  alt="Main Entrance QR"
                  style={{ width: '100%', height: 'auto', marginTop: 8, borderRadius: 6 }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>Select Dept Screen</span>
              </div>

              {/* Tag 2 */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, textAlign: 'center', background: '#f8fafc' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0284c7' }}>Reception (LOC-A2)</strong>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${baseUrl}/?loc=LOC-A2`)}`}
                  alt="Reception QR"
                  style={{ width: '100%', height: 'auto', marginTop: 8, borderRadius: 6 }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>Ground Floor Lobby</span>
              </div>

              {/* Tag 3 */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, textAlign: 'center', background: '#f8fafc' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0284c7' }}>OPD Corridor (LOC-C2)</strong>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${baseUrl}/?loc=LOC-C2`)}`}
                  alt="OPD QR"
                  style={{ width: '100%', height: 'auto', marginTop: 8, borderRadius: 6 }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>1st Floor Corridor</span>
              </div>

              {/* Tag 4 */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, textAlign: 'center', background: '#dc2626' }}>
                <strong style={{ fontSize: '0.85rem', color: '#dc2626' }}>Direct Emergency</strong>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${baseUrl}/?from=LOC-A1&to=DEPT-001`)}`}
                  alt="Direct Emergency QR"
                  style={{ width: '100%', height: 'auto', marginTop: 8, borderRadius: 6 }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>Direct Navigation!</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowQrModal(false)}
              style={{ marginTop: 8 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
