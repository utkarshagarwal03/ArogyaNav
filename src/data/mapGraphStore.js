// ─── ArogyaNav Map Graph Store ──────────────────────────────────────────────
// Stores the hospital navigation graph (nodes + edges) in localStorage.
// The Super Admin map editor writes here; Dijkstra reads from here.
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_KEY = 'arogyanav_map_graph_v2';

// ─── Node Type Config ─────────────────────────────────────────────────────────
export const NODE_TYPES = {
  checkpoint : { label: 'QR Checkpoint',     color: '#0077B6', fill: '#dbeafe', radius: 14, icon: '📍' },
  junction   : { label: 'Junction/Corridor', color: '#64748b', fill: '#f1f5f9', radius: 10, icon: '●'  },
  elevator   : { label: 'Elevator',          color: '#1e293b', fill: '#334155', radius: 13, icon: '🛗'  },
  stairs     : { label: 'Stairs',            color: '#7c3aed', fill: '#ede9fe', radius: 11, icon: '🪜'  },
  entrance   : { label: 'Entrance / Exit',   color: '#0f172a', fill: '#1e293b', radius: 14, icon: '🚪'  },
  department : { label: 'Department Room',   color: '#059173', fill: '#d1fae5', radius: 13, icon: '🏥'  },
};

// ─── Department → Node ID mapping ────────────────────────────────────────────
// Used by generateRouteFromGraph to find the destination node for a department.
export const DEPT_NODE_MAP = {
  'DEPT-001': 'LOC-B1',   // Emergency
  'DEPT-002': 'LOC-C1',   // OPD
  'DEPT-003': 'LOC-B2',   // Radiology
  'DEPT-004': 'LOC-B3',   // Lab
  'DEPT-005': 'LOC-D2',   // Cardiology
  'DEPT-006': 'LOC-E3',   // Orthopaedics
  'DEPT-007': 'LOC-A4',   // Pharmacy
  'DEPT-008': 'LOC-D3',   // Paediatrics
  'DEPT-009': 'LOC-E2',   // Neurology
  'DEPT-010': 'LOC-F2',   // Robotic OT
  'DEPT-011': 'LOC-C5',   // Physiotherapy
  'DEPT-012': 'LOC-B4',   // Cafeteria
  'DEPT-013': 'LOC-E4',   // Oncology
  'DEPT-014': 'LOC-D4',   // Nephrology
  'DEPT-015': 'LOC-C3',   // ENT
  'DEPT-016': 'LOC-C3',   // Eye Care
  'DEPT-017': 'LOC-C4',   // Dermatology
  'DEPT-018': 'LOC-C3',   // Dental
  'DEPT-019': 'LOC-D3',   // Gynaecology
  'DEPT-020': 'LOC-C2',   // Psychiatry
  'DEPT-021': 'LOC-BASE-2',// Blood Bank
  'DEPT-022': 'LOC-F3',   // Transplant
  'DEPT-023': 'LOC-BASE-1',// Parking
  'DEPT-024': 'LOC-A3',   // Billing
  'DEPT-025': 'LOC-A2',   // Wheelchair Desk
};

// ─── Floor Config ─────────────────────────────────────────────────────────────
export const FLOOR_KEYS   = ['GF', '1F', '2F', '3F', '4F', 'B1'];
export const FLOOR_LABELS = {
  GF: 'Ground Floor', '1F': '1st Floor', '2F': '2nd Floor',
  '3F': '3rd Floor', '4F': '4th Floor', B1: 'Basement B1',
};

// ─── Default Graph ─────────────────────────────────────────────────────────────
// Pre-populated with all 25+ HOSPITAL_LOCATIONS + elevator/stair junction nodes.
// Positions are in canvas coordinates (800 × 520 viewBox).
function buildDefaultGraph() {
  return {
    version: 2,
    floors: {
      GF: {
        label: 'Ground Floor',
        imageDataUrl: null,
        nodes: {
          'LOC-A1':    { id: 'LOC-A1',    name: 'Main Entrance Portico',          type: 'entrance',   x: 400, y: 450, qrCode: 'LOC-A1'    },
          'LOC-A2':    { id: 'LOC-A2',    name: 'Central Atrium & Help Desk',     type: 'checkpoint', x: 400, y: 330, qrCode: 'LOC-A2'    },
          'LOC-A3':    { id: 'LOC-A3',    name: 'Billing & Insurance TPA',        type: 'checkpoint', x: 570, y: 250, qrCode: 'LOC-A3'    },
          'LOC-A4':    { id: 'LOC-A4',    name: 'Manipal 24/7 Main Pharmacy',     type: 'checkpoint', x: 230, y: 250, qrCode: 'LOC-A4'    },
          'LOC-B1':    { id: 'LOC-B1',    name: 'Emergency Casualty Gate',        type: 'checkpoint', x: 100, y: 100, qrCode: 'LOC-B1'    },
          'LOC-B2':    { id: 'LOC-B2',    name: 'Radiology & Imaging Lounge',     type: 'checkpoint', x: 290, y: 100, qrCode: 'LOC-B2'    },
          'LOC-B3':    { id: 'LOC-B3',    name: 'Central Diagnostics & Lab',      type: 'checkpoint', x: 480, y: 100, qrCode: 'LOC-B3'    },
          'LOC-B4':    { id: 'LOC-B4',    name: 'Garden Court Cafeteria',         type: 'checkpoint', x: 660, y: 180, qrCode: 'LOC-B4'    },
          'ELEV-GF':   { id: 'ELEV-GF',  name: 'Elevator Bank (Ground)',          type: 'elevator',   x: 400, y: 210, qrCode: ''          },
          'STAIRS-GF': { id: 'STAIRS-GF',name: 'Staircase (Ground)',              type: 'stairs',     x: 100, y: 240, qrCode: ''          },
        },
        edges: [
          { id: 'e-gf-1',  from: 'LOC-A1',    to: 'LOC-A2',    distance: 30, accessible: true  },
          { id: 'e-gf-2',  from: 'LOC-A2',    to: 'LOC-A3',    distance: 25, accessible: true  },
          { id: 'e-gf-3',  from: 'LOC-A2',    to: 'LOC-A4',    distance: 20, accessible: true  },
          { id: 'e-gf-4',  from: 'LOC-A2',    to: 'ELEV-GF',   distance: 15, accessible: true  },
          { id: 'e-gf-5',  from: 'ELEV-GF',   to: 'LOC-B2',    distance: 40, accessible: true  },
          { id: 'e-gf-6',  from: 'LOC-B1',    to: 'LOC-B2',    distance: 35, accessible: true  },
          { id: 'e-gf-7',  from: 'LOC-B2',    to: 'LOC-B3',    distance: 30, accessible: true  },
          { id: 'e-gf-8',  from: 'LOC-B3',    to: 'LOC-B4',    distance: 30, accessible: true  },
          { id: 'e-gf-9',  from: 'LOC-A3',    to: 'LOC-B3',    distance: 35, accessible: true  },
          { id: 'e-gf-10', from: 'ELEV-GF',   to: 'STAIRS-GF', distance: 25, accessible: true  },
          { id: 'e-gf-11', from: 'LOC-A4',    to: 'STAIRS-GF', distance: 20, accessible: false },
          { id: 'e-gf-12', from: 'LOC-B1',    to: 'STAIRS-GF', distance: 45, accessible: false },
          { id: 'e-gf-13', from: 'ELEV-GF',   to: 'LOC-B3',    distance: 35, accessible: true  },
        ],
      },

      '1F': {
        label: '1st Floor',
        imageDataUrl: null,
        nodes: {
          'LOC-C1':   { id: 'LOC-C1',   name: 'Wing C OPD Registration',          type: 'checkpoint', x: 190, y: 190, qrCode: 'LOC-C1' },
          'LOC-C2':   { id: 'LOC-C2',   name: 'General Medicine & Gastro',        type: 'checkpoint', x: 360, y: 190, qrCode: 'LOC-C2' },
          'LOC-C3':   { id: 'LOC-C3',   name: 'ENT, Eye & Dental Care Suite',     type: 'checkpoint', x: 540, y: 110, qrCode: 'LOC-C3' },
          'LOC-C4':   { id: 'LOC-C4',   name: 'Dermatology & Skin Clinic',        type: 'checkpoint', x: 190, y: 350, qrCode: 'LOC-C4' },
          'LOC-C5':   { id: 'LOC-C5',   name: 'Physiotherapy & Hydrotherapy',     type: 'checkpoint', x: 420, y: 370, qrCode: 'LOC-C5' },
          'ELEV-1F':  { id: 'ELEV-1F',  name: 'Elevator Bank (1st Floor)',        type: 'elevator',   x: 400, y: 210, qrCode: ''       },
          'STAIRS-1F':{ id: 'STAIRS-1F',name: 'Staircase (1st Floor)',            type: 'stairs',     x: 100, y: 250, qrCode: ''       },
          'JN-1F-A':  { id: 'JN-1F-A',  name: 'Main Corridor Junction',           type: 'junction',   x: 360, y: 280, qrCode: ''       },
        },
        edges: [
          { id: 'e-1f-1', from: 'ELEV-1F',   to: 'LOC-C1',    distance: 30, accessible: true  },
          { id: 'e-1f-2', from: 'ELEV-1F',   to: 'LOC-C2',    distance: 15, accessible: true  },
          { id: 'e-1f-3', from: 'LOC-C1',    to: 'LOC-C2',    distance: 25, accessible: true  },
          { id: 'e-1f-4', from: 'LOC-C2',    to: 'LOC-C3',    distance: 40, accessible: true  },
          { id: 'e-1f-5', from: 'LOC-C1',    to: 'LOC-C4',    distance: 30, accessible: true  },
          { id: 'e-1f-6', from: 'LOC-C2',    to: 'JN-1F-A',   distance: 20, accessible: true  },
          { id: 'e-1f-7', from: 'JN-1F-A',   to: 'LOC-C4',    distance: 25, accessible: true  },
          { id: 'e-1f-8', from: 'JN-1F-A',   to: 'LOC-C5',    distance: 20, accessible: true  },
          { id: 'e-1f-9', from: 'STAIRS-1F', to: 'LOC-C1',    distance: 20, accessible: false },
          { id: 'e-1f-10',from: 'STAIRS-1F', to: 'LOC-C4',    distance: 15, accessible: false },
        ],
      },

      '2F': {
        label: '2nd Floor',
        imageDataUrl: null,
        nodes: {
          'LOC-D1':   { id: 'LOC-D1',   name: 'Wing D Elevator Lobby',            type: 'checkpoint', x: 400, y: 300, qrCode: 'LOC-D1' },
          'LOC-D2':   { id: 'LOC-D2',   name: 'Cath Lab & Cardiac ICU Lobby',     type: 'checkpoint', x: 170, y: 130, qrCode: 'LOC-D2' },
          'LOC-D3':   { id: 'LOC-D3',   name: 'Paediatrics & NICU Suite',         type: 'checkpoint', x: 400, y: 130, qrCode: 'LOC-D3' },
          'LOC-D4':   { id: 'LOC-D4',   name: 'Nephrology & Dialysis Center',     type: 'checkpoint', x: 610, y: 200, qrCode: 'LOC-D4' },
          'ELEV-2F':  { id: 'ELEV-2F',  name: 'Elevator Bank (2nd Floor)',        type: 'elevator',   x: 400, y: 215, qrCode: ''       },
          'STAIRS-2F':{ id: 'STAIRS-2F',name: 'Staircase (2nd Floor)',            type: 'stairs',     x: 100, y: 250, qrCode: ''       },
        },
        edges: [
          { id: 'e-2f-1', from: 'ELEV-2F',   to: 'LOC-D1',    distance: 10, accessible: true  },
          { id: 'e-2f-2', from: 'LOC-D1',    to: 'LOC-D2',    distance: 60, accessible: true  },
          { id: 'e-2f-3', from: 'LOC-D1',    to: 'LOC-D3',    distance: 40, accessible: true  },
          { id: 'e-2f-4', from: 'LOC-D1',    to: 'LOC-D4',    distance: 50, accessible: true  },
          { id: 'e-2f-5', from: 'LOC-D3',    to: 'LOC-D2',    distance: 40, accessible: true  },
          { id: 'e-2f-6', from: 'STAIRS-2F', to: 'LOC-D2',    distance: 40, accessible: false },
          { id: 'e-2f-7', from: 'ELEV-2F',   to: 'LOC-D3',    distance: 30, accessible: true  },
        ],
      },

      '3F': {
        label: '3rd Floor',
        imageDataUrl: null,
        nodes: {
          'LOC-E1':   { id: 'LOC-E1',   name: 'Wing E Elevator Lobby',            type: 'checkpoint', x: 400, y: 310, qrCode: 'LOC-E1' },
          'LOC-E2':   { id: 'LOC-E2',   name: 'Neurology & Stroke ICU Suite',     type: 'checkpoint', x: 200, y: 130, qrCode: 'LOC-E2' },
          'LOC-E3':   { id: 'LOC-E3',   name: 'Orthopaedics & Spine Center',      type: 'checkpoint', x: 420, y: 130, qrCode: 'LOC-E3' },
          'LOC-E4':   { id: 'LOC-E4',   name: 'Oncology & Chemotherapy Suite',    type: 'checkpoint', x: 600, y: 130, qrCode: 'LOC-E4' },
          'LOC-E5':   { id: 'LOC-E5',   name: 'Urology & Male Health Suite',      type: 'checkpoint', x: 600, y: 320, qrCode: 'LOC-E5' },
          'ELEV-3F':  { id: 'ELEV-3F',  name: 'Elevator Bank (3rd Floor)',        type: 'elevator',   x: 400, y: 215, qrCode: ''       },
          'STAIRS-3F':{ id: 'STAIRS-3F',name: 'Staircase (3rd Floor)',            type: 'stairs',     x: 100, y: 250, qrCode: ''       },
        },
        edges: [
          { id: 'e-3f-1', from: 'ELEV-3F',   to: 'LOC-E1',    distance: 15, accessible: true  },
          { id: 'e-3f-2', from: 'LOC-E1',    to: 'LOC-E2',    distance: 60, accessible: true  },
          { id: 'e-3f-3', from: 'LOC-E1',    to: 'LOC-E3',    distance: 40, accessible: true  },
          { id: 'e-3f-4', from: 'LOC-E3',    to: 'LOC-E4',    distance: 30, accessible: true  },
          { id: 'e-3f-5', from: 'LOC-E1',    to: 'LOC-E5',    distance: 30, accessible: true  },
          { id: 'e-3f-6', from: 'STAIRS-3F', to: 'LOC-E2',    distance: 50, accessible: false },
          { id: 'e-3f-7', from: 'LOC-E4',    to: 'LOC-E5',    distance: 40, accessible: true  },
        ],
      },

      '4F': {
        label: '4th Floor',
        imageDataUrl: null,
        nodes: {
          'LOC-F1':   { id: 'LOC-F1',   name: 'Wing F Surgical Holding Area',     type: 'checkpoint', x: 230, y: 180, qrCode: 'LOC-F1' },
          'LOC-F2':   { id: 'LOC-F2',   name: 'Robotic OT Complex Entrance',      type: 'checkpoint', x: 420, y: 130, qrCode: 'LOC-F2' },
          'LOC-F3':   { id: 'LOC-F3',   name: 'Organ Transplant Recovery ICU',    type: 'checkpoint', x: 610, y: 180, qrCode: 'LOC-F3' },
          'ELEV-4F':  { id: 'ELEV-4F',  name: 'Elevator Bank (4th Floor)',        type: 'elevator',   x: 400, y: 300, qrCode: ''       },
          'STAIRS-4F':{ id: 'STAIRS-4F',name: 'Staircase (4th Floor)',            type: 'stairs',     x: 100, y: 250, qrCode: ''       },
        },
        edges: [
          { id: 'e-4f-1', from: 'ELEV-4F',   to: 'LOC-F1',    distance: 40, accessible: true  },
          { id: 'e-4f-2', from: 'LOC-F1',    to: 'LOC-F2',    distance: 30, accessible: true  },
          { id: 'e-4f-3', from: 'LOC-F2',    to: 'LOC-F3',    distance: 30, accessible: true  },
          { id: 'e-4f-4', from: 'ELEV-4F',   to: 'LOC-F2',    distance: 20, accessible: true  },
          { id: 'e-4f-5', from: 'STAIRS-4F', to: 'LOC-F1',    distance: 25, accessible: false },
        ],
      },

      B1: {
        label: 'Basement B1',
        imageDataUrl: null,
        nodes: {
          'LOC-BASE-1': { id: 'LOC-BASE-1', name: 'Basement Visitor Parking Desk', type: 'checkpoint', x: 200, y: 340, qrCode: 'LOC-BASE-1' },
          'LOC-BASE-2': { id: 'LOC-BASE-2', name: 'Central Blood Bank & Plasma',   type: 'checkpoint', x: 580, y: 190, qrCode: 'LOC-BASE-2' },
          'ELEV-B1':    { id: 'ELEV-B1',    name: 'Elevator Bank (Basement)',      type: 'elevator',   x: 400, y: 220, qrCode: ''           },
        },
        edges: [
          { id: 'e-b1-1', from: 'ELEV-B1', to: 'LOC-BASE-1', distance: 50, accessible: true },
          { id: 'e-b1-2', from: 'ELEV-B1', to: 'LOC-BASE-2', distance: 40, accessible: true },
        ],
      },
    },

    // Cross-floor connections: elevator & stairs links between floors
    // These are treated as special inter-floor edges by the Dijkstra builder.
    crossFloorEdges: [
      { id: 'xf-elev-b1-gf', fromFloor: 'B1', fromNode: 'ELEV-B1',    toFloor: 'GF', toNode: 'ELEV-GF',   distance: 15, mode: 'elevator' },
      { id: 'xf-elev-gf-1f', fromFloor: 'GF', fromNode: 'ELEV-GF',    toFloor: '1F', toNode: 'ELEV-1F',   distance: 15, mode: 'elevator' },
      { id: 'xf-elev-1f-2f', fromFloor: '1F', fromNode: 'ELEV-1F',    toFloor: '2F', toNode: 'ELEV-2F',   distance: 15, mode: 'elevator' },
      { id: 'xf-elev-2f-3f', fromFloor: '2F', fromNode: 'ELEV-2F',    toFloor: '3F', toNode: 'ELEV-3F',   distance: 15, mode: 'elevator' },
      { id: 'xf-elev-3f-4f', fromFloor: '3F', fromNode: 'ELEV-3F',    toFloor: '4F', toNode: 'ELEV-4F',   distance: 15, mode: 'elevator' },
      { id: 'xf-stair-gf-1f',fromFloor: 'GF', fromNode: 'STAIRS-GF',  toFloor: '1F', toNode: 'STAIRS-1F', distance: 30, mode: 'stairs'   },
      { id: 'xf-stair-1f-2f',fromFloor: '1F', fromNode: 'STAIRS-1F',  toFloor: '2F', toNode: 'STAIRS-2F', distance: 30, mode: 'stairs'   },
      { id: 'xf-stair-2f-3f',fromFloor: '2F', fromNode: 'STAIRS-2F',  toFloor: '3F', toNode: 'STAIRS-3F', distance: 30, mode: 'stairs'   },
      { id: 'xf-stair-3f-4f',fromFloor: '3F', fromNode: 'STAIRS-3F',  toFloor: '4F', toNode: 'STAIRS-4F', distance: 30, mode: 'stairs'   },
    ],
  };
}

// ─── LocalStorage persistence ─────────────────────────────────────────────────
export function loadGraph(hid = 'H1') {
  const key = STORAGE_KEY + '_' + hid;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === 2) return parsed;
    }
  } catch (e) {
    console.warn('ArogyaNav: Could not load map graph from localStorage', e);
  }
  if (hid === 'H1') return buildDefaultGraph();
  
  const empty = buildDefaultGraph();
  Object.keys(empty.floors).forEach(f => {
    empty.floors[f].nodes = {};
    empty.floors[f].edges = [];
    empty.floors[f].imageDataUrl = null;
  });
  return empty;
}

export function saveGraph(hid, graph) {
  try {
    localStorage.setItem(STORAGE_KEY + '_' + hid, JSON.stringify(graph));
    return true;
  } catch (e) {
    console.error('ArogyaNav: Could not save map graph', e);
    return false;
  }
}

export function resetGraph() {
  localStorage.removeItem(STORAGE_KEY);
  return buildDefaultGraph();
}

// ─── Floor key from floor label string ───────────────────────────────────────
export function floorKeyFromLabel(floorStr) {
  if (!floorStr) return 'GF';
  const s = floorStr.toLowerCase();
  if (s.includes('basement') || s.includes('b1')) return 'B1';
  if (s.includes('1st') || s.includes('first'))   return '1F';
  if (s.includes('2nd') || s.includes('second'))  return '2F';
  if (s.includes('3rd') || s.includes('third'))   return '3F';
  if (s.includes('4th') || s.includes('fourth'))  return '4F';
  return 'GF';
}

// ─── Dijkstra's Algorithm ─────────────────────────────────────────────────────
/**
 * Runs Dijkstra on the full multi-floor graph.
 * Nodes are identified by "floorKey::nodeId" composite keys.
 * Returns { path: ["GF::LOC-A1", ...], totalDistance: number } or null.
 */
export function dijkstra(graph, startFloor, startNodeId, endFloor, endNodeId, options = {}) {
  const { accessibleOnly = false } = options;

  // Build composite adjacency list
  const adj = {}; // key → [{ key, distance, mode }]

  function addAdj(fromKey, toKey, distance, accessible, mode = 'walk') {
    if (accessibleOnly && accessible === false) return;
    if (!adj[fromKey]) adj[fromKey] = [];
    if (!adj[toKey])   adj[toKey]   = [];
    adj[fromKey].push({ key: toKey, distance, mode });
    adj[toKey].push({ key: fromKey, distance, mode }); // bidirectional
  }

  // Within-floor edges
  Object.entries(graph.floors).forEach(([floorKey, floor]) => {
    (floor.edges || []).forEach(edge => {
      addAdj(
        `${floorKey}::${edge.from}`,
        `${floorKey}::${edge.to}`,
        edge.distance,
        edge.accessible !== false,
        'walk'
      );
    });
  });

  // Cross-floor edges
  (graph.crossFloorEdges || []).forEach(edge => {
    if (accessibleOnly && edge.mode === 'stairs') return;
    addAdj(
      `${edge.fromFloor}::${edge.fromNode}`,
      `${edge.toFloor}::${edge.toNode}`,
      edge.distance,
      edge.mode !== 'stairs',
      edge.mode
    );
  });

  const startKey = `${startFloor}::${startNodeId}`;
  const endKey   = `${endFloor}::${endNodeId}`;

  if (startKey === endKey) return { path: [startKey], totalDistance: 0 };

  const dist = {};
  const prev = {};
  const visited = new Set();

  // Initialize
  Object.keys(adj).forEach(k => { dist[k] = Infinity; prev[k] = null; });
  // Ensure start/end are in dist even if not in adj
  dist[startKey] = 0;
  if (!(endKey in dist)) dist[endKey] = Infinity;

  const queue = new Set(Object.keys(dist));
  queue.add(startKey);
  queue.add(endKey);

  while (queue.size > 0) {
    // Pick unvisited node with min dist
    let u = null;
    queue.forEach(k => {
      if (!visited.has(k) && (u === null || (dist[k] ?? Infinity) < (dist[u] ?? Infinity))) u = k;
    });

    if (!u || dist[u] === Infinity) break;
    if (u === endKey) break;

    visited.add(u);
    queue.delete(u);

    (adj[u] || []).forEach(({ key: v, distance }) => {
      if (visited.has(v)) return;
      const alt = dist[u] + distance;
      if (alt < (dist[v] ?? Infinity)) {
        dist[v] = alt;
        prev[v] = u;
        queue.add(v);
      }
    });
  }

  if (!prev[endKey] && startKey !== endKey) return null; // No path

  // Reconstruct
  const path = [];
  let cur = endKey;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }

  if (path[0] !== startKey) return null;
  return { path, totalDistance: dist[endKey] ?? 0 };
}

// ─── Generate human-readable route steps from Dijkstra path ──────────────────
export function generateRouteFromGraph(hospitalId = 'H1', fromLocation, toDept) {
  if (!fromLocation || !toDept) return null;

  const graph = loadGraph(hospitalId);

  const startFloor  = floorKeyFromLabel(fromLocation.floor);
  const startNodeId = fromLocation.id; // e.g. "LOC-A2"

  const endNodeId = DEPT_NODE_MAP[toDept.id] || toDept.id;
  if (!endNodeId) return null;

  const endFloor = floorKeyFromLabel(toDept.floor);

  const result = dijkstra(graph, startFloor, startNodeId, endFloor, endNodeId);
  if (!result) return null;

  // Convert path to steps
  const steps = [];
  const { path, totalDistance } = result;

  if (path.length > 0) {
    const [startFloor, startNodeStr] = path[0].split('::');
    const startNode = graph.floors[startFloor]?.nodes?.[startNodeStr];
    const startName = startNode?.name || startNodeStr;
    steps.push({
      instruction: `Start at ${startName} (${FLOOR_LABELS[startFloor] || startFloor})`,
      direction: 'straight',
      distance: '0m'
    });
  }

  for (let i = 1; i < path.length; i++) {
    const prevKey = path[i - 1];
    const currKey = path[i];
    
    const [prevFloor, prevNodeId] = prevKey.split('::');
    const [currFloor, currNodeId] = currKey.split('::');
    
    const currNode = graph.floors[currFloor]?.nodes?.[currNodeId];
    const currName = currNode?.name || currNodeId;
    
    // Check if floor changed
    if (prevFloor !== currFloor) {
      const isElevator = currNodeId.startsWith('ELEV') || prevNodeId.startsWith('ELEV');
      const modeLabel  = isElevator ? 'elevator' : 'staircase';
      steps.push({
        instruction: `Take ${modeLabel} to ${FLOOR_LABELS[currFloor] || currFloor}`,
        direction: 'straight',
        distance: '0m',
      });
      continue;
    }
    
    // Normal walking on same floor
    const dist = calcSegDistance(graph, prevFloor, prevNodeId, currKey);
    let dir = 'straight';
    let action = 'Head towards';
    
    if (i > 1) {
      const prevPrevKey = path[i - 2];
      const [prevPrevFloor, prevPrevNodeId] = prevPrevKey.split('::');
      
      if (prevPrevFloor === prevFloor && prevFloor === currFloor) {
        const p1 = graph.floors[prevFloor]?.nodes?.[prevPrevNodeId];
        const p2 = graph.floors[prevFloor]?.nodes?.[prevNodeId];
        const p3 = currNode;
        
        if (p1 && p2 && p3 && p1.x !== undefined && p2.x !== undefined && p3.x !== undefined) {
          const dx1 = p2.x - p1.x;
          const dy1 = p2.y - p1.y;
          const dx2 = p3.x - p2.x;
          const dy2 = p3.y - p2.y;
          
          const cross = dx1 * dy2 - dy1 * dx2;
          const dot = dx1 * dx2 + dy1 * dy2;
          const angle = Math.atan2(cross, dot);
          
          if (angle > 0.35) {
            dir = 'right';
            action = 'Turn right and head towards';
          } else if (angle < -0.35) {
            dir = 'left';
            action = 'Turn left and head towards';
          } else {
            dir = 'straight';
            action = 'Continue straight towards';
          }
        }
      }
    }
    
    steps.push({
      instruction: `${action} ${currName}`,
      direction: dir,
      distance: `~${dist}m`,
    });
  }
  
  if (path.length > 1) {
    const lastKey = path[path.length - 1];
    const [lastFloor, lastNodeId] = lastKey.split('::');
    const lastNode = graph.floors[lastFloor]?.nodes?.[lastNodeId];
    const lastName = lastNode?.name || lastNodeId;
    steps.push({
      instruction: `You have arrived at ${lastName}`,
      direction: 'arrived',
      distance: '0m'
    });
  }

  const estimatedTime = totalDistance < 60  ? '1-2 min'
                       : totalDistance < 120 ? '3-4 min'
                       : totalDistance < 200 ? '5-6 min' : '7+ min';

  return {
    steps,
    totalDistance: `~${Math.round(totalDistance)}m`,
    estimatedTime,
    path,
  };
}

function calcSegDistance(graph, floorKey, fromNodeId, toCompositeKey) {
  const [toFloor, toNodeId] = toCompositeKey.split('::');
  const edges = (floorKey === toFloor)
    ? (graph.floors[floorKey]?.edges || [])
    : (graph.crossFloorEdges || []).filter(
        e => (e.fromFloor === floorKey && e.fromNode === fromNodeId && e.toFloor === toFloor && e.toNode === toNodeId) ||
             (e.toFloor === floorKey && e.toNode === fromNodeId && e.fromFloor === toFloor && e.fromNode === toNodeId)
      );

  const edge = floorKey === toFloor
    ? edges.find(e => (e.from === fromNodeId && e.to === toNodeId) || (e.to === fromNodeId && e.from === toNodeId))
    : edges[0];

  return edge?.distance ?? '?';
}

