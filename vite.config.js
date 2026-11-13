import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Keep the REACT_APP_ prefix from Create React App so existing environment
  // variables (e.g. ones set in Netlify) keep working.
  envPrefix: ['VITE_', 'REACT_APP_'],
  build: {
    // Same output directory as Create React App, which Netlify publishes
    outDir: 'build',
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
})
