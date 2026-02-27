import { useState, useMemo } from 'react';
import Map from './components/Map';
import LocationDetail from './components/LocationDetail';
import LocationList from './components/LocationList';
import FilterPanel from './components/FilterPanel';
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

type Tab = 'map' | 'list';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('map');
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

  const selected = useMemo(
    () => locations.find(l => l.id === selectedId) ?? null,
    [selectedId],
  );

  function handleSelect(id: string) {
    setSelectedId(id);
    setTab('map');
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__logo">🏡</span>
          <div>
            <h1 className="app-header__title">Spread Out</h1>
            <p className="app-header__tagline">Objective quality-of-life intelligence for smarter housing decisions</p>
          </div>
        </div>
        <div className="app-header__legend">
          <span className="legend-label">Score:</span>
          <span className="legend-dot" style={{ background: '#15803d' }} /> Excellent (85+)
          <span className="legend-dot" style={{ background: '#65a30d' }} /> Good (70–84)
          <span className="legend-dot" style={{ background: '#ca8a04' }} /> Moderate (55–69)
          <span className="legend-dot" style={{ background: '#ea580c' }} /> Fair (40–54)
          <span className="legend-dot" style={{ background: '#dc2626' }} /> Poor (&lt;40)
          <span className="legend-note">· Scores penalised for critical risks</span>
        </div>
      </header>

      <div className="app-body">
        {/* Left sidebar */}
        <aside className="sidebar">
          <FilterPanel filters={filters} onChange={setFilters} />
          <div className="sidebar__count">
            Showing <strong>{filtered.length}</strong> of {locations.length} locations
          </div>

          <div className="tab-bar">
            <button
              className={`tab-btn${tab === 'map' ? ' tab-btn--active' : ''}`}
              onClick={() => setTab('map')}
            >
              🗺 Map
            </button>
            <button
              className={`tab-btn${tab === 'list' ? ' tab-btn--active' : ''}`}
              onClick={() => setTab('list')}
            >
              📋 Rankings
            </button>
          </div>

          {tab === 'list' && (
            <LocationList
              locations={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
        </aside>

        {/* Main map area */}
        <main className="main-area">
          <div className={`map-wrap${tab === 'list' ? ' map-wrap--hidden-mobile' : ''}`}>
            <Map
              locations={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Detail overlay */}
          <div className="detail-wrap">
            <LocationDetail location={selected} onClose={() => setSelectedId(null)} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
