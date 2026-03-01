/**
 * Simple Mercator projection: lat/lng → (x, z) on a flat 3D plane.
 * Tuned so the continental US fills roughly a 100×60 unit box centered at origin.
 */

import { geoAlbersUsa } from 'd3-geo';

export const WORLD_WIDTH = 200;
export const WORLD_HEIGHT = 120;
export const MAP_SCALE = 200;

// Create a single shared projection for 3D coordinates
export const usaProjection = geoAlbersUsa()
  .translate([0, 0])
  .scale(MAP_SCALE);

export function project(lat: number, lng: number): [x: number, z: number] {
  const p = usaProjection([lng, lat]);
  if (!p) return [0, 0]; // fallback for coords outside Albers USA projection (e.g., Guam/PR if out of bounds, though Albers handles most)
  return [p[0], p[1]];
}
