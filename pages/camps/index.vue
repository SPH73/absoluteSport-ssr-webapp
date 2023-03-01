<script setup>
const { error, data: list } = await useFetch("/api/camps/campsList");

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
    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h2 class="font-play capitalize">Holiday Activity Camps</h2>
        <p>
          Who doesn’t love meeting a superhero, dressing up like a Pirate or
          playing Survival?
        </p>
        <p>
          Each one of our Holiday Camp days has a different theme in store for
          the children. Our days are fun-filled and exciting, helping your
          children to spend the school break in laughter while building new
          friendships and life-long memories.
        </p>
        <p>
          Our camps are suitable for children of all abilities between 5 and 12
          years old and provide an opportunity to stay active throughout the
          school holidays by participating in a wide range of fun, exciting
          sports, games and art projects.
        </p>
        <p>
          Our camps are structured and delivered by our coaches trained in
          coaching children in sports. The team will ensure that your child
          feels included in all the fun so that they build not only skills in
          sports but also socially and emotionally (self-esteem and confidence).
        </p>
        <p>
          You'll find an up-to-date list of the current and upcoming camps we
          are running below.
        </p>
      </div>
    </section>
    <section
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto pt-8 px-8"
    >
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'mask']" />
        </template>
        <template #heading> Themes </template>
        <template #details>
          With a variety of themes we make each day an exciting one. We may even
          surprise you with your favourite superhero!
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'paintbrush']" />
        </template>
        <template #heading>Arts & Crafts</template>
        <template #details>
          Your children's imaginations will run wild with our creative arts and
          crafts sessions!
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'puzzle-piece']" />
        </template>
        <template #heading>Games </template>
        <template #details>
          It's fun all the way! Your children will enjoy a variety of games
          sessions during each camp that include individual and group
          activities.
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'futbol-ball']" />
        </template>
        <template #heading>Sports</template>
        <template #details>
          May the best team win but may the losers feel like winners too! Sports
          sessions include many fun sports from football to dodgeball!
        </template>
      </BaseBadge>
    </section>
    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h3 class="font-play capitalize">
          Why not come and see how much fun we have during the school holidays?
        </h3>
        <p>
          We run Holiday Activity Camps at Sidlesham Primary School and
          Portfield Academy throughout the year. Places often fill up quickly so
          please reserve a place for your child as soon as possible
          <NuxtLink to="camps/booking" class="font-bold underline"
            >here</NuxtLink
          >.
        </p>
        <p class="tracking-wide">
          As a service provider to the West Sussex Council we have a certain
          amount of places available for pupils receiving HAF benefit. If you
          would like to book an HAF place please provide your childs HAF ID for
          the booking to succeed. If you aren't sure what it is you can request
          it from your child's school. E.g. HAF123456
        </p>
        <div v-if="currentCamps.length" class="py-4">
          <h3 class="font-play capitalize">Current Camps</h3>
          <p>We have opened bookings now!</p>
          <div>
            <button class="btn-primary my-4 w-full md:w-fit">
              <nuxt-link to="/camps/booking">Book Now</nuxt-link>
            </button>
          </div>
          <table
            v-for="camp in currentCamps"
            class="table-auto border-separate border-spacing-2 border border-secondary text-light w-full text-2xl rounded-md mb-4"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
                >
                  Camp
                </th>
                <td
                  class="bg-light text-dark border border-secondary p-4 w-3/5"
                >
                  {{ camp.campName }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
                >
                  Date
                </th>
                <td class="bg-light text-dark border border-secondary p-4">
                  {{ camp.campDate }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
                >
                  Camp Location
                </th>
                <td
                  class="bg-light text-dark border border-secondary p-4 w-3/5"
                >
                  {{ camp.locRef }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
                >
                  Space Available
                </th>
                <td class="bg-light text-dark border border-secondary p-4">
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
          class="table-auto border-separate border-spacing-2 border border-secondary text-light w-full text-2xl rounded-md mb-4"
        >
          <tbody>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Camp
              </th>
              <td class="bg-light text-dark border border-secondary p-4 w-3/5">
                {{ camp.campName }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Date
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ camp.campDate }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Camp Location
              </th>
              <td class="bg-light text-dark border border-secondary p-4 w-3/5">
                {{ camp.locRef }}
              </td>
            </tr>

            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Maximum Capacity
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ camp.spaceAvailable }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
