import {
  defineEventHandler,
  getRequestHeader,
  getRequestURL,
  createError,
} from "h3";

// Whitelisted “good” crawlers
const allowedBots = [/Googlebot/i, /Bingbot/i, /Slurp/i, /DuckDuckBot/i];

// Patterns to block globally (Phase 1: Expanded)
// Enhanced with patterns from Netlify logs showing high-volume bot traffic
const blockPatterns = [
  // PHP files (any .php request)
  /\.php$/i,

  // WordPress paths (expanded)
  /\/wp-/i, // WordPress paths, e.g. /wp-admin, /wp-login.php, etc.
  /\/wp-includes\/wlwmanifest\.xml/i, // WordPress manifest probes
  /\/wp-content\/plugins/i, // WordPress plugin probes
  /xmlrpc/i, // xmlrpc probes

  // .env file probes (expanded from logs - 50+ variations)
  /^\/\.env($|\.|bak|example|sample|old|save|backup|local|dev|prod|test|stage|dist|docker|travis|production|development|swp|php)/i,
  /^\/public\/\.env/i,
  /^\/\.env-/i,
  /^\/\.env\./i,

  // PHP info probes (expanded from logs)
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

  // Config file probes (expanded from logs)
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

  // Other common patterns
  /#!/, // hashbang-style URLs
  /\?gclid=/i, // gclid tracking params
  /^\/\.git\//i, // any path under .git/
  /^\/phpmyadmin\//i, // phpMyAdmin dir/probes
  /^\/pma\//i, // common phpMyAdmin alias
  /^\/admin/i, // admin probes
  /^\/vendor\/.*\.php$/i, // vendor PHP files
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
