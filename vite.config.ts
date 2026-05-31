import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set base to relative path so build works on static hosts (GitHub Pages, Netlify, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
});
