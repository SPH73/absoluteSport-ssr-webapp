// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { resolve } from "path";
export default defineNuxtConfig({
  alias: {
    "@": resolve(__dirname, "/"),
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "en",
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
    ],
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-swiper",
    "nuxt-security",
  ],
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
      gcSandboxAccessToken: process.env.GC_SANDBOX_ACCESS_TOKEN,
    },
    public: {
      atBaseId: process.env.AT_BASE_ID,
      mcAudId: process.env.MC_AUDIENCE_ID,
      mcServer: process.env.MC_SERVER_PREFIX,
    },
  },
});
