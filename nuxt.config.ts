// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  build: {
    transpile: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-brands-svg-icons',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/free-regular-svg-icons',
      '@fortawesome/vue-fontawesome',
    ]
  },
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
      atApiKey: process.env.AT_API_KEY,
    },
    public: {
      atBaseId: process.env.AT_BASE_ID
    }
  }
})
