import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    define: {
      'process.env': env,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Omelettes',
          short_name: 'Omelettes',
          description: 'Omelettes',
          // theme_color: '#0d7a68', 
          
          // Fallback color
          background_color: '#ffffff',
          start_url: '/',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'minimal-ui', 'standalone'],
          icons: [
            {
              src: '/image/logos.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/image/logos.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        injectRegister: 'auto',
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24,
                },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 20,
                },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === 'script',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'js-cache',
              },
            },
            {
              urlPattern: ({ request }) => request.destination === 'style',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'css-cache',
              },
            },
          ],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 4000,
    },
  });
};
