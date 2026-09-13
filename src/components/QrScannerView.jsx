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

        const qrboxFunction = (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const boxSize = Math.max(150, Math.floor(minEdge * 0.7));
          return { width: boxSize, height: boxSize };
        };

        scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: qrboxFunction },
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

      {/* Info tip + Demo button */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="scan-feedback info" style={{ fontSize: '0.82rem', padding: '12px 14px' }}>
          <Info size={18} style={{ flexShrink: 0 }} />
          <span>Scan any wall QR tag in the hospital corridors, lifts, or entrance to detect your position.</span>
        </div>

        <button
          className="btn btn-primary pulse"
          onClick={handleDemoScan}
          id="demo-scan-btn"
          aria-label="Simulate a QR code scan for demonstration"
        >
          <Camera size={20} />
          Demo: Scan Main Entrance
        </button>
      </div>
    </div>
  );
}
