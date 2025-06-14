import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // ✅ permite testing del manifiesto y SW en `npm run dev`
      },
      manifest: {
        name: 'CD648',
        short_name: 'CD648',
        start_url: '/?v=2', // ✅ fuerza actualización de service worker
        display: 'standalone',
        background_color: '#1c1c1c',
        theme_color: '#1c1c1c',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: '/cd648_icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/cd648_icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})