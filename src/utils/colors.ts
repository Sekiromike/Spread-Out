import { RiskLevel } from '../types';

/** Professional palette for the 5 quality metrics */
export const METRIC_COLORS = {
  airQuality:   '#3b82f6',   // blue
  waterQuality: '#14b8a6',   // teal
  connectivity: '#8b5cf6',   // violet
  safety:       '#f59e0b',   // amber
  livability:   '#10b981',   // emerald
} as const;

export const METRIC_LABELS: Record<string, string> = {
  airQuality:   'Air Quality',
  waterQuality: 'Water Quality',
  connectivity: 'Connectivity',
  safety:       'Safety',
  livability:   'Livability',
};

export const METRIC_KEYS = ['airQuality', 'waterQuality', 'connectivity', 'safety', 'livability'] as const;

/** Composite score to color (professional gradient) */
export function compositeColor(score: number): string {
  if (score >= 85) return '#10b981';   // emerald
  if (score >= 70) return '#3b82f6';   // blue
  if (score >= 55) return '#f59e0b';   // amber
  if (score >= 40) return '#f97316';   // orange
  return '#f43f5e';                     // rose
}

/** Risk level to color */
export const RISK_COLOR: Record<RiskLevel, string> = {
  low:      '#10b981',
  medium:   '#f59e0b',
  high:     '#f97316',
  critical: '#f43f5e',
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low:      'LOW',
  medium:   'MED',
  high:     'HIGH',
  critical: 'CRIT',
};
