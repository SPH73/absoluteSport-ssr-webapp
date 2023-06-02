<script setup>
// fetch academyList from api
const { data: academyList, error: academyError } = await useFetch('/api/football/academyList')
const academyOptions = ref([])
let academy = {}
academyList.value.forEach((record, index) => {
  academy = {
    index: index + 1,
    academyName: record.fields.academyName,
    ageGroup: record.fields.ageGroup,
    sessionTime: record.fields.sessionTime,
    sessionDuration: record.fields.sessionDuration,
    academyRef: record.fields.academyRef,
    venueRef: record.fields.venueRef,
    venueName: record.fields.venueName,
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

const emit = defineEmits(["save-parent","booking-item-added", "show-steps", "parent-submitted"]);

async function showSteps() {
  emit("show-steps");
}

// console.log('AcademyOptions Array', academyOptions.value)
const createPaymentRef = () => {
  paymentRef.value = Date.now().toString(36);
};
const academyBooking = ref([]);

// parent details
const enteredParentName = ref("");
const enteredContact = ref("");
const enteredEmail =  ref("");
const paymentRef = ref(null);
const savedParent = ref({});
const parentAdded = ref(false);
const date = new Date().toLocaleString("en-GB");



const handleSaveParent = (name, contact, email, saved) => {
  enteredParentName.value = name;
  enteredContact.value = contact;
  enteredEmail.value = email;
  parentAdded.value = saved;
createPaymentRef();
  savedParent.value = {
    parentName: enteredParentName.value,
    mainPhone: enteredContact.value,
    email: enteredEmail.value,
    status: "awaiting payment",
    paymentRef: paymentRef.value,
    bookingDate: date,
  };
  console.log("BookingForm Saved Parent obj: ", savedParent.value);
  emit("save-parent", savedParent.value);
  emit("parent-submitted");

};


// child details
const childName = ref("");
const childSurname = ref("");
const childAge = ref(null);
const medicalConditions = ref("");
const selectedVenue = ref("");
const savedChild = ref({});
const filteredAcademies = ref([]);
const academyDetails = ref([]);

const filterAcademiesByVenue = computed(() => {
  let venue = savedChild.value.venueRef;
  return (academyDetails.value = academyOptions.value.filter(
    option => option.venueRef === venue,
  ));
});

const filterAcademiesByAge = computed(() => {
  let age = childAge.value;
  return (filteredAcademies.value = filteredAcademies.value.filter(
    option => option.ageGroup.includes(age)
  ));
});
watchEffect(() => {
  console.log("academy options: ", academyOptions.value);
  console.log('childAge',childAge.value);
  console.log('seelctedVenue',selectedVenue.value);
  filterAcademiesByVenue.value;
  filterAcademiesByAge.value;
  console.log('filtered academies',filteredAcademies.value);
  console.log('AcademyDetails',academyDetails.value)
  });

const childList = ref([]);

const handleBookingItemAdded = (name, surname, medical, age, venue ) => {
    childName.value = name,
    childSurname.value = surname,
    medicalConditions.value = medical,
    childAge.value = age,
    selectedVenue.value = venue,

    savedChild.value = {
      childName: childName.value,
      childSurname: childSurname.value,
      medicalConditions: medicalConditions.value,
      childAge: childAge.value,
      venue: selectedVenue.value,
      parentName: savedParent.value.parentName,
    };
    console.log("Saved Child: ", savedChild.value);
    academyBooking.value.push(savedChild.value);
    console.log("academyBooking: ", academyBooking.value);
      if (!childList.value.includes(name)) {
    childList.value.push(name);
  }
  console.log('childList array: ',childList.value)
  
}
</script>

<template>
  <div>
    <div id="text">
      <h1 class="text-accent font-play capitalize">football academy bookings</h1>
      <p class="text-light">
        We run Holiday Activity Camps at Sidlesham Primary School and Portfield
        Primary Academy throughout the year.
      </p>
      <p class="text-light">
        If you are booking a HAF place please have your child's HAF ID handy. If
        you aren't sure what it is you can request it from your child's school.
      </p>
      <p class="text-light">
        Kindly use your unique payment reference when making payment so that we
        can allocate it to your booking and confirm your child's place.
      </p>
      <p class="text-light">
        TIP: Use the review booking details button at each stage of your booking
        to check your booking items.
      </p>
      <p v-if="!parentAdded" class="cursor-pointer">
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          class="text-primary w-6 h-6 mr-4"
        />
        <strong class="text-accent" @click="showSteps"
          >Show me the steps to complete this form</strong
        >
      </p>
    </div>
    <FootballParentForm  @parent-submitted="handleSaveParent"></FootballParentForm>
    <FootballChildForm @booking-item-added="handleBookingItemAdded"></FootballChildForm>
  </div>
</template>

