<script setup>
const route = useRoute();
const {
  data: parties,
  error,
  pending,
} = await useFetch("/api/parties/details");
const partySlug = ref(route.params.slug);
let partyList = ref([]);

parties.value.forEach(record => {
  if (record.fields.slug === route.params.slug) {
    let imagesCarousel = record.fields.imagesCarousel;
    let img = {};
    let images = [];
    imagesCarousel.forEach(image => {
      img = {
        url: image.thumbnails.large.url,
        id: image.id,
        filename: image.filename,
        width: image.thumbnails.large.width,
        height: image.thumbnails.large.height,
      };
      images.push(img);
    });
    let party = {
      id: record.id,
      slug: record.fields.slug,
      metaTitle: record.fields.metaTitle,
      metaDescription: record.fields.metaDescription,
      partyName: record.fields.partyName,
      descriptionHeading: record.fields.descriptionHeading,
      descriptionP1: record.fields.descriptionP1,
      descriptionP2: record.fields.descriptionP2,
      descriptionP3: record.fields.descriptionP3,
      descriptionP4: record.fields.descriptionP4,
      descriptionP5: record.fields.descriptionP5,
      carousel: images,
    };
    partyList.value.push(party);
  }
});
const selectedParty = computed(partySlug => {
  return partyList.value.find(party => party.slug === route.params.slug);
});

useHead({
  title: selectedParty.value.metaTitle,
  meta: [
    {
      name: "description",
      content: selectedParty.value.metaDescription,
    },
    {
      property: "og:description",
      content: selectedParty.value.metaDescription,
    },
    // {
    //   property: "og:image",
    //   content: selectedParty.value.thumbnail[0].thumbnails.large.url,
    // },
    // { name: "twitter:card", content: `summary_large_image` },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/" + route.path,
    },
  ],
});
</script>

<template>
  <div class="my-8">
    <section class="w-full mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div
          class="px-8 md:container py-4 flex flex-col items-center justify-center overflow-hidden"
        >
          <div
            class="flex flex-col justify-between items-stretch md:container py-8 mx-auto"
          >
            <div v-if="error">{{ error }}</div>
            <div v-if="pending">
              <TheSpinner />
            </div>
            <div class="self-start mb-20">
              <div>
                <h1 class="font-play capitalize">
                  {{ selectedParty.partyName }}
                </h1>

                <h2 class="font-play capitalize">
                  {{ selectedParty.descriptionHeading }}
                </h2>
                <p>{{ selectedParty.descriptionP1 }}</p>
                <p v-html="selectedParty.descriptionP2"></p>
                <div v-html="selectedParty.descriptionP3"></div>
                <div v-html="selectedParty.descriptionP4"></div>
                <div v-html="selectedParty.descriptionP5"></div>
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
          </div>
        </div>
        <!-- images -->
        <div
          class="px-8 md:container py-4 flex flex-col items-center justify-center overflow-hidden"
        >
          <h3 class="font-play capitalize">An AbsoluteSport Party blast!</h3>
          <!-- swiper -->
          <Swiper
            class="w-full max-w-[624px] h-auto"
            :modules="[SwiperAutoplay, SwiperEffectCreative]"
            :slides-per-view="1"
            :loop="true"
            :effect="'creative'"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: true,
            }"
            :creative-effect="{
              prev: {
                shadow: false,
                translate: ['-100%', 0, -1],
              },
              next: {
                translate: ['100%', 0, 0],
              },
            }"
          >
            <SwiperSlide
              v-for="img in selectedParty.carousel"
              :key="img.id"
              class="flex-auto"
              ><img
                :alt="img.filename"
                :src="img.url"
                class="border-4 border-white rounded-xl object-cover object-center"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  </div>
</template>
