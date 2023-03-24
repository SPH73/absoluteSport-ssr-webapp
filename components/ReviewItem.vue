<script setup>
const props = defineProps(["review"]);
const snippet = computed(() => {
  return props.review.comment.substring(0, 315) + "...";
});
</script>

<template>
  <div
    class="text-light flex flex-col justify-center items-center h-full my-12 h-full"
  >
    <div class="flex space-x-1">
      <font-awesome-icon
        v-for="star in review.rating"
        class="text-accent text-xl"
        :icon="['fas', 'star']"
      />
    </div>
    <p class="text-2xl text-light tracking-widest max-w-prose font-bold">
      {{ review.comment.length < 315 ? review.comment : snippet }}
    </p>

    <h3 class="text-[0.9em] tracking-widest text-accent">
      -&nbsp;{{ review.name }}&nbsp;-
    </h3>
  </div>
</template>
