// Indice europeo di qualità dell'aria (EAQI) e metadati inquinanti.

export function getAqiCategory(aqi) {
  if (aqi == null) return { label: 'N/D', color: '#9ca3af' }
  if (aqi <= 20)  return { label: 'Buona',                color: '#10b981' }
  if (aqi <= 40)  return { label: 'Discreta',             color: '#84cc16' }
  if (aqi <= 60)  return { label: 'Moderata',             color: '#f59e0b' }
  if (aqi <= 80)  return { label: 'Scarsa',               color: '#f97316' }
  if (aqi <= 100) return { label: 'Molto scarsa',         color: '#ef4444' }
  return { label: 'Estremamente scarsa', color: '#7c3aed' }
}

export function getUvCategory(uv) {
  if (uv == null) return { label: 'N/D', color: '#9ca3af' }
  if (uv < 3)  return { label: 'Basso',      color: '#10b981' }
  if (uv < 6)  return { label: 'Moderato',   color: '#f59e0b' }
  if (uv < 8)  return { label: 'Alto',       color: '#f97316' }
  if (uv < 11) return { label: 'Molto alto', color: '#ef4444' }
  return { label: 'Estremo', color: '#7c3aed' }
}

export const POLLUTANTS = [
  { key: 'pm2_5',            label: 'PM2.5',  unit: 'µg/m³', icon: '🌫️' },
  { key: 'pm10',             label: 'PM10',   unit: 'µg/m³', icon: '🌁' },
  { key: 'ozone',            label: 'Ozono (O₃)',           unit: 'µg/m³', icon: '🟦' },
  { key: 'nitrogen_dioxide', label: 'Biossido di azoto (NO₂)', unit: 'µg/m³', icon: '🚗' },
  { key: 'sulphur_dioxide',  label: 'Biossido di zolfo (SO₂)', unit: 'µg/m³', icon: '🏭' },
  { key: 'carbon_monoxide',  label: 'Monossido di carbonio (CO)', unit: 'µg/m³', icon: '💨' },
]
