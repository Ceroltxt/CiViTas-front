// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css:['~/assets/css/main.css'],

  modules: ['@pinia/nuxt', '@nuxt/eslint'],

  runtimeConfig: {
    jwtCookieName: process.env.NUXT_JWT_COOKIE_NAME,
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  nitro: {
    preset: 'vercel',
  },
})
