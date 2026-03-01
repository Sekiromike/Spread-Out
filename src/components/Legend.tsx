import React from 'react';
import { METRIC_KEYS, METRIC_LABELS, METRIC_COLORS } from '../utils/colors';

/** Fixed overlay legend explaining bar colors and score scale */
const Legend: React.FC = () => (
  <div className="cyber-legend">
    <div className="cyber-legend__title">METRICS</div>
    {METRIC_KEYS.map(key => (
      <div key={key} className="cyber-legend__item">
        <span
          className="cyber-legend__swatch"
          style={{ background: METRIC_COLORS[key], boxShadow: `0 0 6px ${METRIC_COLORS[key]}88` }}
        />
        <span className="cyber-legend__label">{METRIC_LABELS[key]}</span>
      </div>
    ))}
    <div className="cyber-legend__divider" />
    <div className="cyber-legend__title">SCORE</div>
    {[
      { color: '#00ff9f', label: '85+ Excellent' },
      { color: '#00f0ff', label: '70–84 Good' },
      { color: '#f0f040', label: '55–69 Moderate' },
      { color: '#ff8800', label: '40–54 Fair' },
      { color: '#ff2060', label: '<40 Poor' },
    ].map(({ color, label }) => (
      <div key={label} className="cyber-legend__item">
        <span
          className="cyber-legend__swatch"
          style={{ background: color, boxShadow: `0 0 6px ${color}88` }}
        />
        <span className="cyber-legend__label">{label}</span>
      </div>
    ))}
  </div>
);

export default Legend;
