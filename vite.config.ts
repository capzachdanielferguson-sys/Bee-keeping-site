import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Normal deploys serve from the domain root with clean URLs (BrowserRouter).
  // `--mode static` builds a portable bundle (relative paths + hash routing)
  // that can be opened from any sub-path or file host.
  base: mode === 'static' ? './' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
}))
