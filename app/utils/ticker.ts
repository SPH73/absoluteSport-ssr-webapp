// app/utils/ticker.ts
import { useBookingApi } from "#imports";

export interface TickerViewModel {
  showTicker: boolean;
  tickerText: string;
  // added for clickable link
  targetRoute?: string;
}

const DEFAULT_FALLBACK_MESSAGE =
  "Online services are temporarily unavailable. Please contact us directly.";

const BOOKING_PAUSED_ROUTE = "/booking-paused?context=booking";
interface FetchTickerOptions {
  fallbackMessage?: string;
  showFallbackOnMissing?: boolean;
}

export async function fetchTickerMessage(
  opts: FetchTickerOptions = {},
): Promise<TickerViewModel> {
  const {
    fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
    showFallbackOnMissing = true,
  } = opts;

  const { guardedFetch } = useBookingApi();

  try {
    const result = (await guardedFetch("/api/cms")) as any[] | undefined;

    // Handle 429/503 errors from Airtable (dynamic throttling/outage):
    // - Client-side: guardedFetch redirects and returns undefined
    // - SSR: guardedFetch throws error, caught by catch block below
    // Either way, we show the hard-coded fallback banner instead of crashing.
    if (!result || !Array.isArray(result)) {
      return {
        showTicker: true,
        tickerText: fallbackMessage,
        targetRoute: BOOKING_PAUSED_ROUTE,
      };
    }

    const tickerRow = result.find(
      item =>
        item?.fields?.element === "ticker" && item?.fields?.display === true,
    );

    if (tickerRow?.fields?.content) {
      return {
        showTicker: true,
        tickerText: String(tickerRow.fields.content),
      };
    }

    // No CMS ticker row
    return {
      showTicker: showFallbackOnMissing,
      tickerText: fallbackMessage,
      targetRoute: showFallbackOnMissing ? BOOKING_PAUSED_ROUTE : undefined,
    };
  } catch (error: any) {
    // Catch 429/503 errors from guardedFetch during SSR (or any other errors)
    // When Airtable is throttled/outage (429/503), guardedFetch throws during SSR
    // This allows us to show the fallback message instead of crashing the page
    // Note: This works even when AIRTABLE_DISABLED=false - it handles dynamic Airtable errors
    return {
      showTicker: true,
      tickerText: fallbackMessage,
      targetRoute: BOOKING_PAUSED_ROUTE,
    };
  }
}
