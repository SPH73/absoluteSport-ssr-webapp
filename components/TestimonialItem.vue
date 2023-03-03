<script setup>
const props = defineProps(["review"]);
</script>

<template>
  <div
    class="text-light flex flex-col text-center items-center justify-center rounded-lg px-16 py-4"
  >
    <h5 class="text-xl tracking-wider text-accent">
      {{ review.school }}
    </h5>
    <p class="text-xl text-light md:text-2xl tracking-wider max-w-prose">
      {{ review.comment }}
    </p>
    <h5 class="text-xl tracking-wider text-accent">
      -&nbsp;{{ review.name }} : {{ review.designation }} &nbsp;-
    </h5>
  </div>
</template>

<style scoped></style>
