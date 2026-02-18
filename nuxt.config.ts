export default defineNuxtConfig({
  css: ['assets/scss/main.scss'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
      adminPassword: process.env.ADMIN_PASSWORD,
      mpPublicKey: process.env.MP_PUBLIC_KEY
    },
    mpAccessToken: process.env.MP_ACCESS_TOKEN,
    mpSuccessUrl: process.env.MP_SUCCESS_URL,
    mpFailureUrl: process.env.MP_FAILURE_URL,
    mpPendingUrl: process.env.MP_PENDING_URL
  },

  compatibilityDate: '2026-02-11'
})