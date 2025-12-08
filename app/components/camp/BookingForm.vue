<script setup lang="ts">
const { guardedFetch } = useBookingApi();

// ---------- Types ----------
interface CmsRecord {
  element: string;
  content: string;
  display: boolean;
  lastUpdated: string;
}

interface CmsContent {
  index: number;
  name: string;
  content: string;
  display: boolean;
  modified: string;
}
type CampLocRecord = {
  id: string;
  fields: {
    locationName: string;
    locRef: string;
    pricePerDay: number;
  };
};

interface CampLocation {
  id: string;
  locationName: string;
  locRef: string;
  pricePerDay: number;
}

interface CampOption {
  id: string;
  campName: string;
  campRef: string;
  locRef: string;
  campDate: string;
  weekStarting: string;
  pricePerDay: number;
  spaceAvailable: number;
  status: string | null;
  haf: boolean;
  daysAvailable: string[] | null;
  hafDays: string[] | null;
}

// ---------- CMS for HAF popup ----------
const cms = (await guardedFetch("/api/cms")) as CmsRecord[] | null;

const content = ref<CmsContent[]>(
  (cms ?? []).map((record, i) => ({
    index: i + 1,
    name: record.element,
    content: record.content,
    display: record.display,
    modified: record.lastUpdated,
  }))
);

const hafContent = computed<CmsContent | undefined>(() =>
  content.value.find((item) => item.name === "haf")
);

// ---------- Camp locations ----------
const campLocList: CampLocRecord[] = await guardedFetch("/api/camps/campLocList");

const locationOptions = ref(
  (campLocList || []).map((record, i) => ({
    index: i + 1,
    id: record.id,
    locationName: record.fields.locationName,
    locRef: record.fields.locRef,
    locPrice: record.fields.pricePerDay,
  }))
);

// ---------- Props ----------
const props = defineProps<{
  parentAdded: number | null;
  campsList: CampOption[];
  error?: string | null;
}>();

// ---------- Emits ----------
const emit = defineEmits<{
  (
    e: "parent-submitted",
    name: string,
    contact: string,
    email: string,
    terms: boolean
  ): void;
  (
    e: "camp-booking-added",
    name: string,
    surname: string,
    age: number,
    pp: boolean,
    haf: string,
    photo: boolean,
    loc: string,
    camp: string,
    days: string[],
    num: number
  ): void;
  (e: "show-steps"): void;
}>();

function showSteps() {
  emit("show-steps");
}

// ---------- Parent form state ----------
const enteredParentName = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredMainContact = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const enteredEmail = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const acceptedTerms = ref<{ val: boolean; isValid: boolean }>({
  val: false,
  isValid: true,
});
const parentFormIsValid = ref(true);
const parentSubmitAttempted = ref(false);

// ---------- Parent form validation ----------
const validateParentForm = () => {
  parentFormIsValid.value = true;

  const nameVal = enteredParentName.value.val.trim();
  const emailVal = enteredEmail.value.val.trim();
  const phoneVal = enteredMainContact.value.val.trim();
  const termsVal = acceptedTerms.value.val;

  enteredParentName.value.isValid = true;
  enteredEmail.value.isValid = true;
  enteredMainContact.value.isValid = true;
  acceptedTerms.value.isValid = true;

  if (!nameVal) {
    enteredParentName.value.isValid = false;
    parentFormIsValid.value = false;
  }

  if (!emailVal || !emailVal.includes("@")) {
    enteredEmail.value.isValid = false;
    parentFormIsValid.value = false;
  }

  if (!phoneVal) {
    enteredMainContact.value.isValid = false;
    parentFormIsValid.value = false;
  }

  if (!termsVal) {
    acceptedTerms.value.isValid = false;
    parentFormIsValid.value = false;
  }
};

function onSubmitParent() {
  parentSubmitAttempted.value = true;
  validateParentForm();
  if (!parentFormIsValid.value) return;

  emit(
    "parent-submitted",
    enteredParentName.value.val,
    enteredMainContact.value.val,
    enteredEmail.value.val,
    acceptedTerms.value.val
  );
}

// ---------- Child + camp state ----------
const campFormIsValid = ref(true);
const childName = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const childSurname = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const ageRange = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const childAge = ref<{ val: number | "select"; isValid: boolean }>({
  val: "select",
  isValid: true,
});

const pupilPrem = ref(false);
const ppIsChecked = ref(false);
const title = "Pupil Premium Booking";

watch(pupilPrem, () => {
  ppIsChecked.value = !!pupilPrem.value;
});

const confirmPP = () => {
  ppIsChecked.value = false;
};

const hafID = ref<{ val: string; isValid: boolean }>({
  val: "",
  isValid: true,
});
const confirmedPhoto = ref(true);

// ---------- Camp selection ----------
const campSubmitAttempted = ref(false);

const campLoc = ref<{ val: string; isValid?: boolean }>({
  val: "select",
});

const hasLocation = computed<boolean>(() => campLoc.value.val !== "select");

const filteredCamps = computed<CampOption[]>(() => {
  const list = Array.isArray(props.campsList) ? props.campsList : [];
  return hasLocation.value
    ? list.filter((c) => c.locRef === campLoc.value.val)
    : [];
});

const hafFilteredCamps = computed<CampOption[]>(() =>
  filteredCamps.value.filter((c) => c.haf === true)
);

const noCampsMessage = computed<string>(() => {
  return hasLocation.value && filteredCamps.value.length === 0
    ? "Sorry, no camps available for your selection"
    : "Select a camp location to show available camp weeks.";
});

const campName = ref<{ val: string; isValid: boolean }>({
  val: "select",
  isValid: true,
});

const campWeekSelected = computed<boolean>(
  () => campName.value.val !== "select"
);

const campDetails = computed<CampOption | undefined>(() => {
  const list = Array.isArray(props.campsList) ? props.campsList : [];
  return list.find((c) => c.campRef === campName.value.val);
});

const campDaysSelected = ref<{ val: string[]; isValid: boolean }>({
  val: [],
  isValid: true,
});

const numCampDays = computed<number>(() => campDaysSelected.value.val.length);

watch(
  () => campName.value.val,
  () => {
    campDaysSelected.value.val = [];
  }
);

// ---------- Camp form validation ----------
const validateCampForm = () => {
  campFormIsValid.value = true;

  childName.value.isValid = true;
  childSurname.value.isValid = true;
  childAge.value.isValid = true;
  hafID.value.isValid = true;
  campName.value.isValid = true;
  campDaysSelected.value.isValid = true;

  if (!childName.value.val) {
    childName.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (!childSurname.value.val) {
    childSurname.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (childAge.value.val === "select") {
    childAge.value.isValid = false;
    campFormIsValid.value = false;
  }
  if (pupilPrem.value && !hafID.value.val) {
    hafID.value.isValid = false;
    campFormIsValid.value = false;
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

// ---------- Submit single booking item ----------
const onAddBookingItem = () => {
  campSubmitAttempted.value = true;
  validateCampForm();
  if (!campFormIsValid.value) return;

  emit(
    "camp-booking-added",
    childName.value.val,
    childSurname.value.val,
    Number(childAge.value.val),
    pupilPrem.value,
    hafID.value.val,
    confirmedPhoto.value,
    campLoc.value.val,
    campName.value.val,
    campDaysSelected.value.val,
    numCampDays.value
  );

  childName.value.val = "";
  childSurname.value.val = "";
  childAge.value.val = "select";
  pupilPrem.value = false;
  hafID.value.val = "";
  campName.value.val = "select";
  campDaysSelected.value.val = [];
  campSubmitAttempted.value = false;
};
const { campsList } = toRefs(props);

if (import.meta.client) {
  (window as any).bookingDebug = {
    locationOptions,
    campsList,
    campLoc,
    hasLocation,
    filteredCamps,
    hafFilteredCamps,
    campDetails,
  };
}
</script>

<template>
  <BaseDialog @close="confirmPP" :open="ppIsChecked" :title="title">
    <template #content>
      <p v-if="hafContent?.display" class="font-play">
        {{ hafContent.content }}
      </p>
      <p class="text-dark">
        <span class="font-play">
          <em>For weeks that include HAF places provided by the council:</em>
        </span>
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
    <div id="camp-parent-details" v-if="!parentAdded">
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
      <p class="error" v-if="parentSubmitAttempted && !parentFormIsValid">
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
          {{ noCampsMessage }}
        </p>
        <div v-if="campWeekSelected">
          <!-- camp days !haf-->
          <div
            v-if="!pupilPrem"
            class="flex flex-row justify-between items-center pt-4"
          >
            <div
              v-for="day in campDetails?.daysAvailable || []"
              :key="day"
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
              v-for="day in campDetails?.hafDays || []"
              :key="day"
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
          Select a camp week to show available days.
        </p>
        <!-- /end camp details -->
        <p class="text-light" v-if="campSubmitAttempted && !campFormIsValid">
          Please add the missing fields and submit again.
        </p>
        <div class="md:flex md:justify-end" v-show="numCampDays > 0">
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
