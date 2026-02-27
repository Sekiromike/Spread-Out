import React from 'react';
import {
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { LocationScores } from '../types';

interface RadarChartProps {
  scores: LocationScores;
}

const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const data = [
    { subject: 'Air Quality',   value: scores.airQuality },
    { subject: 'Water Quality', value: scores.waterQuality },
    { subject: 'Connectivity',  value: scores.connectivity },
    { subject: 'Safety',        value: scores.safety },
    { subject: 'Livability',    value: scores.livability },
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(val: number) => [`${val}/100`, 'Score']}
          contentStyle={{ fontSize: 12 }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
};

export default RadarChart;
