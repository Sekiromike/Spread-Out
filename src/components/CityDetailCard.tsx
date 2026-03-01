import React from 'react';
import { Html } from '@react-three/drei';
import { Location, RiskLevel } from '../types';
import { project } from '../utils/projection';
import {
  compositeColor,
  METRIC_KEYS,
  METRIC_LABELS,
  METRIC_COLORS,
  RISK_COLOR,
  RISK_LABEL,
} from '../utils/colors';

interface CityDetailCardProps {
  location: Location;
  onClose: () => void;
}

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
}

function formatPop(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

const RISK_ITEMS: { key: keyof Location['risks']; label: string }[] = [
  { key: 'crimeRate',           label: 'Crime Rate' },
  { key: 'wildfireRisk',        label: 'Wildfire' },
  { key: 'floodRisk',           label: 'Flood' },
  { key: 'environmentalHazards', label: 'Environment' },
];

/** Floating detail card anchored to a selected city in 3D space */
const CityDetailCard: React.FC<CityDetailCardProps> = ({ location, onClose }) => {
  const [x, z] = project(location.lat, location.lng);
  const scoreColor = compositeColor(location.compositeScore);
  const grade =
    location.compositeScore >= 85 ? 'EXCELLENT' :
    location.compositeScore >= 70 ? 'GOOD' :
    location.compositeScore >= 55 ? 'MODERATE' :
    location.compositeScore >= 40 ? 'FAIR' : 'POOR';

  return (
    <Html
      position={[x + 3, 12, z - 3]}
      center
      distanceFactor={22}
      style={{ pointerEvents: 'auto', width: 300 }}
    >
      <div className="cyber-detail">
        {/* Header */}
        <div className="cyber-detail__header">
          <div>
            <div className="cyber-detail__city">{location.name}</div>
            <div className="cyber-detail__state">{location.state}</div>
          </div>
          <div className="cyber-detail__score-block">
            <div className="cyber-detail__score" style={{ color: scoreColor }}>
              {location.compositeScore}
            </div>
            <div className="cyber-detail__grade" style={{ color: scoreColor }}>{grade}</div>
          </div>
          <button className="cyber-detail__close" onClick={onClose}>✕</button>
        </div>

        {/* Description */}
        <p className="cyber-detail__desc">{location.description}</p>

        {/* Meta */}
        <div className="cyber-detail__meta">
          <div className="cyber-detail__meta-item">
            <span className="cyber-detail__meta-val">{formatPop(location.population)}</span>
            <span className="cyber-detail__meta-key">POP</span>
          </div>
          <div className="cyber-detail__meta-item">
            <span className="cyber-detail__meta-val">{formatPrice(location.medianHomePrice)}</span>
            <span className="cyber-detail__meta-key">HOME</span>
          </div>
        </div>

        {/* Metric bars */}
        <div className="cyber-detail__section">QUALITY METRICS</div>
        <div className="cyber-detail__metrics">
          {METRIC_KEYS.map(key => {
            const score = location.scores[key];
            const color = METRIC_COLORS[key];
            return (
              <div key={key} className="cyber-detail__metric">
                <div className="cyber-detail__metric-header">
                  <span className="cyber-detail__metric-label" style={{ color }}>
                    {METRIC_LABELS[key]}
                  </span>
                  <span className="cyber-detail__metric-score" style={{ color }}>
                    {score}
                  </span>
                </div>
                <div className="cyber-detail__metric-track">
                  <div
                    className="cyber-detail__metric-fill"
                    style={{ width: `${score}%`, background: color, boxShadow: `0 0 8px ${color}66` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk grid */}
        <div className="cyber-detail__section">RISK PROFILE</div>
        <div className="cyber-detail__risks">
          {RISK_ITEMS.map(({ key, label }) => {
            const level = location.risks[key] as RiskLevel;
            const color = RISK_COLOR[level];
            return (
              <div key={key} className="cyber-detail__risk" style={{ borderColor: `${color}44` }}>
                <span className="cyber-detail__risk-label">{label}</span>
                <span className="cyber-detail__risk-badge" style={{ color, borderColor: color }}>
                  {RISK_LABEL[level]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Html>
  );
};

export default CityDetailCard;
