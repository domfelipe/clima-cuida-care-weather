import type { WeatherBundle, UseProfile } from '../types';

export const USE_PROFILES: UseProfile[] = [
  {
    id: 'adult',
    label: 'Adulto saudável',
    shortLabel: 'Adulto',
    description: 'Rotina comum, sem sensibilidade respiratória declarada.',
  },
  {
    id: 'child',
    label: 'Criança',
    shortLabel: 'Criança',
    description: 'Mais atenção a calor, UV, chuva forte e ar ruim.',
  },
  {
    id: 'elderly',
    label: 'Idoso',
    shortLabel: 'Idoso',
    description: 'Maior sensibilidade a calor, frio, vento e poluição.',
  },
  {
    id: 'respiratory',
    label: 'Pessoa com rinite/asma',
    shortLabel: 'Rinite/asma',
    description: 'Prioriza partículas finas, PM10 e qualidade do ar.',
  },
  {
    id: 'activity',
    label: 'Atividade física',
    shortLabel: 'Exercício',
    description: 'Avalia esforço ao ar livre, calor, UV, vento e poluição.',
  },
];

const today = new Date();
const atHour = (offset: number) => {
  const date = new Date(today);
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + offset);
  return date.toISOString();
};

const day = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

export const MOCK_WEATHER: WeatherBundle = {
  source: 'mock',
  fetchedAt: new Date().toISOString(),
  location: {
    id: 'mock-sao-paulo',
    name: 'São Paulo',
    admin1: 'SP',
    country: 'Brasil',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
  },
  current: {
    time: atHour(0),
    temperature: 27,
    apparentTemperature: 29,
    precipitation: 0.4,
    precipitationProbability: 42,
    windSpeed: 18,
    windGusts: 31,
    uvIndex: 7.1,
    humidity: 68,
    pm25: 18,
    pm10: 42,
    usAqi: 78,
    weatherCode: 2,
  },
  hourly: Array.from({ length: 12 }, (_, index) => ({
    time: atHour(index),
    temperature: [27, 28, 29, 30, 31, 30, 29, 28, 26, 25, 24, 23][index],
    precipitation: [0, 0, 0.2, 0.5, 1.2, 2.1, 1.4, 0.4, 0.1, 0, 0, 0][index],
    precipitationProbability: [24, 28, 34, 46, 58, 64, 52, 38, 26, 20, 18, 16][index],
    uvIndex: [2, 4, 6, 8, 9, 7, 5, 3, 1, 0, 0, 0][index],
    usAqi: [71, 74, 78, 84, 92, 95, 88, 80, 76, 72, 69, 66][index],
    pm25: [16, 17, 18, 20, 23, 24, 21, 18, 17, 16, 15, 14][index],
    pm10: [38, 40, 42, 48, 55, 58, 49, 43, 40, 38, 36, 35][index],
    weatherCode: [2, 2, 3, 3, 61, 63, 61, 3, 2, 1, 1, 1][index],
  })),
  daily: Array.from({ length: 7 }, (_, index) => ({
    date: day(index),
    tempMax: [31, 29, 26, 28, 30, 32, 27][index],
    tempMin: [22, 21, 19, 18, 20, 22, 19][index],
    precipitationProbability: [64, 48, 38, 22, 18, 35, 52][index],
    uvIndexMax: [9, 8, 6, 7, 8, 10, 5][index],
    windSpeedMax: [32, 28, 24, 22, 27, 35, 30][index],
    weatherCode: [63, 61, 3, 2, 1, 2, 61][index],
  })),
};
