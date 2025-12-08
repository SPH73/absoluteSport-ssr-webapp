// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  compatibilityDate: "2025-11-05",
  nitro: {
    preset: process.env.NODE_ENV === "test" ? "node-server" : "netlify",
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
    },
  },

  routeRules: {
    "/": { prerender: true },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "en-GB",
      },
    },
  },
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
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-swiper",
    "@nuxt/image",
    "@nuxt/test-utils/module",
  ],
  image: {
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/`,
    },
  },

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: true,
  },
  css: ["~/assets/css/global.css"],
  runtimeConfig: {
    private: {
      atApiKey: process.env.AT_API_KEY,
      mcApiKey: process.env.MC_API_KEY,
      airtableDisabled: process.env.AIRTABLE_DISABLED === "true",
      gcAccessToken: process.env.GC_ACCESS_TOKEN,
    },
    cspAirtableToken: process.env.NUXT_CSP_AIRTABLE_TOKEN,
    cspAirtableBaseId: process.env.NUXT_CSP_AIRTABLE_BASE_ID,
    cspAirtableTable: process.env.NUXT_CSP_AIRTABLE_TABLE || "CSP-REPORTS",
    legacyAirtableTable:
      process.env.NUXT_LEGACY_AIRTABLE_TABLE || "LEGACY-URLS",
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      atBaseId: process.env.AT_BASE_ID,
      mcAudId: process.env.MC_AUDIENCE_ID,
      mcServer: process.env.MC_SERVER_PREFIX,
      bookingPaused: process.env.NUXT_PUBLIC_BOOKING_PAUSED === "true",
    },
  },
});
