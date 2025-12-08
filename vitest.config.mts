import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";

export default defineConfig({
  test: {
    globals: true,
    // Split between plain Node tests and Nuxt-runtime tests
    projects: [
      // Plain Node-based unit tests
      {
        test: {
          name: "unit",
          include: ["test/unit/**/*.{test,spec}.ts"],
          environment: "node",
        },
      },
      // Nuxt runtime tests (components, composables using useRouter, etc.)
      defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/**/*.{test,spec}.ts"],
          environment: "nuxt",
        },
      }),
    ],
  },
});
