import { Alert } from 'react-bootstrap'
import { useGeoData } from '../hooks/useGeoData'
import { fetchWeather } from '../utils/api'
import WeatherForecast from './WeatherForecast'
import { LoadingScreen, Welcome } from './PageStatus'

export default function WeatherPage({ location, model }) {
  const { data, loading, error } = useGeoData(
    (lat, lon) => fetchWeather(lat, lon, model),
    location,
    model,
  )

  if (loading) return <LoadingScreen message="Caricamento previsioni in corso..." />

  if (error) {
    return (
      <Alert variant="danger" className="mt-2">
        Impossibile caricare le previsioni meteo. Verifica la connessione e riprova.
      </Alert>
    )
  }

  if (data && location) {
    return <WeatherForecast data={data} location={location} model={model} />
  }

  return (
    <Welcome
      icon="🌍"
      title="Previsioni Meteo"
      text="Cerca una città nella barra in alto oppure usa la tua posizione attuale per visualizzare le previsioni meteo dei prossimi 7 giorni."
    />
  )
}
