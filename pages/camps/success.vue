<script lang="ts" setup>
const route = useRoute();
const data = ref(route.query);
const paymentRef = ref(route.query.paymentRef);
const date = new Date().toLocaleString();
console.log("success****", data.value);
</script>

<template>
  <div class="max-w-7xl mx-auto print:bg-light print:text-dark">
    <div class="container py-8">
      <h2 class="font-play">Success!</h2>
      <p class="tracking-wide text-dark">
        Thank you, we have received your booking. Please use the payment reference to
        confirm your reserved places.
      </p>
      <div class="pb-4">
        <h3 class="font-play capitalize">Your enquiry</h3>
        <p class="text-dark">
          Below is a summary of your enquiry to save or print for your records.
        </p>
        <p class="text-dark">
          This is the payment reference number:
          <span class="font-bold">{{ paymentRef }} </span>. Please include it in any
          correspondence.
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
                Booking Date
              </th>
              <td class="bg-light text-dark border border-secondary p-4 w-3/5">
                {{ date }}
              </td>
            </tr>
            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                Your Name
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ data.name }}
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
          </table>
          <h3 class="font-play capitalize">Booking details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-secondary text-light w-full text-2xl rounded-md"
          >
            <tr>
              <th class="uppercase p-4 bg-secondary text-left text-accent p-4 w-2/5">
                Camp
              </th>
              <td class="bg-light text-dark border border-secondary p-4 w-3/5">camp</td>
            </tr>

            <tr>
              <th
                class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
              >
                No. Children
              </th>
              <td class="bg-light text-dark border border-secondary p-4">
                {{ data.numChildren }}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="print:hidden">
        <BaseButton class="btn-secondary my-4 w-full md:w-fit" onclick="window.print()">
          Print this page
        </BaseButton>
      </div>
    </div>
  </div>
</template>
