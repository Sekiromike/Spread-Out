import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import CityBars from './CityBars';
import GroundPlane from './GroundPlane';
import CityTooltip from './CityTooltip';
import CityDetailCard from './CityDetailCard';
import { Location } from '../types';
import { project } from '../utils/projection';

interface CitySceneProps {
  locations: Location[];
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  viewMode: 'breakdown' | 'composite';
}

const CityScene: React.FC<CitySceneProps> = ({
  locations,
  selectedId,
  hoveredId,
  onHover,
  onSelect,
  onDeselect,
  viewMode,
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
          controlsRef.current.setLookAt(x + 5, 25, z + 12, x, 0, z, true);
        }
      } else {
        controlsRef.current.setLookAt(0, 95, 80, 0, 0, 0, true);
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
        toneMappingExposure: 1.6,
      }}
      onPointerMissed={() => onDeselect()}
      style={{ background: '#070b12' }}
    >
      {/* HDR-style ambient environment for metallic bar reflections */}
      <Environment preset="night" />

      {/* Atmospheric depth fog */}
      <fog attach="fog" args={['#070b12', 110, 260]} />

      {/* Lighting — dramatic key + cool fill + warm rim */}
      <ambientLight intensity={0.12} color="#304060" />
      <directionalLight position={[40, 70, 30]} intensity={2.4} color="#d0e8ff" castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={200} />
      <directionalLight position={[-30, 40, -20]} intensity={0.7} color="#2040ff" />
      <directionalLight position={[10, 8,  60]} intensity={0.35} color="#001830" />
      <pointLight position={[0, 60, 0]} intensity={0.6} color="#001428" distance={180} />

      {/* Controls */}
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 8}
        minDistance={8}
        maxDistance={120}
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
