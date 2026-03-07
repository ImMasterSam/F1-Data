import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://F1-Data/config/
export default defineConfig({
  base: '/F1-Data',
  plugins: [react()],
})
