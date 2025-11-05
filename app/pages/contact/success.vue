<script lang="ts" setup>
useHead({
  title: `Contact message success`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/contact/success",
    },
  ],
});
const route = useRoute();
const data = ref(route.query);
const enqRef = ref(route.query.enqRef);
const date = new Date().toLocaleString();
console.log("success****", data.value);
</script>

<template>
  <div class="max-w-7xl mx-auto print:bg-light print:text-dark">
    <div class="container py-8">
      <h2 class="font-play">Success!</h2>
      <p class="tracking-wide">
        Thank you, we have received your message and will be in contact soon!
      </p>
      <div class="pb-4">
        <h3 class="font-play capitalize">Your enquiry</h3>
        <p>
          Below is a summary of your enquiry to save or print for your records.
        </p>
        <p>
          This is the reference number for your enquiry:
          <span class="font-play">{{ enqRef }}</span
          >. Please include it in any correspondence.
        </p>
        <div>
          <h3 class="font-play capitalize">Your details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-secondary text-light w-full text-2xl rounded-md"
          >
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
              >
                Enquiry Date
              </th>
              <td class="bg-light text-dark border border-secondary p-4 w-3/5">
                {{ date }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                First Name
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ data.name }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Surname
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ data.surname }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Phone
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ data.phone }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Email
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ data.email }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Message
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ data.message }}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="print:hidden">
        <BaseButton
          class="btn-secondary my-4 w-full md:w-fit"
          onclick="window.print()"
        >
          Print this page
        </BaseButton>
      </div>
    </div>
  </div>
</template>
