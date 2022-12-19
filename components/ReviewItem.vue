<script setup>
const { data } = await useFetch("/api/reviews");
</script>

<template>
  <div class="bg-secondary text-light flex flex-col text-center justify-center">
    <ul v-for="{ id, fields } in data" :key="id">
      <p class="text-2xl tracking-wider">{{ fields.reviewerComment }}</p>
      <div v-for="star in fields.rating" class="text-accent text-xl">
        <font-awesome-icon :icon="['fas', 'star']" />
        <font-awesome-icon :icon="['fas', 'star']" />
        <font-awesome-icon :icon="['fas', 'star']" />
        <font-awesome-icon :icon="['fas', 'star']" />
        <font-awesome-icon :icon="['fas', 'star']" />
      </div>
      <h5 class="text-xl tracking-wider">{{ fields.reviewerName }}</h5>
    </ul>
  </div>
</template>

<style scoped></style>
