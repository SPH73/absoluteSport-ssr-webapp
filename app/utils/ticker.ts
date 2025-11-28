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
  opts: FetchTickerOptions = {}
): Promise<TickerViewModel> {
  const {
    fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
    showFallbackOnMissing = true,
  } = opts;

  const { guardedFetch } = useBookingApi();

  try {
    const result = (await guardedFetch("/api/cms")) as any[] | undefined;

    // 429/503 → guardedFetch returns undefined and redirects;
    // we show the hard-coded fallback banner instead of crashing.
    if (!result || !Array.isArray(result)) {
      return { showTicker: true, tickerText: fallbackMessage, targetRoute: BOOKING_PAUSED_ROUTE };
    }

    const tickerRow = result.find(
      (item) =>
        item?.fields?.element === "ticker" && item?.fields?.display === true
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
  } catch {
    // Any unexpected error → fallback, but keep the banner visible
    return { showTicker: true, tickerText: fallbackMessage, targetRoute: BOOKING_PAUSED_ROUTE };
  }
}
