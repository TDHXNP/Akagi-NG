import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    target: 'esnext',
    outDir: '../dist/renderer',
    emptyOutDir: true,
    cssMinify: 'lightningcss',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __AKAGI_VERSION__: JSON.stringify(process.env.AKAGI_VERSION ?? 'dev'),
  },
  preview: {
    host: '127.0.0.1',
    port: 24701,
    allowedHosts: true,
  },
});
