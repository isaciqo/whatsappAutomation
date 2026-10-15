import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // O chunk do xlsx (~500 kB) é carregado sob demanda, então o aviso não se aplica.
  build: { chunkSizeWarningLimit: 600 },
})
