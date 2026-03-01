import { useState, useMemo, useCallback } from 'react';
import CityScene from './components/CityScene';
import LocationList from './components/LocationList';
import FilterPanel from './components/FilterPanel';
import Legend from './components/Legend';
import { locations } from './data/locations';
import { FilterState, RiskLevel } from './types';
import './App.css';

const RISK_ORDER: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 };

function maxRiskOf(loc: (typeof locations)[0]): number {
  return Math.max(
    RISK_ORDER[loc.risks.crimeRate],
    RISK_ORDER[loc.risks.wildfireRisk],
    RISK_ORDER[loc.risks.floodRisk],
    RISK_ORDER[loc.risks.environmentalHazards],
  );
}

type ViewMode = 'breakdown' | 'composite';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('breakdown');
  const [filters, setFilters] = useState<FilterState>({
    minScore: 0,
    state: '',
    maxRisk: 'any',
    searchText: '',
  });

  const filtered = useMemo(() => {
    const maxRiskNum = filters.maxRisk === 'any' ? 3 : RISK_ORDER[filters.maxRisk];
    const q = filters.searchText.toLowerCase();
    return locations.filter(loc => {
      if (loc.compositeScore < filters.minScore) return false;
      if (filters.state && loc.state !== filters.state) return false;
      if (maxRiskOf(loc) > maxRiskNum) return false;
      if (q && !loc.name.toLowerCase().includes(q) && !loc.state.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filters]);

  const handleSelect = useCallback((id: string) => setSelectedId(id), []);
  const handleDeselect = useCallback(() => setSelectedId(null), []);
  const handleHover = useCallback((id: string | null) => setHoveredId(id), []);

  return (
    <div className="app">
      {/* Header bar */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__wordmark">
            <h1 className="app-header__title">Spread<span className="app-header__title-accent">Out</span></h1>
            <p className="app-header__tagline">Quality of Life Index — United States</p>
          </div>
        </div>

        <div className="app-header__controls">
          <div className="view-toggle">
            <button
              className={`view-toggle__btn${viewMode === 'breakdown' ? ' view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('breakdown')}
            >
              Breakdown
            </button>
            <button
              className={`view-toggle__btn${viewMode === 'composite' ? ' view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('composite')}
            >
              Composite
            </button>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? 'Hide Panel' : 'Show Panel'}
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? '' : ' sidebar--collapsed'}`}>
          <FilterPanel filters={filters} onChange={setFilters} />
          <div className="sidebar__count">
            <span className="sidebar__count-num">{filtered.length}</span> / {locations.length} locations
          </div>
          <LocationList
            locations={filtered}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </aside>

        {/* 3D Scene */}
        <main className="main-area">
          <CityScene
            locations={filtered}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onHover={handleHover}
            onSelect={handleSelect}
            onDeselect={handleDeselect}
            viewMode={viewMode}
          />
          <Legend />
        </main>
      </div>
    </div>
  );
}

export default App;
