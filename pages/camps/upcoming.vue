<script setup>
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

const { error: listError, data: list } = await useFetch("/api/camps/campsList");

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
  return campList.value.filter(camp => camp.status.includes("current"));
});

const nextCamps = computed(() => {
  return campList.value.filter(camp => camp.status === "next");
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
          We run Holiday Activity Camps at Sidlesham Primary School and
          Portfield Primary Academy throughout the year. Places often fill up
          quickly so please reserve a place for your child as soon as possible
          <NuxtLink
            aria-label="book camps"
            to="camps/booking"
            class="font-bold underline"
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
        <div v-if="currentCamps.length" class="py-4">
          <h2 class="font-play capitalize">Current Camps</h2>
          <p>We are taking bookings now!</p>
          <div>
            <button class="btn-primary my-4 w-full md:w-fit">
              <nuxt-link to="/camps/booking" aria-label="book camps"
                >Book Now</nuxt-link
              >
            </button>
          </div>
          <table
            v-for="camp in currentCamps"
            class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md mb-4"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
                >
                  Camp
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ camp.campName }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
                >
                  Date
                </th>
                <td class="bg-light text-dark border border-light p-4">
                  {{ camp.campDate }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
                >
                  Camp Location
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ camp.locRef }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
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
            As we approach each holdiday we will open up for bookings. You can
            select the weeks you wish to book while space is available and add
            them all to a single booking and payment on our booking page.
          </p>
        </div>
        <table
          v-for="camp in nextCamps"
          class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md mb-4"
        >
          <tbody>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Camp
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ camp.campName }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Date
              </th>
              <td class="bg-light text-dark border border-light p-4">
                {{ camp.campDate }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Camp Location
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ camp.locRef }}
              </td>
            </tr>

            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
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
