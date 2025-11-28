<script setup>
const { guardedFetch } = useBookingApi();

// fetched data
const partyList = await guardedFetch("/api/parties/partyList");
const error = ref(null);
const partyOptions = ref([]);

// Guard against undefined result from 429/503 redirect
if (!partyList || !Array.isArray(partyList)) {
  // guardedFetch already handled the redirect to /booking-paused
  // Safe to render with empty partyOptions
} else {
  let party = {};
  partyList.forEach((record, index) => {
    party = {
      index: index + 1,
      id: record.id,
      partyName: record.partyName,
      partyRef: record.partyRef,
    };
    partyOptions.value.push(party);
  });
}

// form data
const partyData = ref({});
const parentFirstName = ref({ val: "", isValid: true });
const surname = ref({ val: "", isValid: true });
const email = ref({ val: "", isValid: true });
const phone = ref({ val: "", isValid: true });
const postCode = ref({ val: "", isValid: true });
const info = ref(null);
const selectedParty = ref({ val: "select", isValid: true });
const partyDate1 = ref({ val: "", isValid: true });
const partyDate2 = ref({ val: "", isValid: true });
const partyStart = ref({ val: "", isValid: true });
const partyLength = ref({ val: null, isValid: true });
const childsName = ref({ val: "", isValid: true });
const childsAge = ref({ val: null, isValid: true });
const childsBday = ref(null);
const numChildren = ref({ val: null, isValid: true });
const quoteRef = ref("");
const formIsValid = ref(true);
// TODO
// const recaptcha = ref({ val: "..." });

// methods
const validateForm = () => {
  formIsValid.value = true;

  // parent details
  if (parentFirstName.value.val === "") {
    parentFirstName.value.isValid = false;
    formIsValid.value = false;
  }
  if (surname.value.val === "") {
    surname.value.isValid = false;
    formIsValid.value = false;
  }
  if (email.value.val === "" || !email.value.val.includes("@")) {
    email.value.isValid = false;
    formIsValid.value = false;
  }
  if (phone.value.val === "") {
    phone.value.isValid = false;
    formIsValid.value = false;
  }
  if (postCode.value.val === "") {
    postCode.value.isValid = false;
    formIsValid.value = false;
  }
  // event details
  if (selectedParty.value.val === "select") {
    selectedParty.value.isValid = false;
    formIsValid.value = false;
  }
  if (partyDate1.value.val === null) {
    partyDate1.value.isValid = false;
    formIsValid.value = false;
  }
  if (partyDate2.value.val === null) {
    partyDate2.value.isValid = false;
    formIsValid.value = false;
  }
  if (partyStart.value.val === null) {
    partyStart.value.isValid = false;
    formIsValid.value = false;
  }
  if (partyLength.value.val === null) {
    partyLength.value.isValid = false;
    formIsValid.value = false;
  }
  // child details
  if (childsAge.value.val === null) {
    childsAge.value.isValid = false;
    formIsValid.value = false;
  }
  if (numChildren.value.val === null) {
    numChildren.value.isValid = false;
    formIsValid.value = false;
  }
};
async function handleSubmit() {
  validateForm();
  if (!formIsValid.value) {
    return;
  }
  // TODO
  // if (!recaptcha.val) {
  //   return;
  // }

  partyData.value = {
    firstName: parentFirstName.value.val,
    status: "new",
    enquiryType: "party",
    surname: surname.value.val,
    email: email.value.val,
    info: info.value,
    phone: phone.value.val,
    postCode: postCode.value.val,
    childsName: childsName.value.val,
    childsAge: childsAge.value.val,
    childsBirthday: childsBday.value,
    party: selectedParty.value.val,
    partyDate1: partyDate1.value.val,
    partyDate2: partyDate2.value.val,
    partyStart: partyStart.value.val,
    partyLength: partyLength.value.val,
    numChildren: numChildren.value.val,
    // recaptcha: recaptcha.value.val,
  };

  const res = await guardedFetch("/api/parties/partyQuote", {
    method: "post",
    body: partyData.value,
  });
  console.log("quote res*****", res);

  if (!res) {
    // 429 or 503: guardedFetch has already redirected to /booking-paused
    // Do not access properties on res or continue with quote flow
    return;
  }

  quoteRef.value = res.id;
  const router = useRouter();
  router.replace({
    path: "/parties/success",
    query: {
      name: res.firstName,
      surname: res.surname,
      phone: res.phone,
      email: res.email,
      party: res.party,
      quoteRef: res.id,
      date1: res.partyDate1,
      date2: res.partyDate2,
      length: res.partyLength,
      start: res.partyStart,
      numChildren: res.numChildren,
      postCode: res.postCode,
    },
  });
}
</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <div>
        <h1 class="text-accent font-play capitalize">party booking enquiry</h1>
        <p class="text-light">
          We cover West Sussex and Hampshire, however we may also be able to
          accomodate parties beyond with an additional travel charge.
        </p>
        <p class="text-light">
          We recommend at least 2 weeks advance booking to secure your preferred
          date and time. If you have an urgent request please get in touch and
          we&#39;ll do our best to grant your wish. You can also read our
          FAQ&#39;s for more info.
        </p>
      </div>
      <form @submit.prevent="handleSubmit">
        <h2 class="text-accent font-play captitalize">Party Details</h2>
        <h3 class="text-accent">Parent/Guardian Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div
            class="md:text-end"
            :class="{ invalid: !parentFirstName.isValid }"
          >
            <label>First Name</label>
          </div>
          <div :class="{ invalid: !parentFirstName.isValid }">
            <input
              type="text"
              v-model.trim.lazy="parentFirstName.val"
              class="w-full p-2 rounded"
              autocomplete="given-name"
            />
          </div>
          <div class="md:text-end" :class="{ invalid: !surname.isValid }">
            <label>Surname</label>
          </div>
          <div :class="{ invalid: !surname.isValid }">
            <input
              type="text"
              v-model.trim.lazy="surname.val"
              class="w-full p-2 rounded"
              autocomplete="family-name"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !email.isValid,
            }"
          >
            <label>Email</label>
          </div>
          <div
            :class="{
              invalid: !email.isValid,
            }"
          >
            <input
              type="email"
              v-model.trim.lazy="email.val"
              class="w-full p-2 rounded"
              placeholder="Your best email"
              autocomplete="email"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !phone.isValid,
            }"
          >
            <label>Phone</label>
          </div>
          <div
            :class="{
              invalid: !phone.isValid,
            }"
          >
            <input
              type="phone"
              v-model.trim.lazy="phone.val"
              class="w-full p-2 rounded"
              placeholder="Your best contact number"
              autocomplete="tel"
            />
          </div>
        </div>
        <h3 class="text-accent">Child Details</h3>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-3 w- text-3xl w-full p-2 rounded"
        >
          <div
            class="md:text-end"
            :class="{
              invalid: !childsName.isValid,
            }"
          >
            <label>Name (or School/Event)</label>
          </div>
          <div
            :class="{
              invalid: !childsName.isValid,
            }"
          >
            <input
              type="text"
              v-model.trim.lazy="childsName.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !childsAge.isValid,
            }"
          >
            <label>Age</label>
          </div>
          <div
            :class="{
              invalid: !childsAge.isValid,
            }"
          >
            <input
              type="number"
              min="4"
              max="14"
              v-model="childsAge.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div class="md:text-end">
            <label>Actual Birthday</label>
          </div>
          <div>
            <input
              type="date"
              v-model="childsBday"
              class="w-full p-2 rounded"
            />
          </div>
          <div class="md:text-end">
            <label>Additonal Info?</label>
          </div>
          <div>
            <textarea
              v-model="info"
              class="w-full p-2 rounded"
              placeholder="Anything else you'd like us to know?"
            />
          </div>
        </div>
        <h3 class="text-accent">Event Details</h3>
        <div v-if="error">
          <p>{{ error }}</p>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-3 w- text-3xl w-full p-2 rounded"
        >
          <div
            class="md:text-end"
            :class="{
              invalid: !selectedParty.isValid,
            }"
          >
            <label>Choose your party</label>
          </div>
          <div>
            <select
              name="partyName"
              id="partyName"
              v-model="selectedParty.val"
              class="w-full p-2 rounded"
            >
              <option disabled value="select">Choose...</option>
              <option
                v-for="option in partyOptions"
                :key="option.id"
                :value="option.partyName"
              >
                {{ option.partyName }}
              </option>
            </select>
          </div>

          <div
            class="md:text-end"
            :class="{
              invalid: !partyDate1.isValid,
            }"
          >
            <label>Party Date 1st Choice</label>
          </div>
          <div>
            <input
              type="date"
              v-model="partyDate1.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !partyDate2.isValid,
            }"
          >
            <label>Party Date 2nd Choice</label>
          </div>
          <div
            :class="{
              invalid: !partyDate2.isValid,
            }"
          >
            <input
              type="date"
              v-model="partyDate2.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !partyLength.isValid,
            }"
          >
            <label>Party Duration</label>
          </div>
          <div
            :class="{
              invalid: !partyLength.isValid,
            }"
          >
            <input
              type="number"
              step="0.5"
              min="1"
              max="3"
              v-model="partyLength.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !partyStart.isValid,
            }"
          >
            <label>Party Start Time</label>
          </div>
          <div
            :class="{
              invalid: !partyStart.isValid,
            }"
          >
            <input
              type="time"
              v-model="partyStart.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !numChildren.isValid,
            }"
          >
            <label>Number of Children</label>
          </div>
          <div
            :class="{
              invalid: !numChildren.isValid,
            }"
          >
            <input
              type="number"
              min="1"
              step="1"
              v-model="numChildren.val"
              class="w-full p-2 rounded"
            />
          </div>
          <div
            class="md:text-end"
            :class="{
              invalid: !postCode.isValid,
            }"
          >
            <label>Post Code</label>
          </div>
          <div
            :class="{
              invalid: !postCode.isValid,
            }"
          >
            <input
              type="text"
              v-model.trim.lazy="postCode.val"
              class="w-full p-2 rounded"
              autocomplete="postal-code"
            />
          </div>
        </div>
        <div class="md:flex md:justify-end">
          <BaseButton class="btn-accent my-4 w-full md:w-fit">
            Send Me A Quote
          </BaseButton>
        </div>
        <p class="error" v-if="!formIsValid">
          One or more fields are invalid. Please correct the errors and submit
          again.
        </p>
      </form>
    </BaseCard>
  </div>
</template>
