import { useState, useMemo } from 'react';
import { DEPARTMENTS } from '../data/hospitalData';
import { Search, MapPin, ChevronRight } from 'lucide-react';

export default function DestinationView({ currentLocation, onDestinationSelected }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return DEPARTMENTS;
    const q = query.toLowerCase();
    return DEPARTMENTS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.floor.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="view">
      {/* Current Location Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', border: '1.5px solid #b3d9f5' }}>
        <MapPin size={20} color="var(--color-primary)" />
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Location</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>{currentLocation.name}</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{currentLocation.floor} · Wing {currentLocation.wing}</p>
        </div>
      </div>

      <div>
        <h2 className="view-title">Where do you want to go?</h2>
        <p className="view-subtitle">Search for a department, ward, or service below.</p>
      </div>

      {/* Search */}
      <div className="search-bar-wrapper">
        <Search size={20} className="search-icon" />
        <input
          id="destination-search"
          type="search"
          className="search-bar"
          placeholder="e.g. Cardiology, Pharmacy, OPD…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
          aria-label="Search departments"
        />
      </div>

      {/* Department List */}
      <div className="dept-list" role="listbox" aria-label="Department list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: '2rem' }}>🔍</span>
            <p>No departments found for "<strong>{query}</strong>"</p>
          </div>
        ) : (
          filtered.map(dept => (
            <button
              key={dept.id}
              className="dept-card"
              role="option"
              id={`dept-${dept.id}`}
              aria-label={`Navigate to ${dept.name}, ${dept.floor}`}
              onClick={() => onDestinationSelected(dept)}
            >
              <div className="dept-icon" style={{ background: dept.color }}>
                {dept.icon}
              </div>
              <div className="dept-info">
                <h3>{dept.name}</h3>
                <p>{dept.description}</p>
              </div>
              <span className="dept-floor">{dept.floor}</span>
              <ChevronRight size={18} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
