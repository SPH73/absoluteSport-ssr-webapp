<script setup>
// fetched data
const { data: partyList } = await useFetch("/api/parties/partyList");
let party = {};
const partyOptions = ref([]);
partyList.value.forEach((record, index) => {
  party = {
    index: index + 1,
    id: record.id,
    partyName: record.fields.partyName,
    partyRef: record.fields.partyRef,
  };
  partyOptions.value.push(party);
});

// form data
const parentFirstName = ref("Sue");
const surname = ref("Holder");
const email = ref("sue@designdevelophost.co.uk");
const phone = ref("07492727870");
const postCode = ref("PO20 1PE");
const info = ref("None");
const childsName = ref("Nathan");
const childsBday = ref("2023-03-11");
const childsAge = ref(10);
const selectedParty = ref("select");
const partyDate1 = ref("2023-03-11");
const partyDate2 = ref("2023-03-18");
const partyStart = ref("16:00");
const partyLength = ref(2);
const numChildren = ref(15);
const recaptcha = ref("...");
const formIsValid = ref(true);
const partyData = ref({});
const quoteRef = ref("");

// methods
async function handleSubmit() {
  partyData = {
    firstName: parentFirstName.value,
    status: "new",
    enquiryType: "party",
    surname: surname.value,
    email: email.value,
    info: info.value,
    phone: phone.value,
    postCode: postCode.value,
    childsName: childsName.value,
    childsAge: childsAge.value,
    childsBirthday: childsBday.value,
    party: selectedParty.value,
    partyDate1: partyDate1.value,
    partyDate2: partyDate2.value,
    partyStart: partyStart.value,
    partyLength: partyLength.value,
    numChildren: numChildren.value,
    recaptcha: recaptcha.value,
  };
  console.log("partydata*********", partyData.value);
  const res = await $fetch("/api/parties/partyQuote", {
    method: "post",
    body: partyData.value,
  });
  console.log("Response", res);
  quoteRef.value = res.id;
  console.log("quoteRef", quoteRef.value);
  navigateTo("/");
}
</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <div>
        <h1 class="text-accent capitalize">party booking enquiry</h1>
        <p class="tracking-wide">
          We cover West Sussex and Hampshire, however we may also be able to accomodate
          parties beyond with an additional travel charge.
        </p>
        <p class="tracking-wide">
          We recommend at least 2 weeks advance booking to secure your preferred date and
          time. If you have an urgent request please get in touch and we&#39;ll do our
          best to grant your wish. You can also read our FAQ&#39;s for more info.
        </p>
      </div>
      <form @submit.prevent="handleSubmit">
        <h3 class="text-accent">Parent/Guardian Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div class="md:text-end">
            <label>First Name</label>
          </div>
          <div class="">
            <input
              type="text"
              v-model.trim.lazy="parentFirstName"
              class="w-full p-2 rounded"
              autocomplete="given-name"
            />
          </div>
          <div class="md:text-end">
            <label>Surname</label>
          </div>
          <div>
            <input
              type="text"
              v-model.trim.lazy="surname"
              class="w-full p-2 rounded"
              autocomplete="family-name"
            />
          </div>
          <div>
            <div class="md:text-end">
              <label>Email</label>
            </div>
          </div>
          <div>
            <input
              type="email"
              v-model.trim.lazy="email"
              class="w-full p-2 rounded"
              placeholder="Your best email"
              autocomplete="email"
            />
          </div>
          <div class="md:text-end">
            <label>Phone</label>
          </div>
          <div class="">
            <input
              type="phone"
              v-model.trim.lazy="phone"
              class="w-full p-2 rounded"
              placeholder="Your best contact number"
              autocomplete="mobile"
            />
          </div>
          <div class="md:text-end">
            <label>Post Code</label>
          </div>
          <div>
            <input
              type="text"
              v-model.trim.lazy="postCode"
              class="w-full p-2 rounded"
              autocomplete="postal-code"
            />
          </div>
        </div>
        <h3 class="text-accent">Child Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w- text-3xl w-full p-2 rounded">
          <div class="md:text-end">
            <label>Child's Name</label>
          </div>
          <div>
            <input
              type="text"
              v-model.trim.lazy="childsName"
              class="w-full p-2 rounded"
            />
          </div>
          <div class="md:text-end">
            <label>Child's Age</label>
          </div>
          <div>
            <input type="text" v-model="childsAge" class="w-full p-2 rounded" />
          </div>
          <div class="md:text-end">
            <label>Actual Birthday</label>
          </div>
          <div>
            <input type="date" v-model="childsBday" class="w-full p-2 rounded" />
          </div>
        </div>
        <h3 class="text-accent">Event Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w- text-3xl w-full p-2 rounded">
          <div class="md:text-end">
            <label>Choose your party</label>
          </div>
          <div>
            <select
              name="partyName"
              id="partyName"
              v-model="selectedParty"
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
          <div class="md:text-end">
            <label>Party Date 1st Choice</label>
          </div>
          <div>
            <input type="date" v-model="partyDate1" class="w-full p-2 rounded" />
          </div>
          <div class="md:text-end">
            <label>Party Date 2nd Choice</label>
          </div>
          <div>
            <input type="date" v-model="partyDate2" class="w-full p-2 rounded" />
          </div>
          <div class="md:text-end">
            <label>Party Duration</label>
          </div>
          <div>
            <input type="number" v-model="partyLength" class="w-full p-2 rounded" />
          </div>
          <div class="md:text-end">
            <label>Party Start Time</label>
          </div>
          <div>
            <input type="time" v-model="partyStart" class="w-full p-2 rounded" />
          </div>
          <div class="md:text-end">
            <label>Number of Children</label>
          </div>
          <div>
            <input type="number" v-model="numChildren" class="w-full p-2 rounded" />
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
        <div class="md:flex md:justify-end">
          <button
            class="btn-accent flex justify-center items-center text-2xl capitalise font-bold px-6 py-3 my-4 w-full md:w-fit"
          >
            Send Me A Quote
          </button>
        </div>
        <p class="error" v-if="!formIsValid">
          One or more fields are invalid. Please correct the errors and submit again.
        </p>
      </form>
    </BaseCard>
  </div>
</template>
BaseCa
