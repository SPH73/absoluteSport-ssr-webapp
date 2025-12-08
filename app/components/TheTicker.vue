<script setup lang="ts">
const props = defineProps<{
  text: string;
  to?: string;
}>();
</script>

<template>
  <div class="bg-secondary w-full text-light font-mulish uppercase p-1 print:hidden">
    <NuxtLink
      v-if="props.to"
      :to="props.to"
      class="block text-center underline-offset-2 hover:underline focus-visible:underline"
    >
      {{ props.text }}
    </NuxtLink>
    <h4 v-else class="text-center">
      {{ props.text }}
    </h4>
  </div>
</template>
