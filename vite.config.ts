import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://F1-Laboratory/config/
export default defineConfig({
  base: '/F1-Laboratory/',
  plugins: [react()],
})
