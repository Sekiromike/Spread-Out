import React from 'react';
import { FilterState, RiskLevel } from '../types';
import { US_STATES } from '../data/locations';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

const RISK_OPTIONS: { value: RiskLevel | 'any'; label: string }[] = [
  { value: 'any',      label: 'Any risk level' },
  { value: 'low',      label: 'Low only' },
  { value: 'medium',   label: 'Medium or lower' },
  { value: 'high',     label: 'High or lower' },
  { value: 'critical', label: 'Include critical' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  return (
    <div className="filter-panel">
      <div className="filter-panel__row">
        <label htmlFor="search-input">🔍 Search</label>
        <input
          id="search-input"
          type="text"
          placeholder="City or state..."
          value={filters.searchText}
          onChange={e => set({ searchText: e.target.value })}
          className="filter-panel__input"
        />
      </div>

      <div className="filter-panel__row">
        <label htmlFor="state-select">📍 State</label>
        <select
          id="state-select"
          value={filters.state}
          onChange={e => set({ state: e.target.value })}
          className="filter-panel__select"
        >
          <option value="">All states</option>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="filter-panel__row">
        <label htmlFor="min-score">⭐ Min Score: <strong>{filters.minScore}</strong></label>
        <input
          id="min-score"
          type="range"
          min={0}
          max={100}
          value={filters.minScore}
          onChange={e => set({ minScore: Number(e.target.value) })}
          className="filter-panel__range"
        />
      </div>

      <div className="filter-panel__row">
        <label htmlFor="max-risk">⚠️ Max Risk</label>
        <select
          id="max-risk"
          value={filters.maxRisk}
          onChange={e => set({ maxRisk: e.target.value as RiskLevel | 'any' })}
          className="filter-panel__select"
        >
          {RISK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <button
        className="filter-panel__reset"
        onClick={() => onChange({ minScore: 0, state: '', maxRisk: 'any', searchText: '' })}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;
