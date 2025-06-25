<script setup>
useHead({
  title: `Event Ticket Booking`,
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
const ticketList = ref([]);
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
      payerEmail: payerEmail.value,
      payerContact: payerContact.value,
      paymentRef: paymentRef.value,
      amountDue: totalCost,
      status: "awaiting payment",
      numTickets: numTickets,
      ticketNames: ticketNames,
    };
  } catch (err) {
    console.error("Error in handleSavePayer:", err);
  }
  console.log("savedPayer***", savedPayer.value);
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

  if (!ticketList.value.includes(name)) {
    ticketList.value.push(name);
  }

  // computed ticket price
  let calculatedTicketPrice = 0;

  if (type === "infant") calculatedTicketPrice = 0;
  else if (type === "child") calculatedTicketPrice = 10;
  else if (type === "adult") calculatedTicketPrice = 7.5;

  watchEffect(() => {
    ticketType.value;
    console.log("ticket price***", ticketPrice.value);
    console.log("total cost***", totalCost.value);
  });
  const ticketItem = ref({});
  ticketItem.value = {
    payerName: payerName.value,
    status: "reserved",
    paymentRef: paymentRef.value,
    ticketName: ticketName.value,
    ticketType: ticketType.value,
    ticketAge: ticketAge.value,
    ticketPrice: calculatedTicketPrice,
    ticketInfo: ticketInfo.value,
    ticketRef: ticketRef.value,
  };

  eventBooking.value.push(ticketItem.value);
  console.log("eventBooking***", eventBooking.value);

  console.log("ticketList***", ticketList.value);
};

const ticketNames = computed(() => {
  return JSON.stringify(ticketList.value);
});

const numTickets = computed(() => {
  return ticketList.value.length;
});

const totalCost = computed(() => {
  return eventBooking.value.reduce(
    (total, curr) => (total = total + curr.ticketPrice),
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
    const resBook = await $fetch("/api/events/ffdBooking", {
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
        tickets: ticketNames.value,
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
