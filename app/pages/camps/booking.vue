<script setup lang="ts">
const { guardedFetch } = useBookingApi();

// ---------- Types ----------
interface CampOption {
  id: string;
  campName: string;
  campRef: string;
  locRef: string;
  campDate: string;
  weekStarting: string;
  pricePerDay: number;
  spaceAvailable: number;
  status: string | null;
  haf: boolean;
  daysAvailable: string[] | null;
  hafDays: string[] | null;
}

interface CampBookingItem {
  childName: string;
  childSurname: string;
  parentName: string;
  childAge: number;
  photos: boolean;
  location: string;
  campName: string;
  daysBooked: string[];
  totalDays: number;
  bookingRef: string;
  pupilPrem: boolean;
  hafID: string;
  price: number;
  paymentRef: string;
  status: "reserved" | "pupil premium";
}

// ---------- <head> ----------
useHead({
  title: "Holiday camps booking request",
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/camps/booking",
    },
  ],
});

// ---------- Fetch camps ----------
const campsListResponse = (await guardedFetch(
  "/api/camps/campsList"
)) as CampOption[] | null;

const campOptions = ref<CampOption[]>(Array.isArray(campsListResponse) ? campsListResponse : []);

// Only camps with status "current" should be bookable
const currentCamps = computed<CampOption[]>(() =>
  campOptions.value.filter(
    (camp) => typeof camp.status === "string" && camp.status.includes("current")
  )
);

// ---------- Tab state ----------
const selectedTab = ref<"CampForm" | "CampBookingDetails">("CampForm");
const setSelectedTab = (tab: "CampForm" | "CampBookingDetails") => {
  selectedTab.value = tab;
};

// ---------- Shared booking state ----------
const campBooking = ref<CampBookingItem[]>([]);
const bookingRef = ref<string | null>(null);
const paymentRef = ref<string | null>(null);
const childList = ref<string[]>([]);

const enteredParentName = ref<string>("");
const enteredEmail = ref<string>("");
const enteredMainContact = ref<string>("");
const acceptedTerms = ref<boolean>(false);
const parentAdded = ref<number>(0);

const savedParent = ref<Record<string, unknown>>({});

// ---------- Parent details ----------
const handleSaveParent = (
  name: string,
  contact: string,
  email: string,
  terms: boolean
) => {
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
    numChildren: numChildren.value,
    childrenNames: childrenNames.value,
    amountDue: totalCost.value,
    status: "awaiting payment",
  };
};

watch(
  savedParent,
  () => {
    // parentAdded being truthy is enough for the form logic
    parentAdded.value = Object.keys(savedParent.value).length;
  },
  { deep: true }
);

// ---------- Child + camp booking from child form ----------
const handleAddCampBookingItem = (
  name: string,
  surname: string,
  age: number,
  pp: boolean,
  haf: string,
  photo: boolean,
  loc: string,
  camp: string,
  days: string[],
  num: number
) => {
  createBookingRef();

  if (!childList.value.includes(name)) {
    childList.value.push(name);
  }

  // Find the selected camp to get price per day
  const foundCamp = campOptions.value.find(
    (c) => c.campRef === camp && c.locRef === loc
  );

  const pricePerDay = foundCamp?.pricePerDay ?? 0;
  const price = pp ? 0 : num * pricePerDay;

  const bookingItem: CampBookingItem = {
    childName: name,
    childSurname: surname,
    parentName: enteredParentName.value,
    childAge: age,
    photos: photo,
    location: loc,
    campName: camp,
    daysBooked: days,
    totalDays: num,
    bookingRef: bookingRef.value ?? "",
    pupilPrem: pp,
    hafID: haf,
    price,
    paymentRef: paymentRef.value ?? "",
    status: price > 0 ? "reserved" : "pupil premium",
  };

  campBooking.value.push(bookingItem);
};

// ---------- Aggregates ----------
const childrenNames = computed<string>(() => {
  return JSON.stringify(childList.value);
});

const numChildren = computed<number>(() => {
  return childList.value.length;
});

const totalCost = computed<number>(() => {
  return campBooking.value.reduce((total, curr) => total + curr.price, 0);
});

// ---------- Mutations ----------
const removeItem = (bookingRefToRemove: string) => {
  campBooking.value = campBooking.value.filter(
    (booking) => booking.bookingRef !== bookingRefToRemove
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
  childList.value = [];
};

// ---------- Confirm booking ----------
async function confirmBooking() {
  const success = ref(false);
  const payId = ref<string | null>(null);
  const bookId = ref<string | null>(null);

  // Parent payment record
  const resPay = await guardedFetch("/api/camps/campPayment", {
    method: "post",
    body: savedParent.value,
  });

  if (!resPay) {
    // 429 or 503 – guardedFetch will already have redirected
    return;
  }

  payId.value = (resPay as { id: string }).id;

  const summary: unknown[] = [];
  for (const campItem of campBooking.value) {
    const resBook = await guardedFetch("/api/camps/campBooking", {
      method: "post",
      body: campItem,
    });

    if (!resBook) {
      // 429 or 503
      return;
    }

    bookId.value = (resBook as { id: string }).id;
    summary.push(resBook);
  }

  if (payId.value && bookId.value) {
    success.value = true;
  } else {
    alert("We are sorry, there was a problem with your booking");
    return;
  }

  if (success.value) {
    const router = useRouter();
    const date = new Date().toLocaleString("en-GB");
    router.replace({
      path: "/camps/success",
      query: {
        name: enteredParentName.value,
        phone: enteredMainContact.value,
        email: enteredEmail.value,
        children: childList.value,
        paymentRef: paymentRef.value ?? "",
        amountDue: totalCost.value.toString(),
        bookingDate: date,
        status:
          totalCost.value > 0 ? "awaiting payment" : ("pupil premium" as const),
      },
    });
  }
}
</script>

<template>
  <div class="md:container p-2">
    <BaseCard>
      <KeepAlive>
        <CampBookingForm
          v-if="selectedTab === 'CampForm'"
          :parent-added="parentAdded"
          :camps-list="currentCamps"
          :error="null"
          @parent-submitted="handleSaveParent"
          @camp-booking-added="handleAddCampBookingItem"
          @show-steps="selectedTab = 'CampBookingDetails'"
        />
      </KeepAlive>

      <KeepAlive>
        <CampBookingDetails
          v-if="selectedTab === 'CampBookingDetails'"
          :parent-added="parentAdded"
          :parent-name="enteredParentName"
          :main-contact="enteredMainContact"
          :email="enteredEmail"
          :payment-ref="paymentRef ?? ''"
          :booking-date="bookingDate"
          :camp-booking="campBooking"
          @handle-remove-booking-item="removeItem"
          @handle-cancel-booking="cancelBooking"
          @handle-confirm-booking="confirmBooking"
        />
      </KeepAlive>

      <div class="button-container">
        <div class="btn-group">
          <button
            class="btn-accent"
            v-show="selectedTab === 'CampForm'"
            @click="setSelectedTab('CampBookingDetails')"
          >
            Review Booking Details <span>&nbsp;⟼</span>
          </button>
          <button
            class="btn-accent"
            v-show="selectedTab === 'CampBookingDetails'"
            @click="setSelectedTab('CampForm')"
          >
            <span>⟻&nbsp;</span> Back To Booking Form
          </button>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
