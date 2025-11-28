// test/nuxt/pages/legal-policies.nuxt.spec.ts
// @vitest-environment nuxt

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import PoliciesPage from "../../../app/pages/legal/policies.vue";

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

describe("legal/policies page – empty CMS redirects to booking-paused", () => {
  beforeEach(() => {
    navigateToMock.mockReset();
    guardedFetchMock.mockReset();
  });

  it("redirects to /booking-paused when CMS returns an empty policy list", async () => {
    guardedFetchMock.mockResolvedValueOnce([]);

    await mountSuspended(PoliciesPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "info" },
    });
  });

  it("redirects to /booking-paused when guardedFetch returns undefined (throttled)", async () => {
    guardedFetchMock.mockResolvedValueOnce(undefined);

    await mountSuspended(PoliciesPage);

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith({
      path: "/booking-paused",
      query: { context: "info" },
    });
  });

  it("renders content and does not redirect when CMS returns policy data", async () => {
    guardedFetchMock.mockResolvedValueOnce([
      {
        id: "rec123",
        policyName: "Privacy Policy",
        policyDate: "2025-01-01",
        link: "https://example.com/privacy.pdf",
        status: "active",
      },
      {
        id: "rec456",
        policyName: "Terms & Conditions",
        policyDate: "2025-01-01",
        link: "https://example.com/terms.pdf",
        status: "active",
      },
    ]);

    await mountSuspended(PoliciesPage);

    expect(navigateToMock).not.toHaveBeenCalled();
  });
});
