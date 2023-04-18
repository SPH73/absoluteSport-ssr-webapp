<script lang="ts" setup>
useHead({
  title: `Clubs reservation success`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/clubs/success",
    },
  ],
});
const route = useRoute();
const data = ref(route.query);
const paymentRef = ref(route.query.paymentRef);
const amount = Number(data.value.amountDue) * 100;
const instantPayment = ref(true);
const paymentRequest = ref(false);
const paymentCreated = ref(false);
let paymentURL: string | undefined;
const payNow = async () => {
  const details = {
    paymentRef: paymentRef.value,
    amount: amount,
    description: `AbsoluteSport School Clubs : bookings payment: ${paymentRef.value}`,
  };
  console.log("pay now details", details);
  const createdBillingRequest = await $fetch("/api/gocardless/billing-request", {
    method: "post",
    body: details,
  });

  console.log("billing request res*****", createdBillingRequest);
  if (createdBillingRequest) {
    paymentRequest.value = true;
    const paymentDetails = {
      id: createdBillingRequest,
      paymentRef: paymentRef.value,
      amount: data.value.amountDue,
    };

    console.log("paymentDetails", paymentDetails);
    const createdBillingRequestFlow = await $fetch(
      "/api/gocardless/billing-request-flow",
      {
        method: "post",
        body: paymentDetails,
      }
    );

    console.log("billing request flow payment url", createdBillingRequestFlow);

    if (createdBillingRequestFlow) {
      paymentCreated.value = true;
      paymentURL = createdBillingRequestFlow.authorisation_url;
    }
  } else {
    instantPayment.value = false;
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto print:bg-light print:text-dark">
    <div class="container py-8">
      <h2 class="font-play print:text-dark">Success!</h2>
      <p class="tracking-wide">
        Thank you for reserving your child a place in our AbsoluteSport school clubs.
      </p>
      <p class="font-inter-medium print:hidden">
        This page is printer friendly! We suggest printing it or saving it as a PDF for
        future reference before closing the page.
      </p>
      <button
        class="btn-accent my-2 w-full md:w-fit print:hidden"
        onclick="window.print()"
      >
        Print this page
      </button>
      <div v-if="instantPayment" class="print:hidden">
        <h3>Payment options:</h3>
        <p>1: Instant Secure Payment</p>
        <p>
          This option confirms your booking immediately and is the recommended payment
          method.
        </p>
        <p>
          Click <span class="font-play">Request Pay Now </span>to create an instant
          payment request.
        </p>
        <p>
          Once the request has been created the button will update to
          <span class="font-play"> Pay Now</span>.
        </p>
        <p>
          Click <span class="font-play"> Pay Now </span> to be securely redirected to our
          payment processor <span class="font-play"> GoCardless</span>. Your bank will ask
          you to authorise the payment.
        </p>
        <p>
          As soon your payment has been processed, you will receive a confirmation email
          for your records from<span class="font-play"> GoCardless</span>.
        </p>
        <!-- instnt payment buttons -->
        <button
          v-if="paymentRequest === false"
          class="btn-secondary print:hidden"
          @click="payNow"
        >
          Request Pay Now
        </button>
        <button v-if="paymentCreated === true" class="btn-secondary print:hidden">
          <NuxtLink :to="paymentURL" target="_blank"> Pay Now </NuxtLink>
        </button>

        <!-- bank transfter -->
        <p>2: Pay by bank transfer</p>
        <p>
          If you are unable to connect to your bank or haven't set up internet banking you
          can still pay via bank transfer.
        </p>
      </div>
      <h3 v-else>Please pay by bank transfer</h3>
      <p>
        If paying by bank transfer, please ensure you use the payment reference provided
        and email us the bank payment confirmation.
      </p>
      <p class="font-inter-bold">
        Your booking status will be updated to paid on receipt of the funds in our
        account.
      </p>
      <p>Account Name: <span class="font-play">ABSOLUTESPORT</span></p>
      <p>Account Number: <span class="font-play">36771585</span></p>
      <p>Sort Code: <span class="font-play">09-01-29</span></p>
      <p>
        Beneficiary Reference:
        <span class="font-play">{{ data.paymentRef }}</span>
      </p>
      <div class="pb-4">
        <h3 class="font-play capitalize print:text-dark">Clubs Booking Summary</h3>
        <p>
          This is the payment reference number:
          <span class="font-play">{{ paymentRef }} </span>. Please include it in any
          correspondence relating to this booking.
        </p>
        <div>
          <h3 class="font-play capitalize print:text-dark">Your details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-light print:border-secondary text-light w-full text-2xl rounded-md"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Payment Reference
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.paymentRef }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Booking Date
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.bookingDate }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Your Name
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.name }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Phone
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.phone }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Email
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.email }}
                </td>
              </tr>
            </tbody>
          </table>
          <h3 class="font-play capitalize print:text-dark">Booking details:</h3>
          <table
            class="table-auto border-separate border-spacing-2 border border-light print:border-secondary text-light w-full text-2xl rounded-md"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  First Name
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.childName }} {{ data.surname }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Surname
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.surname }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Medical Conditions
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.medicalConds }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  School
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.school }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Year Group
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.yearGroup }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Clubs Booked
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  {{ data.clubsQty }} {{ data.clubsBooked }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-light text-left text-secondary border border-light print:border-secondary p-4 w-2/5"
                >
                  Amount Due
                </th>
                <td
                  class="bg-light text-dark border border-light print:border-secondary p-4 w-3/5"
                >
                  £{{ data.amountDue }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="print:hidden">
        <button class="btn-primary my-4 w-full md:w-fit" onclick="window.print()">
          Print this page
        </button>
      </div>
    </div>
  </div>
</template>
