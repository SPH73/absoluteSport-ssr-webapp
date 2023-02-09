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
const setSelectedTab = tab => {
  selectedTab.value = tab;
};

// form data
const campBooking = ref([]);
const bookingRef = ref(null);
const paymentRef = ref(null);
const childList = ref([]);
const enteredParentName = ref({ val: "", isValid: true });
const enteredEmail = ref({ val: "", isValid: true });
const enteredMainContact = ref({ val: "", isValid: true });
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
// const hafId = ref("");
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
  // hafId,
  photo,
  loc,
  camp,
  days,
  num,
) => {
  createBookingRef();
  childName.value = name;
  childSurname.value = surname;
  childAge.value = age;
  pupilPrem.value = pp;
  // hafId.value = hafId;
  confirmedPhoto.value = photo;
  campLoc.value = loc;
  campName.value = camp;
  campDays.value = days;
  numCampDays.value = num;

  if (!childList.value.includes(name)) {
    childList.value.push(name);
  }

  const findCamp = computed(() => {
    return campsList.value.find(camp => camp.locRef === campLoc.value);
  });

  watchEffect(() => {
    console.log("found camp price", findCamp.value);
  });

  const calculatedPrice = computed(() => {
    return (pricePerDay.value = pupilPrem.value ? 0 : numCampDays.value * 25);
  });
  campBookingItem.value = {
    childName: childName.value,
    childSurname: childSurname.value,
    parentName: enteredParentName.value,
    childAge: childAge.value,
    photos: confirmedPhoto.value,
    location: campLoc.value,
    campName: campName.value,
    campDays: campDays.value,
    numCampDays: numCampDays.value,
    bookingRef: bookingRef.value,
    pupilPrem: pupilPrem.value,
    // hafId: hafId.value,
    price: calculatedPrice.value,
    paymentRef: paymentRef.value,
    status: "reserved",
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
  return campBooking.value.reduce(
    (total, curr) => (total = total + curr.price),
    0,
  );
});

const removeItem = item => {
  campBooking.value = campBooking.value.filter(
    booking => booking.bookingRef !== item,
  );
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
};

async function confirmBooking() {
  alert("ready to handle confirm booking");
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
            re Review Booking Details <span>&nbsp;⟼</span>
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
          :numChildren="numChildren"
          :campBooking="campBooking"
          @handleRemoveBookingItem="removeItem"
          @handleCancelBooking="cancelBooking"
          @handleConfirmBooking="confirmBooking"
        ></CampBookingDetails>
      </KeepAlive>
    </BaseCard>
  </div>
</template>
