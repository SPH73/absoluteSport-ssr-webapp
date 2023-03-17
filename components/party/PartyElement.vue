<script lang="ts" setup>
defineProps(["partyDetails"]);
</script>

<template>
  <div
    v-for="party in partyDetails"
    :key="party.id"
    class="bg-secondary p-8 rounded border-4 border-light flex flex-col justify-between items-stretch"
  >
    <div class="self-start">
      <h3 class="text-accent text-center capitalize font-play">
        {{ party.partyName }}
      </h3>
      <img
        v-for="img in party.image"
        :src="img.thumbnail"
        alt="{{img.filename}}"
        class="w-full h-50 my-8"
      />
      <div class="my-8">
        <h4 class="text-accent capitalize font-play">{{ party.summaryP1 }}</h4>
        <p class="text-light">{{ party.summaryP2 }}</p>
        <p class="text-light">{{ party.summaryP3 }}</p>
      </div>
    </div>
    <div class="my-4 flex justify-between">
      <button class="btn-accent w-full md:w-fit">
        <NuxtLink :to="{ name: 'parties-slug', params: { slug: party.slug } }">
          party details &nbsp;<font-awesome-icon :icon="['fas', 'arrow-right']" />
        </NuxtLink>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
