export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['assets/scss/main.scss'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
      adminPassword: process.env.ADMIN_PASSWORD ?? '',
      mpPublicKey: process.env.MP_PUBLIC_KEY ?? '',
      storeId: process.env.STORE_ID ?? 'tiendaA',
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? ''
    },
    mpAccessToken: process.env.MP_ACCESS_TOKEN ?? '',
    mpSuccessUrl: process.env.MP_SUCCESS_URL ?? '',
    mpFailureUrl: process.env.MP_FAILURE_URL ?? '',
    mpPendingUrl: process.env.MP_PENDING_URL ?? ''
  },

  // 👇 IMPORTANTE: desactivar ISR en dev
  routeRules: process.env.NODE_ENV === 'production'
    ? {
        '/': { isr: 300 },
        '/productos': { isr: 120 },
        '/producto/**': { isr: 60 }
      }
    : {},

  // 👇 estabiliza watcher en Windows
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/.nuxt/**', '**/node_modules/**']
      }
    }
  },

  image: {
    format: ['avif', 'webp'],
    quality: 80
  }
})