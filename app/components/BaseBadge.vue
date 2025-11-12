<script lang="ts" setup>
const props = defineProps();
</script>

<template>
  <div
       class="bg-dark rounded-md border-4 border-white p-8 mx-auto flex flex-col items-stretch tracking-wider leading-8 text-xl">
    <div class="text-accent text-center text-9xl pt-4 pb-6">
      <slot name="icon" />
    </div>
    <div class="text-accent text-center text-3xl p-4">
      <slot name="heading" />
    </div>
    <div class="text-light text-center p-4 text-2xl">
      <slot name="details" />
    </div>
  </div>
</template>

<style scoped>

</style>
