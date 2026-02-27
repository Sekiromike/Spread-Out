import React from 'react';
import { RiskLevel } from '../types';

interface RiskIndicatorProps {
  label: string;
  level: RiskLevel;
  icon?: string;
}

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; label: string }> = {
  low:      { color: '#1a7f37', bg: '#d1fae5', label: 'Low' },
  medium:   { color: '#854d0e', bg: '#fef9c3', label: 'Medium' },
  high:     { color: '#9a3412', bg: '#ffedd5', label: 'High' },
  critical: { color: '#7f1d1d', bg: '#fee2e2', label: 'Critical' },
};

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ label, level, icon }) => {
  const cfg = RISK_CONFIG[level];
  return (
    <div className="risk-indicator" style={{ borderLeft: `4px solid ${cfg.color}`, background: cfg.bg }}>
      <span className="risk-icon">{icon}</span>
      <span className="risk-label">{label}</span>
      <span className="risk-badge" style={{ color: cfg.color, background: cfg.bg }}>
        {cfg.label}
      </span>
    </div>
  );
};

export default RiskIndicator;
