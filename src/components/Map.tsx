import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Location } from '../types';

interface MapProps {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function markerColor(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#ca8a04';
  if (score >= 40) return '#ea580c';
  return '#dc2626';
}

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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected locations={locations} selectedId={selectedId} />
      {locations.map(loc => {
        const color = markerColor(loc.compositeScore);
        const isSelected = loc.id === selectedId;
        return (
          <CircleMarker
            key={loc.id}
            center={[loc.lat, loc.lng]}
            radius={isSelected ? 16 : 10}
            pathOptions={{
              color: isSelected ? '#1d4ed8' : color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(loc.id) }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              <div style={{ textAlign: 'center', minWidth: 100 }}>
                <strong>{loc.name}, {loc.state}</strong>
                <br />
                Score: <strong style={{ color }}>{loc.compositeScore}</strong>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
