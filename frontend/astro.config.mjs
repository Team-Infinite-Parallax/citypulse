// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(process.env.PUBLIC_API_URL || 'https://citypulse-backend-520102883931.us-central1.run.app')
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3001'
      }
    }
  }
});