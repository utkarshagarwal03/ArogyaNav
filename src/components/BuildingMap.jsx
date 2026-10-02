import { useState, useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Circle, Line, Text, Group, Image as KonvaImage, Rect } from 'react-konva';
import { loadGraph, FLOOR_KEYS, NODE_TYPES, floorKeyFromLabel, dijkstra, DEPT_NODE_MAP } from '../data/mapGraphStore';
import { DEPARTMENTS } from '../data/hospitalData';
import { Layers, ChevronRight, Sparkles } from 'lucide-react';

const SHORT_FLOOR = { GF: 'Ground', '1F': '1st', '2F': '2nd', '3F': '3rd', '4F': '4th', B1: 'Basement' };
const CANVAS_W = 800;
const CANVAS_H = 500;

function truncate(s, n = 16) {
  return s && s.length > n ? s.slice(0, n - 1) + '\u2026' : (s || '');
}
function midpoint(x1, y1, x2, y2) { return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }; }

export default function BuildingMap({ currentLocation, destination, onSelectRoom }) {
  const graph = useMemo(() => loadGraph(), []);
  
  const startFloorKey = currentLocation ? floorKeyFromLabel(currentLocation.floor) : 'GF';
  const endFloorKey   = destination ? floorKeyFromLabel(destination.floor) : null;
  const startNodeId   = currentLocation?.id;
  const endNodeId     = destination ? DEPT_NODE_MAP[destination.id] : null;

  const [activeFloor, setActiveFloor] = useState(startFloorKey);
  const [bgImage, setBgImage]         = useState(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Resize canvas to fit container
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      // Scale down if container is smaller than CANVAS_W
      setScale(w < CANVAS_W ? w / CANVAS_W : 1);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute route
  const route = useMemo(() => {
    if (!startNodeId || !endNodeId) return null;
    return dijkstra(graph, startFloorKey, startNodeId, endFloorKey, endNodeId);
  }, [graph, startFloorKey, startNodeId, endFloorKey, endNodeId]);

  // Set active floor if it changes externally
  useEffect(() => {
    if (endFloorKey && endFloorKey !== activeFloor) {
      setActiveFloor(endFloorKey);
    } else if (startFloorKey && !endFloorKey) {
      setActiveFloor(startFloorKey);
    }
  }, [startFloorKey, endFloorKey]);

  // Load background image
  useEffect(() => {
    const url = graph.floors[activeFloor]?.imageDataUrl;
    if (url) {
      const img = new window.Image();
      img.src = url;
      img.onload = () => setBgImage(img);
    } else {
      setBgImage(null);
    }
  }, [activeFloor, graph.floors[activeFloor]?.imageDataUrl]);

  const floorData = graph.floors[activeFloor] || { nodes: {}, edges: [] };
  const nodes = floorData.nodes || {};
  const edges = floorData.edges || [];

  // Determine which edges/nodes are part of the route on the current floor
  const routeEdges = new Set();
  const routeNodes = new Set();
  if (route && route.path) {
    for (let i = 0; i < route.path.length; i++) {
      const [fKey, nId] = route.path[i].split('::');
      if (fKey === activeFloor) routeNodes.add(nId);
      
      if (i < route.path.length - 1) {
        const [nextFKey, nextNId] = route.path[i+1].split('::');
        if (fKey === activeFloor && nextFKey === activeFloor) {
          // Find the edge between nId and nextNId
          const edge = edges.find(e => (e.from === nId && e.to === nextNId) || (e.from === nextNId && e.to === nId));
          if (edge) routeEdges.add(edge.id);
        }
      }
    }
  }

  // Reverse map node -> dept
  const nodeToDept = useMemo(() => {
    const map = {};
    for (const [deptId, nodeId] of Object.entries(DEPT_NODE_MAP)) {
      map[nodeId] = DEPARTMENTS.find(d => d.id === deptId);
    }
    return map;
  }, []);

  function handleNodeClick(nodeId) {
    if (onSelectRoom) {
      const dept = nodeToDept[nodeId];
      if (dept) onSelectRoom(dept);
    }
  }

  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #0f172a, #0077B6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Live Hospital Map</h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Generated from Map Editor
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 10 }}>
          {FLOOR_KEYS.map(fk => {
            const isActive = activeFloor === fk;
            const hasStart = startFloorKey === fk && startNodeId;
            const hasDest  = endFloorKey === fk && endNodeId;
            return (
              <button key={fk} onClick={() => setActiveFloor(fk)}
                style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: isActive ? '#0077B6' : 'transparent', color: isActive ? '#fff' : '#475569',
                  display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s'
                }}>
                {SHORT_FLOOR[fk]}
                {hasStart && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06D6A0' }} title="You Are Here" />}
                {hasDest && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef476f' }} title="Destination" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-floor transition banner */}
      {route && startFloorKey !== endFloorKey && (
        <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd', padding: '8px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#1e40af' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <Sparkles size={14} color="#2563eb" /> Route spans across floors!
          </div>
          <button onClick={() => setActiveFloor(activeFloor === startFloorKey ? endFloorKey : startFloorKey)}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            View {activeFloor === startFloorKey ? SHORT_FLOOR[endFloorKey] : SHORT_FLOOR[startFloorKey]} <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Canvas */}
      <div ref={containerRef} style={{ width: '100%', background: '#e8edf2', borderRadius: 12, overflow: 'hidden', border: '1.5px solid #cbd5e1', display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CANVAS_W * scale, height: CANVAS_H * scale }}>
          <Stage width={CANVAS_W} height={CANVAS_H}>
            <Layer>
              {bgImage ? (
                <KonvaImage image={bgImage} width={CANVAS_W} height={CANVAS_H} opacity={0.5} listening={false} />
              ) : (
                <Rect width={CANVAS_W} height={CANVAS_H} fill="#ffffff" listening={false} />
              )}
            </Layer>
            
            {/* Edges */}
            <Layer>
              {edges.map(edge => {
                const A = nodes[edge.from], B = nodes[edge.to];
                if (!A || !B) return null;
                const isRoute = routeEdges.has(edge.id);
                const mid = midpoint(A.x, A.y, B.x, B.y);
                return (
                  <Group key={edge.id} listening={false}>
                    <Line points={[A.x, A.y, B.x, B.y]} 
                      stroke={isRoute ? '#ef476f' : '#94a3b8'} 
                      strokeWidth={isRoute ? 6 : 2} 
                      dash={!edge.accessible ? [6, 4] : []}
                      shadowColor={isRoute ? '#ef476f' : undefined} shadowBlur={isRoute ? 10 : 0} />
                    {!isRoute && (
                      <>
                        <Rect x={mid.x-14} y={mid.y-7} width={28} height={14} fill="#f8fafc" cornerRadius={4} />
                        <Text x={mid.x-14} y={mid.y-4} width={28} text={edge.distance+'m'} fontSize={8} fill="#64748b" align="center" />
                      </>
                    )}
                  </Group>
                );
              })}
            </Layer>

            {/* Nodes */}
            <Layer>
              {Object.values(nodes).map(node => {
                const cfg = NODE_TYPES[node.type] || NODE_TYPES.junction;
                const r = cfg.radius || 12;
                const isStart = activeFloor === startFloorKey && node.id === startNodeId;
                const isDest  = activeFloor === endFloorKey && node.id === endNodeId;
                const inRoute = routeNodes.has(node.id);
                const dept = nodeToDept[node.id];
                const clickable = !!onSelectRoom && !!dept;

                let strokeColor = cfg.color || '#0077B6';
                let strokeW = 2;
                if (isStart) { strokeColor = '#06D6A0'; strokeW = 4; }
                else if (isDest) { strokeColor = '#ef476f'; strokeW = 4; }
                else if (inRoute) { strokeColor = '#ef476f'; strokeW = 3; }

                return (
                  <Group key={node.id} x={Number(node.x)} y={Number(node.y)}
                    onClick={() => handleNodeClick(node.id)} onTap={() => handleNodeClick(node.id)}
                    onMouseEnter={e => { if (clickable) e.target.getStage().container().style.cursor = 'pointer'; }}
                    onMouseLeave={e => { if (clickable) e.target.getStage().container().style.cursor = 'default'; }}
                  >
                    {clickable && <Rect x={-(r+15)} y={-(r+15)} width={(r+15)*2} height={(r+15)*2} fill="transparent" />}
                    
                    {/* Ring for start/dest */}
                    {(isStart || isDest) && (
                      <Circle r={r + 8} fill={isStart ? '#e6faf5' : '#fde8ee'} stroke={strokeColor} strokeWidth={2} listening={false} />
                    )}
                    <Circle r={r} fill={cfg.fill || '#fff'} stroke={strokeColor} strokeWidth={strokeW} listening={false} />
                    <Text x={-(r+30)} y={r+4} width={(r+30)*2} text={truncate(node.name, 14)} fontSize={9} fill="#0f172a" fontStyle={isStart || isDest || inRoute ? 'bold' : 'normal'} align="center" listening={false} />
                  </Group>
                );
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
