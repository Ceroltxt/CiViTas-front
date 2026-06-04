// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint'],

  // Heroicons como conjunto padrão de ícones do projeto.
  icon: {
    mode: 'svg',
    clientBundle: {
      scan: true,
    },
  },

  // @nuxt/fonts é registrado automaticamente pelo Nuxt UI.
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Poppins', provider: 'google' },
      // Fonte arredondada usada na marca "Civitas" (igual à referência).
      { name: 'Fredoka', provider: 'google', weights: [500, 600, 700] },
    ],
  },

  ui: {
    colorMode: true,
  },

  // Permite acessar o dev server por domínios de túnel (cloudflared/localtunnel)
  // ao compartilhar o link. Afeta apenas o ambiente de desenvolvimento.
  vite: {
    server: {
      allowedHosts: true,
    },
  },

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
