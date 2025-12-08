import { defineEventHandler, getRequestURL, createError } from "h3";

/**
 * Route Allow-List Middleware (Phase 1: Pre-routing protection)
 *
 * Purpose:
 * - Maintain a manifest of allowed public routes
 * - Reject obviously invalid or legacy probe paths early
 * - Short-circuit before:
 *   - Layout initialisation
 *   - Airtable calls
 *   - Full SSR execution
 *
 * This substantially reduces Airtable/API calls under bot or crawler pressure.
 */

// Whitelist of valid public HTML routes
// These are the actual pages that exist in app/pages/
const allowedRoutes = [
  // Root
  "/",

  // Camps
  "/camps",
  "/camps/booking",
  "/camps/success",
  "/camps/upcoming",

  // Clubs
  "/clubs",
  "/clubs/booking",
  "/clubs/success",
  "/clubs/upcoming",

  // Contact
  "/contact",
  "/contact/success",

  // Events
  "/events",
  "/events/booking",
  "/events/success",

  // Football
  "/football",
  "/football/booking",
  "/football/meet-coach-Tom",
  "/football/success",

  // Parties (dynamic slug route - handled separately)
  "/parties",
  "/parties/quote",
  "/parties/success",

  // Other pages
  "/faqs",
  "/legal/policies",
  "/booking-paused", // Page exists in security-refactors branch; allow route for redirects
  "/payment/exit",
  "/payment/success",
];

// Known legacy URLs that should return 410 Gone
// Expanded from legacy-gone.global.ts and Airtable LEGACY-URLS table
const legacyPaths = [
  "/contact-us", // old wix
  "/store", // old wix
  "/faq's", // malformed apostrophe URL
  "/about-us", // from Airtable logs
  // Add more from Airtable LEGACY-URLS table as needed
];

// Regex patterns for common probe/attack paths
// These are blocked early before any processing
const blockPatterns = [
  // WordPress probes (expanded)
  /^\/wp-(admin|includes|content|login|json)/i,
  /\/wp-includes\/wlwmanifest\.xml/i,
  /\/wp-content\/plugins/i,
  /xmlrpc\.php$/i,

  // .env file probes (50+ variations from logs)
  /^\/\.env($|\.|bak|example|sample|old|save|backup|local|dev|prod|test|stage|dist|docker|travis|production|development|swp|php)/i,
  /^\/public\/\.env/i,
  /^\/\.env-/i,
  /^\/\.env\./i,

  // PHP info probes
  /^\/php(info|_info|version|infos|info\.php[345]?)$/i,
  /^\/info\.php$/i,
  /^\/test\.php$/i,
  /^\/temp\.php$/i,
  /^\/time\.php$/i,
  /^\/asdf\.php$/i,
  /^\/i\.php$/i,
  /^\/pinfo\.php$/i,
  /^\/infophp\.php$/i,
  /^\/old_phpinfo\.php$/i,
  /^\/php-info\.php$/i,
  /^\/linusadmin-phpinfo\.php$/i,
  /^\/dashboard\/phpinfo\.php$/i,
  /^\/_profiler\/phpinfo\.php$/i,

  // Config file probes
  /^\/config($|\.|s|\.json|\.dev|\.prod|\.test|\.stage|\.local|\.production|\.development|\.staging)/i,
  /^\/configuration\.json$/i,
  /^\/settings\.json$/i,
  /^\/app\.config\.json$/i,
  /^\/conf\.json$/i,
  /^\/configs\.json$/i,
  /^\/application\.json$/i,
  /^\/config\//i,
  /^\/assets\/config/i,
  /^\/static\/config/i,
  /^\/dist\/config/i,
  /^\/public\/config/i,
  /^\/apiconfig\.json$/i,
  /^\/js\/config\.json$/i,
  /^\/api\/v[12]\/config\.json$/i,
  /^\/react\/config\.json$/i,
  /^\/angular\/config\.json$/i,
  /^\/vue\/config\.json$/i,
  /^\/credentials\/config\.json$/i,
  /^\/secrets\/config\.json$/i,
  /^\/keys\/config\.json$/i,
  /^\/secret\/config\.json$/i,
  /^\/aws\/config\.json$/i,
  /^\/auth\/config\.json$/i,
  /^\/db\/config\.json$/i,
  /^\/s3\/config\.json$/i,
  /^\/aws\/credentials\.json$/i,
  /^\/cloud\/config\.json$/i,
  /^\/database\/config\.json$/i,
  /^\/mysql\/config\.json$/i,

  // Security probes
  /^\/\.aws\/credentials$/i,
  /^\/debug$/i,
  /^\/\.well-known\/traffic-advice$/i,

  // Other common probes
  /^\/\.git/i,
  /^\/phpmyadmin/i,
  /^\/pma/i,
  /^\/admin/i,
  /^\/vendor\/.*\.php$/i,
];

// Static/internal paths that bypass all checks
const staticSafePrefixes = [
  "/_nuxt/",
  "/_ipx/",
  "/__nuxt", // Internal Nuxt routes (__nuxt_error, __nuxt_dev__, etc.)
  "/img/",
  "/fonts/",
  "/favicon",
  "/robots",
  "/sitemap.xml",
  "/_payload.json",
  "/.well-known/", // Allow .well-known for ACME, but block specific paths above
  "/.netlify/",
  "/api/", // API routes are handled separately
];

export default defineEventHandler(async event => {
  const url = getRequestURL(event);
  const pathname = url.pathname;

  // Allow static assets and internal paths immediately
  if (staticSafePrefixes.some(prefix => pathname.startsWith(prefix))) {
    return;
  }

  // Check against block patterns first (highest priority)
  const matchesBlockPattern = blockPatterns.some(pattern =>
    pattern.test(pathname),
  );

  if (matchesBlockPattern) {
    console.warn("[route-allowlist] Blocked pattern", {
      ts: new Date().toISOString(),
      path: pathname,
      reason: "block-pattern",
    });

    // Return 410 Gone for known probe patterns
    throw createError({
      statusCode: 410,
      statusMessage: "Gone",
    });
  }

  // Check against known legacy paths
  if (legacyPaths.includes(pathname)) {
    console.warn("[route-allowlist] Legacy path", {
      ts: new Date().toISOString(),
      path: pathname,
      reason: "legacy-path",
    });

    throw createError({
      statusCode: 410,
      statusMessage: "Gone",
    });
  }

  // Check if route is in allowed list
  const isAllowedRoute = allowedRoutes.includes(pathname);

  // Handle dynamic routes (parties/[slug])
  const isDynamicRoute =
    pathname.startsWith("/parties/") &&
    pathname !== "/parties" &&
    pathname !== "/parties/quote" &&
    pathname !== "/parties/success";

  if (isAllowedRoute || isDynamicRoute) {
    // Route is valid, allow it to continue
    return;
  }

  // Unknown route - log for analysis and return 404
  // Note: This will be caught by Nuxt's error handling
  // We log here for visibility, but actual 404 handling happens in Nuxt
  console.warn("[route-allowlist] Unknown route", {
    ts: new Date().toISOString(),
    path: pathname,
    reason: "unknown-route",
  });

  // Return 404 - Nuxt will handle the error page
  // This prevents Airtable calls for invalid routes
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
  });
});
