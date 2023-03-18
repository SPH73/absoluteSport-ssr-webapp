<script setup>
const route = useRoute();
useHead(() => {
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org" + route.path,
    },
  ];
});
const { data: cms } = await useFetch("/api/cms");
const content = ref([]);
let element = {};
cms.value.forEach((record, index) => {
  element = {
    index: index + 1,
    name: record.fields.element,
    content: record.fields.content,
    display: record.fields.display,
    modified: record.fields.lastUpdated,
  };
  content.value.push(element);
});
const tickerContent = computed(() => {
  return content.value.find((item) => item.name === "ticker");
});
</script>

<template>
  <div class="w-full min-h-full h-screen flex flex-col">
    <TheTicker :cms="tickerContent" v-if="tickerContent.display" />
    <header>
      <TheNavbar />
    </header>
    <main class="mb-auto flex flex-col bg-primary">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
