<script setup>
const props = defineProps(["review"]);
const snippet = computed(() => {
  return props.review.comment.substring(0, 200) + "...";
});
</script>

<template>
  <div
    class="text-light flex flex-col justify-center items-center h-full my-12"
  >
    <div class="flex space-x-1">
      <font-awesome-icon
        v-for="star in review.rating"
        class="text-accent text-xl"
        :icon="['fas', 'star']"
      />
    </div>
    <p class="text-light text-sm md:text-md lg:text-lg max-w-prose font-bold">
      {{ review.comment.length < 200 ? review.comment : snippet }}
    </p>

    <h5 class="text-xl tracking-wider text-accent">
      -&nbsp;{{ review.name }}&nbsp;-
    </h5>
  </div>
</template>
