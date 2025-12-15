// workbox-config.js
module.exports = {
  globDirectory: '.',
  globPatterns: [
    '**/*.{html,js,css,json,png,svg,ico}',
    '!node_modules/**',
    '!scripts/**',
    '!workbox-config.js'
  ],
  swDest: 'service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 يوم
        }
      }
    },
    {
      urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/monaco-editor\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'monaco-editor-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365 // سنة
        }
      }
    }
  ],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [
    /^\/api/,
    /^\/_next/,
    /^\/static/,
    /^\/service-worker\.js$/
  ]
};