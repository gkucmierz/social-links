import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Deterministic port for social-links via @gkucmierz/dport is 20104
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 20104,
    strictPort: true,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
