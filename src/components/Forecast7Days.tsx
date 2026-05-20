import { CloudRain, Sun, Wind } from 'lucide-react';
import {
  formatDay,
  formatPercent,
  formatTemperature,
  formatWind,
  weatherCodeLabel,
} from '../lib/formatters';
import type { DailyForecast } from '../types';

interface Forecast7DaysProps {
  days: DailyForecast[];
}

export function Forecast7Days({ days }: Forecast7DaysProps) {
  return (
    <section className="forecast-panel" aria-labelledby="forecast-title">
      <div className="section-heading">
        <p className="eyebrow">7 dias</p>
        <h2 id="forecast-title">Janela para planejar</h2>
      </div>
      <div className="forecast-list">
        {days.map((day) => (
          <article className="forecast-day" key={day.date}>
            <div>
              <time dateTime={day.date}>{formatDay(day.date)}</time>
              <span>{weatherCodeLabel(day.weatherCode)}</span>
            </div>
            <strong>
              {formatTemperature(day.tempMax)} / {formatTemperature(day.tempMin)}
            </strong>
            <dl>
              <div>
                <dt>
                  <CloudRain aria-hidden="true" size={13} />
                  chuva
                </dt>
                <dd>{formatPercent(day.precipitationProbability)}</dd>
              </div>
              <div>
                <dt>
                  <Sun aria-hidden="true" size={13} />
                  UV
                </dt>
                <dd>{day.uvIndexMax.toFixed(1)}</dd>
              </div>
              <div>
                <dt>
                  <Wind aria-hidden="true" size={13} />
                  vento
                </dt>
                <dd>{formatWind(day.windSpeedMax)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
