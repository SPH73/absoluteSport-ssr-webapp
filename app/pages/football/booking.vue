<script setup>
useHead({
  title: `Football Academy booking request`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/football/booking",
    },
  ],
});
const {data: academyList, error} = await useFetch('/api/football/academyList')

const academyOptions = ref([])
let academy = {}
if (academyList.value) {
academyList.value.forEach((record, index) => {
  academy = {
    index: index + 1,
    id: record.id,
    academyName: record.fields.academyName,
    ageGroup: record.fields.ageGroup,
    sessionStart: record.fields.sessionStart,
    sessionDuration: record.fields.sessionDuration,
    sessionTime: record.fields.sessionTime,
    academyRef: record.fields.academyRef,
    venueRef: record.fields.venueRef,
    numSessions: record.fields.numSessions,
    pricePerSession: record.fields.pricePerSession,
    termCost: record.fields.termCost,
    spaceAvailable: record.fields.spaceAvailable,
    startDate: record.fields.startDate,
    endDate: record.fields.endDate,
    status: record.fields.status,
  };
  academyOptions.value.push(academy);
});
// console.log("academy options***", academyOptions.value)
};

const upcomingSessions = computed(() => {
  return academyOptions.value.filter(academy => academy.status === "upcoming");
});
const savedParent = ref({});
const parentAdded = ref(false);

const handleParentDetails = (parent) => {
  savedParent.value = parent;
  console.log("booking handle parent details", savedParent.value)
}
const bookingItem = ref({});
const academyBooking = ref([]);
const childList = ref([]);

const handleBookingDetails = (booking) => {
  bookingItem.value = booking
  academyBooking.value.push(bookingItem.value);
  console.log("booking handle booking details", academyBooking.value)
  if (!childList.value.includes(bookingItem.value.childName)) {
    childList.value.push(bookingItem.value.childName);
  }
  console.log('booking updated child list', childList.value)
}

const removeItem = (item) => {
  console.log(" booking remove item", item)
  academyBooking.value = academyBooking.value.filter(
    booking => booking.bookingRef !== item,
    console.log("booking after removing item", academyBooking.value)
  );
};
const handleChildList = (child) => {
  childList.value = child;
  console.log("booking handle child list", childList.value)
}

const cancelBooking = () => {
  savedParent.value = {};
  academyBooking.value = [];
  childList.value = [];
  parentAdded.value = false;
};

const totalCost = computed(() => {
  return academyBooking.value.reduce(
    (total, curr) => (total = total + curr.termCost),
    0,
  );
});

const paymentRecord = ref({})
const confirmBooking = async () => {
  const success = ref(false);
  const payId = ref(null);
  const bookId = ref(null);
  paymentRecord.value = ({
    parentName: savedParent.value.parentName,
    paymentRef: savedParent.value.paymentRef,
    status: savedParent.value.status,
    amountDue: totalCost.value,
    contactNumber: savedParent.value.mainPhone,
    email: savedParent.value.email,
    termsAccepted: true,
    numBookings: academyBooking.value.length,
    children: JSON.stringify(childList.value),
  })

  console.log("confirm bookomg payment record*****", paymentRecord.value)

  const resPay = await $fetch("/api/football/academyPayment", {
    method: "post",
    body: paymentRecord.value,
  });

  payId.value = resPay.id;
  console.log("resPay*****", resPay.id);
  console.log("payId*****", payId.value);

  const summary = ref([]);
  const bookingRecord = ref({});

  for (let item of academyBooking.value) {
    console.debug('item', item);
    bookingRecord.value = ({
      parentName: savedParent.value.parentName,
      paymentRef: savedParent.value.paymentRef,
      bookingRef: item.bookingRef,
      status: savedParent.value.status,
      mobile: item.mobile,
      email: savedParent.value.email,
      childName: item.childName,
      surname: item.surname,
      age: item.age,
      venue: item.venue,
      medicalConditions: item.medicalConditions,
      photo: item.confirmedPhoto,
      sessions: item.sessions,
      academy: item.academy,
      time: item.time,
      termCost: item.termCost,
      startDate: item.startDate,
      endDate: item.endDate,
      status: "reserved awaiting payment",
    });
    console.log('confirm booking booking record', bookingRecord.value)
    const resBook = await $fetch("/api/football/academyBooking", {
      method: "post",
      body: bookingRecord.value,
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
      path: "/football/success",
      query: {
        name: savedParent.value.parentName,
        phone: savedParent.value.mainPhone,
        email: savedParent.value.email,
        children: childList.value,
        paymentRef: savedParent.value.paymentRef,
        amountDue: totalCost.value,
        bookingDate: date,
        status: totalCost.value > 0 ? "awaiting payment" : "paid",
        numBookings: academyBooking.value.length,
        startDate: academyBooking.value[0].startDate,
        endDate: academyBooking.value[0].endDate,
        sessions: academyBooking.value[0].sessions,
      },
    });
  }
}
// keep alive
const selectedTab = ref("FootballForm");
const setSelectedTab = tab => {
  selectedTab.value = tab;
};

</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <div class="button-container">
        <div class="btn-group">
          <button class="btn-accent" v-show="selectedTab === 'FootballForm'" @click="selectedTab = 'FootballBookingDetails'">
            Review Booking Details <span>&nbsp;⟼</span>
          </button>
          <button class="btn-accent" v-show="selectedTab === 'FootballBookingDetails'" @click="selectedTab = 'FootballForm'">
            <span>⟻&nbsp;</span> Back To Booking Form
          </button>
        </div>
      </div>
      <KeepAlive>
        <FootballBookingForm v-if="selectedTab === 'FootballForm'" 
          @show-steps="selectedTab = 'FootballBookingDetails'" 
          @parent-submitted="parentAdded = true"
          @save-parent="handleParentDetails"
          @booking-item-added="handleBookingDetails"
          :academy-list="academyOptions"
          :parent-added="parentAdded" />
      </KeepAlive>
      <KeepAlive>
        <FootballBookingDetails v-if="selectedTab === 'FootballBookingDetails'"
        :parent-added="parentAdded"  :savedParent="savedParent"
        :academy-booking="academyBooking"  
        @handleRemoveBookingItem="removeItem"
        @handleCancelBooking="cancelBooking"
        @handleConfirmBooking="confirmBooking" />
      </KeepAlive>
    </BaseCard>
  </div>
</template>

