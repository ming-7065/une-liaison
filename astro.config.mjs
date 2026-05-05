// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.URL || 'http://localhost:4321',
  base: '/',
  server: {
    port: 4321,
    host: '0.0.0.0' // 允許外部設備訪問，用於手機預覽
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
