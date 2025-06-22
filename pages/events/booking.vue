<script setup lang="ts">
useHead({
  title: `Charity Event Ticket Booking`,
  meta: [{ name: "robots", content: "noindex" }],
  link: [
    { rel: "canonical", href: "https://www.absolutesport.org/events/booking" },
  ],
});

// Tabs system
const selectedTab = ref<"BookingForm" | "BookingDetails">("BookingForm");
const setSelectedTab = (tab: "BookingForm" | "BookingDetails") => {
  selectedTab.value = tab;
};

// Booking data
const eventBooking = ref<
  Array<{
    name: string;
    age: string;
    info: string;
    bookingRef: string | null;
    price: number;
    paymentRef: string | null;
    status: string;
  }>
>([]);

const bookingRef = ref<string | null>(null);
const paymentRef = ref<string | null>(null);
const ticketNames = ref<string[]>([]);
const payerName = ref("");
const payerEmail = ref("");
const payerContact = ref("");
const acceptedTerms = ref(false);
const payerAdded = ref(false);
const ticketType = ref("select");
const savedPayer = ref<Record<string, any>>({});
const amountDue = ref(0);

// Payer details handler
const handleSavePayerDetails = (
  name: string,
  contact: string,
  email: string,
  terms: boolean
) => {
  createPaymentRef();
  payerName.value = name;
  payerContact.value = contact;
  payerEmail.value = email;
  acceptedTerms.value = terms;

  savedPayer.value = {
    name: payerName.value,
    phone: payerContact.value,
    email: payerEmail.value,
    paymentRef: paymentRef.value,
    numTickets: ticketNames.value.length,
    ticketNames: ticketNames.value,
    amountDue: totalCost.value,
    status: amountDue.value > 0 ? "awaiting payment" : "confirmed",
  };

  payerAdded.value = true;
};

// Ticket handlers
const handleAddTicket = (name: string, age: string) => {
  createBookingRef();
  if (!name || age === "select") {
    alert("Please enter valid name and age");
    return;
  }

  if (!ticketNames.value.includes(name)) {
    ticketNames.value.push(name);
  }

  const ticketPrice = computed(() => {
    if (ticketType.value === "infant") return 0;
    if (ticketType.value === "child") return 10;
    return 7.5; // adult
  });

  eventBooking.value.push({
    name,
    age,
    info: "",
    bookingRef: bookingRef.value,
    price: ticketPrice.value,
    paymentRef: paymentRef.value,
    status: "awaiting payment",
  });
};

// Computed properties
const totalCost = computed(() => {
  return eventBooking.value.reduce((total, curr) => total + curr.price, 0);
});

const bookingDate = new Date().toLocaleString("en-GB");

// Helper functions
const createBookingRef = () => {
  bookingRef.value = Date.now().toString(24);
};

const createPaymentRef = () => {
  paymentRef.value = Date.now().toString(36);
};

const cancelBooking = () => {
  savedPayer.value = {};
  eventBooking.value = [];
  ticketNames.value = [];
  payerAdded.value = false;
};

async function confirmBooking() {
  try {
    const resPay = await $fetch("/api/camps/campPayment", {
      method: "POST",
      body: savedPayer.value,
    });

    for (const item of eventBooking.value) {
      await $fetch("/api/camps/campBooking", {
        method: "POST",
        body: item,
      });
    }

    await navigateTo({
      path: "/event/success",
      query: {
        name: payerName.value,
        phone: payerContact.value,
        email: payerEmail.value,
        paymentRef: paymentRef.value,
        amountDue: totalCost.value,
        bookingDate,
        status: totalCost.value > 0 ? "awaiting payment" : "confirmed",
      },
    });
  } catch (error) {
    alert("Booking failed. Please try again.");
  }
}
</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <KeepAlive>
        <component
          :is="selectedTab"
          v-bind="{
            payerAdded,
            payerName,
            payerContact,
            payerEmail,
            paymentRef,
            bookingDate,
            eventBooking,
            amountDue: totalCost,
          }"
          @payer-submitted="handleSavePayerDetails"
          @show-steps="setSelectedTab('BookingDetails')"
          @event-ticket-added="handleAddTicket"
          @handleRemoveBookingItem="
            (item) =>
              (eventBooking = eventBooking.filter((b) => b.bookingRef !== item))
          "
          @handleCancelBooking="cancelBooking"
          @handleConfirmBooking="confirmBooking"
        />
      </KeepAlive>

      <div class="button-container">
        <div class="btn-group">
          <button
            class="btn-accent"
            v-show="selectedTab === 'BookingForm'"
            @click="setSelectedTab('BookingDetails')"
          >
            Review Booking Details <span>&nbsp;⟼</span>
          </button>
          <button
            class="btn-accent"
            v-show="selectedTab === 'BookingDetails'"
            @click="setSelectedTab('BookingForm')"
          >
            <span>⟻&nbsp;</span> Back To Booking Form
          </button>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
