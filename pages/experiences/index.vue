<script setup>
const year = new Date().getFullYear();
const route = useRoute();
useHead({
  title: `${year} Experience Events with AbsoluteSport`,
  meta: [
    {
      name: "description",
      content: "Description for experience events!",
    },
    {
      property: "og:description",
      content: "Description for experience events!",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/experiences",
    },
  ],
});
const { error: assetError, data: assets } = await useFetch(
  "/api/carouselImages"
);
const { error: listError, data: list } = await useFetch("/api/camps/campsList");

const campImages = ref([]);

let images = [];
let img = {};
assets.value.forEach((asset, index) => {
  if (asset.fields.segment === "camps") {
    let imagesCarousel = asset.fields.images;
    imagesCarousel.forEach((image) => {
      img = {
        url: image.url,
        id: image.id,
        filename: image.filename,
        width: image.width,
        height: image.height,
      };
      campImages.value.push(img);
    });
  }
});

const campList = ref([]);
let camp = {};
list.value.forEach((record, index) => {
  camp = {
    index: index + 1,
    id: record.id,
    campRef: record.fields.campRef,
    campName: record.fields.campName,
    campDate: record.fields.campDate,
    locRef: record.fields.locRef,
    spaceAvailable: record.fields.spaceAvailable,
    status: record.fields.status,
  };
  campList.value.push(camp);
});
const currentCamps = computed(() => {
  return campList.value.filter((camp) => camp.status.includes("current"));
});

const nextCamps = computed(() => {
  return campList.value.filter((camp) => camp.status === "next");
});
</script>

<template>
  <div class="my-8">
    <section class="w-full mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div
          class="px-8 md:container py-4 flex flex-col items-center justify-center overflow-hidden"
        >
          <h2 class="font-play capitalize">
            Experience Day Events with AbsoluteSport
          </h2>
          <p>
            Description1 Lorem, ipsum dolor sit amet consectetur adipisicing
            elit. Repudiandae nostrum saepe, sed soluta doloremque adipisci nemo
            nisi eveniet harum eius repellendus inventore nam, eaque corporis
            cum ex perspiciatis. Debitis quod eligendi, ullam aperiam cum,
            perspiciatis nostrum exercitationem recusandae voluptas deserunt
            atque qui fugit adipisci, soluta repudiandae libero! Assumenda,
            atque? Eligendi!
          </p>
          <p>
            Description2 Lorem, ipsum dolor sit amet consectetur adipisicing
            elit. Perspiciatis soluta atque sint earum et corrupti voluptas
            pariatur tempora cupiditate tempore. Maiores beatae omnis animi
            possimus doloremque, non deleniti nobis reiciendis.
          </p>
          <p>
            Description3 Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Labore officia aspernatur provident quis. Suscipit,
            dignissimos?
          </p>
          <p>
            Description3 Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quos nisi repudiandae optio itaque sapiente, libero alias
            voluptas laborum voluptates praesentium?
          </p>
          <p>
            Description5 Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Sunt, molestiae incidunt dicta ducimus deserunt recusandae
            ipsum blanditiis non hic obcaecati at numquam quidem facere dolore
            libero sapiente voluptatem quia quisquam!
          </p>
          <p>
            You'll find more information and an up-to-date list of the upcoming
            experience on our "upcoming experiences" page
            <NuxtLink
              aria-label="view upcoming experiences"
              to="experiences/upcoming"
              class="font-play underline"
              >here</NuxtLink
            >.
          </p>
        </div>
        <!-- images -->
        <div
          class="px-8 md:container py-4 flex flex-col items-center justify-center overflow-hidden"
        >
          <h3 class="font-play capitalize text-left">
            An AbsoluteSport blast!
          </h3>
          <p>
            Get a sneak peek into some of our experience days! Lorem, ipsum
            dolor sit amet consectetur adipisicing elit. Officia, obcaecati?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, voluptatum.
          </p>
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
              v-for="img in campImages"
              :key="img.id"
              class="flex-auto flex items-center justify-center"
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
    <!-- Benefits -->
    <section
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto pt-8 px-8"
    >
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'bullseye']" />
        </template>
        <template #heading>Archery</template>
        <template #details>
          In Archery Tag, you're not just a participant; you're a warrior, a
          marksman, and a guardian of your team's honour.
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'crosshairs']" />
        </template>
        <template #heading>Laser Tag</template>
        <template #details>
          Get ready to unleash your inner warrior, outmaneuver your rivals, and
          immerse yourself in an adrenaline-fueled adventure like no
          other.</template
        >
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'clipboard-question']" />
        </template>
        <template #heading>Quests</template>
        <template #details>
          Your quest awaits, and within its unfolding chapters, you may just
          discover the hero you were always meant to be. The adventure begins
          now!</template
        >
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'question']" />
        </template>
        <template #heading>Adventure Themed Parties</template>
        <template #details>
          Our children's themed parties are a portal to a magical universe where
          every detail is carefully crafted to enchant, entertain and bring
          smiles to young faces.</template
        >
      </BaseBadge>
    </section>
  </div>
</template>

<style>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: auto;
  min-height: fit-content;
  width: auto;
  min-width: fit-content;
}
</style>
