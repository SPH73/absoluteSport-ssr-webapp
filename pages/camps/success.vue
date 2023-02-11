<script lang="ts" setup>
const route = useRoute();
const data = ref(route.query);
const paymentRef = ref(route.query.paymentRef);
const date = ref(route.query.bookingDate);
console.log("success****", data.value);
</script>

<template>
  <div class="max-w-7xl mx-auto print:bg-light print:text-dark">
    <div class="container py-8">
      <h2 class="font-play">Success!</h2>
      <p class="tracking-wide text-dark">
        Thank you, we have received your booking. If applicable, please use the payment
        reference provided when making payment to ensure it is correctly allocated to your
        booking.
      </p>
      <div class="pb-4">
        <h3 class="font-play capitalize">Booking Summary</h3>
        <p class="text-dark">
          Below is a summary of your booking to save or print for your records.
        </p>
        <p class="text-dark">
          This is the payment reference number:
          <span class="font-bold">{{ paymentRef }} </span>. Please include it in any
          correspondence for this booking.
        </p>
        <div>
          <h3 class="font-play capitalize">Your details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-secondary text-light w-full text-2xl rounded-md"
          >
            <tbody>
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
            </tbody>
          </table>
          <h3 class="font-play capitalize">Booking details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-secondary text-light w-full text-2xl rounded-md"
          >
            <tbody>
              <tr>
                <th class="uppercase p-4 bg-secondary text-left text-accent p-4 w-2/5">
                  Children
                </th>
                <td class="bg-light text-dark border border-secondary p-4 w-3/5">
                  <span v-for="child in data.children">{{ child }}</span>
                </td>
              </tr>
              <tr>
                <th class="uppercase p-4 bg-secondary text-left text-accent p-4 w-2/5">
                  Amount Due
                </th>
                <td class="bg-light text-dark border border-secondary p-4 w-3/5">
                  £{{ data.amountDue }}
                </td>
              </tr>
              <tr>
                <th class="uppercase p-4 bg-secondary text-left text-accent p-4 w-2/5">
                  Booking Status
                </th>
                <td class="bg-light text-dark border border-secondary p-4 w-3/5">
                  {{ data.status }}
                </td>
              </tr>
            </tbody>
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
