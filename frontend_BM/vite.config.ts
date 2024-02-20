import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
     watch: {
       usePolling: true
     },
  },
  define: {
    global: {}
    // Add any global variables or identifiers as needed
    // For example:
    // global: { myGlobalVar: 'window.myGlobalVar' }
  }
 })