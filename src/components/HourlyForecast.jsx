import { getWeatherInfo } from '../utils/weatherCodes'

const DAYS_IT   = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
const MONTHS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']

const SLOTS = [0, 3, 6, 9, 12, 15, 18, 21]

export default function HourlyForecast({ hourly, dayIndex, date, isToday }) {
  const d = new Date(date + 'T12:00:00')
  const dayLabel  = isToday ? 'Oggi' : DAYS_IT[d.getDay()]
  const dateLabel = `${d.getDate()} ${MONTHS_IT[d.getMonth()]}`

  const now = new Date()
  const nearestSlot = Math.floor(now.getHours() / 3) * 3

  const startIdx = dayIndex * 24

  const slots = SLOTS.map((h) => {
    const i = startIdx + h
    const rawTime = hourly.time?.[i]
    const timeStr = rawTime ? rawTime.split('T')[1] : `${String(h).padStart(2, '0')}:00`
    return {
      hour: h,
      time: timeStr,
      weatherCode: hourly.weather_code?.[i] ?? 0,
      temp:        hourly.temperature_2m?.[i]          ?? null,
      feelsLike:   hourly.apparent_temperature?.[i]    ?? null,
      precipProb:  hourly.precipitation_probability?.[i] ?? null,
      precip:      hourly.precipitation?.[i]           ?? null,
      wind:        hourly.wind_speed_10m?.[i]          ?? null,
      humidity:    hourly.relative_humidity_2m?.[i]    ?? null,
    }
  })

  return (
    <div className="hourly-panel mt-3">
      <div className="d-flex align-items-baseline gap-2 mb-3 flex-wrap">
        <span className="hourly-panel-title">⏱️ Previsioni ogni 3 ore</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          {dayLabel}, {dateLabel}
        </span>
      </div>

      <div className="hourly-scroll">
        <div className="d-flex gap-2">
          {slots.map((slot) => {
            const { icon, description } = getWeatherInfo(slot.weatherCode)
            const isCurrent = isToday && slot.hour === nearestSlot

            return (
              <div
                key={slot.hour}
                className={`hourly-card ${isCurrent ? 'is-current-hour' : ''}`}
                title={description}
              >
                <div className="hourly-time" style={{ color: isCurrent ? 'var(--text-accent)' : undefined, fontWeight: isCurrent ? 700 : 400 }}>
                  {slot.time}
                  {isCurrent && <span className="ms-1" style={{ fontSize: '0.6rem' }}>◉</span>}
                </div>

                <div className="hourly-icon">{icon}</div>

                <div className="hourly-temp">
                  {slot.temp != null ? `${Math.round(slot.temp)}°` : '—'}
                </div>

                {slot.feelsLike != null && (
                  <div className="hourly-feels">
                    Perc. {Math.round(slot.feelsLike)}°
                  </div>
                )}

                <div className="hourly-stats">
                  {slot.precipProb != null && (
                    <span>💧 {slot.precipProb}%</span>
                  )}
                  {slot.precip != null && slot.precip > 0 && (
                    <span>🌧️ {slot.precip.toFixed(1)}&thinsp;mm</span>
                  )}
                  {slot.wind != null && (
                    <span>💨 {Math.round(slot.wind)}&thinsp;km/h</span>
                  )}
                  {slot.humidity != null && (
                    <span>💦 {slot.humidity}%</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
