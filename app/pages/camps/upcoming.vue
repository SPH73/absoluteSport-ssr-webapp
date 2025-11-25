<script setup>
const { guardedFetch } = useBookingApi();

useHead({
  title: `Upcoming AbsoluteSport Holiday Activity Camps`,
  meta: [
    {
      name: "description",
      content:
        "Get your kids active this school holiday with our fun and engaging, themed Activity Camps for kids aged 5-14 years!",
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
      href: "https://www.absolutesport.org/camps/upcoming",
    },
  ],
});

const list = await guardedFetch("/api/camps/campsList");
const locs = await guardedFetch("/api/camps/campLocList");

const campList = ref([]);

// Guard against undefined result from 429/503 redirect
if (!list || !Array.isArray(list)) {
  // guardedFetch already handled the redirect to /booking-paused
  // Safe to render with empty campList
} else {
  let camp = {};
  list.forEach((record, index) => {
    camp = {
      index: index + 1,
      id: record.id,
      campRef: record.campRef,
      campName: record.campName,
      campDate: record.campDate,
      locRef: record.locRef,
      spaceAvailable: record.spaceAvailable,
      status: record.status,
    };
    campList.value.push(camp);
  });
}
console.log(campList.value);

const locList = ref([]);

// Guard against undefined result from 429/503 redirect
if (!locs || !Array.isArray(locs)) {
  // guardedFetch already handled the redirect to /booking-paused
  // Safe to render with empty locList
} else {
  let loc = {};
  locs.forEach((record, index) => {
    loc = {
      index: index + 1,
      id: record.id,
      locationName: record.locationName,
      locRef: record.locRef,
      schoolBadge: record.schoolBadge,
    };
    locList.value.push(loc);
  });
}

console.log(locList.value);
const currentCamps = computed(() => {
  return campList.value.filter(
    (camp) =>
      camp.locRef === selectedLocation.value && camp.status === "current"
  );
});

const nextCamps = computed(() => {
  return campList.value.filter(
    (camp) =>
      camp.locRef === selectedLocation.value && camp.status === "upcoming"
  );
});

const selectedImage = ref(null);
const selectedLocation = ref(null);

const handleImageClick = (image) => {
  selectedImage.value = image;
  selectedLocation.value = image.filename.split(" ")[0];
  if (selectedLocation.value === "Great") {
    return (selectedLocation.value = "Great Ballard");
  } else selectedLocation.value = selectedLocation.value;
  console.log(selectedLocation.value);
};
watchEffect(() => {
  console.log("watched location", selectedLocation.value);
});
</script>

<template>
  <div class="my-8">
    <div class="max-w-7xl mx-auto">
      <div class="px-8 md:container py-4">
        <h1 class="font-play capitalize">
          Why not come and see how much fun we have during the school holidays?
        </h1>
        <p>
          We run Holiday Activity Camps at several local West Sussex and
          Hampshire schools (see badges below), throughout the year.
        </p>
        <p>
          Places often fill up quickly so please reserve a place for your
          child(ren) as soon as possible. Simply select any weeks you wish to
          book while space is available and add them all to a single booking and
          payment on our camp booking page
          <NuxtLink
            aria-label="book camps"
            to="/camps/booking"
            class="font-play underline"
            >here</NuxtLink
          >.
        </p>

        <p>
          As a service provider to the West Sussex Council we have a certain
          amount of places available for pupils receiving HAF benefit. If you
          would like to book an HAF place please provide your childs HAF ID for
          the booking to succeed. If you aren't sure what it is you can request
          it from your child's school. E.g. HAF123456
        </p>
        <p>
          As we approach each holiday, we update this page when we are accepting
          bookings for the current camps. You can also always view any upcoming
          camps for your preferred location below after clicking on a badge.
        </p>
        <p>
          If you have any questions please don't hesitate to
          <NuxtLink
            aria-label="contact us"
            to="/contact"
            class="font-play underline"
            >contact us</NuxtLink
          >
        </p>
        <div class="grid grid-cols-4 gap-4 mt-8">
          <div v-for="items in locList" class="flex justify-center">
            <img
              v-for="image in items.schoolBadge"
              :key="image.id"
              :src="image.url"
              :alt="image.filename"
              @click="handleImageClick(image)"
              class="border-4 border-secondary border-solid cursor-pointer aspect-square block"
            />
          </div>
        </div>
        <div v-if="selectedImage" class="py-4">
          <div v-if="currentCamps.length">
            <h2 class="font-play capitalize">
              Current Camps
              <span v-if="selectedImage">for {{ selectedLocation }} </span>
            </h2>
            <p>We are taking bookings now!</p>
            <div>
              <button class="btn-primary my-4 w-full md:w-fit">
                <nuxt-link to="/camps/booking" aria-label="book camps"
                  >Book Now</nuxt-link
                >
              </button>
            </div>
          </div>
          <div v-else>
            <p>
              We are sorry for any inconveniece caused but we do not have any
              camps to show you for your selected location at the moment. This
              may be due to a change in program or they are booked to capacity.
            </p>
          </div>
          <table
            v-for="camp in currentCamps"
            class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md mb-4"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
                >
                  Camp
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ camp.campName }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
                >
                  Date
                </th>
                <td class="bg-light text-dark border border-light p-4">
                  {{ camp.campDate }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
                >
                  Camp Location
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ camp.locRef }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
                >
                  Space Available
                </th>
                <td class="bg-light text-dark border border-light p-4">
                  {{ camp.spaceAvailable }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="py-4">
          <h3 class="font-play capitalize">Upcoming Camps</h3>

          <p>
            <span class="font-play">TIP: </span>Click or tap a school badge to
            select the location you wish to view upcoming camps for.
          </p>
        </div>
        <table
          v-for="camp in nextCamps"
          class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md mb-4"
        >
          <tbody>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
              >
                Camp
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ camp.campName }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
              >
                Date
              </th>
              <td class="bg-light text-dark border border-light p-4">
                {{ camp.campDate }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
              >
                Camp Location
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ camp.locRef }}
              </td>
            </tr>

            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
              >
                Maximum Capacity
              </th>
              <td class="bg-light text-dark border border-light p-4">
                {{ camp.spaceAvailable }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
