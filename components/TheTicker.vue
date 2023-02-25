<script lang="ts" setup>
const props = defineProps(["cms"]);
</script>

<template>
  <div
    class="bg-secondary w-full text-light font-mulish uppercase p-1 print:hidden"
  >
    <h4 class="text-center">{{ cms.content }}</h4>
  </div>
</template>
