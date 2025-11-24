<script setup lang="ts">
import type { NuxtError } from "#app";
import { onMounted } from "vue";

const props = defineProps<{
  error: NuxtError;
}>();

const route = useRoute();

const reset = () => {
  clearError({ redirect: "/" });
};

// Client-only 404 logging
if (import.meta.client) {
  onMounted(async () => {
    if (props.error?.statusCode !== 404) {
      return;
    }

    try {
      await $fetch("/api/legacy-404", {
        method: "POST",
        body: {
          url: route.fullPath,
          statusCode: props.error.statusCode,
          statusMessage: props.error.statusMessage,
        },
      });
    } catch (err) {
      console.warn("[legacy-404] Failed to send 404 log", err);
      ``;
    }
  });
}
</script>
<template>
  <NuxtLayout>
    <section
      class="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <h1 class="text-4xl font-bold mb-4">
        <span v-if="props.error?.statusCode === 404">
          404 | Page not found
        </span>
        <span v-else> An error occurred </span>
      </h1>

      <p class="mb-2 text-dark">
        <span v-if="props.error?.statusCode === 404">
          Oops! The page you’re looking for doesn’t exist or may have been
          moved.
        </span>
        <span v-else>
          Something went wrong while processing your request. Please try again.
        </span>
      </p>

      <!-- <p v-if="props.error?.statusMessage" class="text-xs text-gray-500 mb-1">
        {{ props.error.statusMessage }}
      </p> -->

      <!-- Active route not found -->
      <p v-if="route.fullPath" class="text-xl text-white mb-6">
        URL: {{ route.fullPath }}
      </p>

      <button
        type="button"
        class="underline text-2xl text-white"
        @click="reset"
      >
        Go back home
      </button>
    </section>
  </NuxtLayout>
</template>
