import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { MapControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import CityBars from './CityBars';
import GroundPlane from './GroundPlane';
import CityTooltip from './CityTooltip';
import CityDetailCard from './CityDetailCard';
import { Location } from '../types';
import { project } from '../utils/projection';
import { useMacroData } from '../hooks/useMacroData';

interface CitySceneProps {
  locations: Location[];
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  viewMode: 'breakdown' | 'composite' | 'macro';
  macroState?: ReturnType<typeof useMacroData>;
}

const CityScene: React.FC<CitySceneProps> = ({
  locations,
  selectedId,
  hoveredId,
  onHover,
  onSelect,
  onDeselect,
  viewMode,
  macroState,
}) => {
  const selectedLoc = locations.find(l => l.id === selectedId) ?? null;
  const hoveredLoc = locations.find(l => l.id === hoveredId) ?? null;
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      if (selectedId) {
        const loc = locations.find(l => l.id === selectedId);
        if (loc) {
          const [x, z] = project(loc.lat, loc.lng);
          controlsRef.current.target.set(x, 0, z);
          controlsRef.current.object.position.set(x + 5, 25, z + 12);
        }
      } else {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.object.position.set(0, 95, 80);
      }
    }
  }, [selectedId, locations]);

  return (
    <Canvas
      className="city-canvas"
      camera={{ position: [0, 95, 80], fov: 50, near: 0.1, far: 800 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      onPointerMissed={() => onDeselect()}
      style={{ background: '#f4f4f6' }}
    >
      {/* HDR-style ambient environment for metallic bar reflections */}
      <Environment preset="city" />

      {/* Atmospheric depth fog */}
      <fog attach="fog" args={['#f4f4f6', 100, 240]} />

      {/* Lighting — clean daylight */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[40, 70, 30]} intensity={1.5} color="#ffffff" castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={200} />
      <directionalLight position={[-30, 40, -20]} intensity={0.4} color="#e6f0fa" />

      {/* Controls */}
      <MapControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 8}
        minDistance={8}
        maxDistance={140}
        makeDefault
      />

      {/* Ground */}
      <GroundPlane locations={locations} selectedId={selectedId} />

      {/* City bars */}
      <CityBars
        locations={locations}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onHover={onHover}
        onSelect={onSelect}
        viewMode={viewMode}
        macroState={macroState}
      />

      {/* Hover tooltip */}
      {hoveredLoc && hoveredLoc.id !== selectedId && (
        <CityTooltip location={hoveredLoc} />
      )}

      {/* Selected detail card */}
      {selectedLoc && (
        <CityDetailCard location={selectedLoc} onClose={onDeselect} />
      )}
    </Canvas>
  );
};

export default CityScene;
