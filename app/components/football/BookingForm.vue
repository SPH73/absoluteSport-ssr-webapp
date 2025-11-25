<script setup>
const { guardedFetch } = useBookingApi();

// fetch academyList from api
const academyError = ref(null);
let academyList = [];

try {
  academyList = await guardedFetch("/api/football/academyList");
} catch (error) {
  // Non-429/503 errors only; 429/503 are already redirected by the guard
  academyError.value = error;
}

const academyOptions = ref([]);

// Guard against undefined result from 429/503 redirect
if (!academyList || !Array.isArray(academyList)) {
  // guardedFetch already handled the redirect to /booking-paused
  // Safe to render with empty academyOptions
} else {
  let academy = {};
  academyList.forEach((record, index) => {
    academy = {
      index: index + 1,
      academyName: record.academyName,
      ageGroup: record.ageGroup,
      sessionTime: record.sessionTime,
      sessionDuration: record.sessionDuration,
      academyRef: record.academyRef,
      venueRef: record.venueRef,
      venueName: record.venueName,
      numSessions: record.numSessions,
      pricePerSession: record.pricePerSession,
      termCost: record.termCost,
      spaceAvailable: record.spaceAvailable,
      startDate: record.startDate,
      endDate: record.endDate,
      status: record.status,
    };
    academyOptions.value.push(academy);
  });
}

const emit = defineEmits([
  "show-steps",
  "save-parent",
  "parent-submitted",
  "save-child",
  "booking-item-added",
  "childlist-updated",
  "booking-item-removed",
  "booking-cancelled",
]);

async function showSteps() {
  emit("show-steps");
}

// parent details
const enteredParentName = ref("");
const enteredContact = ref("");
const enteredEmail = ref("");
const paymentRef = ref(null);
const savedParent = ref({});
const parentAdded = ref(false);
const date = new Date().toLocaleString("en-GB");

const createPaymentRef = () => {
  paymentRef.value = Date.now().toString(36);
};
const createBookingRef = () => {
  bookingRef.value = Date.now().toString(24);
};

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
const confirmedPhoto = ref(null);
const bookingRef = ref(null);
const academyDetails = ref({});
const savedChild = ref({});

const findAcademy = () => {
  let age = String(childAge.value);
  let venue = selectedVenue.value;
  return (academyDetails.value = academyOptions.value.find(
    (option) => option.ageGroup.includes(age) && option.venueRef === venue
  ));
};
// booking details
// const academyBooking = ref([]);
// const childList = ref([]);

watchEffect(() => {
  academyOptions.value;
  // console.log(" watch booking form  academy options: ", academyOptions.value);
  childAge.value;
  // console.log(' watch booking form childAge',childAge.value);
  selectedVenue.value;
  // console.log(' watch booking form  selectedVenue',selectedVenue.value);
  academyDetails.value;
  // console.log('watch booking form academyDetails',academyDetails.value)
  // academyBooking.value
  // console.log('watch booking form academyBooking', academyBooking.value)
  // childList.value
  // console.log('watch booking form childList', childList.value)
});

const handleBookingItemAdded = (name, surname, medical, age, venue, photos) => {
  (childName.value = name),
    (childSurname.value = surname),
    (medicalConditions.value = medical),
    (childAge.value = age),
    (selectedVenue.value = venue),
    (confirmedPhoto.value = photos),
    createBookingRef();
  findAcademy();
  savedChild.value = {
    surname: childSurname.value,
    childName: childName.value,
    parentName: enteredParentName.value,
    email: enteredEmail.value,
    mobile: enteredContact.value,
    medicalConditions: medicalConditions.value,
    age: childAge.value,
    confirmedPhoto: confirmedPhoto.value,
    venue: selectedVenue.value,
    time: academyDetails.value.sessionTime,
    academyRef: academyDetails.value.academyRef,
    academy: academyDetails.value.academyName,
    venue: academyDetails.value.venueRef,
    sessions: academyDetails.value.numSessions,
    termCost: academyDetails.value.termCost,
    startDate: academyDetails.value.startDate,
    endDate: academyDetails.value.endDate,
    status: academyDetails.value.status,
    bookingRef: bookingRef.value,
  };
  console.log("BookingForm Saved Child Obj: ", savedChild.value);
  emit("booking-item-added", savedChild.value);
};
</script>

<template>
  <div>
    <div id="text">
      <h1 class="text-accent font-play capitalize">
        football academy bookings
      </h1>
      <p class="text-light">
        We run our Football Academy coaching sessions at Sidlesham Primary
        School and Portfield Primary Academy throughout the year.
      </p>
      <p class="text-light">
        Sessions are booked in blocks of 6 sessions at a time.
      </p>
      <p class="text-light">
        Kindly use your unique payment reference when making payment so that we
        can allocate it to your booking and confirm your child(ren)'s place.
      </p>
      <p class="text-light">
        TIP: Use the review booking details button at each stage of your booking
        to check your booking is correct.
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
    <FootballParentForm
      @parent-submitted="handleSaveParent"
      :parent-added="parentAdded"
    ></FootballParentForm>
    <FootballChildForm
      @booking-item-added="handleBookingItemAdded"
      :parent-added="parentAdded"
    ></FootballChildForm>
  </div>
</template>
