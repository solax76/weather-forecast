import { Card } from 'react-bootstrap'
import { getWeatherInfo } from '../utils/weatherCodes'

const DAYS_IT  = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
const MONTHS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']

function formatTime(isoString) {
  if (!isoString) return null
  const d = new Date(isoString)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export default function DayCard({
  date, weatherCode, tempMax, tempMin,
  precipProbability, precipSum, windSpeed,
  sunrise, sunset, isToday, isSelected, onClick,
}) {
  const d = new Date(date + 'T12:00:00')
  const dayLabel  = isToday ? 'Oggi' : DAYS_IT[d.getDay()]
  const dateLabel = `${d.getDate()} ${MONTHS_IT[d.getMonth()]}`
  const { icon, description } = getWeatherInfo(weatherCode)

  const hasPrecip = typeof precipProbability === 'number' && precipProbability !== null

  return (
    <Card
      className={`day-card ${isToday ? 'today-card' : ''} ${isSelected ? 'selected-card' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body className="d-flex flex-column align-items-center p-3 gap-1">
        <div className="fw-bold" style={{ fontSize: '1.05rem', color: isToday ? 'var(--text-accent)' : 'var(--text-primary)' }}>
          {dayLabel}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{dateLabel}</div>

        <span className="weather-icon my-2">{icon}</span>

        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          minHeight: '2.6em',
          display: 'flex',
          alignItems: 'center',
        }}>
          {description}
        </div>

        <div className="d-flex gap-3 mt-1">
          <span className="temp-max" style={{ fontSize: '1.15rem' }}>
            {tempMax != null ? `${Math.round(tempMax)}°` : '—'}
          </span>
          <span className="temp-min" style={{ fontSize: '1.15rem' }}>
            {tempMin != null ? `${Math.round(tempMin)}°` : '—'}
          </span>
        </div>

        <div className="d-flex flex-column align-items-center mt-2 gap-1">
          {hasPrecip && (
            <span className="stat-item">
              <span>💧</span>
              <span>{precipProbability}%</span>
            </span>
          )}
          {precipSum != null && precipSum > 0 && (
            <span className="stat-item">
              <span>🌧️</span>
              <span>{precipSum.toFixed(1)} mm</span>
            </span>
          )}
          {windSpeed != null && (
            <span className="stat-item">
              <span>💨</span>
              <span>{Math.round(windSpeed)} km/h</span>
            </span>
          )}
          {isToday && sunrise && (
            <span className="stat-item">
              <span>🌅</span>
              <span>{formatTime(sunrise)}</span>
              <span style={{ margin: '0 2px', opacity: 0.5 }}>·</span>
              <span>🌇</span>
              <span>{formatTime(sunset)}</span>
            </span>
          )}
        </div>
        <div className="mt-2" style={{ fontSize: '0.65rem', color: isSelected ? 'var(--selected-indicator)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>
          {isSelected ? '▲ chiudi' : '▼ orario'}
        </div>
      </Card.Body>
    </Card>
  )
}
