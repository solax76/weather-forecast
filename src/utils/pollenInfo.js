// Tipi di polline forniti da Open-Meteo (disponibili solo per l'Europa)
// e scala di intensità generica espressa in grani/m³.

export const POLLEN_TYPES = [
  { key: 'alder_pollen',   label: 'Ontano',     icon: '🌳' },
  { key: 'birch_pollen',   label: 'Betulla',    icon: '🌳' },
  { key: 'grass_pollen',   label: 'Graminacee', icon: '🌾' },
  { key: 'mugwort_pollen', label: 'Artemisia',  icon: '🌿' },
  { key: 'olive_pollen',   label: 'Olivo',      icon: '🫒' },
  { key: 'ragweed_pollen', label: 'Ambrosia',   icon: '🌼' },
]

export function getPollenLevel(value) {
  if (value == null) return { label: 'N/D',        color: '#9ca3af', pct: 0 }
  if (value <= 0)    return { label: 'Assente',     color: '#10b981', pct: 0 }
  if (value < 10)    return { label: 'Basso',       color: '#84cc16', pct: 25 }
  if (value < 30)    return { label: 'Moderato',    color: '#f59e0b', pct: 50 }
  if (value < 100)   return { label: 'Alto',        color: '#f97316', pct: 75 }
  return { label: 'Molto alto', color: '#ef4444', pct: 100 }
}
