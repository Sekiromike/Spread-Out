import React from 'react';

interface ScoreCardProps {
  label: string;
  score: number;
  icon?: string;
  small?: boolean;
}

export function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#ca8a04';
  if (score >= 40) return '#ea580c';
  return '#dc2626';
}

export function scoreBg(score: number): string {
  if (score >= 80) return '#dcfce7';
  if (score >= 60) return '#fefce8';
  if (score >= 40) return '#fff7ed';
  return '#fef2f2';
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, score, icon, small }) => {
  const color = scoreColor(score);
  const bg = scoreBg(score);

  return (
    <div
      className={`score-card${small ? ' score-card--small' : ''}`}
      style={{ borderTop: `4px solid ${color}`, background: bg }}
    >
      {icon && <span className="score-card__icon">{icon}</span>}
      <div className="score-card__value" style={{ color }}>{score}</div>
      <div className="score-card__label">{label}</div>
      <div className="score-card__bar-track">
        <div
          className="score-card__bar-fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
};

export default ScoreCard;
