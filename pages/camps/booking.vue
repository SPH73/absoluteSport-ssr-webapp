<script setup>
// fetched camps
const { data: campsList, error } = await useFetch("/api/camps/campsList");
let camp = {};
const campOptions = ref([]);
campsList.value.forEach((record, index) => {
  camp = {
    index: index + 1,
    id: record.id,
    campName: record.fields.campName,
    campRef: record.fields.campRef,
    locRef: record.fields.locRef,
    campDate: record.fields.campDate,
    weekStarting: record.fields.ws,
    pricePerDay: record.fields.pricePerDay,
    spaceAvailable: record.fields.spaceAvailable,
    status: record.fields.status,
  };
  campOptions.value.push(camp);
});

// keep alive
const selectedTab = ref("CampForm");
const setSelectedTab = (tab) => {
  selectedTab.value = tab;
};

// form data
const campBooking = ref([]);
const bookingRef = ref(null);
const paymentRef = ref(null);
const childList = ref([]);
const enteredParentName = ref("");
const enteredEmail = ref("");
const enteredMainContact = ref("");
const acceptedTerms = ref(false);
const parentAdded = ref(null);
const savedParent = ref({});

// parent details
const handleSaveParent = (name, contact, email, terms) => {
  createPaymentRef();
  enteredParentName.value = name;
  enteredMainContact.value = contact;
  enteredEmail.value = email;
  acceptedTerms.value = terms;

  savedParent.value = {
    parentName: enteredParentName.value,
    mainPhone: enteredMainContact.value,
    email: enteredEmail.value,
    paymentRef: paymentRef.value,
    numChildren: numChildren,
    childrenNames: childrenNames,
    amountDue: totalCost,
    status: "awaiting payment",
    paymentRef: paymentRef.value,
  };
};

watch(savedParent, () => {
  parentAdded.value = Object.keys(savedParent.value).length;
});
const childName = ref("");
const childSurname = ref("");
const childAge = ref("select");
const pupilPrem = ref(false);
const hafID = ref("");
const confirmedPhoto = ref(true);
const campLoc = ref("select");
const campName = ref("select");
const campDays = ref(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
const numCampDays = ref(null);

const campBookingItem = ref({});
const pricePerDay = ref(null);

// TODO
// const recaptcha = ref({ val: "..." });

// camp booking
const handleAddCampBookingItem = (
  name,
  surname,
  age,
  pp,
  haf,
  photo,
  loc,
  camp,
  days,
  num
) => {
  createBookingRef();
  childName.value = name;
  childSurname.value = surname;
  childAge.value = age;
  pupilPrem.value = pp;
  confirmedPhoto.value = photo;
  hafID.value = haf;
  campLoc.value = loc;
  campName.value = camp;
  campDays.value = days;
  numCampDays.value = num;

  if (!childList.value.includes(name)) {
    childList.value.push(name);
  }

  const findCamp = computed(() => {
    return campOptions.value.find((camp) => camp.locRef === campLoc.value);
  });

  watchEffect(() => {
    console.log("find camp***", findCamp.value.pricePerDay);
    console.log("total cost***", totalCost.value);
  });

  const calculatedPrice = computed(() => {
    let ppd = findCamp.value.pricePerDay;
    return (pricePerDay.value = pupilPrem.value ? 0 : numCampDays.value * ppd);
  });
  campBookingItem.value = {
    childName: childName.value,
    childSurname: childSurname.value,
    parentName: enteredParentName.value,
    childAge: childAge.value,
    photos: confirmedPhoto.value,
    location: campLoc.value,
    campName: campName.value,
    daysBooked: campDays.value,
    totalDays: numCampDays.value,
    bookingRef: bookingRef.value,
    pupilPrem: pupilPrem.value,
    hafID: hafID.value,
    price: calculatedPrice.value,
    paymentRef: paymentRef.value,
    status: calculatedPrice.value > 0 ? "reserved" : "pupil premium",
  };

  campBooking.value.push(campBookingItem.value);
};

const childrenNames = computed(() => {
  return JSON.stringify(childList.value);
});

const numChildren = computed(() => {
  return childList.value.length;
});

const totalCost = computed(() => {
  return campBooking.value.reduce((total, curr) => (total = total + curr.price), 0);
});

const removeItem = (item) => {
  campBooking.value = campBooking.value.filter((booking) => booking.bookingRef !== item);
};

const createBookingRef = () => {
  bookingRef.value = Date.now().toString(24);
};
const createPaymentRef = () => {
  paymentRef.value = Date.now().toString(36);
};
const bookingDate = new Date().toLocaleString("en-GB");
const cancelBooking = () => {
  savedParent.value = {};
  campBooking.value = [];
  childList.value = [];
};

async function confirmBooking() {
  const success = ref(false);
  const payId = ref(null);
  const bookId = ref(null);

  const resPay = await $fetch("/api/camps/campPayment", {
    method: "post",
    body: savedParent.value,
  });

  payId.value = resPay.id;
  console.log("resPay*****", resPay.id);
  console.log("payId*****", payId.value);

  const summary = ref([]);
  for (let campItem of campBooking.value) {
    const resBook = await $fetch("/api/camps/campBooking", {
      method: "post",
      body: campItem,
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
      path: "/camps/success",
      query: {
        name: enteredParentName.value,
        phone: enteredMainContact.value,
        email: enteredEmail.value,
        children: childList.value,
        paymentRef: paymentRef.value,
        amountDue: totalCost.value,
        bookingDate: date,
        status: totalCost.value > 0 ? "awaiting payment" : "pupil premium",
      },
    });
  }
}
</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <div class="button-container">
        <div class="btn-group">
          <button
            class="btn-accent"
            v-show="selectedTab === 'CampForm'"
            @click="selectedTab = 'CampBookingDetails'"
          >
            Review Booking Details <span>&nbsp;⟼</span>
          </button>
          <button
            class="btn-accent"
            v-show="selectedTab === 'CampBookingDetails'"
            @click="selectedTab = 'CampForm'"
          >
            <span>⟻&nbsp;</span> Back To Booking Form
          </button>
        </div>
      </div>
      <KeepAlive>
        <CampBookingForm
          v-if="selectedTab === 'CampForm'"
          @parent-submitted="handleSaveParent"
          @show-steps="selectedTab = 'CampBookingDetails'"
          @camp-booking-added="handleAddCampBookingItem"
          :error="error"
          :camps-list="campOptions"
          :parent-added="parentAdded"
        ></CampBookingForm>
      </KeepAlive>
      <KeepAlive>
        <CampBookingDetails
          v-if="selectedTab === 'CampBookingDetails'"
          :parentAdded="parentAdded"
          :parentName="enteredParentName"
          :mainContact="enteredMainContact"
          :email="enteredEmail"
          :paymentRef="paymentRef"
          :bookingDate="bookingDate"
          :campBooking="campBooking"
          @handleRemoveBookingItem="removeItem"
          @handleCancelBooking="cancelBooking"
          @handleConfirmBooking="confirmBooking"
        ></CampBookingDetails>
      </KeepAlive>
    </BaseCard>
  </div>
</template>
