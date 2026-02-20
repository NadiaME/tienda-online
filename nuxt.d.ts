declare module 'nuxt/schema' {
  interface RuntimeConfig {
    mpAccessToken: string
  }

  interface PublicRuntimeConfig {
    storeId: string
    adminPassword?: string
    mpPublicKey?: string
  }
}

export {}
