<script setup lang="ts">
const props = defineProps<{
  payerAdded: boolean;
  payerName: string;
  payerContact: string;
  payerEmail: string;
  paymentRef: string | null;
  bookingDate: string;
  eventBooking: Array<{
    name: string;
    age: string;
    price: number;
    bookingRef: string;
  }>;
  amountDue: number;
}>();

const emit = defineEmits([
  "handleRemoveBookingItem",
  "handleConfirmBooking",
  "handleCancelBooking",
]);

const submitDisabled = ref(false);

const removeBookingItem = (item: string) => {
  emit("handleRemoveBookingItem", item);
};

const confirmBooking = () => {
  submitDisabled.value = true;
  emit("handleConfirmBooking");
};

const cancelBooking = () => {
  emit("handleCancelBooking");
};
</script>

<template>
  <div>
    <h2 class="text-accent">Booking Details</h2>

    <div v-if="!props.payerAdded">
      <p>Please complete the booking form first</p>
    </div>

    <div v-else>
      <h3>Payer Details</h3>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{{ props.payerName }}</td>
          </tr>
          <tr>
            <th>Contact</th>
            <td>{{ props.payerContact }}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{{ props.payerEmail }}</td>
          </tr>
          <tr>
            <th>Booking Date</th>
            <td>{{ props.bookingDate }}</td>
          </tr>
          <tr>
            <th>Amount Due</th>
            <td>£{{ props.amountDue.toFixed(2) }}</td>
          </tr>
          <tr v-if="props.paymentRef">
            <th>Payment Ref</th>
            <td>{{ props.paymentRef }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="props.eventBooking.length">
        <h3>Tickets</h3>
        <table>
          <tbody>
            <tr
              v-for="(booking, index) in props.eventBooking"
              :key="booking.bookingRef"
            >
              <td>{{ index + 1 }}. {{ booking.name }} ({{ booking.age }})</td>
              <td>£{{ booking.price.toFixed(2) }}</td>
              <td>
                <button @click="removeBookingItem(booking.bookingRef)">
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="actions">
          <button @click="confirmBooking" :disabled="submitDisabled">
            Confirm Booking
          </button>
          <button @click="cancelBooking">Cancel Booking</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  @apply w-full my-4 border-collapse;
}

th,
td {
  @apply border p-2;
}

th {
  @apply bg-gray-100 text-left;
}

.actions {
  @apply flex gap-4 mt-4;
}

button:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
