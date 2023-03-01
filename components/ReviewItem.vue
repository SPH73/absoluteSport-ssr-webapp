<script setup>
const props = defineProps(["review"]);
const snippet = computed(() => {
  return props.review.comment.substring(0, 300) + "...";
});
</script>

<template>
  <div
    class="text-light flex flex-col text-center items-center justify-center rounded-lg px-16 py-4"
  >
    <p class="text-xl text-light md:text-2xl tracking-wider max-w-prose">
      {{ review.comment.length < 300 ? review.comment : snippet }}
    </p>
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
