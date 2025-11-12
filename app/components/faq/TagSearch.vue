<script lang="ts" setup>
defineProps(["filteredFAQs"]);
</script>

<template>
  <div class="p-8 mx-auto max-w-6xl">
    <BaseCard>
      <h3 class="font-play">Tag Results</h3>
      <FaqList :faqList="filteredFAQs" />
    </BaseCard>
  </div>
</template>
