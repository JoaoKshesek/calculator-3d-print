/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Testes da lógica de cálculo rodam em Node puro (sem DOM)
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
