// test/nuxt/pages/camps-index.nuxt.spec.ts
// @vitest-environment nuxt

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import CampsIndexPage from "../../../app/pages/camps/index.vue";

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

describe("camps index page – empty CMS redirects to booking-paused", () => {
  beforeEach(() => {
    navigateToMock.mockReset();
    guardedFetchMock.mockReset();
  });

  it("redirects to /booking-paused when both campList and campImages are empty", async () => {
    // Mock both API calls to return empty arrays
    guardedFetchMock
      .mockResolvedValueOnce([]) // carouselImages
      .mockResolvedValueOnce([]); // campsList

    await mountSuspended(CampsIndexPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "booking" },
    });
  });

  it("redirects to /booking-paused when guardedFetch returns undefined (throttled)", async () => {
    guardedFetchMock
      .mockResolvedValueOnce(undefined) // carouselImages throttled
      .mockResolvedValueOnce(undefined); // campsList throttled

    await mountSuspended(CampsIndexPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "booking" },
    });
  });

  it("renders content and does not redirect when CMS returns camp data", async () => {
    guardedFetchMock
      .mockResolvedValueOnce([
        {
          segment: "camps",
          images: [
            {
              id: "img1",
              url: "https://example.com/camp.jpg",
              filename: "camp.jpg",
              width: 800,
              height: 600,
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "rec123",
          campRef: "CAMP001",
          campName: "Summer Camp",
          campDate: "2025-07-01",
          locRef: "Location A",
          spaceAvailable: 20,
          status: "current",
        },
      ]);

    await mountSuspended(CampsIndexPage);

    expect(navigateToMock).not.toHaveBeenCalled();
  });

  it("renders content when only campList has data (images empty)", async () => {
    guardedFetchMock
      .mockResolvedValueOnce([]) // no images
      .mockResolvedValueOnce([
        {
          id: "rec123",
          campRef: "CAMP001",
          campName: "Summer Camp",
          campDate: "2025-07-01",
          locRef: "Location A",
          spaceAvailable: 20,
          status: "current",
        },
      ]);

    await mountSuspended(CampsIndexPage);

    expect(navigateToMock).not.toHaveBeenCalled();
  });
});
