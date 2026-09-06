import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensures relative assets loading for GitHub Pages, Vercel, Netlify, or subfolders
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
