import { Activity, Droplets, Home, ShieldAlert, Sun, Umbrella } from 'lucide-react';
import type { RiskRecommendation } from '../types';

interface RecommendationChipsProps {
  recommendations: RiskRecommendation[];
}

const icons = {
  hydrate: Droplets,
  umbrella: Umbrella,
  sunscreen: Sun,
  'close-windows': Home,
  'avoid-intense-exercise': Activity,
  'sensitive-people': ShieldAlert,
};

export function RecommendationChips({ recommendations }: RecommendationChipsProps) {
  return (
    <section className="recommendation-panel" aria-labelledby="recommendation-title">
      <div className="section-heading">
        <p className="eyebrow">Ações práticas</p>
        <h2 id="recommendation-title">O que fazer agora</h2>
      </div>
      <div className="recommendation-list">
        {recommendations.map((recommendation) => {
          const Icon = icons[recommendation.id as keyof typeof icons] ?? ShieldAlert;
          return (
            <article className={`recommendation-chip risk-${recommendation.level}`} key={recommendation.id}>
              <Icon aria-hidden="true" size={18} />
              <div>
                <strong>{recommendation.label}</strong>
                <span>{recommendation.detail}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
