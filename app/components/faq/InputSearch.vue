<script lang="ts" setup>
defineProps(["matchingFAQs"]);
</script>

<template>
  <div class="p-8 mx-auto max-w-6xl">
    <BaseCard>
      <h3 class="font-play">Search Results</h3>
      <FaqList :faqList="matchingFAQs" />
    </BaseCard>
  </div>
</template>
