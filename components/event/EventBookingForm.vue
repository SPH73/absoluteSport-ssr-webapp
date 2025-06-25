<script setup>
// props
const props = defineProps(["payerAdded"]);
// events ****
const emit = defineEmits([
  "payer-submitted",
  "event-ticket-added",
  "show-steps",
]);
async function showSteps() {
  emit("show-steps");
}

// payer form data ****

const payerName = ref({ val: "Jane Doe", isValid: true });
const payerContact = ref({ val: "0787111555", isValid: true });
const payerEmail = ref({ val: "jane.doe@example.com", isValid: true });
const acceptedTerms = ref({ val: true, isValid: true });
const payerFormIsValid = ref(null);

// payer form validation
const validatePayerForm = () => {
  payerFormIsValid.value = true;
  if (payerName.value.val === "") {
    payerName.value.isValid = false;
    payerFormIsValid.value = false;
  }
  if (payerEmail.value.val === "" || !payerEmail.value.val.includes("@")) {
    payerEmail.value.isValid = false;
    payerFormIsValid.value = false;
  }
  if (payerContact.value.val === null) {
    payerContact.value.isValid = false;
    payerFormIsValid.value = false;
  }
  if (acceptedTerms.value.val === false) {
    acceptedTerms.value.isValid = false;
    payerFormIsValid.value = false;
  }
};
// payer form submission
async function onSubmitPayer() {
  validatePayerForm();
  if (!payerFormIsValid) {
    return;
  }
  emit(
    "payer-submitted",
    payerName.value.val,
    payerContact.value.val,
    payerEmail.value.val,
    acceptedTerms.value.val
  );
}

// ticket form data
const eventFormIsValid = ref(false);
const ticketName = ref({ val: "", isValid: true });
const ticketAge = ref({ val: "select", isValid: true });
const ticketType = ref({ val: "select", isValid: true });
const ticketInfo = ref({ val: "", isValid: true });
const showAgeField = ref(false);
// Dynamic age ranges based on ticket type
const ageRanges = {
  infant: Array.from({ length: 5 }, (_, i) => i), // 0-4
  child: Array.from({ length: 12 }, (_, i) => i + 5), // 5-16
};

const ticketPrice = computed(() => {
  const type = ticketType.value.val;
  if (type === "infant") return 0;
  if (type === "child") return 10;
  if (type === "adult") return 7.5;
  return 0;
});

watchEffect(() => {
  const nameOk = ticketName.value.val.trim() !== "";
  const typeOk = ticketType.value.val !== "select";
  const infoOk = ticketInfo.value.val.trim() !== "";
  const ageOk =
    ticketType.value.val !== "child" ||
    (ticketAge.value.val !== "select" && ticketAge.value.val !== null);

  eventFormIsValid.value = nameOk && typeOk && infoOk && ageOk;

  console.log({
    nameOk,
    typeOk,
    infoOk,
    ageOk,
    ticketType: ticketType.value.val,
    ticketAge: ticketAge.value.val,
    eventFormIsValid: eventFormIsValid.value,
  });
});

watch(
  () => ticketType.value.val, // this is the correct reactive getter
  (newVal) => {
    console.log("[watch:ticketType]", newVal);
    if (newVal === "child" || newVal === "infant") {
      showAgeField.value = true;
    } else {
      showAgeField.value = false;
      ticketAge.value.val = null;
    }
  }
);

const validateTicketAge = () => {
  const age = Number(ticketAge.value.val);
  if (ticketType.value === "infant" && age > 4) {
    ticketAge.value.isValid = false;
    return false;
  }
  if (ticketType.value === "child" && (age < 5 || age > 16)) {
    ticketAge.value.isValid = false;
    return false;
  }
  ticketAge.value.isValid = true;
  return true;
};

// ticket details
// ticket form **
// validation
const validateEventForm = () => {
  eventFormIsValid.value = true;

  if (!ticketName.value.val.trim()) {
    ticketName.value.isValid = false;
    eventFormIsValid.value = false;
  }
  if (ticketType.value.val === "select") {
    ticketType.value.isValid = false;
    eventFormIsValid.value = false;
  }

  if (
    ticketType.value.val === "child" &&
    (ticketAge.value.val === "select" || ticketAge.value.val === null)
  ) {
    ticketAge.value.isValid = false;
    eventFormIsValid.value = false;
  } else {
    ticketAge.value.isValid = true;
  }

  if (!ticketInfo.value.val.trim()) {
    ticketInfo.value.isValid = false;
    eventFormIsValid.value = false;
  }
};
// submission
const onAddTicketItem = () => {
  validateEventForm();
  validateTicketAge();
  if (eventFormIsValid) {
    emit(
      "event-ticket-added",
      ticketName.value.val,
      ticketAge.value.val,
      ticketType.value.val,
      ticketInfo.value.val,
      ticketPrice.value
    );
    // reset after each booking is added
    ticketName.value.val = "";
    ticketAge.value.val = "select";
    ticketType.value.val = "select";
    ticketInfo.value.val = "";
  }
  return;
};
</script>

<template>
  <div id="text">
    <h1 class="text-accent font-play capitalize">Event bookings</h1>
    <p class="text-light">
      Please complete the form below to book your event tickets. Please book all
      required tickets after adding your or (payer) details.
    </p>
    <p class="text-light">
      Please save each ticket you wish to book for your family individually.
    </p>
    <p class="text-light">
      Children under 4 years old are free to attend but must be included in your
      booking. Please add them as a infant ticket with no charge. Under 17's
      must be accompanied by an adult at all times during the event.
    </p>
    <p class="text-light">
      Kindly use your unique payment reference if making payment by bank
      transfer so that we can allocate it to your booking and confirm your
      ticket purchases.
    </p>
    <p class="text-light">
      TIP: Use the review booking details button at each stage of your booking
      to check your booking items.
    </p>
    <p v-if="!payerAdded" class="cursor-pointer">
      <font-awesome-icon
        :icon="['fas', 'circle-info']"
        class="text-primary w-6 h-6 mr-4"
      />
      <strong class="text-accent" @click="showSteps"
        >Show me the steps to complete this form</strong
      >
    </p>
  </div>
  <!-- <p class="text-light">Payer Added: {{ payerAdded }}</p> -->
  <div id="forms" class="my-2">
    <h3>1: Booking Details</h3>
    <div id="event-payer-details" v-if="!payerAdded">
      <form @submit.prevent="onSubmitPayer">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div class="md:text-end" :class="{ invalid: !payerName.isValid }">
            <label>Name</label>
          </div>
          <div :class="{ invalid: !payerName.isValid }">
            <input
              type="text"
              v-model.trim.lazy="payerName.val"
              class="w-full p-2 rounded"
              autocomplete="name"
              required
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !payerContact.isValid }">
            <label>Mobile Number</label>
          </div>
          <div :class="{ invalid: !payerContact.isValid }">
            <input
              type="tel"
              v-model.trim.lazy="payerContact.val"
              class="w-full p-2 rounded"
              autocomplete="tel"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !payerEmail.isValid,
            }"
          >
            <label>Email</label>
          </div>
          <div
            :class="{
              invalid: !payerEmail.isValid,
            }"
          >
            <input
              type="email"
              v-model.trim.lazy="payerEmail.val"
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
    </div>

    <p v-else class="text-accent">Details saved successfully.</p>

    <!-- ticket item form -->
    <div v-if="payerAdded">
      <form @submit.prevent="onAddTicketItem">
        <!-- ticket details -->
        <h3>2: Ticket Details</h3>
        <div
          id="ticket-details"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full"
        >
          <div class="md:text-end" :class="{ invalid: !ticketName.isValid }">
            <label>Name</label>
          </div>
          <div :class="{ invalid: !ticketName.isValid }">
            <input
              type="text"
              v-model.trim.lazy="ticketName.val"
              class="w-full p-2 rounded"
              autocomplete="first-name"
              required
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !ticketType.isValid }">
            <label>Ticket Type</label>
          </div>
          <div :class="{ invalid: !ticketType.isValid }">
            <select
              name="ticket-type"
              id="ticket-type"
              v-model="ticketType.val"
              required
              class="w-full p-2 rounded"
            >
              <option disabled value="select">Select a ticket type...</option>
              <option value="infant">Infant (0–4, Free)</option>
              <option value="child">Child (5–16, £10)</option>
              <option value="adult">Adult (£7.50)</option>
            </select>
          </div>
          <div
            v-if="showAgeField"
            class="md:text-end"
            :class="{ invalid: !ticketAge.isValid }"
          >
            <label for="ticketAge">Age</label>
            <div :class="{ invalid: !ticketAge.isValid }">
              <select
                name="ticketAge"
                id="ticketAge"
                v-model.number="ticketAge.val"
                class="w-full p-2 rounded"
                required
              >
                <option
                  v-for="age in ageRanges[ticketType.val]"
                  :key="age"
                  :value="age"
                >
                  {{ age }} years
                </option>
              </select>
            </div>
          </div>
          <div class="md:text-end" :class="{ invalid: !ticketInfo.isValid }">
            <label for="medical">Special Requirements *</label>
          </div>
          <div :class="{ invalid: !ticketInfo.isValid }">
            <textarea
              rows="4"
              v-model="ticketInfo.val"
              class="w-full p-2 rounded"
              placeholder="Please tell us about any special requirements we need to be aware of. (None if N/A)"
            ></textarea>
          </div>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-3xl w-full"
        ></div>
        <!-- /ticket details -->

        <p class="text-light" v-if="!eventFormIsValid">
          Please add all fields before saving your ticket details.
        </p>
        <div class="md:flex md:justify-end" v-if="eventFormIsValid">
          <button class="btn-accent my-4 w-full md:w-fit">
            Save ticket details
          </button>
        </div>
      </form>
      <!-- /end ticket item form -->

      <p class="text-light">
        Please review your booking details before confirming. Ticket and
        payments references will be created on submission.
      </p>
    </div>
  </div>
</template>
