import type {
  CurrentConditions,
  ProfileId,
  RiskFactor,
  RiskLevel,
  RiskRecommendation,
  RiskResult,
} from '../types';
import {
  aqiLabel,
  clamp,
  formatMillimeters,
  formatPercent,
  formatTemperature,
  formatWind,
} from './formatters';

interface FactorInput {
  conditions: CurrentConditions;
  profile: ProfileId;
}

export function calculateRiskScore(
  conditions: CurrentConditions,
  profile: ProfileId,
): RiskResult {
  const factorInput = { conditions, profile };
  const factors = buildFactors(factorInput);
  const maxFactor = Math.max(...factors.map((factor) => factor.score));
  const weighted =
    getFactor(factors, 'uv').score * 0.22 +
    getFactor(factors, 'rain').score * 0.18 +
    getFactor(factors, 'thermal').score * 0.2 +
    getFactor(factors, 'wind').score * 0.12 +
    getFactor(factors, 'pollution').score * 0.28;

  const score = Math.round(
    clamp(weighted * 0.45 + maxFactor * 0.65 + profileAdjustment(factorInput)),
  );
  const level = levelFromScore(score);
  const recommendations = buildRecommendations(conditions, profile, level, factors);
  const dominant = factors.slice().sort((a, b) => b.score - a.score)[0];

  return {
    score,
    level,
    title: titleForLevel(level),
    summary: summaryFor(level, dominant.id, profile),
    recommendations,
    factors: factors.sort((a, b) => b.score - a.score),
  };
}

function buildFactors({ conditions }: FactorInput): RiskFactor[] {
  const thermalScore = thermalRisk(conditions.apparentTemperature);
  const pollutionScore = pollutionRisk(conditions.pm25, conditions.pm10, conditions.usAqi);
  const rainScore = Math.max(
    precipitationProbabilityRisk(conditions.precipitationProbability),
    precipitationIntensityRisk(conditions.precipitation),
  );
  const windScore = Math.max(windRisk(conditions.windSpeed), windRisk(conditions.windGusts) - 8);
  const uvScore = uvRisk(conditions.uvIndex);

  return [
    {
      id: 'uv',
      label: 'UV',
      score: uvScore,
      value: conditions.uvIndex.toFixed(1),
      explanation: uvScore >= 55 ? 'Sol forte pede proteção ativa.' : 'Radiação dentro de uma faixa manejável.',
    },
    {
      id: 'rain',
      label: 'Chuva',
      score: rainScore,
      value: `${formatPercent(conditions.precipitationProbability)} · ${formatMillimeters(
        conditions.precipitation,
      )}`,
      explanation:
        rainScore >= 55 ? 'Há chance relevante de chuva atrapalhar deslocamentos.' : 'Baixo impacto de chuva agora.',
    },
    {
      id: 'thermal',
      label: 'Sensação térmica',
      score: thermalScore,
      value: formatTemperature(conditions.apparentTemperature),
      explanation:
        thermalScore >= 55
          ? 'A sensação térmica exige reduzir exposição prolongada.'
          : 'Temperatura confortável para a maioria das pessoas.',
    },
    {
      id: 'wind',
      label: 'Vento',
      score: windScore,
      value: `${formatWind(conditions.windSpeed)} · rajadas ${formatWind(conditions.windGusts)}`,
      explanation:
        windScore >= 55 ? 'Rajadas podem prejudicar direção, guarda-chuva e exercício.' : 'Vento sem alerta importante.',
    },
    {
      id: 'pollution',
      label: 'Ar',
      score: pollutionScore,
      value: `AQI ${conditions.usAqi ?? '—'} · PM2.5 ${conditions.pm25.toFixed(0)} · PM10 ${conditions.pm10.toFixed(0)}`,
      explanation:
        pollutionScore >= 55
          ? `Qualidade do ar ${aqiLabel(conditions.usAqi)}; grupos sensíveis devem reduzir exposição.`
          : `Qualidade do ar ${aqiLabel(conditions.usAqi)} para uso geral.`,
    },
  ];
}

function profileAdjustment({ conditions, profile }: FactorInput): number {
  const uv = uvRisk(conditions.uvIndex);
  const thermal = thermalRisk(conditions.apparentTemperature);
  const pollution = pollutionRisk(conditions.pm25, conditions.pm10, conditions.usAqi);
  const rain = precipitationProbabilityRisk(conditions.precipitationProbability);
  const wind = windRisk(Math.max(conditions.windSpeed, conditions.windGusts));

  if (profile === 'child') return 5 + uv * 0.08 + thermal * 0.05 + rain * 0.04;
  if (profile === 'elderly') return 6 + thermal * 0.1 + pollution * 0.07 + wind * 0.04;
  if (profile === 'respiratory') return 6 + pollution * 0.2;
  if (profile === 'activity') return 4 + uv * 0.08 + thermal * 0.08 + pollution * 0.08 + wind * 0.04;
  return 0;
}

function buildRecommendations(
  conditions: CurrentConditions,
  profile: ProfileId,
  level: RiskLevel,
  factors: RiskFactor[],
): RiskRecommendation[] {
  const recommendations = new Map<string, RiskRecommendation>();
  const add = (item: RiskRecommendation) => recommendations.set(item.id, item);
  const pollution = getFactor(factors, 'pollution').score;
  const thermal = getFactor(factors, 'thermal').score;
  const rain = getFactor(factors, 'rain').score;
  const wind = getFactor(factors, 'wind').score;
  const uv = getFactor(factors, 'uv').score;

  add({
    id: 'hydrate',
    label: 'Beber água',
    detail: thermal >= 35 ? 'A sensação térmica aumenta a perda de líquidos.' : 'Boa prática para manter conforto no dia.',
    level: thermal >= 55 ? 'orange' : 'green',
  });

  if (rain >= 40) {
    add({
      id: 'umbrella',
      label: 'Levar guarda-chuva',
      detail: `Chuva em ${formatPercent(conditions.precipitationProbability)} nas próximas horas.`,
      level: rain >= 65 ? 'orange' : 'yellow',
    });
  }

  if (uv >= 35) {
    add({
      id: 'sunscreen',
      label: 'Usar protetor solar',
      detail: conditions.uvIndex >= 8 ? 'UV muito alto no meio do dia.' : 'UV já pede proteção em exposição direta.',
      level: uv >= 70 ? 'orange' : 'yellow',
    });
  }

  if (pollution >= 45) {
    add({
      id: 'close-windows',
      label: 'Fechar janelas',
      detail: 'Reduz entrada de partículas quando o ar externo piora.',
      level: pollution >= 70 ? 'red' : 'yellow',
    });
  }

  if (pollution >= 45 || thermal >= 55 || wind >= 62 || profile === 'activity') {
    add({
      id: 'avoid-intense-exercise',
      label: 'Evitar exercício intenso',
      detail:
        profile === 'activity'
          ? 'Prefira horários mais frescos e monitore respiração.'
          : 'Esforço ao ar livre piora quando calor, vento ou poluição sobem.',
      level: pollution >= 70 || thermal >= 70 ? 'red' : 'orange',
    });
  }

  if ((profile === 'child' || profile === 'elderly') && level !== 'green') {
    add({
      id: 'sensitive-people',
      label: 'Atenção para crianças/idosos',
      detail: 'Reduza tempo em sol forte, chuva intensa ou ar poluído.',
      level: level === 'red' ? 'red' : 'orange',
    });
  }

  return Array.from(recommendations.values());
}

function levelFromScore(score: number): RiskLevel {
  if (score >= 75) return 'red';
  if (score >= 51) return 'orange';
  if (score >= 26) return 'yellow';
  return 'green';
}

function titleForLevel(level: RiskLevel): string {
  const titles: Record<RiskLevel, string> = {
    green: 'Verde',
    yellow: 'Amarelo',
    orange: 'Laranja',
    red: 'Vermelho',
  };
  return titles[level];
}

function summaryFor(level: RiskLevel, dominantFactor: string, profile: ProfileId): string {
  if (level === 'green') return 'Bom para sair agora; mantenha hidratação e acompanhe mudanças do tempo.';
  if (dominantFactor === 'pollution') {
    return 'A qualidade do ar pede menos exposição ao ar livre, principalmente para perfis sensíveis.';
  }
  if (dominantFactor === 'uv') {
    return 'Dá para sair com atenção, mas use protetor solar e prefira sombra entre 11h e 15h.';
  }
  if (dominantFactor === 'rain') {
    return 'Planeje deslocamentos com chuva provável e leve proteção antes de sair.';
  }
  if (dominantFactor === 'thermal') {
    return profile === 'activity'
      ? 'Evite treino intenso agora; prefira horário mais fresco e pausas.'
      : 'Exposição prolongada pode cansar; faça pausas e hidrate-se.';
  }
  return 'Há fatores de cuidado no período; reduza exposição prolongada e acompanhe a próxima hora.';
}

function getFactor(factors: RiskFactor[], id: string): RiskFactor {
  const factor = factors.find((item) => item.id === id);
  if (!factor) throw new Error(`Fator de risco ausente: ${id}`);
  return factor;
}

function uvRisk(value: number): number {
  if (value <= 2) return 8;
  if (value <= 5) return 28;
  if (value <= 7) return 52;
  if (value <= 10) return 78;
  return 94;
}

function precipitationProbabilityRisk(value: number): number {
  if (value < 20) return 4;
  if (value < 45) return 26;
  if (value < 65) return 48;
  if (value < 82) return 66;
  return 84;
}

function precipitationIntensityRisk(value: number): number {
  if (value < 0.5) return 0;
  if (value < 2) return 34;
  if (value < 6) return 56;
  if (value < 15) return 76;
  return 92;
}

function thermalRisk(value: number): number {
  if (value >= 38 || value <= 3) return 92;
  if (value >= 34 || value <= 8) return 74;
  if (value >= 30 || value <= 12) return 45;
  return 8;
}

function windRisk(value: number): number {
  if (value >= 65) return 90;
  if (value >= 48) return 70;
  if (value >= 32) return 48;
  if (value >= 22) return 24;
  return 6;
}

function pollutionRisk(pm25: number, pm10: number, usAqi?: number): number {
  return Math.max(pm25Risk(pm25), pm10Risk(pm10), aqiRisk(usAqi));
}

function pm25Risk(value: number): number {
  if (value <= 12) return 4;
  if (value <= 35) return 36;
  if (value <= 55) return 62;
  if (value <= 150) return 90;
  return 98;
}

function pm10Risk(value: number): number {
  if (value <= 54) return 5;
  if (value <= 154) return 38;
  if (value <= 254) return 64;
  if (value <= 354) return 82;
  return 95;
}

function aqiRisk(value?: number): number {
  if (value == null) return 0;
  if (value <= 50) return 4;
  if (value <= 100) return 30;
  if (value <= 150) return 56;
  if (value <= 200) return 76;
  if (value <= 300) return 90;
  return 98;
}
