import React, { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import { Location, RiskLevel } from '../types';
import { project, WORLD_WIDTH, WORLD_HEIGHT, MAP_SCALE } from '../utils/projection';
import { compositeColor, RISK_COLOR } from '../utils/colors';

const RISK_ORDER: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 };

function worstRisk(loc: Location): RiskLevel {
  const levels: RiskLevel[] = [
    loc.risks.crimeRate,
    loc.risks.wildfireRisk,
    loc.risks.floodRisk,
    loc.risks.environmentalHazards,
  ];
  let worst: RiskLevel = 'low';
  for (const l of levels) {
    if (RISK_ORDER[l] > RISK_ORDER[worst]) worst = l;
  }
  return worst;
}

interface GroundPlaneProps {
  locations: Location[];
  selectedId: string | null;
}

/** Grid ground plane + score rings under each city */
const GroundPlane: React.FC<GroundPlaneProps> = ({ locations, selectedId }) => {
  const [usaGeometry, setUsaGeometry] = useState<any>(null);

  // Load US map topology
  useEffect(() => {
    fetch('/us-states.json')
      .then(res => res.json())
      .then(topology => {
        const feature = topojson.feature(topology, topology.objects.states);
        setUsaGeometry(feature);
      })
      .catch(err => console.error('Failed to load map data', err));
  }, []);

  // Create a base map/grid texture procedurally
  const mapTexture = useMemo(() => {
    const canvasWidth = 2048;
    const canvasHeight = Math.round(canvasWidth * (WORLD_HEIGHT / WORLD_WIDTH));
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;

    // Ocean background
    ctx.fillStyle = '#070b12';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw US states
    if (usaGeometry) {
      const projection = geoAlbersUsa()
        .translate([canvasWidth / 2, canvasHeight / 2])
        .scale(MAP_SCALE * (canvasWidth / WORLD_WIDTH));

      const path = geoPath(projection, ctx);

      // Land fill — clearly distinct from ocean
      ctx.beginPath();
      path(usaGeometry);
      ctx.fillStyle = '#0f1e36';
      ctx.fill();

      // State borders — vivid and crisp
      ctx.beginPath();
      path(usaGeometry);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Subtle grid overlay
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 0.5;
    const step = canvasWidth / 40;
    for (let i = 0; i <= 40; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, canvasHeight);
      ctx.stroke();
    }
    const hSteps = Math.floor(canvasHeight / step);
    for (let i = 0; i <= hSteps; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(canvasWidth, i * step);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    // Don't repeat, map covers entire plane exactly once!
    return tex;
  }, [usaGeometry]);

  // Score rings (flat circles at each city)
  const rings = useMemo(() =>
    locations.map(loc => {
      const [x, z] = project(loc.lat, loc.lng);
      const color = compositeColor(loc.compositeScore);
      const riskColor = RISK_COLOR[worstRisk(loc)];
      const isSelected = loc.id === selectedId;
      return { id: loc.id, x, z, color, riskColor, isSelected };
    }),
    [locations, selectedId]
  );

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[WORLD_WIDTH, WORLD_HEIGHT]} />
        <meshStandardMaterial
          map={mapTexture}
          color="#ffffff"
          roughness={1.0}
          metalness={0}
          envMapIntensity={0}
        />
      </mesh>

      {/* Score circles under each city */}
      {rings.map(r => (
        <group key={r.id} position={[r.x, 0.01, r.z]}>
          {/* Outer risk ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.35, 40]} />
            <meshBasicMaterial
              color={r.riskColor}
              transparent
              opacity={r.isSelected ? 0.85 : 0.35}
              toneMapped={false}
            />
          </mesh>
          {/* Inner score disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.8, 40]} />
            <meshBasicMaterial
              color={r.color}
              transparent
              opacity={r.isSelected ? 0.22 : 0.1}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default GroundPlane;
