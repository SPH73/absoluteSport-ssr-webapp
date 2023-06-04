<script lang="ts" setup>

const emit = defineEmits([
  "parent-submitted",
]);

const enteredParentName = ref({ val: "", isValid: true });
const enteredContact = ref({ val: "", isValid: true });
const enteredEmail = ref({ val: "", isValid: true });
const acceptedTerms = ref({ val: false, isValid: true });
const parentAdded = ref(false);
const parentFormIsValid = ref(true);

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
  if (enteredContact.value.val === null) {
    enteredContact.value.isValid = false;
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
      console.log("parent form invalid");
      return;
    }
    parentAdded.value = true;
    emit(
      "parent-submitted",
      enteredParentName.value.val,
      enteredContact.value.val,
      enteredEmail.value.val,
      parentAdded.value
    );
  }

</script>

<template>
  <div>
    <h3>1. Parent Details</h3>
      <div v-if="parentAdded">
        <p class="text-accent">Details saved successfully!</p>
      </div>
      <div id="academy-parent-details" v-if="!parentAdded">
        <form @submit.prevent="onSubmitParent" >
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
              :class="{ invalid: !enteredContact.isValid }"
            >
              <label>Mobile Number</label>
            </div>
            <div :class="{ invalid: !enteredContact.isValid }">
              <input
                type="tel"
                v-model.trim.lazy="enteredContact.val"
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
      </div>
      <p class="error" v-if="!parentFormIsValid">
        One or more fields are invalid. Please correct the errors and submit
        again.
      </p>
  </div>
</template>
