import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
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
        toneMappingExposure: 1.2,
      }}
      onPointerMissed={() => onDeselect()}
      style={{ background: '#161e31' }}
    >
      {/* Fog for depth */}
      <fog attach="fog" args={['#161e31', 80, 220]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} color="#8090b0" />
      <directionalLight position={[30, 50, 20]} intensity={1.2} color="#c8d8ff" />
      <directionalLight position={[-20, 30, -10]} intensity={0.5} color="#a0c0e0" />
      <directionalLight position={[0, -10, -40]} intensity={0.25} color="#6070a0" />

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
