<script lang="ts" setup>
defineProps(["partyDetails"]);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mx-auto p-8">
    <PartyElement :partyDetails="partyDetails" />
  </div>
</template>
