// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config',
    exposeConfig: true,
  },
  css: [
    '~/assets/css/global.css'
  ],
  runtimeConfig: {
    private: {
      atApiKey: process.env.NUXT_ENV_AT_API_KEY,
    },
    public: {
      atBaseId: process.env.NUXT_ENV_AT_BASE_ID
    }
  }
})
