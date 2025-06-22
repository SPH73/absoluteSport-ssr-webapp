<script setup lang="ts">
const props = defineProps<{
  payerAdded: boolean;
}>();

const emit = defineEmits([
  "payer-submitted",
  "event-ticket-added",
  "show-steps",
]);

// Payer form
const payerName = ref({ val: "", isValid: true });
const payerContact = ref({ val: "", isValid: true });
const payerEmail = ref({ val: "", isValid: true });
const acceptedTerms = ref({ val: false, isValid: true });
const payerFormIsValid = ref(true);

// Ticket form
const formIsValid = ref(true);
const name = ref({ val: "", isValid: true });
const age = ref({ val: "select", isValid: true });
const info = ref({ val: "", isValid: true });
const ticketType = ref({ val: "select", isValid: true });
const childAgeRange = Array.from({ length: 17 }, (_, i) => i);

// Form validation
const validatePayerForm = () => {
  payerFormIsValid.value = true;

  if (!payerName.value.val.trim()) {
    payerName.value.isValid = false;
    payerFormIsValid.value = false;
  }

  if (!payerEmail.value.val.includes("@")) {
    payerEmail.value.isValid = false;
    payerFormIsValid.value = false;
  }

  if (!payerContact.value.val.trim()) {
    payerContact.value.isValid = false;
    payerFormIsValid.value = false;
  }

  if (!acceptedTerms.value.val) {
    acceptedTerms.value.isValid = false;
    payerFormIsValid.value = false;
  }
};

const validateTicketForm = () => {
  formIsValid.value = true;

  if (!name.value.val.trim()) {
    name.value.isValid = false;
    formIsValid.value = false;
  }

  if (age.value.val === "select") {
    age.value.isValid = false;
    formIsValid.value = false;
  }
};

// Form handlers
const onSubmitPayerDetails = () => {
  validatePayerForm();
  if (!payerFormIsValid.value) return;

  emit(
    "payer-submitted",
    payerName.value.val,
    payerContact.value.val,
    payerEmail.value.val,
    acceptedTerms.value.val
  );
};

const onAddTicket = () => {
  validateTicketForm();
  if (!formIsValid.value) return;

  emit("event-ticket-added", name.value.val, age.value.val);

  // Reset form
  name.value.val = "";
  age.value.val = "select";
  info.value.val = "";
};
</script>

<template>
  <div>
    <h1 class="text-accent font-play capitalize">Event Ticket Reservation</h1>

    <div v-if="!props.payerAdded">
      <h3>1: Payer Details</h3>
      <form @submit.prevent="onSubmitPayerDetails">
        <!-- Payer form fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Name -->
          <div :class="{ invalid: !payerName.isValid }">
            <label>Name</label>
            <input
              type="text"
              v-model.trim="payerName.val"
              @blur="payerName.isValid = !!payerName.val.trim()"
            />
          </div>

          <!-- Contact -->
          <div :class="{ invalid: !payerContact.isValid }">
            <label>Mobile Number</label>
            <input
              type="tel"
              v-model.trim="payerContact.val"
              @blur="payerContact.isValid = !!payerContact.val.trim()"
            />
          </div>

          <!-- Email -->
          <div :class="{ invalid: !payerEmail.isValid }">
            <label>Email</label>
            <input
              type="email"
              v-model.trim="payerEmail.val"
              @blur="payerEmail.isValid = payerEmail.val.includes('@')"
            />
          </div>

          <!-- Terms -->
          <div :class="{ invalid: !acceptedTerms.isValid }">
            <label>
              <input
                type="checkbox"
                v-model="acceptedTerms.val"
                @change="acceptedTerms.isValid = acceptedTerms.val"
              />
              Accept Terms
            </label>
          </div>
        </div>

        <button type="submit">Save Details</button>
      </form>
    </div>

    <div v-else>
      <h3>2: Ticket Details</h3>
      <form @submit.prevent="onAddTicket">
        <!-- Ticket form fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Name -->
          <div :class="{ invalid: !name.isValid }">
            <label>Ticket Holder Name</label>
            <input
              type="text"
              v-model.trim="name.val"
              @blur="name.isValid = !!name.val.trim()"
            />
          </div>

          <!-- Age -->
          <div :class="{ invalid: !age.isValid }">
            <label>Age</label>
            <select
              v-model="age.val"
              @change="age.isValid = age.val !== 'select'"
            >
              <option value="select">Select age</option>
              <option v-for="ageOption in childAgeRange" :value="ageOption">
                {{ ageOption }}
              </option>
            </select>
          </div>
        </div>

        <button type="submit">Add Ticket</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.invalid {
  @apply border-red-500 text-red-500;
}

button {
  @apply bg-accent text-white px-4 py-2 rounded mt-4;
}
</style>
