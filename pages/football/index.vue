<script lang="ts" setup>
const formData = ref({});
const firstName = ref({ val: "", isValid: true });
const lastName = ref({ val: "", isValid: true });
const email = ref({ val: "", isValid: true });
const success = ref("");

const formIsValid = ref(true);

// methods
const validateForm = () => {
  formIsValid.value = true;

  // form details
  if (firstName.value.val === "") {
    firstName.value.isValid = false;
    formIsValid.value = false;
  }
  if (lastName.value.val === "") {
    lastName.value.isValid = false;
    formIsValid.value = false;
  }
  if (email.value.val === "" || !email.value.val.includes("@")) {
    email.value.isValid = false;
    formIsValid.value = false;
  }
};

async function subscribe() {
  validateForm();
  if (!formIsValid.value) {
    return;
  }

  formData.value = {
    firstName: firstName.value.val,
    lastName: lastName.value.val,
    email: email.value.val,
    status: "pending",
  };

  console.log(formData.value);

  const result = await $fetch("/api/mailchimp", {
    method: "post",
    body: formData.value,
  });

  if (result) {
    success.value =
      "Thank you for subscribing to updates, please confirm your email address!";
    firstName.value.val = "";
    lastName.value.val = "";
    email.value.val = "";
  }
}
</script>

<template>
  <div>
    <div class="max-w-7xl mx-auto">
      <div class="container font-play py-4">
        <h2 class="font-play capitalize">Football Academy at AbsoluteSport</h2>
        <p>Yes! AbsoluteSport is bringing you Football Academy this year!</p>
      </div>
      <section id="subscriber" class="max-w-6xl">
        <p
          class="tracking-wide text-md lg:text-3xl 2xl:text-4xl py-3 lg:py-8 font-inter-medium"
        >
          Please consider subscribing to the Football Academy mailing list to be kept
          informed. No spam ever, just updates and info!
        </p>
        <form @submit.prevent="subscribe">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-4">
            <input
              type="text"
              v-model.trim.lazy="firstName.val"
              placeholder="First"
              class="p-3 rounded text-xl"
            />
            <input
              type="text"
              v-model.trim.lazy="lastName.val"
              placeholder="Last"
              class="p-3 rounded text-xl"
            />
            <input
              type="email"
              v-model.trim.lazy="email.val"
              placeholder="Email"
              class="p-3 rounded text-xl"
            />
            <button class="btn-subscribe">Subscribe</button>
          </div>
        </form>
        <p v-if="success" class="text-md text-primary font-inter-medium tracking-wide">
          {{ success }}
        </p>
        <p v-else class="text-sm font-inter-regular tracking-wide">
          By submitting your info you are giving us permission to store your data for the
          purpose of you relevant info you relevant info, updates and upcoming offers to
          your inbox. Your data will never be sold or given to a third party. You can
          request to unsubscribe at anytime by clicking the unsubscribe link in our
          emails.
        </p>
      </section>
      <section id="message-from-coach"></section>
    </div>
  </div>
</template>
