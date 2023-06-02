<script setup>
useHead({
  title: `Football Academy booking request`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/football/booking",
    },
  ],
});
const {data: academyList, error} = await useFetch('/api/football/academyList')

const academyOptions = ref([])
let academy = {}
if (academyList.value) {
academyList.value.forEach((record, index) => {
  academy = {
    index: index + 1,
    id: record.id,
    academyName: record.fields.academyName,
    ageGroup: record.fields.ageGroup,
    sessionStart: record.fields.sessionStart,
    sessionDuration: record.fields.sessionDuration,
    sessionTime: record.fields.sessionTime,
    academyRef: record.fields.academyRef,
    venueRef: record.fields.venueRef,
    numSessions: record.fields.numSessions,
    pricePerSession: record.fields.pricePerSession,
    termCost: record.fields.termCost,
    spaceAvailable: record.fields.spaceAvailable,
    startDate: record.fields.startDate,
    endDate: record.fields.endDate,
    status: record.fields.status,
  };
  academyOptions.value.push(academy);
});
// console.log("academy options***", academyOptions.value)
};

const upcomingSessions = computed(() => {
  return academyOptions.value.filter(academy => academy.status === "upcoming");
});
const savedParent = ref({});

const handleParentDetails = (parent) => {
  savedParent.value = parent;
  console.log("booking handle parent details", savedParent.value)
}

const bookingItem = ref({})

const handleBookingDetails = (booking) => {
  bookingItem.value = booking;
  academyBooking.push(bookingItem.value)
  console.log("booking handle booking details", booking)
}

const academyBooking = ref([]);
// keep alive
const selectedTab = ref("FootballForm");
const setSelectedTab = tab => {
  selectedTab.value = tab;
};

</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <div class="button-container">
        <div class="btn-group">
          <button class="btn-accent" v-show="selectedTab === 'FootballForm'" @click="selectedTab = 'FootballBookingDetails'">
            Review Booking Details <span>&nbsp;⟼</span>
          </button>
          <button class="btn-accent" v-show="selectedTab === 'FootballBookingDetails'" @click="selectedTab = 'FootballForm'">
            <span>⟻&nbsp;</span> Back To Booking Form
          </button>
        </div>
      </div>
      <KeepAlive>
        <FootballBookingForm v-if="selectedTab === 'FootballForm'" 
          @show-steps="selectedTab = 'FootballBookingDetails'" 
          @parent-submitted="parentAdded = true"
          @save-parent="handleParentDetails"
          @booking-item-added="handleBookingDetails"
          :academy-list="academyOptions" />
      </KeepAlive>
      <KeepAlive>
        <FootballBookingDetails v-if="selectedTab === 'FootballBookingDetails'"
        :parent-added="parentAdded"  :savedParent="savedParent"/>
      </KeepAlive>
    </BaseCard>
  </div>
</template>

