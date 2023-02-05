<script lang="ts" setup>
const route = useRoute();
const data = ref(route.query);
const paymentRef = ref(route.query.paymentRef);

// const date = ref(route.query.bookingDate);
// console.log("success****", data.value);
</script>

<template>
  <div class="max-w-7xl mx-auto print:bg-light print:text-dark">
    <div class="container py-8">
      <h2 class="font-play">Success!</h2>
      <p class="tracking-wide text-dark">
        Thank you for reserving your child a place in our AbsoluteSport school
        clubs. Please use the payment reference for any future correspondence.
      </p>
      <p class="tracking-wide text-dark">Payment is by bank transfer to:</p>
      <p class="tracking-wide text-dark">Account Name:</p>
      <p class="tracking-wide text-dark">Account Number:</p>
      <p class="tracking-wide text-dark">Sort Code:</p>
      <p class="tracking-wide text-dark">
        Beneficiary Reference: {{ data.paymentRef }}
      </p>
      <div class="pb-4">
        <h3 class="font-play capitalize">Club Booking Summary</h3>
        <p class="text-dark">
          Below is a summary of your booking to save or print for your records.
        </p>
        <p class="text-dark">
          Please use your payment reference
          <span class="font-bold text-light">{{ paymentRef }} </span>
          for any future correspondence relating to this booking.
        </p>
        <div>
          <h3 class="font-play capitalize">Your details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Payment Reference
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.paymentRef }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Booking Date
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.bookingDate }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Your Name
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.name }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Phone
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.phone }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Email
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.email }}
                </td>
              </tr>
            </tbody>
          </table>
          <h3 class="font-play capitalize">Booking details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-light text-light w-full text-2xl rounded-md"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  First Name
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.childName }} {{ data.surname }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Surname
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.surname }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Medical Conditions
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.medicalConds }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  School
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.school }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Year Group
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.yearGroup }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Clubs
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  {{ data.clubsQty }} {{ data.clubsBooked }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light p-4 w-2/5"
                >
                  Amount Due
                </th>
                <td class="bg-light text-dark border border-light p-4 w-3/5">
                  £{{ data.amountDue }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="print:hidden">
        <button
          class="btn-primary my-4 w-full md:w-fit"
          onclick="window.print()"
        >
          Print this page
        </button>
      </div>
    </div>
  </div>
</template>
