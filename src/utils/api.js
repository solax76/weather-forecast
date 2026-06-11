const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

export async function searchLocation(query) {
  const params = new URLSearchParams({
    name: query,
    count: 8,
    language: 'it',
    format: 'json',
  })
  const res = await fetch(`${GEOCODING_URL}?${params}`)
  if (!res.ok) throw new Error('Errore geocoding')
  const data = await res.json()
  return data.results ?? []
}

export async function fetchWeather(lat, lon, model) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
    ].join(','),
    hourly: [
      'weather_code',
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'wind_speed_10m',
      'relative_humidity_2m',
    ].join(','),
    timezone: 'auto',
    forecast_days: 7,
  })

  if (model) {
    params.append('models', model)
  }

  const res = await fetch(`${WEATHER_URL}?${params}`)
  if (!res.ok) throw new Error('Errore API meteo')
  return res.json()
}

export async function fetchAirQuality(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'european_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
    ].join(','),
    timezone: 'auto',
  })

  const res = await fetch(`${AIR_QUALITY_URL}?${params}`)
  if (!res.ok) throw new Error('Errore API qualità aria')
  return res.json()
}

export async function fetchPollen(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'alder_pollen',
      'birch_pollen',
      'grass_pollen',
      'mugwort_pollen',
      'olive_pollen',
      'ragweed_pollen',
    ].join(','),
    timezone: 'auto',
  })

  const res = await fetch(`${AIR_QUALITY_URL}?${params}`)
  if (!res.ok) throw new Error('Errore API pollini')
  return res.json()
}
