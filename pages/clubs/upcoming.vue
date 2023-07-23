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
const { data: cms } = await useFetch("/api/clubs/cmsSchool");
const content = ref([]);
let element = {};
cms.value.forEach((record, index) => {
  element = {
    index: index + 1,
    name: record.fields.element,
    content: record.fields.content,
    display: record.fields.display,
    school: record.fields.school,
    modified: record.fields.lastUpdated,
  };
  content.value.push(element);
});
console.log('content', content.value)

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
    display: record.fields.display,
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
