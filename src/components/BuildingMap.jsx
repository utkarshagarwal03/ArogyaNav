import { useState } from 'react';
import { DEPARTMENTS, HOSPITAL_LOCATIONS } from '../data/hospitalData';
import { MapPin, Navigation, Layers, Info, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

// Floor data structures with vector coordinates (viewBox 0 0 600 400)
export const FLOOR_PLANS = {
  0: {
    floorName: "Ground Floor (L0)",
    shortLabel: "Ground Floor",
    subtitle: "Main Entrance, Emergency, Radiology, Pharmacy & Cafeteria",
    rooms: [
      { id: "DEPT-001", locId: "LOC-B1", name: "Emergency & Trauma", shortName: "Emergency", x: 40, y: 40, w: 160, h: 120, cx: 120, cy: 100, color: "#fde8ee", border: "#ef476f", icon: "🚨" },
      { id: "DEPT-003", locId: "LOC-B2", name: "Radiology (MRI/CT)", shortName: "Radiology", x: 210, y: 40, w: 120, h: 120, cx: 270, cy: 100, color: "#e6faf5", border: "#06d6a0", icon: "🩻" },
      { id: "DEPT-004", locId: "LOC-B3", name: "Diagnostics & Lab", shortName: "Lab", x: 340, y: 40, w: 110, h: 120, cx: 395, cy: 100, color: "#fff8e6", border: "#f59e0b", icon: "🧪" },
      { id: "DEPT-012", locId: "LOC-B4", name: "Cafeteria", shortName: "Cafeteria", x: 460, y: 40, w: 100, h: 120, cx: 510, cy: 100, color: "#fff8e6", border: "#d97706", icon: "🍽️" },
      
      { id: "DEPT-007", locId: "LOC-A4", name: "24/7 Main Pharmacy", shortName: "Pharmacy", x: 40, y: 240, w: 160, h: 110, cx: 120, cy: 295, color: "#e6faf5", border: "#059173", icon: "💊" },
      { id: "DEPT-025", locId: "LOC-A2", name: "Central Atrium & Help Desk", shortName: "Atrium", x: 210, y: 240, w: 180, h: 110, cx: 300, cy: 295, color: "#EAF2FB", border: "#0077B6", icon: "ℹ️" },
      { id: "DEPT-024", locId: "LOC-A3", name: "Billing & Insurance TPA", shortName: "Billing", x: 400, y: 240, w: 160, h: 110, cx: 480, cy: 295, color: "#f3e8ff", border: "#8b5cf6", icon: "💳" },

      { id: "ENTRANCE", locId: "LOC-A1", name: "Main Entrance Portico", shortName: "Entrance", x: 220, y: 360, w: 160, h: 32, cx: 300, cy: 376, color: "#1e293b", border: "#0f172a", icon: "🚪", isGate: true }
    ]
  },
  1: {
    floorName: "1st Floor (L1)",
    shortLabel: "1st Floor",
    subtitle: "OPD Consultation Suites, ENT, Eye, Dental & Physiotherapy",
    rooms: [
      { id: "DEPT-002", locId: "LOC-C1", name: "OPD General Suites", shortName: "OPD Suites", x: 40, y: 40, w: 170, h: 120, cx: 125, cy: 100, color: "#EAF2FB", border: "#0077B6", icon: "🩺" },
      { id: "DEPT-015", locId: "LOC-C3", name: "ENT Care Suite", shortName: "ENT", x: 220, y: 40, w: 110, h: 120, cx: 275, cy: 100, color: "#e6faf5", border: "#06d6a0", icon: "👂" },
      { id: "DEPT-016", locId: "LOC-C3", name: "Ophthalmology Eye Care", shortName: "Eye Care", x: 340, y: 40, w: 110, h: 120, cx: 395, cy: 100, color: "#fff8e6", border: "#f59e0b", icon: "👁️" },
      { id: "DEPT-018", locId: "LOC-C3", name: "Dental & Maxillofacial", shortName: "Dental", x: 460, y: 40, w: 100, h: 120, cx: 510, cy: 100, color: "#EAF2FB", border: "#0284c7", icon: "🦷" },

      { id: "DEPT-017", locId: "LOC-C4", name: "Dermatology & Skin Center", shortName: "Dermatology", x: 40, y: 240, w: 160, h: 110, cx: 120, cy: 295, color: "#f3e8ff", border: "#a855f7", icon: "🧴" },
      { id: "DEPT-011", locId: "LOC-C5", name: "Physiotherapy & Rehab", shortName: "Physio", x: 210, y: 240, w: 180, h: 110, cx: 300, cy: 295, color: "#e6faf5", border: "#059173", icon: "🏃" },
      { id: "DEPT-020", locId: "LOC-C2", name: "Psychiatry & Wellness", shortName: "Psychiatry", x: 400, y: 240, w: 160, h: 110, cx: 480, cy: 295, color: "#e6faf5", border: "#10b981", icon: "🧘" }
    ]
  },
  2: {
    floorName: "2nd Floor (L2)",
    shortLabel: "2nd Floor",
    subtitle: "Cardiology, Orthopaedics, Paediatrics, Oncology & OT Complex",
    rooms: [
      { id: "DEPT-005", locId: "LOC-D2", name: "Cardiology & Cath Lab", shortName: "Cardiology", x: 40, y: 40, w: 160, h: 120, cx: 120, cy: 100, color: "#fde8ee", border: "#ef476f", icon: "❤️" },
      { id: "DEPT-006", locId: "LOC-E3", name: "Orthopaedics & Spine", shortName: "Orthopaedics", x: 210, y: 40, w: 120, h: 120, cx: 270, cy: 100, color: "#f3e8ff", border: "#9333ea", icon: "🦴" },
      { id: "DEPT-013", locId: "LOC-E4", name: "Oncology & Chemotherapy", shortName: "Oncology", x: 340, y: 40, w: 110, h: 120, cx: 395, cy: 100, color: "#fde8ee", border: "#e11d48", icon: "🎗️" },
      { id: "DEPT-010", locId: "LOC-F2", name: "Robotic Surgery OT", shortName: "Surgery OT", x: 460, y: 40, w: 100, h: 120, cx: 510, cy: 100, color: "#EAF2FB", border: "#2563eb", icon: "🔬" },

      { id: "DEPT-008", locId: "LOC-D3", name: "Paediatrics & NICU", shortName: "Paediatrics", x: 40, y: 240, w: 140, h: 110, cx: 110, cy: 295, color: "#fff8e6", border: "#d97706", icon: "👶" },
      { id: "DEPT-019", locId: "LOC-D3", name: "Obstetrics & Gynaecology", shortName: "Gynaecology", x: 190, y: 240, w: 140, h: 110, cx: 260, cy: 295, color: "#fde8ee", border: "#db2777", icon: "🤰" },
      { id: "DEPT-014", locId: "LOC-D4", name: "Nephrology & Dialysis", shortName: "Dialysis", x: 340, y: 240, w: 110, h: 110, cx: 395, cy: 295, color: "#EAF2FB", border: "#0284c7", icon: "💧" },
      { id: "DEPT-009", locId: "LOC-E2", name: "Neurology & Stroke ICU", shortName: "Neurology", x: 460, y: 240, w: 100, h: 110, cx: 510, cy: 295, color: "#f3e8ff", border: "#7c3aed", icon: "🧠" }
    ]
  }
};

// Helper: map floor string like "Ground Floor", "1st Floor", "2nd Floor" to numeric index (0, 1, 2)
export function parseFloorIndex(floorStr) {
  if (!floorStr) return 0;
  const str = floorStr.toLowerCase();
  if (str.includes('1st') || str.includes('first') || str.includes('1')) return 1;
  if (str.includes('2nd') || str.includes('second') || str.includes('3rd') || str.includes('4th') || str.includes('2')) return 2;
  return 0;
}

export default function BuildingMap({ currentLocation, destination, onSelectRoom }) {
  const startFloorIdx = parseFloorIndex(currentLocation?.floor);
  const destFloorIdx  = parseFloorIndex(destination?.floor);

  const [activeFloor, setActiveFloor] = useState(destFloorIdx || startFloorIdx || 0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const currentFloorPlan = FLOOR_PLANS[activeFloor] || FLOOR_PLANS[0];

  // Helper to find room node by department ID or location ID
  function findRoomNode(floorIdx, deptId, locId) {
    const plan = FLOOR_PLANS[floorIdx];
    if (!plan) return null;
    return plan.rooms.find(r => r.id === deptId || r.locId === locId);
  }

  const startNode = findRoomNode(startFloorIdx, null, currentLocation?.id);
  const destNode  = findRoomNode(destFloorIdx, destination?.id, null);

  // Check if start or destination is on current active floor
  const isStartOnFloor = startFloorIdx === activeFloor && startNode;
  const isDestOnFloor  = destFloorIdx  === activeFloor && destNode;

  // Center Elevator Node coordinates
  const elevatorNode = { cx: 300, cy: 200 };

  // Calculate dynamic path coordinates for active floor
  function getPathPoints() {
    if (isStartOnFloor && isDestOnFloor) {
      // Start & End on same floor
      return `${startNode.cx},${startNode.cy} ${startNode.cx},200 ${destNode.cx},200 ${destNode.cx},${destNode.cy}`;
    } else if (isStartOnFloor) {
      // Path from start node to elevator
      return `${startNode.cx},${startNode.cy} ${startNode.cx},200 ${elevatorNode.cx},200`;
    } else if (isDestOnFloor) {
      // Path from elevator to destination node
      return `${elevatorNode.cx},200 ${destNode.cx},200 ${destNode.cx},${destNode.cy}`;
    }
    return null;
  }

  const pathPoints = getPathPoints();

  return (
    <div className="building-map-wrapper card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
      
      {/* Header & Floor Selector Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #0f172a, #0077B6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
              3-Floor Interactive Hospital Map
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {currentFloorPlan.subtitle}
            </p>
          </div>
        </div>

        {/* Floor Level Toggle Buttons */}
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 10 }}>
          {[0, 1, 2].map(idx => {
            const plan = FLOOR_PLANS[idx];
            const isActive = activeFloor === idx;
            const hasStart = startFloorIdx === idx && currentLocation;
            const hasDest  = destFloorIdx === idx && destination;

            return (
              <button
                key={idx}
                onClick={() => setActiveFloor(idx)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#fff' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.2s'
                }}
              >
                {plan.shortLabel}
                {hasStart && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06D6A0' }} title="You Are Here" />}
                {hasDest && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef476f' }} title="Destination" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Floor Transition Alert Banner */}
      {currentLocation && destination && startFloorIdx !== destFloorIdx && (
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          border: '1px solid #93c5fd',
          padding: '10px 14px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          fontSize: '0.8rem',
          color: '#1e40af'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <Sparkles size={16} color="#2563eb" />
            <span>
              Route spans floors: <strong>{FLOOR_PLANS[startFloorIdx].shortLabel}</strong> ➔ <strong>{FLOOR_PLANS[destFloorIdx].shortLabel}</strong> via Elevator
            </span>
          </div>
          <button
            onClick={() => setActiveFloor(activeFloor === startFloorIdx ? destFloorIdx : startFloorIdx)}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            View {activeFloor === startFloorIdx ? FLOOR_PLANS[destFloorIdx].shortLabel : FLOOR_PLANS[startFloorIdx].shortLabel} <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Vector 2D Architectural SVG Map Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        background: '#f8fafc',
        borderRadius: 14,
        border: '1.5px solid #cbd5e1',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)'
      }}>
        <svg
          viewBox="0 0 600 400"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>

            {/* Glowing marker gradients */}
            <radialGradient id="startGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06D6A0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06D6A0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef476f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef476f" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid & Outer Wall */}
          <rect width="600" height="400" fill="url(#grid)" />
          <rect x="20" y="20" width="560" height="360" rx="16" fill="none" stroke="#0f172a" strokeWidth="4" />

          {/* Main Central Corridor Pathway */}
          <rect x="40" y="170" width="520" height="60" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <text x="70" y="205" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="1">CENTRAL CORRIDOR / WING</text>

          {/* Elevator & Stairs Hub (Center) */}
          <g transform="translate(265, 175)">
            <rect width="70" height="50" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <text x="35" y="24" fill="#fff" fontSize="16" textAnchor="middle">🛗</text>
            <text x="35" y="40" fill="#94a3b8" fontSize="9" fontWeight="800" textAnchor="middle">ELEVATORS</text>
          </g>

          {/* Stairs Hub (Left) */}
          <g transform="translate(45, 178)">
            <rect width="45" height="44" rx="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="22.5" y="26" fill="#334155" fontSize="14" textAnchor="middle">🪜</text>
          </g>

          {/* Restrooms Hub (Right) */}
          <g transform="translate(510, 178)">
            <rect width="45" height="44" rx="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="22.5" y="26" fill="#334155" fontSize="14" textAnchor="middle">🚻</text>
          </g>

          {/* Render Rooms / Departments for Active Floor */}
          {currentFloorPlan.rooms.map(room => {
            const isStart = isStartOnFloor && startNode?.id === room.id;
            const isDest  = isDestOnFloor && destNode?.id === room.id;
            const isSelected = selectedRoom?.id === room.id;

            return (
              <g
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  if (onSelectRoom && room.id !== 'ENTRANCE') {
                    const deptObj = DEPARTMENTS.find(d => d.id === room.id);
                    if (deptObj) onSelectRoom(deptObj);
                  }
                }}
                style={{ cursor: room.isGate ? 'default' : 'pointer' }}
              >
                {/* Room Box */}
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.w}
                  height={room.h}
                  rx="10"
                  fill={room.color}
                  stroke={isSelected ? '#0077B6' : isDest ? '#ef476f' : isStart ? '#06D6A0' : room.border}
                  strokeWidth={isSelected || isStart || isDest ? 3 : 1.5}
                />

                {/* Room Icon & Title */}
                <text x={room.cx} y={room.cy - 12} fontSize="18" textAnchor="middle">{room.icon}</text>
                <text
                  x={room.cx}
                  y={room.cy + 8}
                  fill={room.isGate ? '#fff' : '#0f172a'}
                  fontSize="11"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {room.shortName}
                </text>

                {/* Doorway Notch */}
                <circle
                  cx={room.cx}
                  cy={room.y < 170 ? room.y + room.h : room.y}
                  r="4"
                  fill="#0f172a"
                />
              </g>
            );
          })}

          {/* Render Animated Navigation Path Line if active */}
          {pathPoints && (
            <g>
              <polyline
                points={pathPoints}
                fill="none"
                stroke="#0077B6"
                strokeWidth="5"
                strokeDasharray="8 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: 'dash 1.5s linear infinite' }}
              />
              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -28; }
                }
              `}</style>
            </g>
          )}

          {/* Render Start Marker ("You Are Here") */}
          {isStartOnFloor && startNode && (
            <g transform={`translate(${startNode.cx}, ${startNode.cy})`}>
              <circle r="22" fill="url(#startGlow)" />
              <circle r="10" fill="#06D6A0" stroke="#fff" strokeWidth="2.5" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">YOU</text>
            </g>
          )}

          {/* Render Destination Marker */}
          {isDestOnFloor && destNode && (
            <g transform={`translate(${destNode.cx}, ${destNode.cy})`}>
              <circle r="22" fill="url(#destGlow)" />
              <circle r="12" fill="#ef476f" stroke="#fff" strokeWidth="2.5" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">📍</text>
            </g>
          )}
        </svg>

        {/* Floating Floor Badge Overlay */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(15, 23, 42, 0.85)',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: 8,
          fontSize: '0.74rem',
          fontWeight: 700,
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <MapPin size={12} color="#00B4D8" />
          <span>{currentFloorPlan.floorName}</span>
        </div>
      </div>

      {/* Legend & Instructions Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: '0.76rem', color: '#64748b' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#06D6A0', border: '1px solid #fff' }} />
            Start Location
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef476f', border: '1px solid #fff' }} />
            Destination
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 14, height: 4, background: '#0077B6', borderRadius: 2 }} />
            Walking Path
          </span>
        </div>
        <div style={{ fontStyle: 'italic' }}>
          💡 Tap any room on the map to inspect or set as destination
        </div>
      </div>

      {/* Selected Room Details Card */}
      {selectedRoom && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          padding: 12,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              {selectedRoom.icon} {selectedRoom.name}
            </h4>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
              Located on {FLOOR_PLANS[activeFloor].shortLabel}
            </p>
          </div>

          {onSelectRoom && selectedRoom.id !== 'ENTRANCE' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                const deptObj = DEPARTMENTS.find(d => d.id === selectedRoom.id);
                if (deptObj) onSelectRoom(deptObj);
              }}
              style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Navigation size={12} /> Route Here
            </button>
          )}
        </div>
      )}

    </div>
  );
}
