<script setup lang="ts">
import { useRouter } from "#imports";

import type {
  ClubRecord,
  ClubOption,
  SchoolRecord,
  SchoolOption,
  ClubPaymentRecord,
  ClubBookingRecord,
} from "../../../types/booking";

import { useBookingApi } from "~/composables/useBookingApi";
import { useSelectionCost } from "~/composables/useSelectionCost";

const { guardedFetch } = useBookingApi();
const router = useRouter();

/**
 * Remote data: clubs & schools
 */
const clubError = ref<string | null>(null);
const schoolError = ref<string | null>(null);

const clubOptions = ref<ClubOption[]>([]);
const schoolOptions = ref<SchoolOption[]>([]);

const clubList =
  (await guardedFetch<ClubRecord[]>("/api/clubs/clubsList")) ?? null;
const schoolList =
  (await guardedFetch<SchoolRecord[]>("/api/clubs/schoolList")) ?? null;

if (Array.isArray(clubList)) {
  clubOptions.value = clubList.map((record, index) => ({
    index: index + 1,
    id: record.id,
    clubName: record.clubName,
    yearRange: record.yearRange ?? [],
    clubRef: record.clubRef,
    schoolName: record.schoolName,
    schoolRef: record.schoolRef,
    startDate: record.startDate,
    endDate: record.endDate,
    sessions: record.sessions,
    pricePerSession: record.pricePerSession,
    termCost: record.termCost,
    spaceAvailable: record.spaceAvailable,
    status: record.status ?? null,
  }));
} else {
  clubError.value = "Unable to load clubs at this time.";
}

if (Array.isArray(schoolList)) {
  schoolOptions.value = schoolList.map((record, index) => ({
    index: index + 1,
    id: record.id,
    schoolName: record.schoolName,
    schoolRef: record.schoolRef,
    status: record.status ?? null,
  }));
} else {
  schoolError.value = "Unable to load schools at this time.";
}

/**
 * Form state
 */
const enteredParentName = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredEmail = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredPhone = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredAltParentName = ref<string>("");
const enteredAltContact = ref<string>("");

const enteredChildFirstName = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredSurname = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredMedical = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredYearGroup = ref<{ val: string; isValid: boolean }>({
  val: "select",
  isValid: true,
});
const selectedSchool = ref<{ val: string; isValid: boolean }>({
  val: "select",
  isValid: true,
});

const filteredClubs = ref<ClubOption[]>([]);
const checkedClubs = ref<{ val: string[]; isValid: boolean }>({
  val: [],
  isValid: true,
});

const acceptedTerms = ref<{ val: boolean; isValid: boolean }>({
  val: false,
  isValid: true,
});

const bookingRef = ref<string>("");
const paymentRef = ref<string>("");
const clubBooking = ref<Partial<ClubBookingRecord>>({});
const clubPayment = ref<Partial<ClubPaymentRecord>>({});
const formIsValid = ref<boolean>(true);

const clubDetails = ref<ClubOption | null>(null);
const bookingSummary = ref<ClubBookingRecord[]>([]);
const paymentSummary = ref<ClubPaymentRecord | null>(null);
const submitDisabled = ref<boolean>(false);

/**
 * Helpers
 */
const createPaymentRef = () => {
  paymentRef.value = Date.now().toString(36);
};

const createBookingRef = (clubRef: string) => {
  bookingRef.value = `${paymentRef.value}-${clubRef}`;
};

const getClubDetails = (clubRef: string): ClubOption | null => {
  const details = filteredClubs.value.find(
    (item: ClubOption) => item.clubRef === clubRef
  );
  return details ?? null;
};

/**
 * Year options derived from Airtable club data (not hard-coded)
 */
const yearOptions = computed<string[]>(() => {
  const schoolRef = selectedSchool.value.val;
  const years = new Set<string>();

  for (const club of clubOptions.value) {
  if (schoolRef !== "select" && club.schoolRef !== schoolRef) continue;

  for (const token of club.yearRange) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    years.add(trimmed);
  }
}

  const ordered = Array.from(years);
  const order = ["R", "1", "2", "3", "4", "5", "6"];

  ordered.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);

    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return ordered;
});

/**
 * Filter clubs based on school + year group + status
 */
const updateFilteredClubs = () => {
  const schoolRef = selectedSchool.value.val;
  const year = enteredYearGroup.value.val;

  filteredClubs.value = clubOptions.value.filter((club) => {
    const isUpcoming =
      typeof club.status === "string" && club.status.includes("upcoming");

    if (!isUpcoming) return false;

    // Require both filters before showing any clubs
    if (schoolRef === "select" || year === "select") {
      return false;
    }

    const matchesYear = club.yearRange.includes(year);

    return club.schoolRef === schoolRef && matchesYear;
  });
};

watch(
  [() => selectedSchool.value.val, () => enteredYearGroup.value.val],
  () => updateFilteredClubs(),
  { immediate: true }
);

/**
 * Keep clubDetails in sync with selection (single-club focus)
 */
watch(
  () => checkedClubs.value.val,
  (refs) => {
    if (refs.length === 1) {
      clubDetails.value = getClubDetails(refs[0]!);
    } else {
      clubDetails.value = null;
    }
  },
  { deep: true, immediate: true }
);

/**
 * Cost calculation via shared composable
 *
 * One child can select multiple clubs; cost is sum of termCost for all selected.
 */
const selectedClubRefs = computed(() => checkedClubs.value.val);

const { cost, recalculate } = useSelectionCost<ClubOption>(
  selectedClubRefs,
  filteredClubs,
  (option, refVal) => option.clubRef === refVal
);
/**
 * Clear all selected clubs and reset cost
 */
const clearSelection = () => {
  // Uncheck all checkboxes
  checkedClubs.value = { val: [], isValid: true };

  // Clear focused club details (if any)
  clubDetails.value = null;

  // Recalculate cost (selectedClubRefs is now empty)
  recalculate();
};
/**
 * Validation
 */
const validateForm = () => {
  formIsValid.value = true;

  if (!enteredParentName.value.val.trim()) {
    enteredParentName.value.isValid = false;
    formIsValid.value = false;
  } else {
    enteredParentName.value.isValid = true;
  }

  if (
    !enteredEmail.value.val.trim() ||
    !enteredEmail.value.val.includes("@")
  ) {
    enteredEmail.value.isValid = false;
    formIsValid.value = false;
  } else {
    enteredEmail.value.isValid = true;
  }

  if (!enteredPhone.value.val.trim()) {
    enteredPhone.value.isValid = false;
    formIsValid.value = false;
  } else {
    enteredPhone.value.isValid = true;
  }

  if (!enteredChildFirstName.value.val.trim()) {
    enteredChildFirstName.value.isValid = false;
    formIsValid.value = false;
  } else {
    enteredChildFirstName.value.isValid = true;
  }

  if (!enteredSurname.value.val.trim()) {
    enteredSurname.value.isValid = false;
    formIsValid.value = false;
  } else {
    enteredSurname.value.isValid = true;
  }

  if (enteredYearGroup.value.val === "select") {
    enteredYearGroup.value.isValid = false;
    formIsValid.value = false;
  } else {
    enteredYearGroup.value.isValid = true;
  }

  if (selectedSchool.value.val === "select") {
    selectedSchool.value.isValid = false;
    formIsValid.value = false;
  } else {
    selectedSchool.value.isValid = true;
  }

  if (!enteredMedical.value.val.trim()) {
    enteredMedical.value.isValid = false;
    formIsValid.value = false;
  } else {
    enteredMedical.value.isValid = true;
  }

  if (!checkedClubs.value.val.length) {
    checkedClubs.value.isValid = false;
    formIsValid.value = false;
  } else {
    checkedClubs.value.isValid = true;
  }

  if (!acceptedTerms.value.val) {
    acceptedTerms.value.isValid = false;
    formIsValid.value = false;
  } else {
    acceptedTerms.value.isValid = true;
  }
};

/**
 * Submit: payment then bookings
 */
const handleSubmitClubBooking = async () => {
  validateForm();
  if (!formIsValid.value) {
    return;
  }

  submitDisabled.value = true;
  createPaymentRef();

  const clubsBookedNames: string[] = [];
  checkedClubs.value.val.forEach((clubRef) => {
    const details = getClubDetails(clubRef);
    if (details) {
      clubsBookedNames.push(details.clubName);
    }
  });

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

  const createdPayment = await guardedFetch<ClubPaymentRecord>(
    "/api/clubs/clubPayment",
    {
      method: "post",
      body: clubPayment.value,
    }
  );

  if (!createdPayment || !createdPayment.id) {
    submitDisabled.value = false;
    alert("Oops, something has gone wrong, please try again later.");
    return;
  }

  paymentSummary.value = createdPayment;

  for (const clubRef of checkedClubs.value.val) {
    createBookingRef(clubRef);

    const details = getClubDetails(clubRef);
    if (!details) continue;

    clubBooking.value = {
      club: details.clubName,
      paymentRef: paymentRef.value,
      bookingRef: bookingRef.value,
      surname: enteredSurname.value.val,
      childName: enteredChildFirstName.value.val,
      parentName: enteredParentName.value.val,
      contactNumber: enteredPhone.value.val,
      email: enteredEmail.value.val,
      altParentName: enteredAltParentName.value,
      altParentContact: enteredAltContact.value,
      medicalConds: enteredMedical.value.val,
      yearGroup: enteredYearGroup.value.val,
      school: selectedSchool.value.val,
      startDate: details.startDate,
      endDate: details.endDate,
      sessionCost: details.pricePerSession,
      sessionsPerTerm: details.sessions,
      termCost: details.termCost,
      status: "reserved awaiting payment",
      clubRef: details.clubRef,
      sessions: details.sessions,
    };

    const createdBooking = await guardedFetch<ClubBookingRecord>(
      "/api/clubs/clubBooking",
      {
        method: "post",
        body: clubBooking.value,
      }
    );

    if (createdBooking && createdBooking.id) {
      bookingSummary.value.push(createdBooking);
    }
  }

  const date = new Date().toLocaleString("en-GB");

  await router.replace({
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

  submitDisabled.value = false;
};
</script>

<template>
  <BaseCard>
    <div id="text">
      <h2 class="text-accent font-play">School Clubs Booking Form</h2>
      <p class="text-light">
        Please complete the booking form to reserve a place for your child at
        one of the many clubs we run at our schools in West Sussex and
        Hampshire. We will email confirmation to your provided email address
        once we receive payment into our bank and your child&#39;s place will
        then be confirmed for the term. Please use the booking reference
        provided when you make payment so that we can allocate it correctly to
        all the clubs included in your booking.
      </p>
      <p class="text-light">
        Clubs will need to be paid in a block booking for all weeks.
      </p>
      <p class="text-light">
        Block booking lengths may vary due to bank holiday's and school
        closures.
      </p>
      <p class="text-light">
        Morning School Clubs have a maximum capacity of 12 children.
      </p>
      <p class="text-light">
        After School Clubs have a maximum capacity of 24 children.
      </p>
      <p class="text-light">
        Clubs that are full to maximum capacity will not show up when selecting
        your child&#39;s year and school which filters suitable clubs for your
        convenience. We apologise for any disappointment and recommend booking
        as soon as possible.
      </p>

      <p class="text-light">
        Please refer to our
        <NuxtLink to="/faqs"
          ><span class="cursor-pointer font-play underline"
            >FAQ&#39;s</span
          ></NuxtLink
        >
        for more info or contact us if you have additional questions.
      </p>
    </div>
    <div id="form">
      <form @submit.prevent="handleSubmitClubBooking">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div
            class="md:text-end"
            :class="{ invalid: !enteredParentName.isValid }"
          >
            <label for="club-booking-parentName">Parent / Guardian Name *</label>
          </div>
          <div :class="{ invalid: !enteredParentName.isValid }">
            <input
            id="club-booking-parentName"
              type="text"
              v-model.trim.lazy="enteredParentName.val"
              class="w-full p-2 rounded"
              autocomplete="name"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredPhone.isValid }">
            <label for="club-booking-mainContact">Mobile Number *</label>
          </div>
          <div :class="{ invalid: !enteredPhone.isValid }">
            <input
            id="club-booking-mainContact"
              type="tel"
              v-model.trim.lazy="enteredPhone.val"
              class="w-full p-2 rounded"
              autocomplete="tel"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !enteredEmail.isValid }">
            <label for="club-booking-email">Email Address *</label>
          </div>
          <div :class="{ invalid: !enteredEmail.isValid }">
            <input
            id="club-booking-email"
              type="email"
              v-model.trim.lazy="enteredEmail.val"
              class="w-full p-2 rounded"
              autocomplete="email"
            />
          </div>
          <div class="md:text-end">
            <label for="club-booking-altParentName">Alternate Parent Name</label>
          </div>
          <div>
            <input
            id="club-booking-altParentName"
              type="text"
              class="w-full p-2 rounded"
              v-model.trim.lazy="enteredAltParentName"
            />
          </div>
          <div class="md:text-end">
            <label for="club-booking-altParentContact">Alternate Contact Number</label>
          </div>
          <div>
            <input
              name="altContact"
              id="club-booking-altParentContact"
              type="tel"
              class="w-full p-2 rounded"
              v-model.trim.lazy="enteredAltContact"
            />
          </div>
          <div
            class="md:text-end"
            :class="{ invalid: !enteredChildFirstName.isValid }"
          >
            <label for="club-booking-childFName">Pupil First Name *</label>
          </div>
          <div :class="{ invalid: !enteredChildFirstName.isValid }">
            <input
              name="childFName"
              id="club-booking-childFName"
              type="text"
              v-model.trim.lazy="enteredChildFirstName.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div
            class="md:text-end"
            :class="{ invalid: !enteredSurname.isValid }"
          >
            <label for="club-booking-childSurname">Surname *</label>
          </div>
          <div :class="{ invalid: !enteredSurname.isValid }">
            <input
            id="club-booking-childSurname"
              type="text"
              v-model.trim.lazy="enteredSurname.val"
              class="w-full p-2 rounded"
              autocomplete="family-name"
            />
          </div>
          <div
            class="md:text-end"
            :class="{ invalid: !enteredMedical.isValid }"
          >
            <label for="club-booking-medical">Medical Conditions *</label>
          </div>
          <div :class="{ invalid: !enteredMedical.isValid }">
            <textarea
            id="club-booking-medical"
              rows="4"
              v-model="enteredMedical.val"
              class="w-full p-2 rounded"
              placeholder="Please tell us about any medical conditions we need to be aware of. (None if N/A)"
            ></textarea>
          </div>
          <div
            class="md:text-end"
            :class="{ invalid: !enteredYearGroup.isValid }"
          >
            <label for="club-booking-yearGroup">Year Group *</label>
          </div>
          <div :class="{ invalid: !enteredYearGroup.isValid }">
            <select v-model="enteredYearGroup.val" class="w-full p-2 rounded" id="club-booking-yearGroup">
              <option disabled value="select">Select year...</option>

              <option
                v-for="year in yearOptions"
                :key="year"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>
          <div v-if="schoolError">
            <p>{{ schoolError }} Please contact us to book.</p>
          </div>
          <div
            class="md:text-end"
            :class="{ invalid: !selectedSchool.isValid }"
          >
            <label for="club-booking-schoolName">School *</label>
          </div>
          <div
            v-if="schoolOptions.length"
            :class="{ invalid: !selectedSchool.isValid }"
          >
            <select v-model="selectedSchool.val" class="w-full p-2 rounded" id="club-booking-schoolName">
              <option disabled value="select">Select School...</option>
              <option
                v-for="school in schoolOptions"
                :key="school.id"
                :value="school.schoolRef"
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
            <label for="club-booking-clubOptions"
              >{{ club.clubName }}: ({{ club.clubRef }} : Years
              <span v-for="year in club.yearRange"> {{ year }}</span
              >)</label
            >
            <input
              id="club-booking-clubOptions"
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
                  <g
                    transform="translate(-9 -11)"
                    fill="#F88425"
                    fill-rule="nonzero"
                  >
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
          <p class="text-light">
            If there are no clubs to display for your selected school and school
            year, kindly refer to our
            <NuxtLink to="/clubs/upcoming"
              ><span class="font-play underline cursor-pointer"
                >upcoming clubs</span
              ></NuxtLink
            >
            page for more info.
          </p>
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
            @click="clearSelection"
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
          <label for="club-booking-termsAccepted" class="select-none">Accept T's &amp; C's</label>
          <input
            type="checkbox"
            v-model="acceptedTerms.val"
            class="absolute opacity-0 h-8 w-8"
            id="club-booking-termsAccepted"
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
                <g
                  transform="translate(-9 -11)"
                  fill="#F88425"
                  fill-rule="nonzero"
                >
                  <path
                    d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <p v-if="!formIsValid" class="text-2xl text-light">
          One or more fields are invalid and/or at least one club selection is
          required. Please correct the errors and submit again.
        </p>
        <div class="md:flex md:justify-end">
          <button
            class="btn-accent my-4 w-full md:w-fit"
            :disabled="submitDisabled === true"
          >
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  </BaseCard>
</template>
