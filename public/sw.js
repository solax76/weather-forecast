const VERSION = '%APP_VERSION%'
const CACHE_NAME = `meteo-${VERSION}`
const STATIC_ASSETS = [
  '/weather/',
  '/weather/index.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Bypass non-GET and cross-origin API calls (Open-Meteo, geocoding)
  if (event.request.method !== 'GET') return
  if (!url.origin.includes(self.location.hostname) && !url.pathname.startsWith('/weather')) return

  const isApi = url.hostname !== self.location.hostname

  // Network-first for cross-origin API calls
  if (isApi) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
    return
  }

  // Network-first for navigations and index.html so new builds (with new
  // asset hashes) are picked up immediately; fall back to cache when offline.
  const isNavigation =
    event.request.mode === 'navigate' ||
    url.pathname === '/weather/' ||
    url.pathname === '/weather/index.html'

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() =>
          caches.match(event.request).then((c) => c || caches.match('/weather/index.html'))
        )
    )
    return
  }

  // Cache-first for hashed static assets (they are immutable per build)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
    })
  )
})
