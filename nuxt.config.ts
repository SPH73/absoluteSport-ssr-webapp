// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // Compatibility date for Nitro & Vercel environments
  compatibilityDate: "2025-09-17",

  // App configuration
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: { lang: "en-GB" },
    },
  },

  // Devtools (top-level in Nuxt 4)
  devtools: { enabled: true },

  // Build settings
  build: {
    transpile: [
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/vue-fontawesome",
      "gocardless-nodejs",
    ],
  },

  // Modules
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "nuxt-swiper"],

  // TailwindCSS

  // Global CSS
  css: ["/assets/css/global.css"],

  // Runtime configuration
  runtimeConfig: {
    private: {
      atApiKey: process.env.AT_API_KEY,
      mcApiKey: process.env.MC_API_KEY,
      gcAccessToken: process.env.GC_ACCESS_TOKEN,
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      atBaseId: process.env.AT_BASE_ID,
      mcAudId: process.env.MC_AUDIENCE_ID,
      mcServer: process.env.MC_SERVER_PREFIX,
    },
  },

  // Nitro configuration (top-level, outside runtimeConfig)
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
    },
  },
});
