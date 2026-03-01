import React from 'react';
import { METRIC_KEYS, METRIC_LABELS, METRIC_COLORS } from '../utils/colors';

/** Fixed overlay legend: metric swatches + continuous score gradient */
const Legend: React.FC = () => (
  <div className="cyber-legend">
    <div className="cyber-legend__title">Metrics</div>
    <div className="cyber-legend__items">
      {METRIC_KEYS.map(key => (
        <div key={key} className="cyber-legend__item">
          <span
            className="cyber-legend__swatch"
            style={{
              background: METRIC_COLORS[key],
              boxShadow: `0 0 7px ${METRIC_COLORS[key]}99`,
            }}
          />
          <span className="cyber-legend__label">{METRIC_LABELS[key]}</span>
        </div>
      ))}
    </div>

    <div className="cyber-legend__divider" />

    <div className="cyber-legend__title">Score</div>
    <div className="cyber-legend__score-gradient" />
    <div className="cyber-legend__score-labels">
      <span>0</span>
      <span>55</span>
      <span>85</span>
      <span>100</span>
    </div>
  </div>
);

export default Legend;
