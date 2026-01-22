// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  runtimeConfig: {
    // Server-only (private) config
    // These are populated from env vars: NUXT_VATSIM_OAUTH_URL, etc.
    vatsimOauthUrl: 'https://auth-dev.vatsim.net',
    vatsimClientId: '',
    vatsimClientSecret: '',
    vatsimRedirectUri: 'http://localhost:3000/api/auth/callback',
    sessionSecret: '',
    // Public (client-accessible) config
    // Populated from: NUXT_PUBLIC_APP_URL
    public: {
      appUrl: 'http://localhost:3000'
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
