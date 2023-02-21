<script lang="ts" setup>
defineProps(["faqList"]);
</script>

<template>
  <div v-for="faq in faqList" :key="faq.id">
    <FaqItem :faq="faq" />
  </div>
</template>
