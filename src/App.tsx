import { useCallback, useEffect, useMemo, useState } from 'react';
import { HeartPulse } from 'lucide-react';
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

interface StoredPreferences {
  profile?: ProfileId;
  location?: LocationOption;
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
  const [activeLocation, setActiveLocation] = useState<LocationOption>(
    initialPreferences.location ?? MOCK_WEATHER.location,
  );
  const [weather, setWeather] = useState<WeatherBundle>(MOCK_WEATHER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProfile = USE_PROFILES.find((item) => item.id === profile) ?? USE_PROFILES[0];
  const risk = useMemo(() => calculateRiskScore(weather.current, profile), [profile, weather.current]);

  const loadWeather = useCallback(
    async (location: LocationOption) => {
      setIsLoading(true);
      setError(null);
      try {
        const nextWeather = await fetchClimaCuidaData(location);
        setWeather(nextWeather);
        setActiveLocation(location);
        savePreferences({ profile, location });
      } catch {
        setWeather({
          ...MOCK_WEATHER,
          fetchedAt: new Date().toISOString(),
          source: 'mock',
        });
        setError('A API não respondeu agora. Exibindo dados de exemplo para manter a leitura do dia utilizável.');
      } finally {
        setIsLoading(false);
      }
    },
    [profile],
  );

  useEffect(() => {
    void loadWeather(activeLocation);
  }, []);

  useEffect(() => {
    savePreferences({ profile, location: activeLocation });
  }, [profile, activeLocation]);

  function handleProfileChange(nextProfile: ProfileId) {
    setProfile(nextProfile);
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Este navegador não oferece geolocalização. Busque uma cidade pelo nome.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationOption = {
          id: 'browser-location',
          name: 'Sua localização',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        void loadWeather(location);
      },
      () => {
        setIsLoading(false);
        setError('Não foi possível acessar sua localização. Você pode pesquisar uma cidade manualmente.');
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
        <ProfileSelector profiles={USE_PROFILES} value={profile} onChange={handleProfileChange} />
      </header>

      <main className="dashboard-shell" aria-busy={isLoading}>
        {error && <ErrorBanner message={error} onRetry={() => loadWeather(activeLocation)} />}
        <div className="dashboard-intro">
          <p className="eyebrow">Orientação geral, não recomendação médica</p>
          <p>
            Leitura combinada de clima, UV e qualidade do ar para decidir saída, exercício, deslocamento
            e proteção diária.
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
