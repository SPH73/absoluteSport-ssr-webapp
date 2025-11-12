<script setup>
useHead({
  title: `Contact us`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/contact",
    },
  ],
});
// form data
const formData = ref({});
const firstName = ref({ val: "", isValid: true });
const surname = ref({ val: "", isValid: true });
const email = ref({ val: "", isValid: true });
const phone = ref({ val: "", isValid: true });
const info = ref({ val: "", isValid: true });
const enqRef = ref("");
const formIsValid = ref(true);

// TODO
// const recaptcha = ref({ val: "..." });

// methods
const validateForm = () => {
  formIsValid.value = true;

  // form details
  if (firstName.value.val === "") {
    firstName.value.isValid = false;
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
  if (info.value.val === "") {
    info.value.isValid = false;
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

  formData.value = {
    status: "new",
    enquiryType: "contact",
    firstName: firstName.value.val,
    surname: surname.value.val,
    email: email.value.val,
    phone: phone.value.val,
    info: info.value.val,
    // recaptcha: recaptcha.value.val,
  };

  const res = await $fetch("/api/contact", {
    method: "post",
    body: formData.value,
  });
  console.log("enq res*****", res.fields);

  enqRef.value = res.id;
  const router = useRouter();
  router.replace({
    path: "/contact/success",
    query: {
      name: res.fields.firstName,
      surname: res.fields.surname,
      phone: res.fields.phone,
      email: res.fields.email,
      message: res.fields.info,
      enqRef: res.id,
    },
  });
}
</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <div class="mb-8">
        <h1 class="text-accent font-play capitalize">Let's Chat!</h1>
        <p class="tracking-wide text-light">
          Got questions that we haven't answered in our FAQ's?
        </p>
        <p class="tracking-wide text-light">
          We would love to hear from you so send us a message and we will
          endeavour to respond within one business day.
        </p>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xl w-full">
          <div class="md:text-end" :class="{ invalid: !firstName.isValid }">
            <label>First Name</label>
          </div>
          <div :class="{ invalid: !firstName.isValid }">
            <input
              type="text"
              v-model.trim.lazy="firstName.val"
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
          <div
            class="md:text-end"
            :class="{
              invalid: !info.isValid,
            }"
          >
            <label>Message</label>
          </div>
          <div
            :class="{
              invalid: !info.isValid,
            }"
          >
            <textarea
              v-model.trim.lazy="info.val"
              class="w-full p-2 rounded"
              placeholder="How can we help?"
            />
          </div>
        </div>
        <div class="md:flex md:justify-end">
          <button class="btn-accent my-4 w-full md:w-fit">Send Message</button>
        </div>
        <p class="error" v-if="!formIsValid">
          One or more fields are invalid. Please correct the errors and submit
          again.
        </p>
      </form>
    </BaseCard>
  </div>
</template>
