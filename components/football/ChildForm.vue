<script  setup>
// fetch venueList from api
const {data: venueList, error: venueError} = await useFetch('/api/football/academyVenueList')
const venueOptions = ref([])
let venue = {}
venueList.value.forEach((record, index) => {
  venue = {
    index: index + 1,
    venueName: record.fields.venueName,
    venueRef: record.fields.venueRef,
    status: record.fields.status,
  };
  venueOptions.value.push(venue);
});

const props = defineProps(['parent-added'])
const emit = defineEmits(["booking-item-added"])

const childName = ref({ val: "", isValid: true });
const childSurname = ref({ val: "", isValid: true });
const enteredMedical = ref({ val: "", isValid: true });
const ages = [5, 6, 7, 8, 9, 10, 11, 12];
const childAge = ref({ val: "select", isValid: true });
const selectedVenue = ref({ val: "select", isValid: true });
const confirmedPhoto = ref(true);
const childFormIsValid = ref(true);


  // child form validation
  const validateChildForm = () => {
    childFormIsValid.value = true;

    if (childName.value.val === "") {
      childName.value.isValid = false;
      childFormIsValid.value = false;
    }
    if (childSurname.value.val === "") {
      childSurname.value.isValid = false;
      childFormIsValid.value = false;
    }
    if (enteredMedical.value.val === "") {
      enteredMedical.value.isValid = false;
      childFormIsValid.value = false;
    }
    if (childAge.value.val === "select") {
      childAge.value.isValid = false;
      childFormIsValid.value = false;
    }
    if (selectedVenue.value.val === "select") {
      selectedVenue.value.isValid = false;
      childFormIsValid.value = false;
  }
  };


const onAddBookingItem = () => {
  validateChildForm();
  if (!childFormIsValid) {
    console.log("child form invalid");
    return;
  }
  emit(
    "booking-item-added",
    childName.value.val,
    childSurname.value.val,
    enteredMedical.value.val,
    childAge.value.val,
    selectedVenue.value.val,
    confirmedPhoto.value,

  );
  // reset after each booking is added
  childName.value.val = "";
  childAge.value.val = "select";
  enteredMedical.value.val = "";
  childFormIsValid.value = true;
};
</script>

<template>
  <div id="academy-child-details" v-if="props.parentAdded">
    <form @submit.prevent="onAddBookingItem">
    <h3>2. Booking Details</h3>
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
          :class="{ invalid: !enteredMedical.isValid }"
        >
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
            <option disabled value="select">Select age ...</option>
            <option v-for="(n, i) in ages" :key="i" :value="n">
              {{ n }}
            </option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full mt-4">
    <div class="md:text-end">
      <label>Academy Venue</label>
    </div>
    <div>
      <select
        name="selected-venue"
        id="selected-venue"
        required
        v-model="selectedVenue.val"
        class="w-full p-2 rounded"
      >
        <option disabled value="select">Choose a venue...</option>
        <option
          v-for="option in venueOptions"
          :value="option.venueRef"
          :key="option.id"
        >
          {{ option.venueName }}
        </option>
      </select>
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
      <div class="md:flex md:justify-end">
        <button class="btn-accent my-4 w-full md:w-fit">Add Child</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
