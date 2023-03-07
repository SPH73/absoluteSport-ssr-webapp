<script setup>
const route = useRoute();
let partyList = ref([]);
const partySlug = ref(route.params.slug);
const {
  data: parties,
  error,
  pending,
} = await useFetch("/api/parties/details");

parties.value.forEach(record => {
  let party = {
    id: record.id,
    slug: record.fields.slug,
    partyName: record.fields.partyName,
    descriptionHeading: record.fields.descriptionHeading,
    descriptionP1: record.fields.descriptionP1,
    descriptionP2: record.fields.descriptionP2,
    descriptionP3: record.fields.descriptionP3,
    descriptionP4: record.fields.descriptionP4,
    descriptionP5: record.fields.descriptionP5,
  };
  partyList.value.push(party);
});
const selectedParty = computed(partySlug => {
  return partyList.value.find(party => party.slug === route.params.slug);
});
console.log("partyList***********", partyList.value);
// add meta to Airtable
// useHead({
//   title: selectedParty.value.fields.partyName,
//   meta: [
//     {
//       name: "description",
//       content: selectedParty.value.fields.metaDescription,
//     },
//     {
//       property: "og:description",
//       content: selectedParty.value.fields.metaDescription,
//     },
//     {
//       property: "og:image",
//       content: selectedParty.value.fields.thumbnail[0].thumbnails.large.url,
//     },
//     { name: "twitter:card", content: `summary_large_image` },
//   ],
// });
</script>

<template>
  <section class="flex flex-col justify-between items-stretch container py-8">
    <div v-if="error">{{ error }}</div>
    <div v-if="pending">
      <TheSpinner />
    </div>
    <div v-else class="self-start mb-20">
      <div v-for="party in partyList" :key="party.id">
        <div v-if="party.slug === partySlug">
          <div>
            <h2 class="font-play capitalize">{{ party.partyName }}</h2>
          </div>
          <h3 class="font-play capitalize">{{ party.descriptionHeading }}</h3>
          <p>{{ party.descriptionP1 }}</p>
          <p v-html="party.descriptionP2"></p>
          <p v-html="party.descriptionP3"></p>
          <p v-html="party.descriptionP4"></p>
          <p v-html="party.descriptionP5"></p>
        </div>
      </div>
      <div class="flex justify-between mt-8">
        <button class="btn-accent">
          <NuxtLink :to="{ name: 'parties-quote' }"
            >Get A Quote &nbsp;<font-awesome-icon
              :icon="['fas', 'arrow-right']"
            />
          </NuxtLink>
        </button>
        <button class="btn-accent">
          <NuxtLink :to="{ name: 'parties' }"
            >All Parties &nbsp;<font-awesome-icon
              :icon="['fas', 'arrow-right']"
            />
          </NuxtLink>
        </button>
      </div>
    </div>
  </section>
</template>
