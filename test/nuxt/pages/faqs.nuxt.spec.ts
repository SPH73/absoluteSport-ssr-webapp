// test/nuxt/pages/faqs.nuxt.spec.ts
// @vitest-environment nuxt

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import FaqsPage from "../../../app/pages/faqs.vue";

// Hoisted mocks so mockNuxtImport can use them in a Nuxt test env
const { navigateToMock, guardedFetchMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn(),
  guardedFetchMock: vi.fn(),
}));

// Mock Nuxt auto-imports (navigateTo + useBookingApi)
mockNuxtImport("navigateTo", () => navigateToMock);
mockNuxtImport("useBookingApi", () => {
  return () => ({
    guardedFetch: guardedFetchMock,
  });
});

describe("faqs page – empty CMS redirects to booking-paused", () => {
  beforeEach(() => {
    navigateToMock.mockReset();
    guardedFetchMock.mockReset();
  });

  it("redirects to /booking-paused when CMS returns an empty payload", async () => {
    // Make CMS appear 'empty' – empty array
    guardedFetchMock.mockResolvedValueOnce([]);

    await mountSuspended(FaqsPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "contact" },
    });
  });

  it("redirects to /booking-paused when guardedFetch returns undefined (throttled)", async () => {
    // guardedFetch returns undefined when it handles 429/503
    guardedFetchMock.mockResolvedValueOnce(undefined);

    await mountSuspended(FaqsPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "contact" },
    });
  });

  it("renders content and does not redirect when CMS returns FAQ data", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        id: "rec123",
        question: "What is AbsoluteSport?",
        answer: "We are a sports organization...",
        tags: ["general"],
      },
      {
        id: "rec456",
        question: "How do I book?",
        answer: "Visit our booking page...",
        tags: ["booking"],
      },
    ]);

    await mountSuspended(FaqsPage);

    expect(navigateToMock).not.toHaveBeenCalled();
  });
});
