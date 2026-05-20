import { CloudRain, Gauge, Sun } from 'lucide-react';
import {
  formatHour,
  formatPercent,
  formatTemperature,
  weatherCodeLabel,
} from '../lib/formatters';
import type { HourPoint } from '../types';

interface Timeline12hProps {
  hours: HourPoint[];
}

export function Timeline12h({ hours }: Timeline12hProps) {
  return (
    <section className="timeline-panel" aria-labelledby="timeline-title">
      <div className="section-heading">
        <p className="eyebrow">Próximas 12 horas</p>
        <h2 id="timeline-title">Chuva, UV e ar por horário</h2>
      </div>
      <div className="timeline-scroll">
        {hours.map((hour) => (
          <article className="timeline-hour" key={hour.time}>
            <time dateTime={hour.time}>{formatHour(hour.time)}</time>
            <strong>{formatTemperature(hour.temperature)}</strong>
            <span>{weatherCodeLabel(hour.weatherCode)}</span>
            <dl>
              <div>
                <dt>
                  <CloudRain aria-hidden="true" size={14} />
                  Chuva
                </dt>
                <dd>{formatPercent(hour.precipitationProbability)}</dd>
              </div>
              <div>
                <dt>
                  <Sun aria-hidden="true" size={14} />
                  UV
                </dt>
                <dd>{hour.uvIndex.toFixed(1)}</dd>
              </div>
              <div>
                <dt>
                  <Gauge aria-hidden="true" size={14} />
                  Ar
                </dt>
                <dd>{hour.usAqi ? `AQI ${Math.round(hour.usAqi)}` : `PM2.5 ${hour.pm25.toFixed(0)}`}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
