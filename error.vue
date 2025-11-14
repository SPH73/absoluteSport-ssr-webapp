<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const reset = () => {
  // Nuxt 4 recommended pattern: clear error state and redirect
  clearError({ redirect: "/" });
};
</script>

<template>
  <NuxtLayout>
    <section
      class="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <h1 class="text-4xl font-bold mb-4">
        <span v-if="props.error?.statusCode === 404">
          404 – Page not found
        </span>
        <span v-else> An error occurred </span>
      </h1>

      <p class="mb-2 text-gray-700">
        <span v-if="props.error?.statusCode === 404">
          The page you’re looking for doesn’t exist or may have been moved.
        </span>
        <span v-else>
          Something went wrong while processing your request. Please try again.
        </span>
      </p>

      <p v-if="props.error?.statusMessage" class="text-xs text-gray-500 mb-1">
        {{ props.error.statusMessage }}
      </p>
      <p v-if="props.error?.url" class="text-xs text-gray-400 mb-6">
        URL: {{ props.error.url }}
      </p>

      <button
        type="button"
        class="underline text-sm hover:text-gray-900"
        @click="reset"
      >
        Go back home
      </button>
    </section>
  </NuxtLayout>
</template>
