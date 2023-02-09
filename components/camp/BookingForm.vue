<script setup>
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
const acceptedTerms = ref({ val: true, isValid: true });
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
const title = "Pupil Premium Booking";
const childName = ref({ val: "", isValid: true });
const childSurname = ref({ val: "", isValid: true });
const childAge = ref({ val: "select", isValid: true });
const confirmedPhoto = ref(true);

const pupilPrem = ref(false);
const ppIsChecked = ref(false);
watch(pupilPrem, () => {
  ppIsChecked.value = pupilPrem.value ? true : false;
});
const confirmPP = () => {
  ppIsChecked.value = false;
};
const hafId = ref({ val: "", isValid: true });

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
console.log("locationOptions", locationOptions.value);
const campLoc = ref({ val: "" });
const filteredCamps = ref([]);

const filterCampsByLoc = computed(() => {
  let loc = campLoc.value.val;
  return (filteredCamps.value = props.campsList.filter(
    camp => camp.locRef === loc,
  ));
});

const campName = ref({ val: "select", isValid: true });
const campDays = ref({ val: [], isValid: true });
const numCampDays = ref(null);

const calculatedDays = computed(() => {
  return (numCampDays.value = campDays.value.val.length);
});

watchEffect(() => {
  console.log("camp loc", campLoc.value.val);
  filterCampsByLoc.value;
  console.log("filtered camps", filteredCamps.value);
  console.log("camp days", campDays.value.val);
  calculatedDays.value;
  console.log("num days", numCampDays.value);
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
    if (hafId.value.val === "") {
      hafId.value.isValid = false;
    }
    campFormIsValid.value = false;
  }

  if (campName.value.val === "select") {
    campName.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (campDays.value.val.length === 0) {
    campDays.value.isValid = false;
    campFormIsValid.value = false;
  }
};
// submition
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
    // hafId.value.val,
    confirmedPhoto.value,
    campLoc.value.val,
    campName.value.val,
    campDays.value.val,
    numCampDays.value,
  );
  // reset after each camp is added
  childName.value.val = "";
  childAge.value.val = "select";
  campName.value.val = "select";
  campDays.value.val = [];
};
</script>

<template>
  <BaseDialog @close="confirmPP" :open="ppIsChecked" :title="title">
    <template #content>
      <p class="text-dark">
        Please provide your child's HAF ID so that we can confirm a place with
        the council. If there are any issues we will contact you directly.
      </p>
    </template>
    <template #actions>
      <button @click="confirmPP" class="btn-primary">Got It!</button>
    </template>
  </BaseDialog>
  <div id="text">
    <h1 class="text-accent capitalize">camp bookings</h1>
    <p>
      We run Holiday Activity Camps at Sidlesham Primary School and Portfield
      Academy throughout the year.
    </p>
    <p>
      If you are booking a HAF place please have your child's HAF ID handy. If
      you aren't sure what it is you can request it from your child's school.
    </p>
    <p>
      Kindly use your unique payment reference when making payment so that we
      can allocate it to the booking and confirm your child's place.
    </p>
    <p v-if="!parentAdded" class="cursor-pointer">
      <strong class="text-accent" @click="showSteps"
        >Show me the steps to complete this form</strong
      >
    </p>
  </div>
  <div id="forms" class="my-2">
    <h3 class="text-accent">1: Parent/Guardian Details</h3>
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
            <label>Name</label>
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
              <option v-for="(n, i) in 12" :key="i" :value="n">
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
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full"
        >
          <div class="md:text-end" :class="{ invalid: !hafId.isValid }">
            <label>HafID</label>
          </div>
          <div :class="{ invalid: !hafId.isValid }">
            <input
              type="text"
              v-model.trim.lazy="hafId.val"
              class="w-full p-2 rounded"
              autocomplete="name"
              required
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
          <!-- camp week -->
          <div v-if="filteredCamps.length">
            <div
              class="md:text-end"
              :class="{
                invalid: !campName.isValid,
              }"
            >
              <label>Camp week</label>
            </div>
            <div
              :class="{
                invalid: !campName.isValid,
              }"
            >
              <select
                required
                v-model="campName.val"
                class="w-full p-2 rounded"
              >
                <option disabled value="select">Select a camp...</option>
                <option
                  v-for="option in filteredCamps"
                  :value="option.campName"
                  :key="option.id"
                >
                  {{ option.campName }} £{{ option.pricePerDay }} p/day
                </option>
              </select>
            </div>
          </div>
          <p v-else>Please choose a camp location to display available camps</p>
        </div>
        <!-- camp days -->
        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-col items-center justify-end gap-4">
            <label for="mon">Mo</label>
            <input
              type="checkbox"
              name="mon"
              id="mon"
              value="Monday"
              v-model="campDays.val"
              class="absolute opacity-0 h-8 w-8 justify-self-end"
            />
            <div
              class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center"
              :class="{
                invalid: !campDays.isValid,
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
          <div class="flex flex-col items-center justify-end gap-4">
            <label for="tue">Tu</label>
            <input
              type="checkbox"
              name="tue"
              id="tue"
              value="Tuesday"
              v-model="campDays.val"
              class="absolute opacity-0 h-8 w-8 justify-self-end"
            />
            <div
              class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center"
              :class="{
                invalid: !campDays.isValid,
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
          <div class="flex flex-col items-center justify-end gap-4">
            <label for="wed">We</label>
            <input
              type="checkbox"
              name="wed"
              id="wed"
              value="Wednesday"
              v-model="campDays.val"
              class="absolute opacity-0 h-8 w-8 justify-self-end"
            />
            <div
              class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center"
              :class="{
                invalid: !campDays.isValid,
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
          <div class="flex flex-col items-center justify-end gap-4">
            <label for="thu">Th</label>
            <input
              type="checkbox"
              name="thu"
              id="thu"
              value="Thursday"
              v-model="campDays.val"
              class="absolute opacity-0 h-8 w-8 justify-self-end"
            />
            <div
              class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center"
              :class="{
                invalid: !campDays.isValid,
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
          <div class="flex flex-col items-center justify-end gap-4">
            <label for="fri">Fr</label>
            <input
              type="checkbox"
              name="fri"
              id="fri"
              value="Friday"
              v-model="campDays.val"
              class="absolute opacity-0 h-8 w-8 justify-self-end"
            />
            <div
              class="bg-white rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center"
              :class="{
                invalid: !campDays.isValid,
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
        <!-- /end camp details -->
        <p v-if="!campFormIsValid" class="errors">
          Please correct the above errors and submit again.
        </p>
        <div class="md:flex md:justify-end">
          <button class="btn-accent my-4 w-full md:w-fit">
            Save to booking
          </button>
        </div>
      </form>
      <!-- /end camp item form -->
      <p>
        Please save each camp week and the specific days for each week you wish
        to book for your child(ren) individually.
      </p>
      <p>
        Please review your booking to confirm all children and camp weeks have
        been added to your booking and then click submit when ready. A booking
        reference and payment details will be emailed to you on submission.
      </p>
    </div>
  </div>
</template>
