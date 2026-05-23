import { useCallback, useEffect, useMemo, useState } from 'react';
import { HeartPulse, Moon, Sun } from 'lucide-react';
import { fetchClimaCuidaData } from './api/openMeteo';
import { ErrorBanner } from './components/ErrorBanner';
import { Forecast7Days } from './components/Forecast7Days';
import { MetricsGrid } from './components/MetricsGrid';
import { ProfileSelector } from './components/ProfileSelector';
import { RecommendationChips } from './components/RecommendationChips';
import { SearchBar } from './components/SearchBar';
import { SemaforoCard } from './components/SemaforoCard';
import { SkeletonDashboard } from './components/SkeletonDashboard';
import { Timeline12h } from './components/Timeline12h';
import { WhyPanel } from './components/WhyPanel';
import { MOCK_WEATHER, USE_PROFILES } from './data/mock';
import { calculateRiskScore } from './lib/riskScore';
import type { LocationOption, ProfileId, WeatherBundle } from './types';

const STORAGE_KEY = 'clima-cuida-preferences';
type ThemeMode = 'light' | 'dark';

interface StoredPreferences {
  profile?: ProfileId;
  location?: LocationOption;
  theme?: ThemeMode;
}

function loadPreferences(): StoredPreferences {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as StoredPreferences) : {};
  } catch {
    return {};
  }
}

function savePreferences(preferences: StoredPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Local storage can be blocked in private contexts; the app remains usable.
  }
}

export default function App() {
  const initialPreferences = useMemo(() => loadPreferences(), []);
  const [profile, setProfile] = useState<ProfileId>(initialPreferences.profile ?? 'adult');
  const [theme, setTheme] = useState<ThemeMode>(initialPreferences.theme ?? 'light');
  const [activeLocation, setActiveLocation] = useState<LocationOption>(
    initialPreferences.location ?? MOCK_WEATHER.location,
  );
  const [weather, setWeather] = useState<WeatherBundle>(MOCK_WEATHER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProfile = USE_PROFILES.find((item) => item.id === profile) ?? USE_PROFILES[0];
  const risk = useMemo(() => calculateRiskScore(weather.current, profile), [profile, weather.current]);
  const isDarkTheme = theme === 'dark';

  const loadWeather = useCallback(
    async (location: LocationOption) => {
      setIsLoading(true);
      setError(null);
      try {
        const nextWeather = await fetchClimaCuidaData(location);
        setWeather(nextWeather);
        setActiveLocation(location);
        savePreferences({ profile, location, theme });
      } catch {
        setWeather({
          ...MOCK_WEATHER,
          fetchedAt: new Date().toISOString(),
          source: 'mock',
        });
        setError('A API nao respondeu agora. Exibindo dados de exemplo para manter a leitura do dia utilizavel.');
      } finally {
        setIsLoading(false);
      }
    },
    [profile, theme],
  );

  useEffect(() => {
    void loadWeather(activeLocation);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    savePreferences({ profile, location: activeLocation, theme });
  }, [profile, activeLocation, theme]);

  function handleProfileChange(nextProfile: ProfileId) {
    setProfile(nextProfile);
  }

  function handleToggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Este navegador nao oferece geolocalizacao. Busque uma cidade pelo nome.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationOption = {
          id: 'browser-location',
          name: 'Sua localizacao',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        void loadWeather(location);
      },
      () => {
        setIsLoading(false);
        setError('Nao foi possivel acessar sua localizacao. Voce pode pesquisar uma cidade manualmente.');
      },
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 10 * 60 * 1000 },
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand-mark" href={import.meta.env.BASE_URL} aria-label="Clima Cuida">
          <span aria-hidden="true">
            <HeartPulse size={20} />
          </span>
          <strong>Clima Cuida</strong>
        </a>
        <SearchBar
          currentLocation={activeLocation}
          isLoading={isLoading}
          onSelectLocation={loadWeather}
          onUseCurrentLocation={handleUseCurrentLocation}
        />
        <div className="topbar-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={isDarkTheme ? 'Ativar modo claro' : 'Ativar modo escuro'}
            onClick={handleToggleTheme}
          >
            {isDarkTheme ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            <span>{isDarkTheme ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>
          <ProfileSelector profiles={USE_PROFILES} value={profile} onChange={handleProfileChange} />
        </div>
      </header>

      <main className="dashboard-shell" aria-busy={isLoading}>
        {error && <ErrorBanner message={error} onRetry={() => loadWeather(activeLocation)} />}
        <div className="dashboard-intro">
          <p className="eyebrow">Orientacao geral, nao recomendacao medica</p>
          <p>
            Leitura combinada de clima, UV e qualidade do ar para decidir saida, exercicio, deslocamento
            e protecao diaria.
          </p>
        </div>

        {isLoading ? (
          <SkeletonDashboard />
        ) : (
          <div className="dashboard-grid">
            <div className="primary-column">
              <SemaforoCard
                current={weather.current}
                location={weather.location}
                profile={selectedProfile}
                risk={risk}
                fetchedAt={weather.fetchedAt}
                source={weather.source}
              />
              <MetricsGrid current={weather.current} />
              <Timeline12h hours={weather.hourly} />
            </div>

            <div className="secondary-column">
              <RecommendationChips recommendations={risk.recommendations} />
              <Forecast7Days days={weather.daily} />
              <WhyPanel risk={risk} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
