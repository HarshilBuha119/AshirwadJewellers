import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'vscode-4464ebd2-ec11-47c5-9a01-c8a438228e2c.cluster-0.preview.emergentcf.cloud',
      '192.168.1.22',
      'ashirawd.onrender.com'
    ]
  }
})
