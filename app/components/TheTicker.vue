<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>

<template>
  <div
    class="bg-secondary w-full text-light font-mulish uppercase p-1 print:hidden"
  >
    <h4 class="text-center">
      {{ props.text }}
    </h4>
  </div>
</template>
