<script setup>
// retrieve data for haf pop up
const { data: cms } = await useFetch("/api/cms");
const content = ref([]);
let element = {};
cms.value.forEach((record, index) => {
  element = {
    index: index + 1,
    name: record.fields.element,
    content: record.fields.content,
    display: record.fields.display,
    modified: record.fields.lastUpdated,
  };
  content.value.push(element);
});
// pop up when haf is selected
const hafContent = computed(() => {
  return content.value.find(item => item.name === "haf");
});
// fetched data / props ****
const { data: campLocList, error } = await useFetch("/api/camps/campLocList");
const props = defineProps(["parentAdded", "error", "campsList"]);
// events ****
const emit = defineEmits([
  "parent-submitted",
  "camp-booking-added",
  "show-steps",
]);
async function showSteps() {
  emit("show-steps");
}

// parent form data ****

const enteredParentName = ref({ val: "", isValid: true });
const enteredMainContact = ref({ val: "", isValid: true });
const enteredEmail = ref({ val: "", isValid: true });
const acceptedTerms = ref({ val: false, isValid: true });
const parentFormIsValid = ref(true);
// const savedParent = ref({});

// parent form validation
const validateParentForm = () => {
  parentFormIsValid.value = true;
  if (enteredParentName.value.val === "") {
    enteredParentName.value.isValid = false;
    parentFormIsValid.value = false;
  }
  if (enteredEmail.value.val === "" || !enteredEmail.value.val.includes("@")) {
    enteredEmail.value.isValid = false;
    parentFormIsValid.value = false;
  }
  if (enteredMainContact.value.val === null) {
    enteredMainContact.value.isValid = false;
    parentFormIsValid.value = false;
  }
  if (acceptedTerms.value.val === false) {
    acceptedTerms.value.isValid = false;
    parentFormIsValid.value = false;
  }
};
// parent form submission
async function onSubmitParent() {
  validateParentForm();
  if (!parentFormIsValid) {
    return;
  }
  emit(
    "parent-submitted",
    enteredParentName.value.val,
    enteredMainContact.value.val,
    enteredEmail.value.val,
    acceptedTerms.value.val,
  );
}

// child form data
const childName = ref({ val: "", isValid: true });
const childSurname = ref({ val: "", isValid: true });
const ageRange = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const childAge = ref({ val: "select", isValid: true });

const pupilPrem = ref(false);
const ppIsChecked = ref(false);
const title = "Pupil Premium Booking";
watch(pupilPrem, () => {
  ppIsChecked.value = pupilPrem.value ? true : false;
});
const confirmPP = () => {
  ppIsChecked.value = false;
};
const hafID = ref({ val: "", isValid: true });
const confirmedPhoto = ref(true);

// camp details
const locationOptions = ref([]);
let location = {};
campLocList.value.forEach((record, index) => {
  location = {
    index: index + 1,
    id: record.id,
    locationName: record.fields.locationName,
    locRef: record.fields.locRef,
    locPrice: record.fields.pricePerDay,
  };
  locationOptions.value.push(location);
});

const campLoc = ref({ val: "" });
const filteredCamps = ref([]);
const hafFilteredCamps = ref([]);
const campDetails = ref({});
const filterCampsByLoc = computed(() => {
  let loc = campLoc.value.val;
  return (filteredCamps.value = props.campsList.filter(
    camp => camp.locRef === loc,
  ));
});

const filterCampsByHaf = computed(() => {
  return (hafFilteredCamps.value = filteredCamps.value.filter(
    camp => camp.haf === true,
  ));
});

const campName = ref({ val: "select", isValid: true });
const campWeekSelected = computed(() => {
  campDaysSelected.value.val = [];
  return campName.value.val === "select" ? false : true;
});

const findCampByRef = computed(() => {
  campDetails.value = props.campsList.find(
    camp => camp.campRef === campName.value.val,
  );
});

// build checkbox days from campRef

watch(findCampByRef, () => {
  campDetails.value = [];
  campDetails.value = props.campsList.find(
    camp => camp.campRef === campName.value.val,
  );
});

watch(campName, () => {
  campWeekSelected = false;
  campDaysSelected.value.val = [];
  campDetails.value = [];
  findCampByRef.value;
  return campDetails.value;
});

const campDaysSelected = ref({ val: [], isValid: true });
const numCampDays = ref(null);

const calculatedDays = computed(() => {
  return (numCampDays.value = campDaysSelected.value.val.length);
});

watchEffect(() => {
  pupilPrem.value;
  campLoc.value.val;
  filterCampsByLoc.value;
  filteredCamps.value;
  filterCampsByHaf.value;
  hafFilteredCamps.value;
  campName.value.val;
  campWeekSelected;
  findCampByRef.value;
  campDetails.value;
  campDaysSelected.value.val;
  calculatedDays.value;
  numCampDays.value;
});

const campFormIsValid = ref(true);

// camp form **
// validation
const validateCampForm = () => {
  campFormIsValid.value = true;
  if (childName.value.val === null) {
    childName.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (childSurname.value.val === "") {
    childSurname.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (childAge.value.val === "select") {
    childAge.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (pupilPrem) {
    if (hafID.value.val === "") {
      hafID.value.isValid = false;
      campFormIsValid.value = false;
    }
  }

  if (campName.value.val === "select") {
    campName.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (campDaysSelected.value.val.length === 0) {
    campDaysSelected.value.isValid = false;
    campFormIsValid.value = false;
  }
};
// submission
const onAddBookingItem = () => {
  validateCampForm();
  if (!campFormIsValid) {
    return;
  }
  emit(
    "camp-booking-added",
    childName.value.val,
    childSurname.value.val,
    childAge.value.val,
    pupilPrem.value,
    hafID.value.val,
    confirmedPhoto.value,
    campLoc.value.val,
    campName.value.val,
    campDaysSelected.value.val,
    numCampDays.value,
  );
  // reset after each booking is added
  childName.value.val = "";
  childSurname.value.val = "";
  childAge.value.val = "select";
  pupilPrem.value = false;
  hafID.value.val = "";
  campLoc.value.val = "select";
  campName.value.val = "select";
  campDaysSelected.value.val = [];
  campFormIsValid = true;
};
</script>

<template>
  <BaseDialog @close="confirmPP" :open="ppIsChecked" :title="title">
    <template #content>
      <p v-if="hafContent.display" class="font-play">
        {{ hafContent.content }}
      </p>
      <p class="text-dark">
        <span class="font-play"
          ><em>
            For weeks that include HAF places provided by the council:</em
          ></span
        >
        your child's HAF ID is required so that the council can confirm the
        booking. If there are any issues we will contact you directly.
      </p>
    </template>
    <template #actions>
      <button @click="confirmPP" class="btn-primary">Got It!</button>
    </template>
  </BaseDialog>
  <div id="text">
    <h1 class="text-accent font-play capitalize">camp bookings</h1>
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
  <div id="forms" class="my-2">
    <h3>1: Parent/Guardian Details</h3>
    <div id="parent-details" v-if="!parentAdded">
      <form @submit.prevent="onSubmitParent">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div
            class="md:text-end"
            :class="{ invalid: !enteredParentName.isValid }"
          >
            <label>Name</label>
          </div>
          <div :class="{ invalid: !enteredParentName.isValid }">
            <input
              type="text"
              v-model.trim.lazy="enteredParentName.val"
              class="w-full p-2 rounded"
              autocomplete="name"
              required
            />
          </div>
          <div
            class="md:text-end"
            :class="{ invalid: !enteredMainContact.isValid }"
          >
            <label>Mobile Number</label>
          </div>
          <div :class="{ invalid: !enteredMainContact.isValid }">
            <input
              type="tel"
              v-model.trim.lazy="enteredMainContact.val"
              class="w-full p-2 rounded"
              autocomplete="tel"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !enteredEmail.isValid,
            }"
          >
            <label>Email</label>
          </div>
          <div
            :class="{
              invalid: !enteredEmail.isValid,
            }"
          >
            <input
              type="email"
              v-model.trim.lazy="enteredEmail.val"
              class="w-full p-2 rounded"
              placeholder="Your best email"
              autocomplete="email"
              required
            />
          </div>
        </div>
        <div class="flex items-center justify-end mb-2 relative pt-4">
          <div
            :class="{
              invalid: !acceptedTerms.isValid,
            }"
          >
            <label for="terms-agreed" class="select-none"
              >Accept T's &amp; C's</label
            >
          </div>
          <input
            type="checkbox"
            name="terms-agreed"
            v-model="acceptedTerms.val"
            class="absolute opacity-0 h-8 w-8"
            required
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
        <div class="md:flex md:justify-end">
          <button class="btn-accent my-4 w-full md:w-fit">Save Details</button>
        </div>
      </form>
      <p class="error" v-if="!parentFormIsValid">
        One or more fields are invalid. Please correct the errors and submit
        again.
      </p>
    </div>

    <p v-else class="text-accent">Details saved successfully.</p>

    <!-- camp booking item form -->
    <div v-if="parentAdded">
      <form @submit.prevent="onAddBookingItem">
        <!-- child details -->
        <h3>2: Child Details</h3>

        <div
          id="child-details"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full"
        >
          <div class="md:text-end" :class="{ invalid: !childName.isValid }">
            <label>First Name</label>
          </div>
          <div :class="{ invalid: !childName.isValid }">
            <input
              type="text"
              v-model.trim.lazy="childName.val"
              class="w-full p-2 rounded"
              autocomplete="name"
              required
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !childSurname.isValid }">
            <label>Surname</label>
          </div>
          <div :class="{ invalid: !childSurname.isValid }">
            <input
              type="text"
              v-model.trim.lazy="childSurname.val"
              class="w-full p-2 rounded"
              autocomplete="family-name"
              required
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !childAge.isValid,
            }"
          >
            <label>Age</label>
          </div>
          <div
            :class="{
              invalid: !childAge.isValid,
            }"
          >
            <select
              name="childAge"
              id="childAge"
              v-model.number="childAge.val"
              required
              class="w-full p-2 rounded"
            >
              <option disabled value="select">Select age at camp ...</option>
              <option v-for="(n, i) in ageRange" :key="i" :value="n">
                {{ n }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-end mb-2 relative pt-4">
          <label for="pupil-premium" class="select-none">HAF Booking?</label>
          <input
            type="checkbox"
            name="pupil-premium"
            v-model="pupilPrem"
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
        <div
          v-if="pupilPrem"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full pt-2"
        >
          <div class="md:text-end" :class="{ invalid: !hafID.isValid }">
            <label>HAF ID Code</label>
          </div>
          <div>
            <input
              type="text"
              v-model.trim.lazy="hafID.val"
              class="w-full p-2 rounded"
              autocomplete="off"
              placeholder="HAF..."
            />
          </div>
        </div>
        <div class="flex items-center justify-end mb-2 relative pt-4">
          <label for="photo-permission" class="select-none"
            >Photo permission</label
          >
          <input
            type="checkbox"
            name="photo-permission"
            v-model="confirmedPhoto"
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

        <!-- /child details -->
        <!-- camp details -->
        <h3>3: Camp Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div class="md:text-end">
            <label>Camp Location</label>
          </div>
          <div>
            <select
              name="camp-loc"
              id="camp-loc"
              required
              v-model="campLoc.val"
              class="w-full p-2 rounded"
            >
              <option disabled value="select">Choose a location...</option>
              <option
                v-for="option in locationOptions"
                :value="option.locRef"
                :key="option.id"
              >
                {{ option.locationName }}
              </option>
            </select>
          </div>
        </div>
        <!-- camp week -->
        <div
          v-if="filteredCamps.length"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full pt-4"
        >
          <div
            class="md:text-end"
            :class="{
              invalid: !campName.isValid,
            }"
          >
            <label>Camp week</label>
          </div>
          <div
            v-if="!pupilPrem"
            :class="{
              invalid: !campName.isValid,
            }"
          >
            <select required v-model="campName.val" class="w-full p-2 rounded">
              <option disabled value="select">Select a camp...</option>
              <option
                v-for="option in filteredCamps"
                :value="option.campRef"
                :key="option.id"
              >
                {{ option.campName }} £{{ option.pricePerDay }} p/day
              </option>
            </select>
          </div>
          <div
            v-if="pupilPrem"
            :class="{
              invalid: !campName.isValid,
            }"
          >
            <select required v-model="campName.val" class="w-full p-2 rounded">
              <option disabled value="select">Select a camp...</option>
              <option
                v-for="option in hafFilteredCamps"
                :value="option.campRef"
                :key="option.id"
              >
                {{ option.campName }} £{{ option.pricePerDay }} p/day
              </option>
            </select>
          </div>
        </div>
        <p class="text-light" v-else>
          {{
            !campLoc === "select"
              ? "Sorry\, no camps available for your selection"
              : "Select a location to show available camp weeks."
          }}
        </p>
        <div v-if="campWeekSelected">
          <!-- camp days !haf-->
          <div
            v-if="!pupilPrem"
            class="flex flex-row justify-between items-center pt-4"
          >
            <div
              v-for="day in campDetails.daysAvailable"
              class="flex flex-col items-center justify-end gap-4"
            >
              <label>{{ day }}</label>
              <input
                type="checkbox"
                :value="day"
                v-model="campDaysSelected.val"
                class="absolute opacity-0 h-8 w-8 justify-self-end"
              />
              <div
                class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center"
                :class="{
                  invalid: !campDaysSelected.isValid,
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
          </div>
          <!-- camp days haf-->
          <div
            v-if="pupilPrem"
            class="flex flex-row justify-between items-center pt-4"
          >
            <div
              v-for="day in campDetails.hafDays"
              class="flex flex-col items-center justify-end gap-4"
            >
              <label>{{ day }}</label>
              <input
                type="checkbox"
                :value="day"
                v-model="campDaysSelected.val"
                class="absolute opacity-0 h-8 w-8 justify-self-end"
              />
              <div
                class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center"
                :class="{
                  invalid: !campDaysSelected.isValid,
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
          </div>
        </div>
        <p v-if="!campWeekSelected" class="text-light">
          Select a camp week to show available days
        </p>
        <!-- /end camp details -->
        <p class="text-light" v-if="!campFormIsValid">
          Please add the missing fields and submit again.
        </p>
        <div class="md:flex md:justify-end">
          <button class="btn-accent my-4 w-full md:w-fit">
            Save to booking
          </button>
        </div>
      </form>
      <!-- /end camp item form -->
      <p class="text-light">
        Please save each camp week and the specific days for each week you wish
        to book for your child(ren) individually.
      </p>
      <p class="text-light">
        Please review your booking to confirm all children and camp weeks have
        been added to your booking and then click confirm when ready. A booking
        reference and payment details will be emailed to you on submission.
      </p>
    </div>
  </div>
</template>
