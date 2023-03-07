<script setup>
const props = defineProps(["review"]);
const snippet = computed(() => {
  return props.review.comment.substring(0, 250) + "...";
});
</script>

<template>
  <div
    class="text-light flex flex-col justify-center items-center mx-16 py-4 h-full"
  >
    <div class="flex space-x-1">
      <font-awesome-icon
        v-for="star in review.rating"
        class="text-accent text-xl"
        :icon="['fas', 'star']"
      />
    </div>
    <p class="text-md md:text-lg lg:text-xl text-light max-w-prose font-bold">
      {{ review.comment.length < 250 ? review.comment : snippet }}
    </p>

    <h5 class="text-xl tracking-wider text-accent">
      -&nbsp;{{ review.name }}&nbsp;-
    </h5>
  </div>
</template>
