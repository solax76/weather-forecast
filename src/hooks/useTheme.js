import { useState, useEffect } from 'react'

const STORAGE_KEY = 'theme_preference'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function loadPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'auto'
  } catch {
    return 'auto'
  }
}

export function useTheme() {
  const [preference, setPreferenceState] = useState(loadPreference)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  // Segui i cambi di tema del sistema operativo
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resolvedTheme = preference === 'auto' ? systemTheme : preference

  // Applica l'attributo data-theme al root del documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme])

  function setPreference(pref) {
    setPreferenceState(pref)
    try {
      localStorage.setItem(STORAGE_KEY, pref)
    } catch {}
  }

  return { preference, resolvedTheme, setPreference }
}
