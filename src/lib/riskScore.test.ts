import { describe, expect, it } from 'vitest';
import { calculateRiskScore } from './riskScore';
import type { CurrentConditions } from '../types';

const baseConditions: CurrentConditions = {
  time: '2026-05-20T10:00:00',
  temperature: 24,
  apparentTemperature: 25,
  precipitation: 0,
  precipitationProbability: 8,
  windSpeed: 10,
  windGusts: 16,
  uvIndex: 2,
  humidity: 54,
  pm25: 7,
  pm10: 18,
  usAqi: 32,
  weatherCode: 1,
};

describe('calculateRiskScore', () => {
  it('classifies a mild day for a healthy adult as green with simple guidance', () => {
    const result = calculateRiskScore(baseConditions, 'adult');

    expect(result.level).toBe('green');
    expect(result.score).toBeLessThanOrEqual(25);
    expect(result.summary).toContain('Bom para sair');
    expect(result.recommendations.some((item) => item.id === 'hydrate')).toBe(true);
  });

  it('raises the risk for children when UV and rain are both relevant', () => {
    const result = calculateRiskScore(
      {
        ...baseConditions,
        uvIndex: 8.4,
        precipitationProbability: 68,
        precipitation: 2.4,
        apparentTemperature: 31,
      },
      'child',
    );

    expect(['orange', 'red']).toContain(result.level);
    expect(result.score).toBeGreaterThanOrEqual(51);
    expect(result.recommendations.map((item) => item.id)).toEqual(
      expect.arrayContaining(['sunscreen', 'umbrella', 'sensitive-people']),
    );
  });

  it('prioritizes exposure avoidance for respiratory profiles under heavy pollution', () => {
    const result = calculateRiskScore(
      {
        ...baseConditions,
        pm25: 72,
        pm10: 190,
        usAqi: 176,
        windSpeed: 22,
      },
      'respiratory',
    );

    expect(result.level).toBe('red');
    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.summary).toContain('qualidade do ar');
    expect(result.recommendations.map((item) => item.id)).toEqual(
      expect.arrayContaining(['close-windows', 'avoid-intense-exercise']),
    );
  });
});
