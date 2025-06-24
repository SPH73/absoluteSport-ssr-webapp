<script setup>
useHead({
  title: `Charity Event Ticket Booking`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/events/booking",
    },
  ],
});

// keep alive
const selectedTab = ref("EventForm");
const setSelectedTab = (tab) => {
  selectedTab.value = tab;
};

// booking data
const eventBooking = ref([]);
const ticketNames = ref([]);
const payerName = ref("");
const payerEmail = ref("");
const payerContact = ref("");
const payerAdded = ref(null);
const savedPayer = ref({});
const ticketRef = ref(null);
const paymentRef = ref(null);
const acceptedTerms = ref(false);

// payer details
const handleSavePayer = (name, contact, email, terms) => {
  try {
    createPaymentRef();
    payerName.value = name;
    payerContact.value = contact;
    payerEmail.value = email;
    acceptedTerms.value = terms;

    savedPayer.value = {
      payerName: payerName.value,
      payerContact: payerContact.value,
      payerEmail: payerEmail.value,
      paymentRef: paymentRef.value,
      numTickets: numTickets,
      ticketNames: ticketNames,
      amountDue: totalCost,
      status: "awaiting payment",
    };
  } catch (err) {
    console.error("Error in handleSavePayer:", err);
  }
};

watch(savedPayer, () => {
  payerAdded.value = Object.keys(savedPayer.value).length;
});

// TODO
// const recaptcha = ref({ val: "..." });

// ticket booking

const ticketType = ref("select");
const ticketPrice = ref(null);
const ticketName = ref("");
const ticketAge = ref("select");
const ticketInfo = ref("");

const handleAddTicketItem = (name, age, type, info, price) => {
  createTicketRef();
  ticketName.value = name;
  ticketAge.value = age;
  ticketType.value = type;
  ticketInfo.value = info;
  ticketPrice.value = price;

  if (!ticketNames.value.includes(name)) {
    ticketNames.value.push(name);
  }

  watchEffect(() => {
    console.log("total cost***", totalCost.value);
  });
  // computed ticket price
  const calculatedTicketPrice = computed(() => {
    if (ticketType.value === "infant") {
      return (ticketPrice.value = 0);
    } else if (ticketType.value === "child") {
      return (ticketPrice.value = 10);
    } else if (ticketType.value === "adult") {
      return (ticketPrice.value = 7.5);
    }
  });

  watchEffect(() => {
    ticketType.value;
    console.log("ticket price***", ticketPrice.value);
    console.log("ticket cost***", totalCost.value);
  });
  const ticketItem = ref({});
  ticketItem.value = {
    ticketName: ticketName.value,
    payerName: payerName.value,
    ticketAge: ticketAge.value,
    ticketType: ticketType.value,
    bookingRef: bookingRef.value,
    ticketInfo: ticketInfo.value,
    price: calculatedTicketPrice.value,
    paymentRef: paymentRef.value,
    status: "reserved",
  };

  eventBooking.value.push(ticketItem.value);
};

const tickets = computed(() => {
  return JSON.stringify(ticketNames.value);
});

const numTickets = computed(() => {
  return ticketNames.value.length;
});

const totalCost = computed(() => {
  return eventBooking.value.reduce(
    (total, curr) => (total = total + curr.price),
    0
  );
});

const removeItem = (item) => {
  eventBooking.value = eventBooking.value.filter(
    (ticket) => ticket.ticketRef !== item
  );
};

const createTicketRef = () => {
  ticketRef.value = Date.now().toString(24);
};
const createPaymentRef = () => {
  paymentRef.value = Date.now().toString(36);
};
const bookingDate = new Date().toLocaleString("en-GB");
const cancelBooking = () => {
  savedPayer.value = {};
  eventBooking.value = [];
  ticketNames.value = [];
};

async function confirmBooking() {
  const success = ref(false);
  const payId = ref(null);
  const bookId = ref(null);

  const resPay = await $fetch("/api/events/ffdPayment", {
    method: "post",
    body: savedPayer.value,
  });

  payId.value = resPay.id;
  console.log("resPay*****", resPay.id);
  console.log("payId*****", payId.value);

  const summary = ref([]);
  for (let item of eventBooking.value) {
    const resBook = await $fetch("/api/events/eventBooking", {
      method: "post",
      body: item,
    });
    bookId.value = resBook.id;
    console.log("resBook*****", resBook.fields);
    console.log("bookId*****", bookId.value);
    summary.value.push(resBook.fields);
  }
  console.log("booking summary*****", summary.value);

  if (payId && bookId) {
    success.value = true;
  } else {
    alert("We are sorry, there was a problem with your booking");
  }
  if (success) {
    const router = useRouter();
    const date = new Date().toLocaleString("en-GB");
    router.replace({
      path: "/events/success",
      query: {
        name: payerName.value,
        phone: payerContact.value,
        email: payerEmail.value,
        tickets: tickets.value,
        paymentRef: paymentRef.value,
        amountDue: totalCost.value,
        bookingDate: date,
        status: "awaiting payment",
      },
    });
  }
}
</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <KeepAlive>
        <EventBookingForm
          v-if="selectedTab === 'EventForm'"
          @payer-submitted="handleSavePayer"
          @event-ticket-added="handleAddTicketItem"
          @show-steps="selectedTab = 'EventBookingDetails'"
          :payer-added="payerAdded"
        ></EventBookingForm>
      </KeepAlive>
      <KeepAlive>
        <EventBookingDetails
          v-if="selectedTab === 'EventBookingDetails'"
          :payerAdded="payerAdded"
          :payerName="payerName"
          :payerContact="payerContact"
          :payerEmail="payerEmail"
          :paymentRef="paymentRef"
          :bookingDate="bookingDate"
          :eventBooking="eventBooking"
          @handleRemoveTicketItem="removeItem"
          @handleCancelBooking="cancelBooking"
          @handleConfirmBooking="confirmBooking"
        ></EventBookingDetails>
      </KeepAlive>
      <div class="button-container">
        <div class="btn-group">
          <button
            class="btn-accent"
            v-show="selectedTab === 'EventForm'"
            @click="selectedTab = 'EventBookingDetails'"
          >
            Review Booking Details <span>&nbsp;⟼</span>
          </button>
          <button
            class="btn-accent"
            v-show="selectedTab === 'EventBookingDetails'"
            @click="selectedTab = 'EventForm'"
          >
            <span>⟻&nbsp;</span> Back To Booking Form
          </button>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
