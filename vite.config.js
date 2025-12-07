import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const certDir = path.resolve(__dirname, 'certs')
const keyPath = path.join(certDir, 'localhost-key.pem')
const certPath = path.join(certDir, 'localhost.pem')

let httpsConfig = false
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  httpsConfig = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
}

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: false,  // Disable minification (removes terser requirement)
  },
  server: {
    https: httpsConfig,
    host: true,
    port: 5176
  }
})