import { Alert } from 'react-bootstrap'
import { useGeoData } from '../hooks/useGeoData'
import { fetchAirQuality } from '../utils/api'
import { getAqiCategory, getUvCategory, POLLUTANTS } from '../utils/airQualityInfo'
import { LoadingScreen, Welcome, LocationHeader, DataFooter } from './PageStatus'

export default function AirQuality({ location }) {
  const { data, loading, error } = useGeoData(fetchAirQuality, location)

  if (!location) {
    return (
      <Welcome
        icon="🌬️"
        title="Qualità dell'aria"
        text="Cerca una città nella barra in alto oppure usa la tua posizione attuale per visualizzare l'indice europeo di qualità dell'aria e le concentrazioni di inquinanti."
      />
    )
  }

  if (loading) return <LoadingScreen message="Caricamento qualità dell'aria..." />

  if (error) {
    return (
      <Alert variant="danger" className="mt-2">
        Impossibile caricare i dati sulla qualità dell'aria. Verifica la connessione e riprova.
      </Alert>
    )
  }

  if (!data) return null

  const current = data.current ?? {}
  const aqi = current.european_aqi
  const cat = getAqiCategory(aqi)
  const uv = current.uv_index
  const uvCat = getUvCategory(uv)

  return (
    <div className="mt-3">
      <LocationHeader location={location} />

      <div className="aqi-hero" style={{ borderColor: cat.color }}>
        <div className="aqi-value" style={{ color: cat.color }}>{aqi ?? '—'}</div>
        <div className="aqi-label">Indice europeo di qualità dell'aria</div>
        <div className="aqi-cat" style={{ background: cat.color }}>{cat.label}</div>
      </div>

      <div className="aqi-hero" style={{ borderColor: uvCat.color }}>
        <div className="aqi-value" style={{ color: uvCat.color }}>
          {uv != null ? Math.round(uv * 10) / 10 : '—'}
        </div>
        <div className="aqi-label">Indice UV</div>
        <div className="aqi-cat" style={{ background: uvCat.color }}>{uvCat.label}</div>
      </div>

      <div className="metric-grid">
        {POLLUTANTS.map((p) => {
          const value = current[p.key]
          return (
            <div key={p.key} className="metric-card">
              <div className="metric-icon">{p.icon}</div>
              <div className="metric-label">{p.label}</div>
              <div className="metric-value">
                {value != null ? Math.round(value * 10) / 10 : '—'}
                {value != null && <span className="metric-unit"> {p.unit}</span>}
              </div>
            </div>
          )
        })}
      </div>

      <DataFooter />
    </div>
  )
}
