import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Location, RiskLevel } from '../types';

interface MapProps {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** 5-zone smooth gradient: red → orange → amber → lime → green */
export function markerColor(score: number): string {
  if (score >= 85) return '#15803d'; // deep green
  if (score >= 70) return '#65a30d'; // lime-green
  if (score >= 55) return '#ca8a04'; // amber
  if (score >= 40) return '#ea580c'; // orange
  return '#dc2626';                   // red
}

function markerRadius(score: number, selected: boolean): number {
  // Better locations get slightly larger dots; min 8, max 14
  const base = 8 + Math.round((score / 100) * 6);
  return selected ? base + 5 : base;
}

const RISK_COLOR: Record<RiskLevel, string> = {
  low:      '#16a34a',
  medium:   '#ca8a04',
  high:     '#ea580c',
  critical: '#dc2626',
};

const RISK_LABEL: Record<RiskLevel, string> = {
  low: '✓', medium: '!', high: '!!', critical: '✕',
};

function FlyToSelected({ locations, selectedId }: { locations: Location[]; selectedId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const loc = locations.find(l => l.id === selectedId);
    if (loc) map.flyTo([loc.lat, loc.lng], 8, { duration: 0.8 });
  }, [selectedId, locations, map]);
  return null;
}

const Map: React.FC<MapProps> = ({ locations, selectedId, onSelect }) => {
  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      className="map-container"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FlyToSelected locations={locations} selectedId={selectedId} />
      {locations.map(loc => {
        const fill = markerColor(loc.compositeScore);
        const isSelected = loc.id === selectedId;
        const r = markerRadius(loc.compositeScore, isSelected);
        return (
          <CircleMarker
            key={loc.id}
            center={[loc.lat, loc.lng]}
            radius={r}
            pathOptions={{
              color: isSelected ? '#1d4ed8' : 'rgba(255,255,255,0.9)',
              fillColor: fill,
              fillOpacity: isSelected ? 1 : 0.82,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(loc.id) }}
          >
            <Tooltip direction="top" offset={[0, -r - 2]} opacity={1} permanent={false}>
              <div style={{ minWidth: 160, fontFamily: 'system-ui, sans-serif' }}>
                {/* City name */}
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1e3a5f', marginBottom: 6 }}>
                  {loc.name}, {loc.state}
                </div>

                {/* Score bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{
                    flex: 1, height: 6, borderRadius: 3, background: '#e5e7eb', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${loc.compositeScore}%`,
                      height: '100%',
                      background: fill,
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: fill, minWidth: 28, textAlign: 'right' }}>
                    {loc.compositeScore}
                  </span>
                </div>

                {/* Risk row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px' }}>
                  {([
                    ['🔒', 'Crime',    loc.risks.crimeRate],
                    ['🔥', 'Wildfire', loc.risks.wildfireRisk],
                    ['🌊', 'Flood',    loc.risks.floodRisk],
                    ['☣', 'Env.',     loc.risks.environmentalHazards],
                  ] as [string, string, RiskLevel][]).map(([icon, label, level]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10 }}>
                      <span>{icon}</span>
                      <span style={{ color: '#6b7280' }}>{label}:</span>
                      <span style={{
                        fontWeight: 700,
                        color: RISK_COLOR[level],
                      }}>{RISK_LABEL[level]}</span>
                    </div>
                  ))}
                </div>

                {/* Hint */}
                <div style={{ marginTop: 6, fontSize: 9, color: '#9ca3af', textAlign: 'center' }}>
                  Click for full details
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
