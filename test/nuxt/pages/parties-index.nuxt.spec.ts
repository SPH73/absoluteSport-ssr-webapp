// test/nuxt/pages/parties-index.nuxt.spec.ts
// @vitest-environment nuxt

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import PartiesIndexPage from "../../../app/pages/parties/index.vue";

// Hoisted mocks
const { navigateToMock, guardedFetchMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn(),
  guardedFetchMock: vi.fn(),
}));

// Mock Nuxt auto-imports
mockNuxtImport("navigateTo", () => navigateToMock);
mockNuxtImport("useBookingApi", () => {
  return () => ({
    guardedFetch: guardedFetchMock,
  });
});

describe("parties index page – empty CMS redirects to booking-paused", () => {
  beforeEach(() => {
    navigateToMock.mockReset();
    guardedFetchMock.mockReset();
  });

  it("redirects to /booking-paused when CMS returns an empty party list", async () => {
    guardedFetchMock.mockResolvedValueOnce([]);

    await mountSuspended(PartiesIndexPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "contact" },
    });
  });

  it("redirects to /booking-paused when guardedFetch returns undefined (throttled)", async () => {
    guardedFetchMock.mockResolvedValueOnce(undefined);

    await mountSuspended(PartiesIndexPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "contact" },
    });
  });

  it("redirects to /booking-paused when no featured parties exist", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        id: "rec123",
        slug: "football-party",
        pageTitle: "Football Party",
        partyName: "Football Party",
        featured: false, // Not featured
        summaryP1: "Fun football party",
        summaryP2: "For ages 5-12",
        summaryP3: "2 hours of fun",
        thumbnail: [
          {
            id: "img1",
            filename: "football.jpg",
            url: "https://example.com/football.jpg",
          },
        ],
      },
    ]);

    await mountSuspended(PartiesIndexPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "contact" },
    });
  });

  it("renders content and does not redirect when CMS returns featured parties", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        id: "rec123",
        slug: "football-party",
        pageTitle: "Football Party",
        partyName: "Football Party",
        featured: true,
        summaryP1: "Fun football party",
        summaryP2: "For ages 5-12",
        summaryP3: "2 hours of fun",
        thumbnail: [
          {
            id: "img1",
            filename: "football.jpg",
            url: "https://example.com/football.jpg",
          },
        ],
      },
    ]);

    await mountSuspended(PartiesIndexPage);

    expect(navigateToMock).not.toHaveBeenCalled();
  });
});
