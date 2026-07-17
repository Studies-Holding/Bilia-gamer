import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// Offline-first requis pour le joueur (Bilia-Child) — cf. AFG-DT-000 §3
// (principe 10) et §4.2, gap comblé le 2026-07-17 (AFG-DT-004 §4).
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        id: '/',
        name: 'Bilia — Bilia-Child',
        short_name: 'Bilia',
        description: 'Plateforme de jeu intergénérationnelle africaine — expérience joueur, offline-first.',
        theme_color: '#aa3bff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        // Mode dégradé/offline (cf. AFG-DT-000 §5 "Résilience réseau") : les
        // assets statiques sont servis cache-first, les appels API réseau
        // d'abord (les données de jeu doivent rester fraîches quand le
        // réseau est là) avec repli cache si hors-ligne.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/v1\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // activer ponctuellement pour tester le SW en dev
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
