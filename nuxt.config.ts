// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { resolve } from "path";
export default defineNuxtConfig({
  compatibilityDate: "2025-11-05",
  nitro: {
    preset: "netlify",
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
    },
  },

  routeRules: {
    "/api/**": { cors: true },
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
    "@nuxt/image-edge",
    // "nuxt-security",
  ],
  image: {
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/`,
    },
  },
  // security: {
  //   headers: {
  //     contentSecurityPolicy: {
  //       "img-src": ["'self'", "https://v5.airtableusercontent.com/"],
  //     },
  //   },
  // },
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
      gcAccessToken: process.env.GC_ACCESS_TOKEN,
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      atBaseId: process.env.AT_BASE_ID,
      mcAudId: process.env.MC_AUDIENCE_ID,
      mcServer: process.env.MC_SERVER_PREFIX,
    },
  },
});
