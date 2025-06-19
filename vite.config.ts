import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  base: '/',  // This ensures assets are loaded correctly on GitHub Pages
}) 