<script setup>
const props = defineProps(["review"]);
const snippet = computed(() => {
  return props.review.comment.substring(0, 250) + "...";
});
</script>

<template>
  <div class="text-light">
    <div class="flex space-x-1">
      <font-awesome-icon
        v-for="star in review.rating"
        class="text-accent text-xl"
        :icon="['fas', 'star']"
      />
    </div>
    <p class="text-sm text-light tracking-wider max-w-prose">
      {{ review.comment.length < 250 ? review.comment : snippet }}
    </p>

    <h5 class="text-xl tracking-wider text-accent">
      -&nbsp;{{ review.name }}&nbsp;-
    </h5>
  </div>
</template>
