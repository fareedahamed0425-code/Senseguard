import { defineConfig, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Custom plugin to write the actual port to a file for Electron to read
const writePortPlugin = () => ({
  name: 'write-port',
  configureServer(server: ViteDevServer) {
    const portFilePath = path.join(__dirname, 'dev-port.txt')
    if (fs.existsSync(portFilePath)) {
      fs.unlinkSync(portFilePath)
    }
    server.httpServer?.once('listening', () => {
      const address = server.httpServer?.address()
      const port = typeof address === 'string' ? address : address?.port
      if (port) {
        fs.writeFileSync(portFilePath, port.toString())
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    writePortPlugin(),
  ],
  server: {
    port: 5173,
    strictPort: false, // Automatically try next port if 5173 is busy
  }
})
