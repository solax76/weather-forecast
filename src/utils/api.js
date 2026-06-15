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

// Modelli base usati dal modello "merged" (media per parametro).
export const BASE_MODELS = [
  'ecmwf_ifs025',
  'gfs_seamless',
  'icon_seamless',
  'italia_meteo_arpae_icon_2i',
]

const DAILY_VARS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'sunrise',
  'sunset',
]

const HOURLY_VARS = [
  'weather_code',
  'temperature_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'wind_speed_10m',
  'relative_humidity_2m',
]

export async function fetchWeather(lat, lon, model) {
  const merged = model === 'merged'
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: DAILY_VARS.join(','),
    hourly: HOURLY_VARS.join(','),
    timezone: 'auto',
    forecast_days: 7,
  })

  if (merged) {
    params.append('models', BASE_MODELS.join(','))
  } else if (model) {
    params.append('models', model)
  }

  const res = await fetch(`${WEATHER_URL}?${params}`)
  if (!res.ok) throw new Error('Errore API meteo')
  const data = await res.json()
  return merged ? mergeModels(data) : data
}

// Le variabili categoriali/temporali non vanno mediate.
const MODE_VARS = new Set(['weather_code'])
const FIRST_VARS = new Set(['sunrise', 'sunset'])

// Quando si richiedono più modelli, Open-Meteo suffissa ogni variabile con
// `_<modello>`. Qui ricostruiamo le serie "piatte" facendo la media (o la moda
// per i codici meteo) tra i modelli disponibili a ogni indice temporale.
function mergeModels(data) {
  return {
    ...data,
    daily: mergeGroup(data.daily, DAILY_VARS),
    hourly: mergeGroup(data.hourly, HOURLY_VARS),
  }
}

function mergeGroup(group, vars) {
  if (!group) return group
  const out = { time: group.time }
  for (const v of vars) {
    const series = BASE_MODELS
      .map((m) => group[`${v}_${m}`])
      .filter((s) => Array.isArray(s))
    if (series.length === 0) {
      if (group[v] != null) out[v] = group[v]
      continue
    }
    out[v] = combineSeries(v, series)
  }
  return out
}

function combineSeries(varName, series) {
  const len = Math.max(...series.map((s) => s.length))
  const out = new Array(len)
  for (let i = 0; i < len; i++) {
    const vals = series.map((s) => s[i]).filter((x) => x != null)
    if (vals.length === 0) {
      out[i] = null
    } else if (FIRST_VARS.has(varName)) {
      out[i] = vals[0]
    } else if (MODE_VARS.has(varName)) {
      out[i] = mode(vals)
    } else {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length
      out[i] = Math.round(avg * 10) / 10
    }
  }
  return out
}

function mode(vals) {
  const counts = new Map()
  let best = vals[0]
  let bestCount = 0
  for (const v of vals) {
    const c = (counts.get(v) ?? 0) + 1
    counts.set(v, c)
    if (c > bestCount) {
      bestCount = c
      best = v
    }
  }
  return best
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
      'uv_index',
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
