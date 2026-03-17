export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['assets/scss/main.scss'],

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt'
  ],

  supabase: {
    redirect: false
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  runtimeConfig: {
    public: {
      mpPublicKey: process.env.MP_PUBLIC_KEY ?? '',
      storeId: process.env.STORE_ID ?? '',
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? ''
    },

    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
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
  },

  compatibilityDate: '2026-02-25'
})