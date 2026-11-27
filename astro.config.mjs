// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://k1w106.github.io',
  base: '/store',
  vite: {
    plugins: [tailwindcss()],
  },
});
