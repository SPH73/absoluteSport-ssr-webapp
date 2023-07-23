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
const { error: schoolError, data: schoolList } = await useFetch("/api/clubs/schoolList");

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
console.log('SportList', sportList.value)

let school = {};
const schoolOptions = ref([]);
schoolList.value.forEach((record, index) => {
  school = {
    index: index + 1,
    id: record.id,
    schoolName: record.fields.schoolName,
    schoolRef: record.fields.schoolRef,
    status: record.fields.status,
    schoolBadge: record.fields.schoolBadge,
  };
  schoolOptions.value.push(school);
});
console.log('SchoolList', schoolOptions.value);

const currentClubs = computed(() => {
  return sportList.value.filter(sport => sport.schoolList === selectedSchool.value);
});

const nextClubs = computed(() => {
  return sportList.value.filter(sport => sport.schoolList === selectedSchool.value);
});

const selectedImage = ref(null);
const selectedSchool = ref(null);


const handleImageClick = (image) => {
  selectedImage.value = image
  selectedSchool.value = image.filename.split('.')[0]

};
watchEffect(() => {
  selectedSchool.value
  selectedImage.value
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
          wraparound care at West Wittering primary, Portfield Primary Academy, Sidlesham Primary and Yapton Primary. These are updated regularly to keep our clubs current and interesting.
        </p>
        <p>Please select a school badge to view the currently available clubs for your child's school.</p>
       
        <div class="grid grid-cols-4 gap-4 my-8">
            <div v-for="items in schoolOptions" class="flex justify-center">
              <img v-for="image in items.schoolBadge" :key="image.id" :src="image.url" :alt="image.filename" @click="handleImageClick(image)" class="border-4 border-secondary border-solid cursor-pointer aspect-square block">
            </div>
        </div>
         <button class="btn-primary my-4 w-full md:w-fit">
            <NuxtLink to="/clubs/booking" aria-label="book clubs"
              >book now</NuxtLink
            >
          </button>
        <div v-if="selectedImage" class="my-8">
          <h2 class="font-play capitalize">Currently available Clubs <span v-if="selectedImage">for {{ selectedSchool }} </span></h2>
          <table
            v-for="activity in currentClubs"
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
                  School
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ activity.schoolList }}
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
