import { ShieldCheck } from 'lucide-react';
import {
  compactLocationLabel,
  formatTemperature,
  formatWind,
  riskLevelLabel,
  weatherCodeLabel,
} from '../lib/formatters';
import type { CurrentConditions, LocationOption, RiskResult, UseProfile } from '../types';

interface SemaforoCardProps {
  current: CurrentConditions;
  location: LocationOption;
  profile: UseProfile;
  risk: RiskResult;
  fetchedAt: string;
  source: 'api' | 'mock';
}

export function SemaforoCard({
  current,
  location,
  profile,
  risk,
  fetchedAt,
  source,
}: SemaforoCardProps) {
  return (
    <section className={`semaforo-panel risk-${risk.level}`} aria-labelledby="semaforo-title">
      <div className="semaforo-topline">
        <span>{compactLocationLabel([location.name, location.admin1, location.country])}</span>
        <span>{source === 'mock' ? 'dados de exemplo' : `atualizado ${new Date(fetchedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}</span>
      </div>

      <div className="semaforo-content">
        <div className="risk-orb" aria-hidden="true">
          <span />
        </div>
        <div>
          <p className="eyebrow">Semáforo do Dia</p>
          <h1 id="semaforo-title">{risk.title}</h1>
          <p className="risk-label">{riskLevelLabel(risk.level)} · risco {risk.score}/100</p>
          <p className="risk-summary">{risk.summary}</p>
        </div>
      </div>

      <dl className="current-strip" aria-label="Condições atuais">
        <div>
          <dt>Agora</dt>
          <dd>{formatTemperature(current.temperature)}</dd>
        </div>
        <div>
          <dt>Sensação</dt>
          <dd>{formatTemperature(current.apparentTemperature)}</dd>
        </div>
        <div>
          <dt>Vento</dt>
          <dd>{formatWind(current.windSpeed)}</dd>
        </div>
        <div>
          <dt>Tempo</dt>
          <dd>{weatherCodeLabel(current.weatherCode)}</dd>
        </div>
      </dl>

      <div className="profile-note">
        <ShieldCheck aria-hidden="true" size={17} />
        <span>{profile.label}: {profile.description}</span>
      </div>
    </section>
  );
}
