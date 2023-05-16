<script setup>
useHead({
  title: "AbsoluteSport upcoming school term clubs",
  meta: [
    {
      name: "description",
      content:
        "We deliver morning and after-school sports clubs and wraparound care across West Sussex, focusing on developing new skills and healthy habits for life.",
    },
    {
      property: "og:description",
      content:
        "We deliver morning and after-school sports clubs and wraparound care across West Sussex, focusing on developing new skills and healthy habits for life.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/clubs/upcoming",
    },
  ],
});

const { error: listError, data: list } = await useFetch("/api/clubs/sportList");

const sportList = ref([]);
let activity = {};
list.value.forEach((record, index) => {
  activity = {
    index: index + 1,
    id: record.id,
    sportName: record.fields.sportName,
    intro: record.fields.intro,
    yearRange: record.fields.yearRange,
    schoolList: record.fields.schoolList,
    sessions: record.fields.sessions,
    startDate: record.fields.startDate,
    endDate: record.fields.endDate,
  };
  sportList.value.push(activity);
});
</script>

<template>
  <div class="my-8">
    <div class="max-w-7xl mx-auto">
      <div class="px-8 md:container py-4">
        <h1 class="font-play capitalize">
          Upcoming AbsoluteSport School Clubs
        </h1>
        <p>
          We coach a variety of sports and activities at our clubs and
          wraparound care at Sidlesham Primary School, West Wittering Primary
          School and Portfield Primary Academy. These are updated regularly to
          keep our clubs current and interesting.
        </p>
        <button class="btn-primary my-4 w-full md:w-fit">
          <NuxtLink to="clubs/booking" aria-label="book clubs"
            >book now</NuxtLink
          >
        </button>
        <table
          v-for="activity in sportList"
          class="table-fixed border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md mb-4 whitespace-pre-wrap"
        >
          <tbody>
            <tr>
              <th
                class="uppercase bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Activity
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ activity.sportName }}
              </td>
            </tr>
            <tr class="">
              <th
                class="uppercase bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                What you can expect
              </th>
              <td
                class="bg-light text-dark border border-light p-4 w-3/5 break-words"
              >
                <span v-for="item in activity.intro">{{ item }} &nbsp;</span>
              </td>
            </tr>
            <tr>
              <th
                class="uppercase bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Schools
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                <span v-for="item in activity.schoolList"
                  >{{ item }} &nbsp;</span
                >
              </td>
            </tr>
            <tr>
              <th
                class="uppercase bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Year groups
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                <span v-for="item in activity.yearRange"
                  >{{ item }} &nbsp;</span
                >
              </td>
            </tr>
            <tr>
              <th
                class="uppercase bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Sessions per booking
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ activity.sessions }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Week commencing
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ activity.startDate }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
               Ending
              </th>
              <td class="bg-light text-dark border border-light p-4 w-3/5">
                {{ activity.endDate }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
