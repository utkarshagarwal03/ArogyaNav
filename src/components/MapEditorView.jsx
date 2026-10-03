import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Stage, Layer, Circle, Line, Text, Group, Image as KonvaImage, Rect } from 'react-konva';
import { loadGraph, saveGraph, resetGraph, FLOOR_KEYS, FLOOR_LABELS, NODE_TYPES } from '../data/mapGraphStore';
import { pushMapToCloud } from '../data/firebaseSync';
import {
  Plus, Trash2, Link, MousePointer, Save, RotateCcw,
  Upload, X, Check, MapPin, ChevronLeft, Info,
} from 'lucide-react';


// ── Short floor labels ────────────────────────────────────────────────────────
const SHORT_FLOOR = { GF: 'Ground', '1F': '1st', '2F': '2nd', '3F': '3rd', '4F': '4th', B1: 'Basement' };

const CANVAS_W = 800;
const CANVAS_H = 500;

// ── Tool definitions ──────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'select',  label: 'Select',  Icon: MousePointer, hint: 'Click node/edge to edit. Drag node to move.' },
  { id: 'add',     label: 'Add',     Icon: Plus,         hint: 'Click on the canvas to place a new node.' },
  { id: 'connect', label: 'Connect', Icon: Link,         hint: 'Click node A then node B to draw a corridor.' },
  { id: 'delete',  label: 'Delete',  Icon: Trash2,       hint: 'Click any node or edge to remove it.' },
];

function midpoint(x1, y1, x2, y2) {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

function truncate(s, n = 16) {
  return s && s.length > n ? s.slice(0, n - 1) + '\u2026' : (s || '');
}

// ── Grid ─────────────────────────────────────────────────────────────────────
function Grid() {
  const lines = [];
  for (let x = 0; x <= CANVAS_W; x += 40)
    lines.push(<Line key={'v' + x} points={[x, 0, x, CANVAS_H]} stroke="#e2e8f0" strokeWidth={0.7} listening={false} />);
  for (let y = 0; y <= CANVAS_H; y += 40)
    lines.push(<Line key={'h' + y} points={[0, y, CANVAS_W, y]} stroke="#e2e8f0" strokeWidth={0.7} listening={false} />);
  return <>{lines}</>;
}

// ── Main Component ─────────────────────────────────────────────────────────────
// Renders as a fullscreen fixed overlay so the canvas always has maximum space.
export default function MapEditorView({ hospitalId = 'H1', onClose }) {
  const [graph, setGraph]               = useState(() => loadGraph(hospitalId));
  const [activeFloor, setActiveFloor]   = useState('GF');
  const [tool, setTool]                 = useState('select');
  const [addNodeType, setAddNodeType]   = useState('checkpoint');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [connectingFrom, setConnectFrom]= useState(null);
  const [bgImage, setBgImage]           = useState(null);
  const [savedMsg, setSavedMsg]         = useState(false);
  const [distPopup, setDistPopup]       = useState(null);
  const [nodeForm, setNodeForm]         = useState(null);
  const [edgeForm, setEdgeForm]         = useState(null);
  const stageRef    = useRef(null);
  const fileRef     = useRef(null);

  const floorData = graph.floors[activeFloor] || { nodes: {}, edges: [] };
  const nodes     = floorData.nodes  || {};
  const edges     = floorData.edges  || [];

  // Load bg image when floor or image changes
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

  // Sync node form
  useEffect(() => {
    if (selectedNode && nodes[selectedNode]) {
      setNodeForm({ ...nodes[selectedNode] });
      setSelectedEdge(null);
      setEdgeForm(null);
    } else if (!selectedNode) {
      setNodeForm(null);
    }
  }, [selectedNode]);

  // Sync edge form
  useEffect(() => {
    if (selectedEdge) {
      const e = edges.find(e => e.id === selectedEdge);
      if (e) { setEdgeForm({ ...e }); setSelectedNode(null); setNodeForm(null); }
    } else if (!selectedEdge) {
      setEdgeForm(null);
    }
  }, [selectedEdge]);

  // ── Graph mutation helper ─────────────────────────────────────────────────
  const mutate = useCallback((fn) => {
    setGraph(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });
  }, []);

  function clearSel() {
    setSelectedNode(null); setSelectedEdge(null);
    setNodeForm(null); setEdgeForm(null);
  }

  // ── Canvas click (background) ─────────────────────────────────────────────
  function onStageClick(e) {
    if (e.target !== stageRef.current && e.target.name() !== 'bg') return;
    const pos = stageRef.current.getPointerPosition();
    if (!pos) return;
    if (tool === 'add') {
      const id  = 'NODE-' + Date.now();
      const cfg = NODE_TYPES[addNodeType];
      mutate(g => {
        g.floors[activeFloor].nodes[id] = { id, name: 'New ' + cfg.label, type: addNodeType, x: Math.round(pos.x), y: Math.round(pos.y), qrCode: '' };
      });
      setSelectedNode(id);
      setTool('select');
    } else {
      clearSel();
      if (tool === 'connect') setConnectFrom(null);
    }
  }

  // ── Node click ────────────────────────────────────────────────────────────
  function onNodeClick(id, e) {
    if (e && e.evt) e.evt.stopPropagation();
    e.cancelBubble = true;
    if (tool === 'select') { setSelectedNode(id); }
    else if (tool === 'delete') {
      mutate(g => {
        delete g.floors[activeFloor].nodes[id];
        g.floors[activeFloor].edges = (g.floors[activeFloor].edges || []).filter(ed => ed.from !== id && ed.to !== id);
      });
      clearSel();
    } else if (tool === 'connect') {
      if (!connectingFrom) { setConnectFrom(id); }
      else if (connectingFrom === id) { setConnectFrom(null); }
      else {
        const dup = edges.some(ed => (ed.from === connectingFrom && ed.to === id) || (ed.from === id && ed.to === connectingFrom));
        if (!dup) setDistPopup({ fromId: connectingFrom, toId: id, dist: 20, accessible: true });
        setConnectFrom(null);
      }
    }
  }

  // ── Drag end ──────────────────────────────────────────────────────────────
  function onDragEnd(id, e) {
    const x = Math.round(e.target.x()), y = Math.round(e.target.y());
    mutate(g => { if (g.floors[activeFloor].nodes[id]) { g.floors[activeFloor].nodes[id].x = x; g.floors[activeFloor].nodes[id].y = y; } });
    if (nodeForm?.id === id) setNodeForm(p => ({ ...p, x, y }));
  }

  // ── Edge click ────────────────────────────────────────────────────────────
  function onEdgeClick(id, e) {
    if (e && e.evt) e.evt.stopPropagation();
    e.cancelBubble = true;
    if (tool === 'select') { setSelectedEdge(id); }
    else if (tool === 'delete') {
      mutate(g => { g.floors[activeFloor].edges = (g.floors[activeFloor].edges || []).filter(ed => ed.id !== id); });
      clearSel();
    }
  }

  // ── Create edge ───────────────────────────────────────────────────────────
  function createEdge() {
    if (!distPopup) return;
    const id = 'e-' + distPopup.fromId + '-' + distPopup.toId + '-' + Date.now();
    mutate(g => {
      if (!g.floors[activeFloor].edges) g.floors[activeFloor].edges = [];
      g.floors[activeFloor].edges.push({ id, from: distPopup.fromId, to: distPopup.toId, distance: distPopup.dist, accessible: distPopup.accessible });
    });
    setDistPopup(null);
  }

  // ── Apply forms ───────────────────────────────────────────────────────────
  function applyNode() {
    if (!nodeForm) return;
    mutate(g => { g.floors[activeFloor].nodes[nodeForm.id] = { ...nodeForm }; });
  }
  function applyEdge() {
    if (!edgeForm) return;
    mutate(g => {
      const idx = (g.floors[activeFloor].edges || []).findIndex(e => e.id === edgeForm.id);
      if (idx >= 0) g.floors[activeFloor].edges[idx] = { ...edgeForm };
    });
  }
  function deleteNode() {
    if (!selectedNode) return;
    mutate(g => {
      delete g.floors[activeFloor].nodes[selectedNode];
      g.floors[activeFloor].edges = (g.floors[activeFloor].edges || []).filter(e => e.from !== selectedNode && e.to !== selectedNode);
    });
    clearSel();
  }
  function deleteEdge() {
    if (!selectedEdge) return;
    mutate(g => { g.floors[activeFloor].edges = (g.floors[activeFloor].edges || []).filter(e => e.id !== selectedEdge); });
    clearSel();
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  function handleSave() {
    saveGraph(hospitalId, graph);
    pushMapToCloud(hospitalId, graph);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function handleReset() {
    if (!window.confirm('Reset all floors to default? This cannot be undone.')) return;
    setGraph(resetGraph());
    clearSel(); setBgImage(null);
  }

  // ── Image upload ──────────────────────────────────────────────────────────
  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    new Promise((res) => {
      const r = new FileReader();
      r.onload = ev => res(ev.target.result);
      r.readAsDataURL(file);
    }).then(url => {
      mutate(g => { g.floors[activeFloor].imageDataUrl = url; });
    });
    e.target.value = '';
  }

  const nodeCount = Object.keys(nodes).length;
  const edgeCount = edges.length;

  // ── Shared style values ───────────────────────────────────────────────────
  const inp  = { width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.83rem', outline: 'none', background: '#fff', color: '#0f172a' };
  const lbl  = { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 2, display: 'block' };
  const fgrp = { display: 'flex', flexDirection: 'column', gap: 3 };

  return createPortal(
    // ── Full-screen fixed overlay (rendered on document.body via portal) ──────
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: '#f1f5f9',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'inherit',
    }}>

      {/* ═══ TOP BAR ════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#0f172a', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 52, flexShrink: 0, flexWrap: 'wrap',
      }}>
        {/* Back button */}
        {onClose && (
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)',
            border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
          }}>
            <ChevronLeft size={16} /> Back
          </button>
        )}

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} color="#00B4D8" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Hospital Map Editor</span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>Super Admin</span>
        </div>

        {/* Floor tabs */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8, background: 'rgba(255,255,255,0.08)', padding: 3, borderRadius: 8 }}>
          {FLOOR_KEYS.map(fk => (
            <button key={fk} onClick={() => { setActiveFloor(fk); clearSel(); setConnectFrom(null); }}
              style={{
                padding: '4px 11px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                background: activeFloor === fk ? '#0077B6' : 'transparent',
                color: activeFloor === fk ? '#fff' : '#94a3b8',
                transition: 'all 0.15s',
              }}>
              {SHORT_FLOOR[fk]}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Stats */}
        <span style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
          {nodeCount} nodes &middot; {edgeCount} edges
        </span>

        {/* Connect hint badge */}
        {connectingFrom && (
          <span style={{ background: '#f59e0b', color: '#0f172a', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
            From: {truncate(nodes[connectingFrom]?.name, 12)} &rarr; pick target
          </span>
        )}

        {savedMsg && (
          <span style={{ background: '#06D6A0', color: '#0f172a', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
            Saved!
          </span>
        )}

        {/* Buttons */}
        <button onClick={handleReset} style={{
          display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem',
        }}>
          <RotateCcw size={13} /> Reset
        </button>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: 5, background: '#0077B6',
          border: 'none', color: '#fff', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700,
        }}>
          <Save size={14} /> Save Map
        </button>
      </div>

      {/* ═══ MAIN AREA ══════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR (tools) ──────────────────────────────────────── */}
        <div style={{
          width: 160, flexShrink: 0, background: '#fff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: 6, overflowY: 'auto',
        }}>
          {/* Tool mode */}
          <div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', padding: '0 4px', marginBottom: 2 }}>TOOL</div>
          {TOOLS.map(t => {
            const Icon = t.Icon;
            return (
              <button key={t.id} onClick={() => { setTool(t.id); if (t.id !== 'connect') setConnectFrom(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px',
                  border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                  background: tool === t.id ? '#eff8ff' : 'transparent',
                  color: tool === t.id ? '#0077B6' : '#475569',
                  borderLeft: `3px solid ${tool === t.id ? '#0077B6' : 'transparent'}`,
                  transition: 'all 0.12s', textAlign: 'left', width: '100%',
                }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}

          {/* Node type picker in Add mode */}
          {tool === 'add' && (
            <>
              <div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', padding: '4px 4px 0' }}>NODE TYPE</div>
              <select value={addNodeType} onChange={e => setAddNodeType(e.target.value)}
                style={{ padding: '6px 8px', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.76rem', background: '#f8fafc', cursor: 'pointer' }}>
                {Object.entries(NODE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: 0, padding: '0 4px', lineHeight: 1.4 }}>
                Click anywhere on the canvas to place
              </p>
            </>
          )}

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />

          {/* Upload image */}
          <div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', padding: '0 4px', marginBottom: 2 }}>FLOOR PLAN</div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          <button onClick={() => fileRef.current?.click()} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px',
            border: '1.5px dashed #cbd5e1', borderRadius: 8, cursor: 'pointer', fontSize: '0.76rem', color: '#475569', background: '#f8fafc', width: '100%',
          }}>
            <Upload size={13} /> Upload Image
          </button>
          {floorData.imageDataUrl && (
            <button onClick={() => mutate(g => { delete g.floors[activeFloor].imageDataUrl; setBgImage(null); })} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
              border: '1px solid #fca5a5', borderRadius: 8, cursor: 'pointer', fontSize: '0.74rem', color: '#dc2626', background: '#fff1f2', width: '100%',
            }}>
              <X size={12} /> Clear Image
            </button>
          )}

          {/* Hint */}
          <div style={{ marginTop: 'auto', background: '#f8fafc', borderRadius: 8, padding: '8px 10px', fontSize: '0.68rem', color: '#64748b', lineHeight: 1.5 }}>
            <Info size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {TOOLS.find(t => t.id === tool)?.hint}
          </div>
        </div>

        {/* ── CANVAS ───────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8edf2', padding: 20 }}>
          <div style={{
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            cursor: tool === 'add' ? 'crosshair' : tool === 'delete' ? 'no-drop' : 'default',
          }}>
            <Stage ref={stageRef} width={CANVAS_W} height={CANVAS_H} onClick={onStageClick}>
              {/* Background */}
              <Layer>
                {bgImage
                  ? <KonvaImage name="bg" image={bgImage} width={CANVAS_W} height={CANVAS_H} opacity={0.45} listening />
                  : <><Rect name="bg" width={CANVAS_W} height={CANVAS_H} fill="#ffffff" listening /><Grid /></>
                }
              </Layer>

              {/* Edges */}
              <Layer>
                {edges.map(edge => {
                  const A = nodes[edge.from], B = nodes[edge.to];
                  if (!A || !B) return null;
                  const mid = midpoint(A.x, A.y, B.x, B.y);
                  const sel = edge.id === selectedEdge;
                  return (
                    <Group key={edge.id}>
                      <Line points={[A.x, A.y, B.x, B.y]} stroke={sel ? '#ef476f' : '#0077B6'} strokeWidth={sel ? 4 : 2.5}
                        dash={!edge.accessible ? [6, 4] : []}
                        shadowColor={sel ? '#ef476f' : undefined} shadowBlur={sel ? 8 : 0} listening={false} />
                      {/* Hit area */}
                      <Line points={[A.x, A.y, B.x, B.y]} stroke="transparent" strokeWidth={20} onClick={ev => onEdgeClick(edge.id, ev)} />
                      {/* Distance label */}
                      <Rect x={mid.x - 17} y={mid.y - 9} width={34} height={18} fill="#fff" cornerRadius={4} stroke={sel ? '#ef476f' : '#e2e8f0'} strokeWidth={1} listening={false} />
                      <Text x={mid.x - 17} y={mid.y - 6} width={34} text={edge.distance + 'm'} fontSize={11} fontStyle="bold" fill={sel ? '#ef476f' : '#0f172a'} align="center" listening={false} />
                    </Group>
                  );
                })}
              </Layer>

              {/* Nodes */}
              <Layer>
                {Object.values(nodes).map(node => {
                  const cfg  = NODE_TYPES[node.type] || NODE_TYPES.junction;
                  const r    = cfg.radius || 12;
                  const sel  = node.id === selectedNode;
                  const conn = node.id === connectingFrom;
                  return (
                    <Group key={node.id} x={Number(node.x)} y={Number(node.y)}
                      draggable={tool === 'select'}
                      onDragEnd={ev => onDragEnd(node.id, ev)}
                      onClick={ev => onNodeClick(node.id, ev)}
                      onTap={ev => onNodeClick(node.id, ev)}
                      onMouseEnter={ev => { ev.target.getStage().container().style.cursor = tool === 'delete' ? 'no-drop' : tool === 'connect' ? 'cell' : 'grab'; }}
                      onMouseLeave={ev => { ev.target.getStage().container().style.cursor = tool === 'add' ? 'crosshair' : 'default'; }}
                    >
                      {/* Explicit Hit Area (invisible but clickable) */}
                      <Rect x={-(r + 20)} y={-(r + 20)} width={(r + 20) * 2} height={(r + 20) * 2} fill="red" opacity={0} />
                      
                      {/* Glow ring */}
                      {(sel || conn) && <Circle r={r + 8} fill={conn ? '#fef3c7' : '#dbeafe'} opacity={0.6} stroke={conn ? '#f59e0b' : '#0077B6'} strokeWidth={3} listening={false} />}
                      
                      {/* Main circle */}
                      <Circle r={r} fill={sel ? (cfg.color || '#0077B6') : (cfg.fill || '#dbeafe')} stroke={cfg.color || '#0077B6'} strokeWidth={sel ? 0 : 2.5} listening={false} />
                      
                      {/* Label */}
                      <Text x={-(r + 30)} y={r + 6} width={(r + 30) * 2} text={truncate(node.name)} fontSize={10} fill="#1e293b"
                        fontStyle={sel ? 'bold' : 'normal'} align="center" listening={false} />
                    </Group>
                  );
                })}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* ── RIGHT PANEL (properties) ──────────────────────────────────── */}
        {(nodeForm || edgeForm) && (
          <div style={{
            width: 230, flexShrink: 0, background: '#fff',
            borderLeft: '1px solid #e2e8f0', padding: 14,
            display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto',
          }}>
            {nodeForm && (
              <>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="#0077B6" /> Node Properties
                </div>

                <div style={fgrp}>
                  <span style={lbl}>ID</span>
                  <div style={{ ...inp, background: '#f8fafc', color: '#94a3b8', fontSize: '0.68rem', fontFamily: 'monospace' }}>{nodeForm.id}</div>
                </div>

                <div style={fgrp}>
                  <label style={lbl}>Name</label>
                  <input style={inp} value={nodeForm.name} onChange={e => setNodeForm(p => ({ ...p, name: e.target.value }))} />
                </div>

                <div style={fgrp}>
                  <label style={lbl}>Type</label>
                  <select style={inp} value={nodeForm.type} onChange={e => setNodeForm(p => ({ ...p, type: e.target.value }))}>
                    {Object.entries(NODE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>

                <div style={fgrp}>
                  <label style={lbl}>QR Code ID (optional)</label>
                  <input style={inp} value={nodeForm.qrCode || ''} placeholder="e.g. LOC-A1"
                    onChange={e => setNodeForm(p => ({ ...p, qrCode: e.target.value }))} />
                </div>

                <div style={fgrp}>
                  <span style={lbl}>Connected to</span>
                  {edges.filter(e => e.from === nodeForm.id || e.to === nodeForm.id).length === 0
                    ? <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>No connections yet</span>
                    : edges.filter(e => e.from === nodeForm.id || e.to === nodeForm.id).map(e => {
                        const otherId = e.from === nodeForm.id ? e.to : e.from;
                        return (
                          <div key={e.id} style={{ fontSize: '0.72rem', color: '#475569', background: '#f1f5f9', borderRadius: 5, padding: '3px 7px' }}>
                            {nodes[otherId]?.name || otherId} &mdash; {e.distance}m
                          </div>
                        );
                      })
                  }
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={applyNode} style={{ flex: 1, padding: '8px 0', background: '#0077B6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Check size={13} /> Apply
                  </button>
                  <button onClick={deleteNode} style={{ flex: 1, padding: '8px 0', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}

            {edgeForm && (
              <>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Link size={14} color="#0077B6" /> Edge Properties
                </div>

                <div style={{ fontSize: '0.78rem', color: '#475569', background: '#f1f5f9', borderRadius: 6, padding: '6px 8px', lineHeight: 1.5 }}>
                  {nodes[edgeForm.from]?.name} <span style={{ color: '#94a3b8' }}>&rarr;</span> {nodes[edgeForm.to]?.name}
                </div>

                <div style={fgrp}>
                  <label style={lbl}>Distance (metres)</label>
                  <input style={inp} type="number" min="1" value={edgeForm.distance}
                    onChange={e => setEdgeForm(p => ({ ...p, distance: parseInt(e.target.value) || 1 }))} />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={edgeForm.accessible !== false} onChange={e => setEdgeForm(p => ({ ...p, accessible: e.target.checked }))} />
                  Wheelchair Accessible
                </label>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={applyEdge} style={{ flex: 1, padding: '8px 0', background: '#0077B6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Check size={13} /> Update
                  </button>
                  <button onClick={deleteEdge} style={{ flex: 1, padding: '8px 0', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <X size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ═══ DISTANCE POPUP ════════════════════════════════════════════════ */}
      {distPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 320, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Create Corridor</h3>
            <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f1f5f9', borderRadius: 8, padding: '8px 12px', lineHeight: 1.5 }}>
              <strong>{nodes[distPopup.fromId]?.name}</strong>
              <span style={{ color: '#94a3b8' }}> &rarr; </span>
              <strong>{nodes[distPopup.toId]?.name}</strong>
            </div>

            <div style={fgrp}>
              <label style={lbl}>Walking Distance (metres)</label>
              <input autoFocus style={{ ...inp, fontSize: '1.1rem', textAlign: 'center', fontWeight: 700 }}
                type="number" min="1" value={distPopup.dist}
                onChange={e => setDistPopup(p => ({ ...p, dist: parseInt(e.target.value) || 1 }))}
                onKeyDown={e => { if (e.key === 'Enter') createEdge(); if (e.key === 'Escape') setDistPopup(null); }} />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>This is the real-world walking distance Dijkstra will use.</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" checked={distPopup.accessible} onChange={e => setDistPopup(p => ({ ...p, accessible: e.target.checked }))} />
              Wheelchair / Accessible Route
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setDistPopup(null)} style={{ flex: 1, padding: '10px 0', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 9, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={createEdge} style={{ flex: 1, padding: '10px 0', background: '#0077B6', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Link size={14} /> Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
