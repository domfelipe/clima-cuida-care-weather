import { CloudRain, Droplets, Gauge, Sun, Thermometer, Wind } from 'lucide-react';
import {
  aqiLabel,
  formatMillimeters,
  formatPercent,
  formatTemperature,
  formatWind,
} from '../lib/formatters';
import type { CurrentConditions } from '../types';

interface MetricsGridProps {
  current: CurrentConditions;
}

export function MetricsGrid({ current }: MetricsGridProps) {
  const metrics = [
    {
      label: 'Sensação térmica',
      value: formatTemperature(current.apparentTemperature),
      detail: `temperatura ${formatTemperature(current.temperature)}`,
      icon: Thermometer,
    },
    {
      label: 'Chuva',
      value: formatPercent(current.precipitationProbability),
      detail: formatMillimeters(current.precipitation),
      icon: CloudRain,
    },
    {
      label: 'UV',
      value: current.uvIndex.toFixed(1),
      detail: current.uvIndex >= 6 ? 'proteção ativa' : 'exposição manejável',
      icon: Sun,
    },
    {
      label: 'Umidade',
      value: formatPercent(current.humidity),
      detail: current.humidity >= 75 ? 'ar úmido' : 'faixa comum',
      icon: Droplets,
    },
    {
      label: 'Vento',
      value: formatWind(current.windSpeed),
      detail: `rajadas ${formatWind(current.windGusts)}`,
      icon: Wind,
    },
    {
      label: 'Qualidade do ar',
      value: current.usAqi ? `AQI ${Math.round(current.usAqi)}` : 'AQI —',
      detail: `${aqiLabel(current.usAqi)} · PM2.5 ${current.pm25.toFixed(0)}`,
      icon: Gauge,
    },
  ];

  return (
    <section className="metrics-grid" aria-label="Indicadores do dia">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <article className="metric-tile" key={metric.label}>
            <Icon aria-hidden="true" size={19} />
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        );
      })}
    </section>
  );
}
