import { RiskLevel } from '../types';

/** Vivid metric palette — distinct and memorable */
export const METRIC_COLORS = {
  airQuality:   '#38bdf8',   // sky blue
  waterQuality: '#22d3ee',   // cyan-teal
  connectivity: '#a78bfa',   // violet
  safety:       '#fbbf24',   // gold
  livability:   '#34d399',   // emerald
} as const;

export const METRIC_LABELS: Record<string, string> = {
  airQuality:   'Air Quality',
  waterQuality: 'Water Quality',
  connectivity: 'Connectivity',
  safety:       'Safety',
  livability:   'Livability',
};

export const METRIC_KEYS = ['airQuality', 'waterQuality', 'connectivity', 'safety', 'livability'] as const;

/**
 * Composite score → vivid neon color.
 * Green = opportunity, red = warning. Psychologically unambiguous.
 */
export function compositeColor(score: number): string {
  if (score >= 85) return '#00ff87';   // neon green  — EXCELLENT
  if (score >= 70) return '#00d4ff';   // vivid cyan   — GOOD
  if (score >= 55) return '#ffd000';   // golden amber — MODERATE
  if (score >= 40) return '#ff6b35';   // deep orange  — FAIR
  return '#ff1744';                     // vivid red    — POOR
}

export const RISK_COLOR: Record<RiskLevel, string> = {
  low:      '#00ff87',
  medium:   '#ffd000',
  high:     '#ff6b35',
  critical: '#ff1744',
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low:      'LOW',
  medium:   'MED',
  high:     'HIGH',
  critical: 'CRIT',
};
