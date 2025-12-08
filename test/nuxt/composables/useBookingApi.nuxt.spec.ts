// test/nuxt/composables/useBookingApi.nuxt.spec.ts
// @vitest-environment nuxt

import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

// Hoisted mocks (Nuxt / Vitest guidance)
const { fetchMock, navigateToMock } = vi.hoisted(() => {
  return {
    fetchMock: vi.fn(),
    navigateToMock: vi.fn(),
  };
});

// 1) navigateTo -> navigateToMock (global utility, can be called from anywhere)
mockNuxtImport("navigateTo", () => navigateToMock);

// 2) $fetch -> fetchMock (mock the global $fetch auto-import)
// Note: $fetch is a global auto-import, so we use vi.stubGlobal
// This must be done before the composable is imported
vi.stubGlobal("$fetch", fetchMock);

// Import the composable
import { useBookingApi } from "../../../app/composables/useBookingApi";

describe("useBookingApi.guardedsFetch", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    navigateToMock.mockReset();
  });

  it("returns data on success and does not redirect", async () => {
    const payload = { ok: true, value: 123 };
    fetchMock.mockResolvedValue(payload);

    const { guardedFetch } = useBookingApi();
    const result = await guardedFetch("/api/example");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/example", expect.any(Object));
    expect(result).toEqual(payload);
    expect(navigateToMock).not.toHaveBeenCalled();
  });

  it("handles 429 by redirecting to /booking-paused and not rethrowing", async () => {
    const rateLimitError = Object.assign(new Error("Rate limited"), {
      statusCode: 429,
      status: 429,
      data: { message: "Too many requests" },
    });

    fetchMock.mockRejectedValue(rateLimitError);

    const { guardedFetch } = useBookingApi();

    await expect(guardedFetch("/api/example")).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith(
      "/booking-paused?context=booking",
    );
  });

  it("handles 503 by redirecting to /booking-paused and not rethrowing", async () => {
    const serviceError = Object.assign(new Error("Service unavailable"), {
      statusCode: 503,
      status: 503,
      data: { message: "Airtable unavailable" },
    });

    fetchMock.mockRejectedValue(serviceError);

    const { guardedFetch } = useBookingApi();

    await expect(guardedFetch("/api/example")).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith(
      "/booking-paused?context=booking",
    );
  });

  it("rethrows non-429/503 errors and does not redirect", async () => {
    const serverError = Object.assign(new Error("Server exploded"), {
      statusCode: 500,
      status: 500,
    });

    fetchMock.mockRejectedValue(serverError);

    const { guardedFetch } = useBookingApi();

    await expect(guardedFetch("/api/example")).rejects.toBe(serverError);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).not.toHaveBeenCalled();
  });
});
