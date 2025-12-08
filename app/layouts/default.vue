<script setup lang="ts">
import TheNavbar from "~/components/TheNavbar.vue";
import TheFooter from "~/components/TheFooter.vue";
import TheTicker from "~/components/TheTicker.vue";

import type { TickerViewModel } from "~/utils/ticker";
import { fetchTickerMessage } from "~/utils/ticker";

const tickerState = ref<TickerViewModel | null>(null);

tickerState.value = await fetchTickerMessage({
  fallbackMessage:
    "Online bookings, party enquiries and contact messages are temporarily unavailable. Please contact us directly.",
});

const showTicker = computed(() => tickerState.value?.showTicker ?? false);
const tickerText = computed(() => tickerState.value?.tickerText ?? "");
const tickerRoute = computed(() => tickerState.value?.targetRoute ?? undefined);
</script>

<template>
  <div class="w-full min-h-full h-screen flex flex-col">
    <header>
      <TheNavbar />
    </header>

    <!-- ✅ Updated usage: pass `text`, not `cms` -->
    <TheTicker v-if="showTicker" :text="tickerText" :to="tickerRoute" />

    <main class="mb-auto flex flex-col bg-primary">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>
