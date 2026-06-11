import { useState, useEffect } from 'react'
import { Container, Alert } from 'react-bootstrap'
import TopBar from './components/TopBar'
import WeatherPage from './components/WeatherPage'
import AirQuality from './components/AirQuality'
import Pollen from './components/Pollen'
import ThemeToggle from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'

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
  const [page, setPage] = useState('weather')
  const [model, setModel] = useState(loadModel)
  const [location, setLocation] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState(null)
  const [clearSignal, setClearSignal] = useState(0)

  // Auto-geolocalizzazione al caricamento iniziale della pagina (fallimento silenzioso)
  useEffect(() => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setGpsLoading(false)
        setLocation({ name: 'Posizione attuale', admin1: '', country: '', lat: latitude, lon: longitude })
      },
      () => setGpsLoading(false),
      { timeout: 10000 },
    )
  }, [])

  function handleModelChange(newModel) {
    setModel(newModel)
    saveModel(newModel)
  }

  function handleLocationSelect(loc) {
    setLocation(loc)
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setGpsError('La geolocalizzazione non è supportata dal tuo browser.')
      return
    }
    setClearSignal((n) => n + 1)
    setGpsLoading(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setGpsLoading(false)
        setLocation({ name: 'Posizione attuale', admin1: '', country: '', lat: latitude, lon: longitude })
      },
      () => {
        setGpsLoading(false)
        setGpsError('Impossibile ottenere la posizione. Verifica i permessi di geolocalizzazione nel browser.')
      },
      { timeout: 10000 },
    )
  }

  return (
    <div className="app-container">
      <TopBar
        page={page}
        onPageChange={setPage}
        selectedModel={model}
        onModelChange={handleModelChange}
        onLocationSelect={handleLocationSelect}
        onCurrentLocation={handleCurrentLocation}
        gpsLoading={gpsLoading}
        clearSignal={clearSignal}
      />

      <Container className="py-4">
        {gpsError && (
          <Alert variant="danger" dismissible onClose={() => setGpsError(null)} className="mt-2">
            {gpsError}
          </Alert>
        )}

        {page === 'weather' && <WeatherPage location={location} model={model} />}
        {page === 'air' && <AirQuality location={location} />}
        {page === 'pollen' && <Pollen location={location} />}

        <ThemeToggle preference={themePref} onThemeChange={setThemePref} />
      </Container>
    </div>
  )
}
