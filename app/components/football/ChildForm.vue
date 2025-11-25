<script setup lang="ts">
const { guardedFetch } = useBookingApi();

// fetch venueList from api (guarded against Airtable 429/503)
const venueError = ref<unknown | null>(null);
let venueList: any[] = [];

try {
  venueList = (await guardedFetch("/api/football/academyVenueList")) as any[];
} catch (error) {
  // Non-429/503 errors only; 429/503 are already handled by the guard redirect
  venueError.value = error;
}

interface VenueOption {
  index: number;
  venueName: string;
  venueRef: string;
  status: string;
}

const venueOptions = ref<VenueOption[]>([]);

// Guard against undefined result from 429/503 redirect
if (!venueList || !Array.isArray(venueList)) {
  // guardedFetch already handled the redirect to /booking-paused
  // Safe to render with empty venueOptions
} else {
  venueList.forEach((record, index) => {
    const venue: VenueOption = {
      index: index + 1,
      venueName: record.venueName,
      venueRef: record.venueRef,
      status: record.status,
    };
    venueOptions.value.push(venue);
  });
}
</script>
