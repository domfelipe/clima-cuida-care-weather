import type { RiskLevel } from '../types';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
});

const hourFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°C`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatMillimeters(value: number): string {
  return `${value.toFixed(value >= 10 ? 0 : 1)} mm`;
}

export function formatWind(value: number): string {
  return `${Math.round(value)} km/h`;
}

export function formatHour(value: string): string {
  return hourFormatter.format(new Date(value));
}

export function formatDay(value: string): string {
  return dateFormatter.format(new Date(`${value}T12:00:00`)).replace('.', '');
}

export function compactLocationLabel(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(', ');
}

export function aqiLabel(aqi?: number): string {
  if (aqi == null) return 'sem AQI';
  if (aqi <= 50) return 'boa';
  if (aqi <= 100) return 'moderada';
  if (aqi <= 150) return 'ruim para sensíveis';
  if (aqi <= 200) return 'ruim';
  return 'muito ruim';
}

export function weatherCodeLabel(code: number): string {
  if ([0].includes(code)) return 'céu limpo';
  if ([1, 2, 3].includes(code)) return 'nuvens variáveis';
  if ([45, 48].includes(code)) return 'neblina';
  if ([51, 53, 55, 56, 57].includes(code)) return 'garoa';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'chuva';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'neve';
  if ([95, 96, 99].includes(code)) return 'trovoadas';
  return 'tempo variável';
}

export function riskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    green: 'Dia confortável',
    yellow: 'Atenção',
    orange: 'Cuidado',
    red: 'Evite exposição',
  };
  return labels[level];
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}
