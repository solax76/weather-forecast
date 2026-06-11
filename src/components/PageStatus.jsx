// Elementi di UI condivisi da tutte le pagine: spinner di caricamento,
// schermata di benvenuto, intestazione località e footer sorgente dati.

export function LoadingScreen({ message }) {
  return (
    <div className="loading-spinner-wrapper">
      <div
        className="spinner-border"
        style={{ width: '3.5rem', height: '3.5rem', color: 'var(--text-primary)' }}
        role="status"
      />
      <p style={{ color: 'var(--text-primary)' }} className="mt-3 mb-0">{message}</p>
    </div>
  )
}

export function Welcome({ icon, title, text }) {
  return (
    <div className="welcome-section">
      <span className="welcome-icon">{icon}</span>
      <h3 style={{ color: 'var(--text-primary)' }} className="mb-2">{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
        {text}
      </p>
    </div>
  )
}

export function LocationHeader({ location, children }) {
  return (
    <div className="text-center mb-4">
      <h2 className="mb-1" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: 'var(--text-primary)' }}>
        📍 {location.name}
        {location.admin1 && <span style={{ color: 'var(--text-secondary)' }}>, {location.admin1}</span>}
        {location.country && <span style={{ color: 'var(--text-secondary)' }}> — {location.country}</span>}
      </h2>
      <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
        </span>
        {children}
      </div>
    </div>
  )
}

export function DataFooter() {
  return (
    <p className="page-footer">
      Dati forniti da{' '}
      <a href="https://open-meteo.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
        Open-Meteo
      </a>
      {' '}· CC BY 4.0
      {' '}· v{__APP_VERSION__}
    </p>
  )
}
