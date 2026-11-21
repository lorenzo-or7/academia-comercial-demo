import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/academia-comercial-demo/',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  // pré-empacota tudo de uma vez para evitar duas cópias do React no dev
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-dev-runtime', 'react/jsx-runtime', 'motion/react'],
  },
})
