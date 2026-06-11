import { useState, useEffect } from 'react'

// Hook condiviso dalle pagine: data una località, esegue la fetch fornita e
// gestisce loading/errore. extraDep permette di rieseguire la fetch quando
// cambia un parametro aggiuntivo (es. il modello meteo).
export function useGeoData(fetchFn, location, extraDep) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!location) {
      setData(null)
      setError(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)
    setData(null)

    fetchFn(location.lat, location.lon)
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, extraDep])

  return { data, loading, error }
}
