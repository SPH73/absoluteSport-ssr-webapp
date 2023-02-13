<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - AbsoluteSport` : "AbsoluteSport New";
  },
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
</template>
<style>
.page-enter-active {
  animation: dissolve 0.4s ease-out reverse;
}
.page-leave-active {
  animation: dissolve 0.4s ease-in;
}

@keyframes dissolve {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
