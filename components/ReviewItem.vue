<script setup>
defineProps(["review"]);
</script>

<template>
  <div
    class="text-light flex flex-col text-center items-center justify-center backdrop-blur-sm backdrop-grayscale rounded-lg p-8 md:px-2"
  >
    <p class="text-2xl tracking-wider max-w-prose">{{ review.comment }}</p>
    <div>
      <font-awesome-icon
        v-for="star in review.rating"
        class="text-accent text-xl p-1"
        :icon="['fas', 'star']"
      />
    </div>
    <h5 class="text-xl tracking-wider">-&nbsp;{{ review.name }}&nbsp;-</h5>
  </div>
</template>

<style scoped></style>
