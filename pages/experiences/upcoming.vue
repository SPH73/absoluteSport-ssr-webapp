<script setup>
useHead({
  title: `Upcoming AbsoluteSport Experience Day Events`,
  meta: [
    {
      name: "description",
      content: "Description for experience day events",
    },
    {
      property: "og:description",
      content: "Description for experience day events!",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/experiences/upcoming",
    },
  ],
});

const { error: listError, data: list } = await useFetch(
  "/api/experiences/expList"
);
const { error: locsError, data: locs } = await useFetch(
  "/api/experiences/expVenueList"
);

const expList = ref([]);
let experience = {};
list.value.forEach((record, index) => {
  experience = {
    index: index + 1,
    id: record.id,
    expName: record.fields.expName,
    status: record.fields.status,
    expRef: record.fields.expRef,
    locRef: record.fields.locRef,
    expDateTime: record.fields.expDateTime,
    duration: record.fields.duration,
    pricePerPerson: record.fields.pricePerPerson,
    spaceAvailable: record.fields.spaceAvailable,
  };
  expList.value.push(experience);
});
console.log(expList.value);

const locList = ref([]);
let loc = {};
locs.value.forEach((record, index) => {
  loc = {
    index: index + 1,
    id: record.id,
    locationName: record.fields.locationName,
    locRef: record.fields.locRef,
    pricePerPerson: record.fields.pricePerPerson,
    schoolBadge: record.fields.schoolBadge,
  };
  locList.value.push(loc);
});

console.log(locList.value);
const currentExps = computed(() => {
  return expList.value.filter(
    (exp) => exp.locRef === selectedLocation.value && exp.status === "current"
  );
});

const nextExps = computed(() => {
  return expList.value.filter(
    (exp) => exp.locRef === selectedLocation.value && exp.status === "upcoming"
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
        <h1 class="font-play capitalize">Experiences Page Title</h1>
        <p>
          Experiences subtitle Descrtiption1 Lorem ipsum dolor sit amet
          consectetur adipisicing elit. At, magnam.
        </p>
        <p>
          Description2 Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Officia tempora minima praesentium eum temporibus eius. Dolores vero
          deserunt fugiat nobis! Book your experience day event
          <NuxtLink
            aria-label="book experiences"
            to="experiences/booking"
            class="font-play underline"
            >here</NuxtLink
          >.
        </p>

        <p>
          Description3 Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Dolores nulla ratione voluptate inventore sequi quos modi saepe
          deleniti assumenda, mollitia labore voluptas ad est velit officiis
          consequuntur ullam minus! Deleniti, in rerum numquam eaque soluta
          placeat commodi debitis hic fugiat maiores unde culpa vero molestiae
          at sequi temporibus quibusdam officia.
        </p>
        <p>
          Description4 Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Libero iste neque ea necessitatibus fugit, atque eos aspernatur?
          Ratione optio laudantium ex aliquam, dicta blanditiis officia eum
          earum vel, doloremque rem.
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
          <h2 class="font-play capitalize">
            Current Experience Days
            <span v-if="selectedImage">in {{ selectedLocation }} </span>
          </h2>
          <div v-if="currentExps.length">
            <p>We are taking bookings now!</p>
            <div>
              <button class="btn-primary my-4 w-full md:w-fit">
                <nuxt-link
                  to="/experiences/booking"
                  aria-label="book experiences"
                  >Book Now</nuxt-link
                >
              </button>
            </div>
          </div>
          <div v-else>
            <p>
              We are sorry for any inconveniece caused but we do not have any
              experience days to show you for your selected venue at the moment.
              This may be because they are booked to capacity.
            </p>
          </div>
          <table
            v-for="exp in currentExps"
            class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md mb-4"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
                >
                  Experience
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ exp.expName }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
                >
                  Date & Time
                </th>
                <td class="bg-light text-dark border border-light p-4">
                  {{ exp.expDateTime }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
                >
                  Experience Venue
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ exp.locRef }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
                >
                  Space Available
                </th>
                <td class="bg-light text-dark border border-light p-4">
                  {{ exp.spaceAvailable }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
                >
                  Price Per Attendee
                </th>
                <td class="bg-light text-dark border border-light p-4">
                  {{ exp.pricePerPerson }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="py-4">
          <h3 class="font-play capitalize">Upcoming Experiences</h3>

          <p>
            <span class="font-play">TIP: </span>Click or tap a school badge to
            select the location you wish to view for upcoming experience days.
          </p>
        </div>
        <table
          v-for="exp in nextExps"
          class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md mb-4"
        >
          <tbody>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
              >
                Experience
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ exp.expName }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
              >
                Date & Time
              </th>
              <td class="bg-light text-dark border border-light p-4">
                {{ exp.expDateTime }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
              >
                Experience Venue
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ exp.locRef }}
              </td>
            </tr>

            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
              >
                Maximum Capacity
              </th>
              <td class="bg-light text-dark border border-light p-4">
                {{ exp.spaceAvailable }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
              >
                Price Per Attendee
              </th>
              <td class="bg-light text-dark border border-light p-4">
                {{ exp.pricePerPerson }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
