<script setup lang="ts">
// -------------------------------------------
// Props (simple, stable, TS-safe)
// -------------------------------------------
const props = defineProps({
  parentAdded: { type: Number, default: null },
  parentName: { type: String, default: "" },
  mainContact: { type: String, default: "" },
  email: { type: String, default: "" },
  paymentRef: { type: String, default: "" },
  bookingDate: { type: String, default: "" },
  campBooking: { type: Array as () => any[], default: () => [] },
});

// -------------------------------------------
// Emits
// -------------------------------------------
const emit = defineEmits([
  "handleRemoveBookingItem",
  "handleConfirmBooking",
  "handleCancelBooking",
]);

// -------------------------------------------
// State
// -------------------------------------------
const submitDisabled = ref(false);

// -------------------------------------------
// Event handlers
// -------------------------------------------
const removeBookingItem = (bookingRef: string) => {
  emit("handleRemoveBookingItem", bookingRef);
};

const confirmBooking = () => {
  emit("handleConfirmBooking");
  submitDisabled.value = true;
};

const cancelBooking = () => {
  emit("handleCancelBooking");
};

// -------------------------------------------
// Computed totals
// -------------------------------------------
const amountDue = computed(() => {
  return props.campBooking.reduce(
    (total, curr: any) => total + (curr.price || 0),
    0
  );
});
</script>

<template>
  <div>
    <h2 class="text-accent font-play capitalize">Booking Details</h2>

    <!-- Step guidance before parent details are added -->
    <div v-if="!props.parentAdded">
      <ul>
        <li>
          <p class="text-light">
            <strong class="text-accent">Step 1</strong>
          </p>
          <p class="text-light">
            To start your booking process, please add and save
            parent/guardian’s details.
          </p>
        </li>
      </ul>
    </div>

    <!-- Parent summary -->
    <div v-else>
      <h3>Parent/Guardian Payment Details</h3>
      <table
        class="table-auto border-separate border-spacing-2 border border-light w-full text-2xl rounded-md"
      >
        <tbody>
          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Your Name
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ props.parentName }}
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Contact Number
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ props.mainContact }}
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Email
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ props.email }}
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5">
              Booking Date
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              {{ props.bookingDate }}
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5">
              Total Amount Due
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              <strong>£{{ amountDue }}</strong>
            </td>
          </tr>

          <tr v-if="amountDue > 0">
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Payment Reference
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              <strong>{{ props.paymentRef }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment instructions -->
    <div v-if="amountDue > 0">
      <p class="text-light">Payment is by bank transfer to:</p>
      <p class="text-light">Account Name: ABSOLUTESPORT</p>
      <p class="text-light">Account Number: 36771585</p>
      <p class="text-light">Sort Code: 09-01-29</p>
      <p class="text-light">
        Beneficiary Reference:
        <span class="font-play">{{ props.paymentRef }}</span>
      </p>
    </div>

    <!-- Child camp booking items -->
    <div v-if="props.campBooking.length">
      <h3>Camp Bookings</h3>

      <table
        class="table-auto border-separate border-spacing-2 border border-light w-full text-2xl rounded-md mt-8"
      >
        <tbody
          v-for="(booking, index) in props.campBooking"
          :key="booking.bookingRef"
          @click="removeBookingItem(booking.bookingRef)"
        >
          <tr>
            <th
              class="uppercase p-4 bg-secondary text-left text-accent border border-secondary w-2/5"
            >
              {{ index + 1 }}: Camp Booked
            </th>
            <td class="bg-light text-dark border border-secondary p-4 w-3/5">
              {{ booking.campName }}
              <span class="cursor-pointer">
                <strong class="text-secondary">[X Remove]</strong>
              </span>
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Camp Location
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ booking.location }}
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Child
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              {{ booking.childName }} {{ booking.childSurname }}
              ({{ booking.childAge }}y/o at camp)
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Days attending
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              <span v-for="day in booking.daysBooked" :key="day">
                {{ day }}{{ day !== booking.daysBooked.at(-1) ? ", " : "" }}
              </span>
            </td>
          </tr>

          <tr>
            <th class="uppercase p-4 bg-secondary text-left text-accent border border-secondary">
              Booking Cost
            </th>
            <td class="bg-light text-dark border border-secondary p-4">
              £{{ booking.price }}
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

    <!-- Guidance when no booking items yet -->
    <div v-else>
      <ul>
        <li>
          <p class="text-light">
            <strong class="text-accent">Step 2</strong>
          </p>
          <p class="text-light">Please add your child’s details…</p>
        </li>

        <li>
          <p class="text-light">
            <strong class="text-accent">Step 3</strong>
          </p>
          <p class="text-light">
            …select a camp week and tick the days they will attend, then click
            <span class="text-accent">“Save To Booking”</span>.
          </p>
        </li>

        <li>
          <p class="text-light">
            <strong class="text-accent">Step 4</strong>
          </p>
          <p class="text-light">
            Repeat Steps 2 &amp; 3 for additional weeks or siblings.
          </p>
        </li>
      </ul>

      <ul>
        <li>
          <p class="text-light">
            <strong class="text-accent">Step 5</strong>
          </p>
          <p class="text-light">
            Once all items are added, click
            <span class="text-accent">“Confirm Booking”</span>.
          </p>
        </li>
      </ul>

      <ul>
        <li>
          <p class="text-light">
            <strong class="text-accent">TIP</strong>
          </p>
          <p class="text-light">
            Remove bookings using <span class="text-accent">“[X Remove]”</span>
            or restart using <span class="text-accent">“Cancel Booking”</span>.
          </p>

          <p class="text-accent font-bold">
            Please note: Camp places are reserved on receipt of your booking,
            but are only secured once payment is received.
          </p>
        </li>
      </ul>
    </div>
  </div>

  <p class="text-light mt-6">
    If you experience any difficulties or need assistance, please contact us.
  </p>
</template>
