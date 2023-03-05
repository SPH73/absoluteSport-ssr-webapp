<script setup>
const props = defineProps(["review"]);
</script>

<template>
  <div
    class="flex flex-col container px-20 items-center justify-center text-center"
  >
    <h5 class="text-xl tracking-wider text-accent mt-20">
      {{ review.school }}
    </h5>
    <p class="text-xl text-light md:text-2xl tracking-wider max-w-prose">
      {{ review.comment }}
    </p>
    <h5 class="text-xl tracking-wider text-accent">
      {{ review.name }} - {{ review.designation }}
    </h5>
  </div>
</template>
