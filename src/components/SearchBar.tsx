import { FormEvent, useId, useState } from 'react';
import { LocateFixed, Loader2, MapPin, Search } from 'lucide-react';
import { searchLocations } from '../api/openMeteo';
import { compactLocationLabel } from '../lib/formatters';
import type { LocationOption } from '../types';

interface SearchBarProps {
  currentLocation: LocationOption;
  isLoading: boolean;
  onSelectLocation: (location: LocationOption) => void;
  onUseCurrentLocation: () => void;
}

export function SearchBar({
  currentLocation,
  isLoading,
  onSelectLocation,
  onUseCurrentLocation,
}: SearchBarProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setMessage('Digite ao menos 2 letras.');
      return;
    }

    setIsSearching(true);
    setMessage('');
    try {
      const nextResults = await searchLocations(trimmed);
      setResults(nextResults);
      if (nextResults.length === 0) {
        setMessage('Nenhuma cidade encontrada.');
      } else if (nextResults.length === 1) {
        chooseLocation(nextResults[0]);
      }
    } catch {
      setMessage('Não foi possível buscar cidades agora.');
    } finally {
      setIsSearching(false);
    }
  }

  function chooseLocation(location: LocationOption) {
    setQuery('');
    setResults([]);
    setMessage('');
    onSelectLocation(location);
  }

  return (
    <div className="search-cluster" aria-label="Busca de cidade">
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor={inputId}>Cidade</label>
        <div className="search-input-row">
          <Search aria-hidden="true" size={18} />
          <input
            id={inputId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={compactLocationLabel([
              currentLocation.name,
              currentLocation.admin1,
              currentLocation.country,
            ])}
            autoComplete="off"
          />
          <button type="submit" disabled={isSearching || isLoading}>
            {isSearching ? <Loader2 className="spin" aria-hidden="true" size={17} /> : 'Buscar'}
          </button>
        </div>
      </form>

      <button
        className="geo-button"
        type="button"
        onClick={onUseCurrentLocation}
        disabled={isLoading}
        aria-label="Usar localização atual do navegador"
      >
        <LocateFixed aria-hidden="true" size={18} />
        Localização
      </button>

      {(results.length > 0 || message) && (
        <div className="search-popover" role="status" aria-live="polite">
          {message && <p>{message}</p>}
          {results.map((result) => (
            <button type="button" key={result.id} onClick={() => chooseLocation(result)}>
              <MapPin aria-hidden="true" size={16} />
              <span>{compactLocationLabel([result.name, result.admin1, result.country])}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
