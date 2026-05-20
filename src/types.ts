export type ProfileId = 'adult' | 'child' | 'elderly' | 'respiratory' | 'activity';

export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface UseProfile {
  id: ProfileId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface LocationOption {
  id: string;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentConditions {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  windGusts: number;
  uvIndex: number;
  humidity: number;
  pm25: number;
  pm10: number;
  usAqi?: number;
  weatherCode: number;
}

export interface HourPoint {
  time: string;
  temperature: number;
  precipitation: number;
  precipitationProbability: number;
  uvIndex: number;
  usAqi?: number;
  pm25: number;
  pm10: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  uvIndexMax: number;
  windSpeedMax: number;
  weatherCode: number;
}

export interface WeatherBundle {
  location: LocationOption;
  current: CurrentConditions;
  hourly: HourPoint[];
  daily: DailyForecast[];
  fetchedAt: string;
  source: 'api' | 'mock';
}

export interface RiskRecommendation {
  id: string;
  label: string;
  detail: string;
  level: RiskLevel;
}

export interface RiskFactor {
  id: string;
  label: string;
  score: number;
  value: string;
  explanation: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  title: string;
  summary: string;
  recommendations: RiskRecommendation[];
  factors: RiskFactor[];
}
