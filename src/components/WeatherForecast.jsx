import { useState, useEffect, useRef } from 'react'
import { Badge } from 'react-bootstrap'
import DayCard from './DayCard'
import HourlyForecast from './HourlyForecast'

const MODEL_LABELS = {
  ecmwf_ifs025: 'ECMWF IFS',
  gfs_seamless:  'NOAA GFS',
  icon_seamless: 'DWD ICON',
}

export default function WeatherForecast({ data, location, model }) {
  const { daily, hourly } = data
  const [selectedDay, setSelectedDay] = useState(0)
  const hourlyRef = useRef(null)

  // Reset to today when new data arrives (new location / model change)
  useEffect(() => {
    setSelectedDay(0)
  }, [data])

  function handleDayClick(idx) {
    setSelectedDay((prev) => (prev === idx ? null : idx))
  }

  useEffect(() => {
    if (selectedDay !== null && hourlyRef.current) {
      hourlyRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedDay])

  return (
    <div className="mt-3">
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
          <Badge bg="primary" style={{ opacity: 0.8, fontSize: '0.75rem' }}>
            {MODEL_LABELS[model] ?? model}
          </Badge>
        </div>
      </div>

      <div className="weekly-scroll">
        {daily.time.map((date, idx) => (
          <div key={date} className="weekly-scroll-item">
            <DayCard
              date={date}
              weatherCode={daily.weather_code[idx]}
              tempMax={daily.temperature_2m_max[idx]}
              tempMin={daily.temperature_2m_min[idx]}
              precipProbability={daily.precipitation_probability_max?.[idx] ?? null}
              precipSum={daily.precipitation_sum[idx]}
              windSpeed={daily.wind_speed_10m_max[idx]}
              sunrise={daily.sunrise?.[idx]}
              sunset={daily.sunset?.[idx]}
              isToday={idx === 0}
              isSelected={selectedDay === idx}
              onClick={() => handleDayClick(idx)}
            />
          </div>
        ))}
      </div>

      {selectedDay !== null && hourly && (
        <div ref={hourlyRef}>
          <HourlyForecast
            hourly={hourly}
            dayIndex={selectedDay}
            date={daily.time[selectedDay]}
            isToday={selectedDay === 0}
          />
        </div>
      )}

      <p className="text-center mt-4" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Dati forniti da{' '}
        <a href="https://open-meteo.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
          Open-Meteo
        </a>
        {' '}· CC BY 4.0
        {' '}· v{__APP_VERSION__}
      </p>
    </div>
  )
}
