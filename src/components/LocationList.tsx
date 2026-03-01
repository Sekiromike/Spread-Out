import React, { useState } from 'react';
import { Location, SortField } from '../types';
import { compositeColor } from '../utils/colors';

interface LocationListProps {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'compositeScore', label: 'Overall Score' },
  { value: 'safety',         label: 'Safety' },
  { value: 'airQuality',     label: 'Air Quality' },
  { value: 'waterQuality',   label: 'Water Quality' },
  { value: 'connectivity',   label: 'Connectivity' },
  { value: 'livability',     label: 'Livability' },
  { value: 'medianHomePrice',label: 'Home Price' },
  { value: 'name',           label: 'Name (A–Z)' },
];

function getVal(loc: Location, field: SortField): number | string {
  if (field === 'name') return loc.name;
  if (field === 'medianHomePrice') return loc.medianHomePrice;
  if (field === 'population') return loc.population;
  if (field === 'compositeScore') return loc.compositeScore;
  return loc.scores[field as keyof typeof loc.scores];
}

/**
 * Value score = how much quality you get per $100K spent.
 * Surfaces underrated, affordable gems — core to the SpreadOut mission.
 */
function valueScore(loc: Location): number {
  return Math.round(loc.compositeScore / (loc.medianHomePrice / 100_000));
}

function valueTier(v: number): 'high' | 'mid' | 'low' {
  if (v >= 25) return 'high';
  if (v >= 14) return 'mid';
  return 'low';
}

const LocationList: React.FC<LocationListProps> = ({ locations, selectedId, onSelect }) => {
  const [sortField, setSortField] = useState<SortField>('compositeScore');
  const [asc, setAsc] = useState(false);

  const sorted = [...locations].sort((a, b) => {
    const av = getVal(a, sortField);
    const bv = getVal(b, sortField);
    if (typeof av === 'string') return asc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    return asc ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  return (
    <div className="location-list">
      <div className="location-list__controls">
        <label htmlFor="sort-select" className="sr-only">Sort by</label>
        <select
          id="sort-select"
          className="location-list__sort"
          value={sortField}
          onChange={e => setSortField(e.target.value as SortField)}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          className="location-list__dir-btn"
          onClick={() => setAsc(v => !v)}
          title={asc ? 'Ascending' : 'Descending'}
        >
          {asc ? '↑' : '↓'}
        </button>
      </div>

      <ul className="location-list__ul">
        {sorted.map((loc, idx) => {
          const color = compositeColor(loc.compositeScore);
          const vs = valueScore(loc);
          const tier = valueTier(vs);
          return (
            <li
              key={loc.id}
              className={`location-list__item${loc.id === selectedId ? ' location-list__item--active' : ''}`}
              style={{ borderLeftColor: color }}
              onClick={() => onSelect(loc.id)}
            >
              <span className="location-list__rank">{idx + 1}</span>
              <div className="location-list__info">
                <span className="location-list__name">{loc.name}, {loc.state}</span>
                <div className="location-list__stats">
                  <span className="location-list__price">${(loc.medianHomePrice / 1000).toFixed(0)}K</span>
                  <span
                    className={`location-list__value location-list__value--${tier}`}
                    title={`Value score: ${vs} quality pts per $100K`}
                  >
                    ♦{vs}
                  </span>
                </div>
              </div>
              <span
                className="location-list__score"
                style={{
                  color,
                  borderColor: color,
                  boxShadow: `0 0 10px ${color}44`,
                }}
              >
                {loc.compositeScore}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LocationList;
