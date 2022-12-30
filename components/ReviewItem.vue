<script setup>
const { data } = await useFetch("/api/reviews");
</script>

<template>
  <div
    class="text-light flex text-center justify-center backdrop-blur-sm backdrop-grayscale rounded-lg p-8 md:px-2"
  >
    <ul v-for="{ id, fields } in data" :key="id">
      <p class="text-2xl tracking-wider max-w-prose">
        {{ fields.reviewerComment }}
      </p>
      <div>
        <font-awesome-icon
          v-for="star in fields.rating"
          class="text-accent text-xl p-1"
          :icon="['fas', 'star']"
        />
      </div>
      <h5 class="text-xl tracking-wider">{{ fields.reviewerName }}</h5>
    </ul>
  </div>
</template>

<style scoped></style>
