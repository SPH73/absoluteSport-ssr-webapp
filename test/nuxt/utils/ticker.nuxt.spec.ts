// test/nuxt/utils/ticker.nuxt.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fetchTickerMessage } from "~/utils/ticker";

// Hoist the mock so it's available before imports are processed
const { guardedFetchMock } = vi.hoisted(() => ({
  guardedFetchMock: vi.fn(),
}));

// Mock Nuxt auto-imports used in ticker.ts
mockNuxtImport("useBookingApi", () => {
  return () => ({
    guardedFetch: guardedFetchMock,
  });
});

describe("fetchTickerMessage", () => {
  const FALLBACK_TEXT =
    "Online services are temporarily unavailable. Please contact us directly.";

  beforeEach(() => {
    guardedFetchMock.mockReset();
  });

  it("returns Airtable ticker content when a visible ticker row exists", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        fields: {
          element: "ticker",
          display: true,
          content: "Airtable ticker message",
        },
      },
      {
        fields: {
          element: "other",
          display: true,
          content: "Ignore this row",
        },
      },
    ]);

    const result = await fetchTickerMessage();

    expect(guardedFetchMock).toHaveBeenCalledTimes(1);
    expect(result.showTicker).toBe(true);
    expect(result.tickerText).toBe("Airtable ticker message");
    // For normal runtime ticker, there should be no forced CTA to booking-paused
    expect(result.targetRoute).toBeUndefined();
  });

  it("falls back to booking-paused ticker when Airtable returns an empty array", async () => {
    guardedFetchMock.mockResolvedValueOnce([]);

    const result = await fetchTickerMessage();

    expect(guardedFetchMock).toHaveBeenCalledTimes(1);
    expect(result.showTicker).toBe(true);
    expect(result.tickerText).toBe(FALLBACK_TEXT);
    expect(result.targetRoute).toBe("/booking-paused?context=booking");
  });

  it("falls back to booking-paused ticker when no visible ticker row exists", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        fields: {
          element: "ticker",
          display: false,
          content: "Hidden ticker – should not display",
        },
      },
      {
        fields: {
          element: "other",
          display: true,
          content: "Other content",
        },
      },
    ]);

    const result = await fetchTickerMessage();

    expect(guardedFetchMock).toHaveBeenCalledTimes(1);
    expect(result.showTicker).toBe(true);
    expect(result.tickerText).toBe(FALLBACK_TEXT);
    expect(result.targetRoute).toBe("/booking-paused?context=booking");
  });

  it("falls back to booking-paused ticker when guardedFetch throws", async () => {
    guardedFetchMock.mockRejectedValueOnce(
      new Error("Airtable quota exceeded")
    );

    const result = await fetchTickerMessage();

    expect(guardedFetchMock).toHaveBeenCalledTimes(1);
    expect(result.showTicker).toBe(true);
    expect(result.tickerText).toBe(FALLBACK_TEXT);
    expect(result.targetRoute).toBe("/booking-paused?context=booking");
  });

  it("normalises unexpected shapes from Airtable and still falls back safely", async () => {
    // Simulate some weird payload that isn't an array of records
    guardedFetchMock.mockResolvedValueOnce(null as any);

    const result = await fetchTickerMessage();

    expect(guardedFetchMock).toHaveBeenCalledTimes(1);
    expect(result.showTicker).toBe(true);
    expect(result.tickerText).toBe(FALLBACK_TEXT);
    expect(result.targetRoute).toBe("/booking-paused?context=booking");
  });
});
