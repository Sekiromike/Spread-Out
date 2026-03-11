import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Location } from '../types';
import { project } from '../utils/projection';
import { METRIC_KEYS, METRIC_COLORS, compositeColor } from '../utils/colors';
import { useMacroData } from '../hooks/useMacroData';

interface CityBarsProps {
  locations: Location[];
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  viewMode: 'breakdown' | 'composite' | 'macro';
  macroState?: ReturnType<typeof useMacroData>;
}

const BAR_WIDTH = 0.45;
const BAR_DEPTH = 0.45;
const BAR_GAP = 0.55;
const HEIGHT_SCALE = 0.35;   // score → world units
const LERP_SPEED = 4;

const tmpMatrix = new THREE.Matrix4();
const tmpPos = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpScale = new THREE.Vector3();
const tmpColor = new THREE.Color();

/**
 * High-perf instanced bars for all cities.
 * In "breakdown" mode: 5 bars per city (one per metric).
 * In "composite" mode: 1 tall bar per city (composite score).
 */
const CityBars: React.FC<CityBarsProps> = ({
  locations,
  selectedId,
  hoveredId,
  onHover,
  onSelect,
  viewMode,
  macroState,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Pre-compute projected positions
  const projected = useMemo(() =>
    locations.map(loc => {
      const [x, z] = project(loc.lat, loc.lng);
      return { id: loc.id, x, z };
    }),
    [locations]
  );

  const count = viewMode === 'breakdown'
    ? locations.length * METRIC_KEYS.length
    : locations.length;

  // Target heights array (what we animate toward)
  const targetHeights = useMemo(() => {
    const arr = new Float32Array(count);
    if (viewMode === 'breakdown') {
      locations.forEach((loc, i) => {
        METRIC_KEYS.forEach((key, k) => {
          arr[i * METRIC_KEYS.length + k] = loc.scores[key] * HEIGHT_SCALE;
        });
      });
    } else {
      locations.forEach((loc, i) => {
        arr[i] = loc.compositeScore * HEIGHT_SCALE;
      });
    }
    return arr;
  }, [locations, viewMode]);

  // Current animated heights
  const currentHeights = useRef<Float32Array>(new Float32Array(count));

  // Reset currentHeights when count changes
  useEffect(() => {
    currentHeights.current = new Float32Array(count);
  }, [count]);

  // Initialize instance colors
  useEffect(() => {
    if (!meshRef.current) return;
    if (viewMode === 'breakdown') {
      locations.forEach((loc, i) => {
        const isHovered = loc.id === hoveredId;
        const isSelected = loc.id === selectedId;
        METRIC_KEYS.forEach((key, k) => {
          const idx = i * METRIC_KEYS.length + k;
          const baseColor = METRIC_COLORS[key];
          tmpColor.set(baseColor);
          if (isHovered || isSelected) {
            tmpColor.lerp(new THREE.Color('#000000'), 0.35);
          }
          meshRef.current.setColorAt(idx, tmpColor);
        });
      });
    } else if (viewMode === 'macro') {
      locations.forEach((loc, i) => {
        if (!macroState) return;
        const spread = macroState.currentExpectedCapRate - loc.capRate;

        // Coloring logic based on real estate valuation
        if (spread > 0.5) {
          tmpColor.set('#ff3b30'); // Overpriced (Red)
        } else if (spread < -0.5) {
          tmpColor.set('#34c759'); // Underpriced (Green)
        } else {
          tmpColor.set('#e5e5ea'); // Neutral (Gray)
        }

        if (loc.id === hoveredId || loc.id === selectedId) {
          tmpColor.lerp(new THREE.Color('#000000'), 0.35);
        }
        meshRef.current.setColorAt(i, tmpColor);
      });
    } else {
      locations.forEach((loc, i) => {
        const c = compositeColor(loc.compositeScore);
        tmpColor.set(c);
        if (loc.id === hoveredId || loc.id === selectedId) {
          tmpColor.lerp(new THREE.Color('#000000'), 0.35);
        }
        meshRef.current.setColorAt(i, tmpColor);
      });
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [locations, viewMode, hoveredId, selectedId, macroState?.currentExpectedCapRate]);

  // Animate bars every frame
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    const cur = currentHeights.current;

    if (viewMode === 'breakdown') {
      for (let i = 0; i < locations.length; i++) {
        const { x, z } = projected[i];
        const clusterWidth = METRIC_KEYS.length * BAR_GAP;
        const startX = x - clusterWidth / 2 + BAR_GAP / 2;

        for (let k = 0; k < METRIC_KEYS.length; k++) {
          const idx = i * METRIC_KEYS.length + k;
          const target = targetHeights[idx];
          cur[idx] += (target - cur[idx]) * LERP_SPEED * dt;
          const h = Math.max(cur[idx], 0.01);

          tmpPos.set(startX + k * BAR_GAP, h / 2, z);
          tmpScale.set(BAR_WIDTH, h, BAR_DEPTH);
          tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
          meshRef.current.setMatrixAt(idx, tmpMatrix);
        }
      }
    } else {
      for (let i = 0; i < locations.length; i++) {
        const { x, z } = projected[i];
        const target = targetHeights[i];
        cur[i] += (target - cur[i]) * LERP_SPEED * dt;
        const h = Math.max(cur[i], 0.01);

        tmpPos.set(x, h / 2, z);
        tmpScale.set(BAR_WIDTH * 2.2, h, BAR_DEPTH * 2.2);
        tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
        meshRef.current.setMatrixAt(i, tmpMatrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Raycast handling
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    const iid = e.instanceId;
    if (iid == null) return;
    const locIdx = viewMode === 'breakdown'
      ? Math.floor(iid / METRIC_KEYS.length)
      : iid;
    if (locIdx < locations.length) {
      onHover(locations[locIdx].id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    onHover(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    const iid = e.instanceId;
    if (iid == null) return;
    const locIdx = viewMode === 'breakdown'
      ? Math.floor(iid / METRIC_KEYS.length)
      : iid;
    if (locIdx < locations.length) {
      onSelect(locations[locIdx].id);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      frustumCulled={false}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.08}
        metalness={0.55}
        toneMapped={false}
        envMapIntensity={1.4}
      />
    </instancedMesh>
  );
};

export default CityBars;
