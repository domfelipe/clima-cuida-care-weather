import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <aside className="error-banner" role="alert">
      <AlertTriangle aria-hidden="true" size={20} />
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        <RefreshCw aria-hidden="true" size={16} />
        Tentar de novo
      </button>
    </aside>
  );
}
