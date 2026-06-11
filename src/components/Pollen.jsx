import { Alert } from 'react-bootstrap'
import { useGeoData } from '../hooks/useGeoData'
import { fetchPollen } from '../utils/api'
import { POLLEN_TYPES, getPollenLevel } from '../utils/pollenInfo'
import { LoadingScreen, Welcome, LocationHeader, DataFooter } from './PageStatus'

export default function Pollen({ location }) {
  const { data, loading, error } = useGeoData(fetchPollen, location)

  if (!location) {
    return (
      <Welcome
        icon="🌼"
        title="Pollini"
        text="Cerca una città nella barra in alto oppure usa la tua posizione attuale per visualizzare le concentrazioni di pollini in atmosfera (disponibili solo per l'Europa)."
      />
    )
  }

  if (loading) return <LoadingScreen message="Caricamento dati pollini..." />

  if (error) {
    return (
      <Alert variant="danger" className="mt-2">
        Impossibile caricare i dati sui pollini. Verifica la connessione e riprova.
      </Alert>
    )
  }

  if (!data) return null

  const current = data.current ?? {}
  const noData = POLLEN_TYPES.every((t) => current[t.key] == null)

  return (
    <div className="mt-3">
      <LocationHeader location={location} />

      {noData ? (
        <Alert variant="info" className="text-center">
          I dati sui pollini sono disponibili solo per l'Europa. Per la località selezionata non sono presenti dati.
        </Alert>
      ) : (
        <div className="pollen-grid">
          {POLLEN_TYPES.map((t) => {
            const value = current[t.key]
            const level = getPollenLevel(value)
            return (
              <div key={t.key} className="pollen-card">
                <div className="pollen-head">
                  <span className="pollen-name">
                    <span>{t.icon}</span>{t.label}
                  </span>
                  <span className="pollen-level" style={{ color: level.color }}>{level.label}</span>
                </div>
                <div className="pollen-bar-track">
                  <div className="pollen-bar-fill" style={{ width: `${level.pct}%`, background: level.color }} />
                </div>
                <div className="pollen-value">
                  {value != null ? `${Math.round(value * 10) / 10} grani/m³` : 'N/D'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <DataFooter />
    </div>
  )
}
