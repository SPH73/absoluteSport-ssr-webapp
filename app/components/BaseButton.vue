<script lang="ts" setup>
defineProps(["type", "theme"]);
</script>

<template>
  <div>
    <button :type="type" :theme="theme">
      <slot />
    </button>
  </div>
</template>
