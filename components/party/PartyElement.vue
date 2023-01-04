<script lang="ts" setup>
import { def } from "@vue/shared";

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
  </div>
</template>

<style scoped></style>
