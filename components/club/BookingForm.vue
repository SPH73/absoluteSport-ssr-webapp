<script setup>
const { data: clubList, error: clubError } = await useFetch("/api/clubs/clubsList");
const { data: schoolList, error: schoolError } = await useFetch("/api/clubs/schoolList");

let club = {};
const clubOptions = ref([]);
clubList.value.forEach((record, index) => {
  club = {
    index: index + 1,
    id: record.id,
    clubName: record.fields.clubName,
    yearRange: record.fields.yearRange,
    clubRef: record.fields.clubRef,
    schoolName: record.fields.schoolName,
    schoolRef: record.fields.schoolRef,
    startDate: record.fields.startDate,
    endDate: record.fields.endDate,
    sessions: record.fields.sessions,
    pricePerSession: record.fields.pricePerSession,
    termCost: record.fields.termCost,
    spaceAvailable: record.fields.spaceAvailable,
    status: record.fields.status,
  };
  clubOptions.value.push(club);
});

let school = {};
const schoolOptions = ref([]);
schoolList.value.forEach((record, index) => {
  school = {
    index: index + 1,
    id: record.id,
    clubName: record.fields.campName,
    yearRange: record.fields.yearRange,
    clubRef: record.fields.campRef,
    schoolName: record.fields.schoolName,
    schoolRef: record.fields.schoolRef,
    startDate: record.fields.startDate,
    endDate: record.fields.endDate,
    pricePerSession: record.fields.pricePerSession,
    termCost: record.fields.termCost,
    spaceAvailable: record.fields.spaceAvailable,
    status: record.fields.status,
  };
  schoolOptions.value.push(school);
});

const enteredParentName = ref({ val: "", isValid: true });
const enteredEmail = ref({ val: "", isValid: true });
const enteredPhone = ref({ val: "", isValid: true });
const enteredAltParentName = ref("");
const enteredAltContact = ref("");
const enteredChildFirstName = ref({ val: "", isValid: true });
const enteredSurname = ref({ val: "", isValid: true });
const enteredMedical = ref({ val: "", isValid: true });
const enteredYearGroup = ref({ val: "select", isValid: true });
const selectedSchool = ref({ val: "select", isValid: true });
const filteredClubs = ref([]);
const checkedClubs = ref({ val: [], isValid: true });
const cost = ref(0);
const acceptedTerms = ref({ val: false, isValid: true });
const bookingRef = ref("");
const paymentRef = ref("");
const clubBooking = ref({});
const clubPayment = ref({});
const formIsValid = ref(true);
const clubDetails = ref([]);
const bookingSummary = ref([]);
const paymentSummary = ref({});

// calculate cost of all clubs
const calculateCost = computed(() => {
  for (club of checkedClubs.value.val) {
    clubDetails.value = filteredClubs.value.find((item) => item.clubRef === club);
    cost.value += clubDetails.value.termCost;
  }
  return cost.value;
});

const clearCost = () => {
  checkedClubs.value.val = [];
  cost.value = 0;
};

// recalc each time a club is checked
watch(checkedClubs, () => {
  cost.value = 0;
  for (club of checkedClubs.value.val) {
    clubDetails.value = filteredClubs.value.find((item) => item.clubRef === club);
    cost.value += clubDetails.value.termCost;
  }
  return cost.value;
});

watch(calculateCost, () => {
  cost.value = 0;
  calculateCost.value;
  return cost.value;
});

// build checkbox list from year & school selection
const filteredSchoolClubs = computed(() => {
  let yearGroup = enteredYearGroup.value.val.toString();
  let schoolRef = selectedSchool.value.val;
  filteredClubs.value = clubOptions.value.filter((el) => {
    return el.yearRange.includes(yearGroup) && el.schoolName === schoolRef;
  });
});

watchEffect(() => {
  enteredYearGroup.value.val.toString();
  selectedSchool.value.val;
  filteredSchoolClubs.value;
  filteredClubs.value;
  checkedClubs.value;
  clubDetails.value;
  cost.value;
});

const validateForm = () => {
  if (enteredParentName.value.val === "") {
    enteredParentName.value.isValid = false;
    formIsValid.value = false;
  }
  if (enteredEmail.value.val === "") {
    enteredEmail.value.isValid = false;
    formIsValid.value = false;
  }
  if (enteredPhone.value.val === "") {
    enteredPhone.value.isValid = false;
    formIsValid.value = false;
  }
  if (enteredChildFirstName.value.val === "") {
    enteredChildFirstName.value.isValid = false;
    formIsValid.value = false;
  }
  if (enteredSurname.value.val === "") {
    enteredSurname.value.isValid = false;
    formIsValid.value = false;
  }
  if (enteredMedical.value.val === "") {
    enteredMedical.value.isValid = false;
    formIsValid.value = false;
  }
  if (enteredYearGroup.value.val === "select") {
    enteredYearGroup.value.isValid = false;
    formIsValid.value = false;
  }
  if (selectedSchool.value.val === "select") {
    selectedSchool.value.isValid = false;
    formIsValid.value = false;
  }
  if (checkedClubs.value.val.length === 0) {
    checkedClubs.value.isValid = false;
    formIsValid.value = false;
  }
  if (acceptedTerms.value.val === false) {
    acceptedTerms.value.isValid = false;
    formIsValid.value = false;
  }
};

const createPaymentRef = () => {
  paymentRef.value = Date.now().toString(36);
};
const createBookingRef = (club) => {
  bookingRef.value = `${paymentRef.value}-${club}`;
};

// Form submission
async function handleSubmitClubBooking() {
  validateForm();
  if (!formIsValid.value) {
    return;
  }
  createPaymentRef();

  clubPayment.value = {
    paymentRef: paymentRef.value,
    status: "awaiting payment",
    surname: enteredSurname.value.val,
    childName: enteredChildFirstName.value.val,
    parentName: enteredParentName.value.val,
    contactNumber: enteredPhone.value.val,
    email: enteredEmail.value.val,
    clubsBooked: JSON.stringify(checkedClubs.value.val),
    clubsQty: checkedClubs.value.val.length,
    amountDue: cost.value,
    school: selectedSchool.value.val,
    yearGroup: enteredYearGroup.value.val,
    medicalConds: enteredMedical.value.val,
  };

  console.log("club payment", clubPayment.value);
  const createdPayment = await $fetch("/api/clubs/clubPayment", {
    method: "post",
    body: clubPayment.value,
  });

  paymentSummary.value = createdPayment.fields;
  console.log("payment res****", createdPayment.fields);

  if (createdPayment.id) {
    for (let club of checkedClubs.value.val) {
      createBookingRef(club);
      clubDetails.value = filteredClubs.value.find((item) => item.clubRef === club);

      clubBooking.value = {
        club: clubDetails.value.clubName,
        paymentRef: paymentRef.value,
        bookingRef: bookingRef.value,
        surname: enteredSurname.value.val,
        childName: enteredChildFirstName.value.val,
        parentName: enteredParentName.value.val,
        contactNumber: enteredPhone.value.val,
        email: enteredEmail.value.val,
        altParentName: enteredAltParentName.value.val,
        altParentContact: enteredAltContact.value.val,
        medicalConds: enteredMedical.value.val,
        yearGroup: enteredYearGroup.value.val,
        school: selectedSchool.value.val,
        startDate: clubDetails.value.startDate,
        endDate: clubDetails.value.endDate,
        sessionCost: clubDetails.value.pricePerSession,
        sessionsPerTerm: clubDetails.value.sessions,
        termCost: clubDetails.value.termCost,
        status: "reserved awaiting payment",
      };

      const createdBooking = await $fetch("/api/clubs/clubBooking", {
        method: "post",
        body: clubBooking.value,
      });

      bookingSummary.value.push(createdBooking.fields);

      if (bookingSummary.value.length === checkedClubs.value.val.length) {
        const date = new Date().toLocaleString("en-GB");
        const router = useRouter();
        router.replace({
          path: "/clubs/success",
          query: {
            name: enteredParentName.value.val,
            childName: enteredChildFirstName.value.val,
            surname: enteredSurname.value.val,
            phone: enteredPhone.value.val,
            email: enteredEmail.value.val,
            paymentRef: paymentRef.value,
            school: selectedSchool.value.val,
            yearGroup: enteredYearGroup.value.val,
            medicalConds: enteredMedical.value.val,
            clubsBooked: JSON.stringify(checkedClubs.value.val),
            clubsQty: checkedClubs.value.val.length,
            amountDue: cost.value,
            bookingDate: date,
          },
        });
      }
    }
  } else {
    alert("Oops, something has gone wrong, please try again later.");
  }
}
</script>

<template>
  <BaseCard>
    <div id="text">
      <h2 class="text-accent font-play">School Clubs Booking Form</h2>
      <p class="text-light">
        We currently run school clubs at Sidlesham Primary School, West Witterings Primary
        School and Portfield Academy in West Sussex.
      </p>
      <p class="text-light">
        Clubs run for 6 weeks and will be need to will need to be paid in a block booking
        for all weeks.
      </p>
      <p class="text-light">
        Morning School Clubs have a maximum capacity of 12 children.
      </p>
      <p class="text-light">After School Clubs have a maximum capacity of 24 children.</p>
      <p class="text-light">
        Clubs that are full to maximum capacity will not show up when selecting your
        child&#39;s year and school which filters suitable clubs for your convenience. We
        apologise for any disappointment and recommend booking as soon as possible.
      </p>
      <p class="text-light">
        Please complete the booking form to reserve a place for your child at one of the
        many clubs we run at our schools. We will email confirmation to your privided
        email address once we receive payment into our bank and your child&#39;s place
        will then be confirmed for the term. Please use the booking reference provided
        when you make payment so that we can allocate it correctly to all the clubs
        included in your booking.
      </p>
      <p class="text-light">
        Please refer to our FAQ&#39;s for more info or contact us if you have additional
        questions.
      </p>
    </div>
    <div id="form">
      <form @submit.prevent="handleSubmitClubBooking">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div class="md:text-end" :class="{ invalid: !enteredParentName.isValid }">
            <label>Parent / Guardian Name *</label>
          </div>
          <div :class="{ invalid: !enteredParentName.isValid }">
            <input
              type="text"
              v-model.trim.lazy="enteredParentName.val"
              class="w-full p-2 rounded"
              autocomplete="name"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredPhone.isValid }">
            <label for="mainContact">Mobile Number *</label>
          </div>
          <div :class="{ invalid: !enteredPhone.isValid }">
            <input
              type="tel"
              v-model.trim.lazy="enteredPhone.val"
              class="w-full p-2 rounded"
              autocomplete="tel"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredEmail.isValid }">
            <label for="email">Email Address *</label>
          </div>
          <div :class="{ invalid: !enteredEmail.isValid }">
            <input
              type="email"
              v-model.trim.lazy="enteredEmail.val"
              class="w-full p-2 rounded"
              autocomplete="email"
            />
          </div>
          <div class="md:text-end">
            <label>Alternate Parent Name</label>
          </div>
          <div>
            <input
              type="text"
              class="w-full p-2 rounded"
              v-model.trim.lazy="enteredAltParentName"
            />
          </div>
          <div class="md:text-end">
            <label>Alternate Contact Number</label>
          </div>
          <div>
            <input
              name="altContact"
              id="altContact"
              type="tel"
              class="w-full p-2 rounded"
              v-model.trim.lazy="enteredAltContact"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredChildFirstName.isValid }">
            <label for="childFName">Pupil First Name *</label>
          </div>
          <div :class="{ invalid: !enteredChildFirstName.isValid }">
            <input
              name="childFName"
              id="childFName"
              type="text"
              v-model.trim.lazy="enteredChildFirstName.val"
              class="w-full p-2 rounded"
              autocomplete="child-name"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredSurname.isValid }">
            <label for="surname">Surname *</label>
          </div>
          <div :class="{ invalid: !enteredSurname.isValid }">
            <input
              type="text"
              v-model.trim.lazy="enteredSurname.val"
              class="w-full p-2 rounded"
              autocomplete="family-name"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredMedical.isValid }">
            <label for="medical">Medical Conditions *</label>
          </div>
          <div :class="{ invalid: !enteredMedical.isValid }">
            <textarea
              rows="4"
              v-model="enteredMedical.val"
              class="w-full p-2 rounded"
              placeholder="Please tell us about any medical conditions we need to be aware of. (None if N/A)"
            ></textarea>
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredYearGroup.isValid }">
            <label>Year Group *</label>
          </div>
          <div :class="{ invalid: !enteredYearGroup.isValid }">
            <select v-model="enteredYearGroup.val" class="w-full p-2 rounded">
              <option disabled value="select">Select year...</option>
              <option v-for="(n, i) in 6" :key="i" :value="n">
                {{ n }}
              </option>
            </select>
          </div>
          <div v-if="schoolError">
            <p>{{ schoolError }} Please contact us to book.</p>
          </div>
          <div class="md:text-end" :class="{ invalid: !selectedSchool.isValid }">
            <label for="school">School *</label>
          </div>
          <div v-if="schoolList.length" :class="{ invalid: !selectedSchool.isValid }">
            <select v-model="selectedSchool.val" class="w-full p-2 rounded">
              <option disabled value="select">Select School...</option>
              <option
                v-for="school in schoolOptions"
                :key="school.id"
                :value="school.schoolName"
              >
                {{ school.schoolName }}
              </option>
            </select>
          </div>
          <div v-else class="form-control">
            <p class="text-light">Loading schools...</p>
          </div>
        </div>
        <div v-if="clubError">
          <p>{{ clubError }} Please contact us to book.</p>
        </div>
        <div v-if="filteredClubs.length">
          <div
            v-for="club in filteredClubs"
            :key="club.id"
            class="flex items-center justify-end mb-2 relative pt-4"
            :class="{
              invalid: !checkedClubs.isValid,
            }"
          >
            <label
              >{{ club.clubName }} ({{ club.clubRef }} Years
              <span v-for="year in club.yearRange"> {{ year }}</span
              >)</label
            >
            <input
              type="checkbox"
              :value="club.clubRef"
              v-model="checkedClubs.val"
              class="absolute opacity-0 h-8 w-8"
            />
            <div
              class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center ml-4"
            >
              <svg
                class="fill-current hidden w-5 h-5 pointer-events-none"
                version="1.1"
                viewBox="0 0 17 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fill-rule="evenodd">
                  <g transform="translate(-9 -11)" fill="#F88425" fill-rule="nonzero">
                    <path
                      d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div v-else>
          <p
            class="text-light"
            v-if="enteredYearGroup !== 'select' || selectedSchool !== 'select'"
          >
            Sorry, there are no clubs available for your selections.
          </p>
          <p class="text-light" v-else>Select a year group and school to load clubs...</p>
        </div>
        <div class="flex flex-col">
          <!-- cost buttons -->
          <div v-if="checkedClubs.val.length" class="relative">
            <p class="text-light">
              Total cost for all checked clubs for the term: £{{ cost }}
            </p>
          </div>
          <button
            v-if="checkedClubs.val.length"
            @click="clearCost"
            class="btn-accent self-end"
          >
            Clear
          </button>
        </div>
        <div
          class="flex items-center justify-end mb-2 relative pt-12"
          :class="{
            invalid: !acceptedTerms.isValid,
          }"
        >
          <label class="select-none">Accept T's &amp; C's</label>
          <input
            type="checkbox"
            v-model="acceptedTerms.val"
            class="absolute opacity-0 h-8 w-8"
          />

          <div
            class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center ml-4"
            :class="{
              invalid: !acceptedTerms.isValid,
            }"
          >
            <svg
              class="fill-current hidden w-5 h-5 pointer-events-none"
              version="1.1"
              viewBox="0 0 17 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(-9 -11)" fill="#F88425" fill-rule="nonzero">
                  <path
                    d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <p v-if="!formIsValid" class="text-xl">
          One or more fields are invalid and/or at least one club selection is required.
          Please correct the errors and submit again.
        </p>
        <div class="md:flex md:justify-end">
          <button class="btn-accent my-4 w-full md:w-fit">Submit Booking</button>
        </div>
      </form>
    </div>
  </BaseCard>
</template>

<style scoped></style>
