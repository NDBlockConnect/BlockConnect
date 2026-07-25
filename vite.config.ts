import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// BlockConnect org site — GitHub Pages with custom domain.
// base: './' so assets resolve regardless of deployment path.
export default defineConfig({
  base: './',
  build: {
    sourcemap: 'hidden',
    target: 'es2020',
  },
  plugins: [
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    tsconfigPaths(),
  ],
})
