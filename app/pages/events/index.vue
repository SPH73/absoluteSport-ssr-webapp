<script setup>
const { guardedFetch } = useBookingApi();

const year = new Date().getFullYear();
const route = useRoute();
useHead({
  title: `${year} AbsoluteSport Family Fun Day Event`,
  meta: [
    {
      name: "description",
      content:
        "Get your kids active with our fun and engaging, themed Activity Camps for children aged 5-14 years that will keep your kids laughing this school holiday!",
    },
    {
      property: "og:description",
      content:
        "Get your kids active with our fun and engaging, themed Activity Camps to children aged 5-14 that will keep your kids laughing this school holiday!",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/events",
    },
  ],
});

// Fetch event data from CMS
const eventData = await guardedFetch("/api/events/eventsList");
const eventList = ref([]);

// Guard against undefined result from 429/503 redirect
if (eventData && Array.isArray(eventData)) {
  eventList.value = eventData;
}

// If there are no events to show, route to booking-paused
if (eventList.value.length === 0) {
  await navigateTo({
    path: "/booking-paused",
    query: { context: "booking" },
  });
}

// posterImage is used in the template to display the event poster
const posterImage = new URL("assets/images/ffd-poster.svg", import.meta.url)
  .href;
</script>

<template>
  <div class="my-8">
    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h1 class="font-play capitalize">AbsoluteSport Family Fun Day Event</h1>
        <p>Join us for a day dedicated to family!</p>
        <p>
          At our family fun day, we can spend time together building and
          renewing connections with our loved ones and within our community.
        </p>
        <p>
          We will have games including a family tug of war or maybe you want to
          have a go at knocking your sibling off of the duel podium?
        </p>
        <p>
          Would you prefer a quieter activity in the woods or doing some craft
          activities, we have those too!
        </p>
        <p>
          To top it all off we will have a community barbecue and finish the day
          with a disco. Bring your family and let's have fun as a community!
        </p>
        <button class="btn-primary my-4 w-full md:w-fit">
          <NuxtLink to="/events/booking" aria-label="book tickets"
            >book tickets</NuxtLink
          >
        </button>
      </div>
    </section>

    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h2 class="font-play capitalize">Event Details</h2>
        <div></div>
        <div
          class="py-4 flex flex-col items-center justify-center overflow-hidden"
        >
          <img
            :src="posterImage"
            alt="Charity Event Poster"
            class="w-full h-auto"
          />
        </div>
      </div>
    </section>
  </div>
</template>
