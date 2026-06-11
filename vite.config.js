import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// Injects the package.json version into public/sw.js (replaces %APP_VERSION%),
// so the service worker cache name bumps automatically on every release.
function swVersion(version) {
  const placeholder = /%APP_VERSION%/g
  return {
    name: 'sw-version',
    // Dev: serve sw.js with the version already substituted
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').replace(/\?.*$/, '')
        if (path.endsWith('/sw.js')) {
          try {
            const sw = readFileSync('./public/sw.js', 'utf-8').replace(placeholder, version)
            res.setHeader('Content-Type', 'application/javascript')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(sw)
            return
          } catch {
            // fall through to default handling
          }
        }
        next()
      })
    },
    // Build: rewrite the sw.js already copied into the output dir
    closeBundle() {
      const out = './dist/sw.js'
      try {
        const sw = readFileSync(out, 'utf-8').replace(placeholder, version)
        writeFileSync(out, sw)
      } catch {
        // dist/sw.js not present — nothing to do
      }
    },
  }
}

export default defineConfig({
  base: "/weather",
  plugins: [react(), swVersion(version)],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
})
