export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface LocationScores {
  airQuality: number;
  waterQuality: number;
  connectivity: number;
  safety: number;
  livability: number;
}

export interface LocationRisks {
  crimeRate: RiskLevel;
  wildfireRisk: RiskLevel;
  floodRisk: RiskLevel;
  environmentalHazards: RiskLevel;
}

export interface Location {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  compositeScore: number;
  capRate: number;
  scores: LocationScores;
  risks: LocationRisks;
  population: number;
  medianHomePrice: number;
  description: string;
}

export type SortField = 'compositeScore' | 'name' | 'medianHomePrice' | 'population'
  | 'airQuality' | 'waterQuality' | 'connectivity' | 'safety' | 'livability';

export interface FilterState {
  minScore: number;
  state: string;
  maxRisk: RiskLevel | 'any';
  searchText: string;
}
