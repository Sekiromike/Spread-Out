import { RiskLevel } from '../types';

/** Vivid metric palette — distinct and memorable */
export const METRIC_COLORS = {
  airQuality:   '#326891',   // NYT Blue
  waterQuality: '#578aab',   // Muted Blue
  connectivity: '#8e7cc3',   // Muted Purple
  safety:       '#e69138',   // Muted Orange
  livability:   '#6aa84f',   // Muted Green
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
  if (score >= 85) return '#326891';   // NYT Blue       — EXCELLENT
  if (score >= 70) return '#6590a9';   // Muted Blue     — GOOD
  if (score >= 55) return '#b0b0b0';   // Neutral Gray   — MODERATE
  if (score >= 40) return '#e0825e';   // Muted Orange   — FAIR
  return '#c0504d';                    // Muted Red      — POOR
}

export const RISK_COLOR: Record<RiskLevel, string> = {
  low:      '#8fbc8f', // DarkSeaGreen
  medium:   '#e6c229', // Muted Gold
  high:     '#f17105', // Orange
  critical: '#d11141', // Crimson
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low:      'LOW',
  medium:   'MED',
  high:     'HIGH',
  critical: 'CRIT',
};
