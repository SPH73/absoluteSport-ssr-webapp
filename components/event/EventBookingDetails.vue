<script setup>
const props = defineProps([
  "payerAdded",
  "payerName",
  "payerContact",
  "payerEmail",
  "paymentRef",
  "bookingDate",
  "eventBooking",
]);

const submitDisabled = ref(false);
// events
const emit = defineEmits([
  "handleRemoveTicketItem",
  "handleConfirmBooking",
  "handleCancelBooking",
]);
const removeTicketItem = (item) => {
  emit("handleRemoveTicketItem", item);
};
const confirmBooking = () => {
  emit("handleConfirmBooking");
  submitDisabled.value = true;
};
const cancelBooking = () => {
  emit("handleCancelBooking");
};
// computed cost
const amountDue = computed(() => {
  return props.eventBooking.reduce(
    (total, curr) => (total = total + curr.ticketPrice),
    0
  );
});
</script>

<template>
  <div>
    <h2 class="text-accent font-play capitalize">Booking Details</h2>
    <div v-if="!props.payerAdded">
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">Step 1</strong></p>
          <p class="text-light">
            To start booking your tickets, please add and save the payer's
            details.
          </p>
        </li>
      </ul>
    </div>
    <div v-else>
      <h3>Payment Details</h3>
      <table
        class="table-auto border-separate border-spacing-2 border border-light w-full text-2xl rounded-md"
      >
        <tbody>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
            >
              Your Name
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ props.payerName }}
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
            >
              Contact Number
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ props.payerContact }}
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
            >
              Email
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ props.payerEmail }}
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
            >
              Booking Date
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              {{ props.bookingDate }}
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
            >
              Total Amount Due
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              <strong>£{{ amountDue.toFixed(2) }}</strong>
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
            >
              Payment Reference
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              <strong>{{ props.paymentRef }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <p class="text-light">Payment is by instant payment or bank transfer</p>
      <p class="text-light">Payment by bank transfer to:</p>
      <p class="text-light">Account Name: ABSOLUTESPORT</p>
      <p class="text-light">Account Number: 36771585</p>
      <p class="text-light">Sort Code: 09-01-29</p>
      <p class="text-light">
        Beneficiary Reference:
        <span class="font-play">{{ props.paymentRef }}</span>
      </p>
    </div>
    <div v-if="props.eventBooking.length > 0">
      <h3>Event Bookings</h3>
      <table
        class="table-auto border-separate border-spacing-2 border border-light w-full text-2xl rounded-md mt-8"
      >
        <tbody
          v-for="(booking, index) in props.eventBooking"
          :key="booking.ticketRef"
          @click="removeTicketItem(booking.ticketRef)"
        >
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5 mt-8"
            >
              {{ index + 1 }}:&nbsp;Ticket Holder
            </th>
            <td
              class="bg-light text-dark border border-secondary p-4 w-3/5 mt-8"
            >
              {{ booking.ticketName }}&nbsp;
              <span class="cursor-pointer"
                ><strong class="text-secondary">[X&nbsp;Remove]</strong></span
              >
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
            >
              Ticket Details
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              <span class="font-bold">Type: &nbsp;</span>
              {{ booking.ticketType }} &nbsp;
              <span
                v-if="
                  booking.ticketType === 'child' ||
                  booking.ticketType === 'infant'
                "
                class="font-bold"
                >Age:
              </span>
              {{ booking.ticketAge }}
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
            >
              Special Requirements
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ booking.ticketInfo }}
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
            >
              Ticket Reference
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              <span class="font-bold">Reference:</span> {{ booking.ticketRef }}
            </td>
          </tr>
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary"
            >
              Ticket Price
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              £{{ booking.ticketPrice.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="btn-group mt-4">
        <button
          class="btn-accent mr-4"
          @click="confirmBooking"
          :disabled="submitDisabled"
        >
          Confirm Booking
        </button>
        <button class="btn-accent" @click="cancelBooking">
          Cancel Booking
        </button>
      </div>
    </div>
    <div v-else>
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">Step 2</strong></p>
          <p class="text-light">Please add your ticket then...</p>
        </li>
        <li>
          <p class="text-light"><strong class="text-accent">Step 3</strong></p>
          <p class="text-light">
            Save by clicking
            <span class="text-accent">"Add To Booking"</span>.
          </p>
        </li>
        <li>
          <p class="text-light"><strong class="text-accent">Step 4</strong></p>
          <p class="text-light">
            Continue repeating
            <span class="text-accent">Steps 2 &amp; 3 </span> for each ticket
            you wish to book.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">Step 5</strong></p>
          <p class="text-light">
            Once you have added any additional tickets and confirmed the details
            are correct, click
            <span class="text-accent">"Confirm Booking" </span> to send us your
            booking. That's it, you are done and your tickets are reserved.
            Please remember to make your payment to us as soon as possible!
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">TIP</strong></p>
          <p class="text-light">
            You can remove individual tickets by clicking
            <span class="text-accent">"[X Remove]"</span> next to each ticket or
            click <span class="text-accent">"Cancel Booking" </span>to start
            again.
          </p>
          <p class="text-accent font-bold">
            Kindly take note: Ticket purchases are reserved on receipt of
            booking request but will only be confirmed on receipt of payment as
            we operate on a first
            <em>paid</em> basis. We apologise for any inconvenience this may
            cause and encourage you to take advantage of our instant payment
            option.
          </p>
        </li>
      </ul>
    </div>
  </div>
  <p class="text-light">
    If you experience any difficulties with booking or need assistance, please
    contact us for help.
  </p>
</template>
