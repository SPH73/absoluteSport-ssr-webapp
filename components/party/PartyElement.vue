<script lang="ts" setup>
defineProps(["partyDetails"]);
</script>

<template>
  <div
    v-for="party in partyDetails"
    :key="party.id"
    class="bg-secondary p-8 rounded border-4 border-light"
  >
    <h3 class="text-accent text-center">{{ party.partyName }}</h3>
    <img
      v-for="img in party.image"
      :src="img.thumbnail"
      alt="{{img.filename}}"
      class="w-full h-50"
    />
    <div>
      <p>{{ party.summaryP1 }}</p>
      <p>{{ party.summaryP2 }}</p>
      <p>{{ party.summaryP3 }}</p>
      <button class="btn-accent">
        <NuxtLink
          :to="{ name: 'parties-slug', params: { slug: party.slug } }"
          class="flex justify-center items-center p-2 text-xl uppercase font-bold"
        >
          {{ party.partyName }} details &nbsp;<font-awesome-icon
            :icon="['fas', 'arrow-right']"
          />
        </NuxtLink>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
