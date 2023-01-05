<script setup>
const route = useRoute();
let partyList = ref([]);
const partySlug = ref(route.params.slug);
const { data: parties, error, pending } = await useFetch("/api/parties/details");

parties.value.forEach((record) => {
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
// const selectedParty = computed((partySlug) => {
//     return partyList.value.filter((party) => party.slug === route.params.slug);
//   });
console.log("partyList***********", partyList.value);

useHead({
  // title: selectedParty.value.fields.partyName,
  // meta: [
  //   { name: "description", content: selectedParty.value.fields.summary },
  //   { property: "og:description", content: selectedParty.value.fields.summary },
  //   {
  //     property: "og:image",
  //     content: selectedParty.value.fields.thumbnail[0].thumbnails.large.url,
  //   },
  //   { name: "twitter:card", content: `summary_large_image` },
  // ],
});
</script>

<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="pending">
    <TheSpinner />
  </div>
  <div v-else class="container mb-20">
    <div v-for="party in partyList" :key="party.id">
      <div v-if="party.slug === $route.params.slug">
        <div>
          <h2>{{ party.partyName }}</h2>
        </div>
        <h3>{{ party.descriptionHeading }}</h3>
        <p>{{ party.descriptionP1 }}</p>
        <p v-html="party.descriptionP2"></p>
        <p v-html="party.descriptionP3"></p>
        <p v-html="party.descriptionP4"></p>
        <p v-html="party.descriptionP5"></p>
      </div>
    </div>

    <!-- <div v-for="slug in party.slug">
      <pre>{{ slug }}</pre>
      <div v-if="!slug === $route.params.slug">
        <button class="btn-accent">
          <NuxtLink
            :to="{ name: 'parties-slug', params: { slug: slug } }"
            class="flex justify-center items-center p-2 text-xl uppercase font-bold"
          >
            {{ party.partyName }} details &nbsp;<font-awesome-icon
              :icon="['fas', 'arrow-right']"
            />
          </NuxtLink>
        </button>
      </div>
    </div> -->
    <div class="flex justify-center gap-8">
      <button class="btn-accent font-bold uppercase w-48 h-12">
        <NuxtLink :to="{ name: 'parties-quote' }"
          >Get A Quote &nbsp;<font-awesome-icon :icon="['fas', 'arrow-right']" />
        </NuxtLink>
      </button>
      <button class="btn-accent font-bold uppercase w-48 h-12">
        <NuxtLink :to="{ name: 'parties-quote' }"
          >All Parties &nbsp;<font-awesome-icon :icon="['fas', 'arrow-right']" />
        </NuxtLink>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
