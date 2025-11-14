import {
  defineEventHandler,
  getRequestHeader,
  getRequestURL,
  createError,
} from "h3";

// Whitelisted “good” crawlers
const allowedBots = [/Googlebot/i, /Bingbot/i, /Slurp/i, /DuckDuckBot/i];

// Patterns to block globally
const blockPatterns = [
  /\.php$/i, // any .php request
  /\/wp-/i, // WordPress paths, e.g. /wp-admin, /wp-login.php, etc.
  /xmlrpc/i, // xmlrpc probes
  /#!/, // hashbang-style URLs
  /\?gclid=/i, // gclid tracking params
  /^\/\.env$/i, // direct .env access
  /^\/\.git\//i, // any path under .git/
  /^\/phpmyadmin\//i, // phpMyAdmin dir/probes
  /^\/pma\//i, // common phpMyAdmin alias
];

// Static / internal paths to allow without checks
const staticSafePrefixes = [
  "/_nuxt/",
  "/_ipx/",
  "/img/",
  "/fonts/",
  "/favicon",
  "/robots", // robots.txt / robots*.*
  "/sitemap.xml",
  "/_payload.json",
  "/.well-known/", // ACME / security.txt, etc.
];

export default defineEventHandler((event) => {
  // Robust URL handling using h3 helper
  const url = getRequestURL(event);
  const pathname = url.pathname;
  const search = url.search || "";

  // Let Nuxt / platform internals and static assets flow through
  if (
    pathname.startsWith("/.netlify/") ||
    staticSafePrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return;
  }

  // User-Agent analysis
  const ua = getRequestHeader(event, "user-agent") || "";

  const isAllowedBot = allowedBots.some((regex) => regex.test(ua));
  const looksLikeBotUA =
    /bot|crawl|spider|scrape|curl|wget|python|java|libwww/i.test(ua);

  const isBadUA = looksLikeBotUA && !isAllowedBot;

  // Path / query analysis
  const fullUrlForChecks = pathname + search;
  const isBadPath = blockPatterns.some((regex) => regex.test(fullUrlForChecks));

  if (isBadUA || isBadPath) {
    // Log to server console (visible in Netlify / hosting logs)
    console.warn("[bot-protect]", {
      ts: new Date().toISOString(),
      path: pathname,
      ua,
      reason: isBadUA ? "ua" : "path",
    });

    // Standard h3 error handling pattern
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  // Request is allowed to continue if passed all checks
});
