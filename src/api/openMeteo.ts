import type {
  CurrentConditions,
  DailyForecast,
  HourPoint,
  LocationOption,
  WeatherBundle,
} from '../types';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    timezone?: string;
    country?: string;
    admin1?: string;
  }>;
}

interface WeatherResponse {
  current?: Record<string, number | string>;
  hourly?: Record<string, Array<number | string>>;
  daily?: Record<string, Array<number | string>>;
}

interface AirQualityResponse {
  current?: Record<string, number | string>;
  hourly?: Record<string, Array<number | string>>;
}

export async function searchLocations(query: string): Promise<LocationOption[]> {
  const name = query.trim();
  if (name.length < 2) return [];

  const url = new URL(GEO_URL);
  url.search = new URLSearchParams({
    name,
    count: '6',
    language: 'pt',
    format: 'json',
  }).toString();

  const response = await fetchJson<GeocodingResponse>(url);
  return (response.results ?? []).map((item) => ({
    id: String(item.id),
    name: item.name,
    admin1: item.admin1,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
  }));
}

export async function fetchClimaCuidaData(location: LocationOption): Promise<WeatherBundle> {
  const weatherUrl = new URL(WEATHER_URL);
  weatherUrl.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'rain',
      'showers',
      'weather_code',
      'wind_speed_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'uv_index',
      'wind_speed_10m',
      'relative_humidity_2m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'uv_index_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  }).toString();

  const airUrl = new URL(AIR_URL);
  airUrl.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: ['us_aqi', 'pm2_5', 'pm10', 'uv_index'].join(','),
    hourly: ['us_aqi', 'pm2_5', 'pm10', 'uv_index'].join(','),
    timezone: 'auto',
    forecast_days: '5',
  }).toString();

  const [weather, air] = await Promise.all([
    fetchJson<WeatherResponse>(weatherUrl),
    fetchJson<AirQualityResponse>(airUrl),
  ]);

  return normalizeBundle(location, weather, air);
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao buscar ${url.hostname}: ${response.status}`);
  }

  const data = (await response.json()) as T & { error?: boolean; reason?: string };
  if (data.error) {
    throw new Error(data.reason ?? 'A API retornou erro.');
  }

  return data;
}

function normalizeBundle(
  location: LocationOption,
  weather: WeatherResponse,
  air: AirQualityResponse,
): WeatherBundle {
  const current = weather.current ?? {};
  const weatherHourly = weather.hourly ?? {};
  const airCurrent = air.current ?? {};
  const airHourly = air.hourly ?? {};
  const dailyRaw = weather.daily ?? {};
  const currentTime = asString(current.time) ?? asString(weatherHourly.time?.[0]) ?? new Date().toISOString();
  const hourlyStart = findHourlyStart(weatherHourly.time, currentTime);

  const hourly: HourPoint[] = Array.from({ length: 12 }, (_, offset) => {
    const index = hourlyStart + offset;
    return {
      time: asString(weatherHourly.time?.[index]) ?? currentTime,
      temperature: asNumber(weatherHourly.temperature_2m?.[index], current.temperature_2m),
      precipitation: asNumber(weatherHourly.precipitation?.[index], current.precipitation),
      precipitationProbability: asNumber(weatherHourly.precipitation_probability?.[index], 0),
      uvIndex: asNumber(weatherHourly.uv_index?.[index], airHourly.uv_index?.[index], airCurrent.uv_index),
      usAqi: optionalNumber(airHourly.us_aqi?.[index], airCurrent.us_aqi),
      pm25: asNumber(airHourly.pm2_5?.[index], airCurrent.pm2_5),
      pm10: asNumber(airHourly.pm10?.[index], airCurrent.pm10),
      weatherCode: asNumber(weatherHourly.weather_code?.[index], current.weather_code),
    };
  });

  const currentConditions: CurrentConditions = {
    time: currentTime,
    temperature: asNumber(current.temperature_2m, hourly[0]?.temperature),
    apparentTemperature: asNumber(current.apparent_temperature, weatherHourly.apparent_temperature?.[hourlyStart]),
    precipitation: asNumber(current.precipitation, hourly[0]?.precipitation),
    precipitationProbability: hourly[0]?.precipitationProbability ?? 0,
    windSpeed: asNumber(current.wind_speed_10m, weatherHourly.wind_speed_10m?.[hourlyStart]),
    windGusts: asNumber(current.wind_gusts_10m, current.wind_speed_10m),
    uvIndex: asNumber(airCurrent.uv_index, hourly[0]?.uvIndex),
    humidity: asNumber(current.relative_humidity_2m, weatherHourly.relative_humidity_2m?.[hourlyStart]),
    pm25: asNumber(airCurrent.pm2_5, hourly[0]?.pm25),
    pm10: asNumber(airCurrent.pm10, hourly[0]?.pm10),
    usAqi: optionalNumber(airCurrent.us_aqi, hourly[0]?.usAqi),
    weatherCode: asNumber(current.weather_code, hourly[0]?.weatherCode),
  };

  const daily: DailyForecast[] = Array.from({ length: 7 }, (_, index) => ({
    date: asString(dailyRaw.time?.[index]) ?? new Date().toISOString().slice(0, 10),
    tempMax: asNumber(dailyRaw.temperature_2m_max?.[index]),
    tempMin: asNumber(dailyRaw.temperature_2m_min?.[index]),
    precipitationProbability: asNumber(dailyRaw.precipitation_probability_max?.[index]),
    uvIndexMax: asNumber(dailyRaw.uv_index_max?.[index]),
    windSpeedMax: asNumber(dailyRaw.wind_speed_10m_max?.[index]),
    weatherCode: asNumber(dailyRaw.weather_code?.[index]),
  }));

  return {
    location,
    current: currentConditions,
    hourly,
    daily,
    source: 'api',
    fetchedAt: new Date().toISOString(),
  };
}

function findHourlyStart(values: Array<number | string> | undefined, currentTime: string): number {
  if (!values?.length) return 0;
  const current = new Date(currentTime).getTime();
  const index = values.findIndex((value) => new Date(String(value)).getTime() >= current);
  return Math.max(0, index === -1 ? 0 : index);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function optionalNumber(...values: unknown[]): number | undefined {
  const value = values.find((candidate) => typeof candidate === 'number' && Number.isFinite(candidate));
  return typeof value === 'number' ? value : undefined;
}

function asNumber(...values: unknown[]): number {
  return optionalNumber(...values) ?? 0;
}
