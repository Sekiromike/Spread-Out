import React from 'react';
import { Location } from '../types';
import ScoreCard from './ScoreCard';
import RiskIndicator from './RiskIndicator';
import RadarChart from './RadarChart';

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

const LocationDetail: React.FC<LocationDetailProps> = ({ location, onClose }) => {
  if (!location) {
    return (
      <div className="detail-panel detail-panel--empty">
        <p>👈 Click a map marker to explore a location</p>
      </div>
    );
  }

  const { name, state, description, compositeScore, scores, risks, population, medianHomePrice } = location;

  return (
    <div className="detail-panel">
      <div className="detail-panel__header">
        <div>
          <h2 className="detail-panel__title">{name}, {state}</h2>
          <p className="detail-panel__desc">{description}</p>
        </div>
        <button className="detail-panel__close" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="detail-panel__meta">
        <span>👥 {formatPop(population)}</span>
        <span>🏠 Median: {formatPrice(medianHomePrice)}</span>
      </div>

      <div className="detail-panel__composite">
        <span className="detail-panel__composite-label">Composite Score</span>
        <span className="detail-panel__composite-value">{compositeScore}<span className="detail-panel__composite-max">/100</span></span>
      </div>

      <div className="detail-panel__section-title">Quality Scores</div>
      <div className="score-grid">
        <ScoreCard label="Air Quality"   score={scores.airQuality}   icon="💨" small />
        <ScoreCard label="Water Quality" score={scores.waterQuality} icon="💧" small />
        <ScoreCard label="Connectivity"  score={scores.connectivity} icon="🔗" small />
        <ScoreCard label="Safety"        score={scores.safety}       icon="🛡️" small />
        <ScoreCard label="Livability"    score={scores.livability}   icon="🌿" small />
      </div>

      <div className="detail-panel__section-title">Radar Profile</div>
      <RadarChart scores={scores} />

      <div className="detail-panel__section-title">Risk Indicators</div>
      <div className="risk-list">
        <RiskIndicator label="Crime Rate"            level={risks.crimeRate}            icon="🔒" />
        <RiskIndicator label="Wildfire Risk"         level={risks.wildfireRisk}         icon="🔥" />
        <RiskIndicator label="Flood Risk"            level={risks.floodRisk}            icon="🌊" />
        <RiskIndicator label="Environmental Hazards" level={risks.environmentalHazards} icon="☣️" />
      </div>
    </div>
  );
};

export default LocationDetail;
