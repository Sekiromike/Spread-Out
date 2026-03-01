import React from 'react';
import { Html } from '@react-three/drei';
import { Location } from '../types';
import { project } from '../utils/projection';
import { compositeColor } from '../utils/colors';

interface CityTooltipProps {
  location: Location;
}

/** Floating HTML tooltip over hovered city (rendered in 3D space) */
const CityTooltip: React.FC<CityTooltipProps> = ({ location }) => {
  const [x, z] = project(location.lat, location.lng);
  const barHeight = location.compositeScore * 0.35 + 2;
  const color = compositeColor(location.compositeScore);

  return (
    <Html
      position={[x, barHeight, z]}
      center
      distanceFactor={30}
      style={{ pointerEvents: 'none' }}
    >
      <div className="cyber-tooltip">
        <div className="cyber-tooltip__name">
          {location.name}, {location.state}
        </div>
        <div className="cyber-tooltip__score" style={{ color }}>
          {location.compositeScore}
          <span className="cyber-tooltip__max">/100</span>
        </div>
        <div className="cyber-tooltip__bar">
          <div
            className="cyber-tooltip__bar-fill"
            style={{ width: `${location.compositeScore}%`, background: color }}
          />
        </div>
        <div className="cyber-tooltip__hint">CLICK TO INSPECT</div>
      </div>
    </Html>
  );
};

export default CityTooltip;
