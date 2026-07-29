import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        // NÃO faz cache de arquivos JS/CSS/HTML (apenas imagens e fontes)
        globPatterns: ['**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2}'],
        // Limpa caches antigos automaticamente
        cleanupOutdatedCaches: true,
        // Força atualização imediata do service worker
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        name: 'Aromaê - Sua Vitrine de Perfumes',
        short_name: 'Aromaê',
        description: 'Monte sua loja virtual de perfumes',
        theme_color: '#C17B7B',
        background_color: '#FDFBF7',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  server: { port: 3000 }
});
