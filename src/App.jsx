import { useState, useEffect } from 'react'
import { Container, Alert } from 'react-bootstrap'
import TopBar from './components/TopBar'
import WeatherForecast from './components/WeatherForecast'
import ThemeToggle from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import { fetchWeather } from './utils/api'

const STORAGE_KEY = 'weather_model'
const DEFAULT_MODEL = 'ecmwf_ifs025'

function loadModel() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_MODEL
  } catch {
    return DEFAULT_MODEL
  }
}

function saveModel(model) {
  try {
    localStorage.setItem(STORAGE_KEY, model)
  } catch {}
}

export default function App() {
  const { preference: themePref, setPreference: setThemePref } = useTheme()
  const [model, setModel] = useState(loadModel)
  const [location, setLocation] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [clearSignal, setClearSignal] = useState(0)

  // Auto-geolocalizzazione al caricamento iniziale della pagina (fallimento silenzioso)
  useEffect(() => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const loc = { name: 'Posizione attuale', admin1: '', country: '', lat: latitude, lon: longitude }
        setGpsLoading(false)
        setLocation(loc)
        loadWeather(latitude, longitude, loadModel())
      },
      () => setGpsLoading(false),
      { timeout: 10000 },
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadWeather(lat, lon, weatherModel) {
    setLoading(true)
    setError(null)
    setWeatherData(null)
    try {
      const data = await fetchWeather(lat, lon, weatherModel)
      setWeatherData(data)
    } catch {
      setError('Impossibile caricare le previsioni meteo. Verifica la connessione e riprova.')
    } finally {
      setLoading(false)
    }
  }

  function handleModelChange(newModel) {
    setModel(newModel)
    saveModel(newModel)
    if (location) {
      loadWeather(location.lat, location.lon, newModel)
    }
  }

  function handleLocationSelect(loc) {
    setLocation(loc)
    loadWeather(loc.lat, loc.lon, model)
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError('La geolocalizzazione non è supportata dal tuo browser.')
      return
    }
    setClearSignal((n) => n + 1)
    setGpsLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const loc = {
          name: 'Posizione attuale',
          admin1: '',
          country: '',
          lat: latitude,
          lon: longitude,
        }
        setGpsLoading(false)
        setLocation(loc)
        loadWeather(latitude, longitude, model)
      },
      () => {
        setGpsLoading(false)
        setError('Impossibile ottenere la posizione. Verifica i permessi di geolocalizzazione nel browser.')
      },
      { timeout: 10000 },
    )
  }

  return (
    <div className="app-container">
      <TopBar
        selectedModel={model}
        onModelChange={handleModelChange}
        onLocationSelect={handleLocationSelect}
        onCurrentLocation={handleCurrentLocation}
        gpsLoading={gpsLoading}
        clearSignal={clearSignal}
      />

      <Container className="py-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mt-2">
            {error}
          </Alert>
        )}

        {loading && (
          <div className="loading-spinner-wrapper">
            <div
              className="spinner-border"
              style={{ width: '3.5rem', height: '3.5rem', color: 'var(--text-primary)' }}
              role="status"
            />
            <p style={{ color: 'var(--text-primary)' }} className="mt-3 mb-0">Caricamento previsioni in corso...</p>
          </div>
        )}

        {!loading && !error && weatherData && location && (
          <WeatherForecast data={weatherData} location={location} model={model} />
        )}

        {!loading && !error && !weatherData && (
          <div className="welcome-section">
            <span className="welcome-icon">🌍</span>
            <h3 style={{ color: 'var(--text-primary)' }} className="mb-2">Previsioni Meteo</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
              Cerca una città nella barra in alto oppure usa la tua posizione attuale per
              visualizzare le previsioni meteo dei prossimi 7 giorni.
            </p>
          </div>
        )}
        <ThemeToggle preference={themePref} onThemeChange={setThemePref} />
      </Container>
    </div>
  )
}
