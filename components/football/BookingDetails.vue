<script setup>
const props = defineProps([
  "parentAdded",
  "savedParent",
  "academyBooking",
]);

console.log("props academyBooking ", props.academyBooking);

// events
const emit = defineEmits([
  "handleRemoveBookingItem",
  "handleConfirmBooking",
  "handleCancelBooking",
]);
const removeBookingItem = (item) => {
  emit("handleRemoveBookingItem", item);
};
const confirmBooking = () => {
  emit("handleConfirmBooking");
};
const cancelBooking = () => {
  emit("handleCancelBooking");
};

// computed cost
const amountDue = computed(() => {
  return props.academyBooking.reduce((total, curr) => (total = total + curr.termCost), 0);
});
</script>

<template>
  <div>
    <h2 class="text-accent font-play capitalize">Booking Details</h2>
    <div v-if="!props.parentAdded">
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">Step 1</strong></p>
          <p class="text-light">
            To start your booking process, please add and save parent/guardian's details.
          </p>
        </li>
      </ul>
    </div>
    <div v-else>
      <h3>Parent/Guardian Payment Details</h3>
      <table class="table-auto border-separate border-spacing-2 border border-light w-full text-2xl rounded-md">
        <tbody>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Your Name
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{savedParent.parentName}}
            </td>
          </tr>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Contact Number
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ savedParent.mainPhone }}
            </td>
          </tr>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Email
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ savedParent.email }}
            </td>
          </tr>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5">
              Booking Date
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              {{savedParent.bookingDate}}
            </td>
          </tr>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5">
              Total Amount Due
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              <strong>£ {{amountDue}}</strong>
            </td>
          </tr>
          <tr >
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5">
              Payment Reference
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              <strong>{{ savedParent.paymentRef }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div  v-if="amountDue > 0">
      <p class="text-light">Payment is by bank transfer to:</p>
      <p class="text-light">Account Name: ABSOLUTESPORT</p>
      <p class="text-light">Account Number: 36771585</p>
      <p class="text-light">Sort Code: 09-01-29</p>
      <p class="text-light">
        Beneficiary Reference:
        <span class="font-play">{{savedParent.paymentRef}}</span>
      </p>
    </div>
    <div v-if="props.academyBooking.length">
      <h3>Football Academy Bookings</h3>
      <table class="table-auto border-separate border-spacing-2 border border-light w-full text-2xl rounded-md mt-8">
        <tbody  v-for="(booking, index) in props.academyBooking"
            :key="booking.bookingRef"
            @click="removeBookingItem(booking.bookingRef)"
         >
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5 mt-8">
              {{index + 1}}:&nbsp;Bookings
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5 mt-8">
              {{booking.academyRef}}&nbsp;<span class="cursor-pointer"><strong
                  class="text-secondary">[X&nbsp;Remove]</strong></span>
            </td>
          </tr>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Child
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ booking.childName }} ({{ booking.age }}y/o)
            </td>
          </tr>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Academy 
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ booking.academy }}
            </td>
          </tr>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Booking Cost
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              £ {{booking.termCost}}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="btn-group mt-4">
        <button class="btn-accent mr-4" @click="confirmBooking" >Confirm Booking</button>
        <button class="btn-accent" @click="cancelBooking">Cancel Booking</button>
      </div>
    </div>
    <div v-else>
    <!-- v-else -->
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">Step 2</strong></p>
          <p class="text-light">Please add your child's details then...</p>
        </li>
        <li>
          <p class="text-light"><strong class="text-accent">Step 3</strong></p>
          <p class="text-light">
            ... save by
            clicking
            <span class="text-accent">"Add Child"</span>.
          </p>
        </li>
        <li>
          <p class="text-light"><strong class="text-accent">Step 4</strong></p>
          <p class="text-light">
            Continue repeating
            <span class="text-accent">Steps 2 &amp; 3 </span> for any
            siblings you wish to book sessions for.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">Step 5</strong></p>
          <p class="text-light">
            Once you have added all children and confirmed the
            details are correct, click
            <span class="text-accent">"Confirm Booking" </span> to send us your booking.
            That's it, you are done and your booking is reserved. Please remember to make
            your payment to confirm your football academy bookings!
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p class="text-light"><strong class="text-accent">TIP</strong></p>
          <p class="text-light">
            You can remove individual bookings by clicking
            <span class="text-accent">"[X Remove]"</span> next to each booking or
            click <span class="text-accent">"Cancel Booking" </span>to start again.
          </p>
          <p class="text-accent font-bold">
            Kindly take note: Places are reserved on receipt of booking request but
            will only be secured on receipt of payment as we operate on a first
            <em>paid</em> first served basis. We apologise for any inconvenience this may
            cause and encourage you to make payment promptly to avoid losing your
            reservation.
          </p>
        </li>
      </ul>
    </div>
  </div>
  <p class="text-light">
    If you experience any difficulties with booking or need assistance, please contact us
    for help.
  </p>
</template>
