import React from 'react';
import { Location, RiskLevel } from '../types';
import RadarChart from './RadarChart';
import { markerColor } from './Map';

interface LocationDetailProps {
  location: Location | null;
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

/** SVG circular score gauge */
function ScoreGauge({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const color = markerColor(score);
  const trackColor = '#e5e7eb';
  const dashoffset = circ * (1 - score / 100);

  // Grade label
  const grade = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Moderate' : score >= 40 ? 'Fair' : 'Poor';

  return (
    <div className="score-gauge">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Track */}
        <circle cx="55" cy="55" r={r} fill="none" stroke={trackColor} strokeWidth="9" />
        {/* Progress */}
        <circle
          cx="55" cy="55" r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${dashoffset}`}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 0.7s ease, stroke 0.4s ease' }}
        />
        {/* Score number */}
        <text x="55" y="50" textAnchor="middle" fontSize="26" fontWeight="800" fill={color}>{score}</text>
        <text x="55" y="63" textAnchor="middle" fontSize="9" fill="#9ca3af">/100</text>
        <text x="55" y="76" textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{grade}</text>
      </svg>
    </div>
  );
}

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; label: string; fill: string }> = {
  low:      { color: '#15803d', bg: '#dcfce7', label: 'Low',      fill: '#22c55e' },
  medium:   { color: '#92400e', bg: '#fef3c7', label: 'Medium',   fill: '#f59e0b' },
  high:     { color: '#9a3412', bg: '#ffedd5', label: 'High',     fill: '#f97316' },
  critical: { color: '#7f1d1d', bg: '#fee2e2', label: 'Critical', fill: '#ef4444' },
};

interface RiskCardProps {
  icon: string;
  label: string;
  level: RiskLevel;
}

function RiskCard({ icon, label, level }: RiskCardProps) {
  const cfg = RISK_CONFIG[level];
  return (
    <div className="risk-card" style={{ background: cfg.bg, borderColor: cfg.fill }}>
      <span className="risk-card__icon">{icon}</span>
      <span className="risk-card__label">{label}</span>
      <span className="risk-card__badge" style={{ color: cfg.color, background: `${cfg.fill}22` }}>
        {cfg.label}
      </span>
    </div>
  );
}

interface MetricBarProps {
  icon: string;
  label: string;
  score: number;
  weight: string;
}

function MetricBar({ icon, label, score, weight }: MetricBarProps) {
  const color = markerColor(score);
  return (
    <div className="metric-bar">
      <div className="metric-bar__header">
        <span className="metric-bar__icon">{icon}</span>
        <span className="metric-bar__label">{label}</span>
        <span className="metric-bar__weight">{weight}</span>
        <span className="metric-bar__score" style={{ color }}>{score}</span>
      </div>
      <div className="metric-bar__track">
        <div
          className="metric-bar__fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

const LocationDetail: React.FC<LocationDetailProps> = ({ location, onClose }) => {
  if (!location) {
    return (
      <div className="detail-panel detail-panel--empty">
        <div className="detail-panel__hint">
          <div className="detail-panel__hint-icon">🗺️</div>
          <p>Click any marker on the map to explore a location's livability score and risk profile</p>
          <div className="detail-panel__hint-legend">
            {[
              { color: '#15803d', label: 'Excellent (85+)' },
              { color: '#65a30d', label: 'Good (70–84)' },
              { color: '#ca8a04', label: 'Moderate (55–69)' },
              { color: '#ea580c', label: 'Fair (40–54)' },
              { color: '#dc2626', label: 'Poor (<40)' },
            ].map(({ color, label }) => (
              <div key={label} className="detail-panel__hint-row">
                <span className="detail-panel__hint-dot" style={{ background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { name, state, description, compositeScore, scores, risks, population, medianHomePrice } = location;
  const scoreColor = markerColor(compositeScore);

  return (
    <div className="detail-panel detail-panel--active">
      {/* Header row */}
      <div className="detail-panel__header">
        <div className="detail-panel__title-group">
          <h2 className="detail-panel__title">{name}</h2>
          <span className="detail-panel__state">{state}</span>
        </div>
        <ScoreGauge score={compositeScore} />
        <button className="detail-panel__close" onClick={onClose} aria-label="Close">✕</button>
      </div>

      {/* Description */}
      <p className="detail-panel__desc">{description}</p>

      {/* Meta */}
      <div className="detail-panel__meta">
        <div className="detail-panel__meta-item">
          <span className="detail-panel__meta-icon">👥</span>
          <div>
            <div className="detail-panel__meta-val">{formatPop(population)}</div>
            <div className="detail-panel__meta-key">Population</div>
          </div>
        </div>
        <div className="detail-panel__meta-item">
          <span className="detail-panel__meta-icon">🏠</span>
          <div>
            <div className="detail-panel__meta-val">{formatPrice(medianHomePrice)}</div>
            <div className="detail-panel__meta-key">Median Home</div>
          </div>
        </div>
        <div className="detail-panel__meta-item">
          <span className="detail-panel__meta-icon">⭐</span>
          <div>
            <div className="detail-panel__meta-val" style={{ color: scoreColor }}>{compositeScore}</div>
            <div className="detail-panel__meta-key">Composite</div>
          </div>
        </div>
      </div>

      {/* Risk grid */}
      <div className="detail-panel__section-title">Risk Profile</div>
      <div className="risk-grid">
        <RiskCard icon="🔒" label="Crime"       level={risks.crimeRate} />
        <RiskCard icon="🔥" label="Wildfire"    level={risks.wildfireRisk} />
        <RiskCard icon="🌊" label="Flood"        level={risks.floodRisk} />
        <RiskCard icon="☣️" label="Env. Hazards" level={risks.environmentalHazards} />
      </div>

      {/* Metric bars */}
      <div className="detail-panel__section-title">Quality Scores</div>
      <div className="metric-bars">
        <MetricBar icon="💨" label="Air Quality"   score={scores.airQuality}   weight="22%" />
        <MetricBar icon="💧" label="Water Quality" score={scores.waterQuality} weight="22%" />
        <MetricBar icon="🛡️" label="Safety"         score={scores.safety}       weight="22%" />
        <MetricBar icon="🌿" label="Livability"     score={scores.livability}   weight="20%" />
        <MetricBar icon="🔗" label="Connectivity"  score={scores.connectivity} weight="14%" />
      </div>

      {/* Radar profile */}
      <div className="detail-panel__section-title">Radar Profile</div>
      <RadarChart scores={scores} />
    </div>
  );
};

export default LocationDetail;
