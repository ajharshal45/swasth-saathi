const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/_offline',
  },
  // CRITICAL: Exclude files that don't exist in Next.js 16 build output
  // This prevents "bad-precaching-response" errors that crash the service worker
  buildExcludes: [
    /dynamic-css-manifest\.json$/,  // Does not exist in Next.js 16
    /middleware-manifest\.json$/,    // May not exist
    /build-manifest\.json$/,         // Internal file
    /_buildManifest\.js$/,           // Already handled differently
    /_ssgManifest\.js$/,             // Already handled differently
  ],
  // Explicitly cache key pages for offline use
  runtimeCaching: [
    {
      // Cache the start URL (homepage) with CacheFirst for reliable offline
      urlPattern: /^\/$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'start-url-cache',
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      // Cache symptoms page
      urlPattern: /^\/symptoms$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      // Cache all Next.js static assets (JS, CSS chunks)
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      // Cache images and icons
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-assets',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
  // Empty turbopack config to silence the warning
  // We use --webpack flag in build script because next-pwa requires webpack
  turbopack: {},
});
