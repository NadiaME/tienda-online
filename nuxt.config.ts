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
      adminPassword: process.env.ADMIN_PASSWORD,
      mpPublicKey: process.env.MP_PUBLIC_KEY,
      storeId: process.env.STORE_ID ?? 'tiendaA',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    },
    mpAccessToken: process.env.MP_ACCESS_TOKEN,
    mpSuccessUrl: process.env.MP_SUCCESS_URL,
    mpFailureUrl: process.env.MP_FAILURE_URL,
    mpPendingUrl: process.env.MP_PENDING_URL
  },

  vite: {
    server: {
      watch: {
        // 🔥 evita loops infinitos (.nuxt rebuild)
        ignored: ['**/.nuxt/**', '**/node_modules/**']
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          // 🔇 silencia warning legacy sass
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },

    optimizeDeps: {
      include: []
    }
  },

  image: {
    format: ['avif', 'webp'],
    quality: 80,
    screens: {
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1280
    }
  },

  // mejora HMR en Windows
  experimental: {
    watcher: 'chokidar',
  },

  routeRules: {
    '/': { isr: 300 },
    '/productos': { isr: 120 },
    '/producto/**': { isr: 60 },
  },

  compatibilityDate: '2026-02-18'
})