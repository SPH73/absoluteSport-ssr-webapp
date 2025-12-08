import { defineEventHandler, getRequestURL, createError } from "h3";

/**
 * Legacy URL Handler (Phase 1: Expanded)
 *
 * Returns 410 Gone for known legacy URLs from previous site versions.
 * Expanded with patterns from Airtable LEGACY-URLS table and Netlify logs.
 */

// Known legacy paths that should return 410 Gone
// Expanded from original 3 paths to include patterns from logs
const gonePaths = [
  // Original legacy paths
  "/contact-us", // old wix
  "/store", // old wix
  "/faq's", // malformed apostrophe URL

  // From Airtable LEGACY-URLS table
  "/about-us",

  // Add more specific legacy paths from Airtable as they are identified
  // This list can be expanded by reviewing the LEGACY-URLS table
];

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname;

  if (gonePaths.includes(pathname)) {
    console.warn("[legacy-gone] Legacy path", {
      ts: new Date().toISOString(),
      path: pathname,
    });

    // Return 410 Gone for known legacy URLs
    // This happens before any Airtable calls
    throw createError({
      statusCode: 410,
      statusMessage: "Gone",
    });
  }
});
