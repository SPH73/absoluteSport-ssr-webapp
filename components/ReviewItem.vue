<script setup>
const props = defineProps(["review"]);
const snippet = computed(() => {
  return props.review.comment.substring(0, 300) + "...";
});
</script>

<template>
  <div class="text-light">
    <div class="">
      <font-awesome-icon
        v-for="star in review.rating"
        class="text-accent text-xl px-1 py-0"
        :icon="['fas', 'star']"
      />
    </div>
    <p class="text-sm text-light tracking-wider max-w-prose">
      {{ review.comment.length < 300 ? review.comment : snippet }}
    </p>

    <h5 class="text-xl tracking-wider text-accent">
      -&nbsp;{{ review.name }}&nbsp;-
    </h5>
  </div>
</template>

<style scoped></style>
