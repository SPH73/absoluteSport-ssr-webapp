// test/nuxt/utils/ticker.nuxt.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fetchTickerMessage } from "~/utils/ticker";

// Hoist the mock so it's available before imports are processed
const { guardedFetchMock } = vi.hoisted(() => ({
  guardedFetchMock: vi.fn(),
}));

// Mock the Nuxt auto-imported composable
mockNuxtImport("useBookingApi", () => {
  return () => ({
    guardedFetch: guardedFetchMock,
  });
});

describe("fetchTickerMessage", () => {
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
          content: "Ignore me",
        },
      },
    ]);

    const result = await fetchTickerMessage();

    expect(guardedFetchMock).toHaveBeenCalledTimes(1);
    expect(guardedFetchMock).toHaveBeenCalledWith("/api/cms");
    expect(result).toEqual({
      showTicker: true,
      tickerText: "Airtable ticker message",
    });
  });

  it("returns fallback message when no ticker row exists and showFallbackOnMissing=true (default)", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        fields: {
          element: "other",
          display: true,
          content: "Not the ticker",
        },
      },
    ]);

    const result = await fetchTickerMessage({
      fallbackMessage: "Fallback message",
    });

    expect(result).toEqual({
      showTicker: true,
      tickerText: "Fallback message",
    });
  });

  it("returns no ticker when no ticker row exists and showFallbackOnMissing=false", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        fields: {
          element: "other",
          display: true,
          content: "Not the ticker",
        },
      },
    ]);

    const result = await fetchTickerMessage({
      fallbackMessage: "Fallback message",
      showFallbackOnMissing: false,
    });

    expect(result).toEqual({
      showTicker: false,
      tickerText: "Fallback message",
    });
  });

  it("returns fallback message when guardedFetch returns undefined (e.g. 429/503 handled by redirect)", async () => {
    guardedFetchMock.mockResolvedValueOnce(undefined);

    const result = await fetchTickerMessage({
      fallbackMessage: "Fallback in rate-limit",
    });

    expect(result).toEqual({
      showTicker: true,
      tickerText: "Fallback in rate-limit",
    });
  });

  it("returns fallback message when guardedFetch throws a non-429/503 error", async () => {
    guardedFetchMock.mockRejectedValueOnce(
      new Error("Unexpected server error")
    );

    const result = await fetchTickerMessage({
      fallbackMessage: "Fallback on error",
    });

    expect(result).toEqual({
      showTicker: true,
      tickerText: "Fallback on error",
    });
  });
});
