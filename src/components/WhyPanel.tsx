import { Info } from 'lucide-react';
import type { RiskResult } from '../types';

interface WhyPanelProps {
  risk: RiskResult;
}

export function WhyPanel({ risk }: WhyPanelProps) {
  return (
    <section className="why-panel" aria-labelledby="why-title">
      <div className="section-heading inline-heading">
        <Info aria-hidden="true" size={18} />
        <div>
          <p className="eyebrow">Por que essa recomendação?</p>
          <h2 id="why-title">Fatores que mais pesaram</h2>
        </div>
      </div>
      <div className="factor-list">
        {risk.factors.map((factor) => (
          <article className="factor-row" key={factor.id}>
            <div>
              <strong>{factor.label}</strong>
              <span>{factor.value}</span>
            </div>
            <meter min="0" max="100" value={factor.score} aria-label={`Peso de ${factor.label}`} />
            <p>{factor.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
