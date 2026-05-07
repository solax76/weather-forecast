export const WMO_CODES = {
  0:  { description: 'Cielo sereno',             icon: '☀️'  },
  1:  { description: 'Prevalentemente sereno',   icon: '🌤️' },
  2:  { description: 'Parzialmente nuvoloso',    icon: '⛅'  },
  3:  { description: 'Coperto',                  icon: '☁️'  },
  45: { description: 'Nebbia',                   icon: '🌫️' },
  48: { description: 'Nebbia con brina',         icon: '🌫️' },
  51: { description: 'Pioggerella leggera',      icon: '🌦️' },
  53: { description: 'Pioggerella moderata',     icon: '🌦️' },
  55: { description: 'Pioggerella intensa',      icon: '🌧️' },
  56: { description: 'Pioggerella gelata',       icon: '🌨️' },
  57: { description: 'Pioggerella gelata intensa', icon: '🌨️' },
  61: { description: 'Pioggia leggera',          icon: '🌧️' },
  63: { description: 'Pioggia moderata',         icon: '🌧️' },
  65: { description: 'Pioggia intensa',          icon: '🌧️' },
  66: { description: 'Pioggia gelata',           icon: '🌨️' },
  67: { description: 'Pioggia gelata intensa',   icon: '🌨️' },
  71: { description: 'Neve leggera',             icon: '🌨️' },
  73: { description: 'Neve moderata',            icon: '🌨️' },
  75: { description: 'Neve intensa',             icon: '❄️'  },
  77: { description: 'Granelli di neve',         icon: '🌨️' },
  80: { description: 'Rovesci leggeri',          icon: '🌦️' },
  81: { description: 'Rovesci moderati',         icon: '🌧️' },
  82: { description: 'Rovesci intensi',          icon: '⛈️'  },
  85: { description: 'Rovesci di neve leggeri',  icon: '🌨️' },
  86: { description: 'Rovesci di neve intensi',  icon: '❄️'  },
  95: { description: 'Temporale',                icon: '⛈️'  },
  96: { description: 'Temporale con grandine',   icon: '⛈️'  },
  99: { description: 'Temporale con grandine forte', icon: '⛈️' },
}

export function getWeatherInfo(code) {
  return WMO_CODES[code] ?? { description: 'Non disponibile', icon: '❓' }
}
