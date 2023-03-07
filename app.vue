<script setup lang="ts">
useHead({
  titleTemplate: titleChunk => {
    return titleChunk ? `${titleChunk} - AbsoluteSport` : "AbsoluteSport";
  },
  meta: [
    {
      name: "description",
      content:
        "We provide high quality football training with an F.A. qualified coach and talent scout.",
    },
    {
      name: "og:description",
      content:
        "We provide high quality football training with an F.A. qualified coach and talent scout.",
    },
    {
      property: "og:type",
      content: "website",
    },
    // {property: "og:image", content: data.value.metaImage},
  ],
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
