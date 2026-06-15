import { Navbar, Container, Form, Button } from 'react-bootstrap'
import LocationSearch from './LocationSearch'

const MODELS = [
  { value: 'ecmwf_ifs025',                  label: 'ECMWF'         },
  { value: 'gfs_seamless',                  label: 'NOAA'          },
  { value: 'icon_seamless',                 label: 'DWD ICON'      },
  { value: 'italia_meteo_arpae_icon_2i',    label: 'ARPAE ICON-2I' },
  { value: 'merged',                        label: 'Merged'        },
]

const PAGES = [
  { key: 'weather', label: 'Previsioni',   icon: '🌤️' },
  { key: 'air',     label: 'Qualità aria', icon: '🌬️' },
  { key: 'pollen',  label: 'Pollini',      icon: '🌼' },
]

export default function TopBar({
  page,
  onPageChange,
  selectedModel,
  onModelChange,
  onLocationSelect,
  onCurrentLocation,
  gpsLoading,
  clearSignal,
}) {
  return (
    <Navbar className="topbar-nav py-2" sticky="top">
      <Container fluid className="flex-column gap-2">
        <div className="d-flex align-items-center gap-2 w-100 flex-wrap">
          <Navbar.Brand className="topbar-brand me-2 d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🌤️</span>
            <span>Meteo</span>
          </Navbar.Brand>

          <nav className="topbar-menu d-flex gap-1 flex-wrap">
            {PAGES.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`nav-pill ${page === p.key ? 'active' : ''}`}
                onClick={() => onPageChange(p.key)}
                aria-current={page === p.key ? 'page' : undefined}
              >
                <span aria-hidden="true">{p.icon}</span>
                <span className="nav-pill-label">{p.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="d-flex align-items-center gap-2 w-100 flex-wrap">
          <LocationSearch onLocationSelect={onLocationSelect} clearSignal={clearSignal} />

          <Button
            className="btn-gps"
            size="sm"
            onClick={onCurrentLocation}
            disabled={gpsLoading}
            title="Usa la posizione corrente del dispositivo"
          >
            {gpsLoading
              ? <><span className="spinner-border spinner-border-sm me-1" role="status" /> Rilevamento...</>
              : <>📍 Posizione attuale</>
            }
          </Button>

                    {page === 'weather' && (
            <Form.Select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              style={{ width: 'auto', minWidth: '130px', flexShrink: 0 }}
              size="sm"
              aria-label="Modello meteo"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </Form.Select>
          )}
        </div>
      </Container>
    </Navbar>
  )
}
