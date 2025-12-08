# AbsoluteSport SSR Web Application — Developer Documentation

This repository contains the production SSR codebase for the AbsoluteSport booking platform, built on Nuxt 4 + Nitro and deployed on Netlify Functions.

For a client-friendly overview, see:

➡ **README-CLIENT.md**

---

## 1. Architecture Overview

### Framework

- Nuxt 4.2.x (Server-Side Rendering)
- Nitro preset: `netlify`
- Deployed as Netlify Functions

### Runtime Services

- **Airtable** — CMS, booking data, FAQs, policies, parties, clubs, camps
- **GoCardless** — Payments
- **Mailchimp** — Email marketing
- **Cloudinary** — Image delivery
- **Netlify** — Hosting, routing, deploy previews

### Key System Domains

- Booking flows (camps, clubs, football, events)
- Contact / enquiries (party enquiries)
- CMS-driven content pages
- Payment processing
- Bot-safe SSR rendering
- Legacy URL telemetry and CSP reporting

---

## 2. Technology Stack

| Domain      | Technology                  |
| ----------- | --------------------------- |
| Framework   | Nuxt 4, Vue 3, Vite 7       |
| Runtime     | Nitro (Netlify preset)      |
| Type System | TypeScript                  |
| Data        | Airtable (REST API)         |
| Payments    | GoCardless                  |
| Email Subs  | Mailchimp                   |
| Styling     | TailwindCSS                 |
| Images      | `@nuxt/image` + Cloudinary  |
| Tests       | Vitest + `@nuxt/test-utils` |

---

## 3. Project Structure (High Level)

```txt
app/
  assets/
    css/
    images/
  components/
  composables/
  layouts/
  middleware/
  pages/
  pligins/
  utils/

server/
  api/
    camps/
    clubs/
    events/
    football/
    gocardless/
    legal/
    parties/
    utils/
    carouselImages.get.ts
    cms.get.ts
    csp-report.post.ts
    faqs.get.ts
    health.get.ts
    legacy-404.post.ts
    mailchimp.ts
    reviews.get.ts
  middleware/
    (bot protection)
    (route allow-list)

test/
  nuxt/
  unit/
```

---

## 4. Environment Variables (Updated Model)

Nuxt 4 uses environment variables that are evaluated at build/startup and surfaced via `runtimeConfig`.

### 4.1 Private Runtime Variables (Server Only)

These are **not** exposed to the browser. They should never be prefixed with `NUXT_PUBLIC_`.

```env
AT_API_KEY=
AT_BASE_ID=
GC_ACCESS_TOKEN=
MC_API_KEY=

# Safety switch – disable all Airtable calls (fail-closed mode)
AIRTABLE_DISABLED=false
```

### 4.2 Public Runtime Variables (Client + Server)

These **must** be prefixed with `NUXT_PUBLIC_` and are exposed to the browser via `runtimeConfig.public`.

```env
NUXT_PUBLIC_SITE_URL=https://absolutesport.org
NUXT_PUBLIC_BOOKING_PAUSED=false
```

### 4.3 RuntimeConfig Parsing (nuxt.config.ts)

The configuration below converts the raw string env vars into booleans and typed values exactly once:

```ts
runtimeConfig: {
  private: {
    atApiKey: process.env.AT_API_KEY,
    mcApiKey: process.env.MC_API_KEY,
    airtableDisabled: process.env.AIRTABLE_DISABLED === "true",
    gcAccessToken: process.env.GC_ACCESS_TOKEN,
    cspAirtableToken: process.env.NUXT_CSP_AIRTABLE_TOKEN,
    cspAirtableBaseId: process.env.NUXT_CSP_AIRTABLE_BASE_ID,
    cspAirtableTable: process.env.NUXT_CSP_AIRTABLE_TABLE || "CSP-REPORTS",
    legacyAirtableTable:
      process.env.NUXT_LEGACY_AIRTABLE_TABLE || "LEGACY-URLS",
  },
  public: {
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    atBaseId: process.env.AT_BASE_ID,
    mcAudId: process.env.MC_AUDIENCE_ID,
    mcServer: process.env.MC_SERVER_PREFIX,
    bookingPaused: process.env.NUXT_PUBLIC_BOOKING_PAUSED === "true",
  },
}
```

### 4.4 Operational Modes

| Scenario          | `AIRTABLE_DISABLED` | `NUXT_PUBLIC_BOOKING_PAUSED` | Result                                                                                                                |
| ----------------- | ------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Normal operation  | `false`             | `false`                      | Full booking + CMS online                                                                                             |
| Airtable outage   | `true`              | `true`                       | No Airtable calls; ticker shows hardcoded message; users redirected to `/booking-paused` when accessing content pages |
| Seasonal downtime | `false`             | `true`                       | Airtable OK; bookings hidden from users                                                                               |
| Debug (rare)      | `true`              | `false`                      | Airtable disabled; ticker shows hardcoded message; UI left open for investigation                                     |

**Note:** The system also automatically handles **dynamic Airtable errors** (429/503 responses) even when both flags are `false`. When Airtable returns rate limit or service unavailable errors, the ticker automatically shows a fallback message and users are redirected appropriately - no manual intervention required.

**Important:** You never edit `runtimeConfig` to flip modes.
All switching is done via environment variables (local `.env` or Netlify Env Vars).

---

## 5. Airtable Access Pipeline

All Airtable access is centralised in:

```txt
server/api/utils/airtable.ts
```

### Exposed Helpers

- `getAirtableBase(event?)`
- `getAirtableTable(tableName, event?)`
- `airtableSelect(tableName, options?, event?)`
- `airtableCreate(tableName, recordOrRecords, event?)`

These provide:

- Consistent use of the Airtable SDK:
  - `new Airtable({ apiKey }).base(baseId)`
  - `table.select(options).all()`
  - `table.create(records)`
- Unified logging for debugging and quota analysis
- **Graceful handling of `AIRTABLE_DISABLED` flag:**
  - `airtableSelect()` and `airtableCreate()` check the disabled state **before** attempting any operations
  - When disabled, they throw proper HTTP 503 errors (using `createError`) instead of generic errors
  - This prevents terminal errors and ensures API endpoints return appropriate HTTP status codes
  - The ticker component catches these errors and displays a hardcoded fallback message

---

## 6. Booking Guard — `useBookingApi`

`useBookingApi` provides a global `$fetch` wrapper for booking- and CMS-related calls, ensuring that Airtable and upstream failures are handled consistently.

### Behaviour Summary

| Response / Error Type       | Behaviour                                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `2xx`                       | Return data normally                                                                                                                    |
| `429` / `503` from Airtable | **Client-side:** Redirect to `/booking-paused?context=booking` \| **SSR:** Throw error (allows callers like ticker to catch and handle) |
| Network / fetch error       | Redirect to `/booking-paused`                                                                                                           |
| Unknown errors              | Rethrow (handled by error page / layout)                                                                                                |

### Implementation Details

- **Client-side navigation:** When `guardedFetch` encounters 429/503 errors during client-side navigation, it automatically redirects to the booking-paused page using `navigateTo()`
- **Server-side rendering:** During SSR, errors are thrown so that callers (like the ticker component) can catch them and provide graceful fallbacks (e.g., hardcoded ticker messages)
- This dual behavior ensures the system **fails soft** and users see a coherent "booking paused" or "temporarily unavailable" state instead of raw 500s

### Dynamic Error Detection

The system handles Airtable errors in two ways:

1. **Manual Override (`AIRTABLE_DISABLED=true`):**

   - Airtable utilities check the disabled flag **before** making any API calls
   - Throws HTTP 503 errors immediately (no actual Airtable requests)
   - Used for planned maintenance or known outages

2. **Dynamic Detection (Airtable returns 429/503):**
   - System makes actual Airtable API calls
   - If Airtable returns 429 (rate limit) or 503 (service unavailable), the error is caught and handled
   - **No manual intervention required** - works automatically even when `AIRTABLE_DISABLED=false`
   - Ticker component automatically shows fallback message
   - Users accessing content pages are redirected to booking-paused

**Example Flow for Dynamic Errors:**

```text
1. User loads page → Layout calls fetchTickerMessage()
2. fetchTickerMessage() → guardedFetch("/api/cms")
3. /api/cms → airtableSelect() makes actual Airtable API call
4. Airtable returns 429/503 (rate limit or outage)
5. Error propagates: Airtable → airtableSelect → /api/cms → guardedFetch
6. guardedFetch detects 429/503:
   - SSR: Throws error → ticker catch block → shows fallback message
   - Client: Redirects to /booking-paused
7. Result: User sees hardcoded ticker message, no crashes
```

This means the system automatically adapts to Airtable throttling/outages without requiring manual env var changes.

---

## 7. Route Allow-List (Bot Hardening) - Phase 1 Enhanced

Implemented in:

```txt
server/middleware/10.route-allowlist.ts
server/middleware/legacy-gone.global.ts (expanded)
server/middleware/bot-protect.global.ts (enhanced)
```

Purpose:

- Maintain a manifest of **allowed** public routes.
- Reject obviously invalid or legacy probe paths (WP endpoints, etc.) early.
- Short-circuit before:
  - Layout initialisation
  - Airtable calls
  - Full SSR execution

**Phase 1 Enhancements:**

- **Expanded pattern matching:** Blocks 50+ .env file variations, PHP info probes, config file probes, and WordPress paths
- **Whitelist approach:** Only explicitly allowed routes are processed; all others are blocked early
- **Enhanced legacy URL handling:** Expanded from 3 to include patterns from Airtable LEGACY-URLS table
- **Comprehensive logging:** Console warnings for all blocked requests (visible in Netlify logs)

Typical behaviour:

- Allowed HTML routes → normal SSR.
- Known bad legacy URLs → `410 Gone`.
- Blocked probe patterns → `410 Gone` (WordPress, .env, PHP info, config files, etc.)
- Unknown HTML routes → lightweight `404 Not Found`.
- Static assets, internal routes, and APIs are selectively bypassed as needed.

**Blocked Patterns (Phase 1):**

- WordPress probes: `/wp-login.php`, `/wp-content/`, `/wp-includes/`, etc.
- .env file probes: 50+ variations (`.env.bak`, `.env.example`, `.env.local`, etc.)
- PHP info probes: `/phpinfo`, `/phpinfo.php`, `/info.php`, etc.
- Config file probes: `/config.json`, `/configuration.json`, etc. (many variations)
- Security probes: `/.aws/credentials`, `/debug`, etc.

This substantially reduces Airtable/API calls under bot or crawler pressure. **Expected reduction: 30-40% of Airtable calls.**

---

## 8. CSP and Legacy URL Logging

Two key telemetry endpoints:

- `POST /api/csp-report`

  - Stores CSP reports to an Airtable table (`CSP-REPORTS` by default).
  - Feeds into security diagnostics.

- `POST /api/legacy-404`
  - Records unknown or legacy URLs (typically sampled).
  - Helps decide whether to:
    - Add redirects,
    - Add hard `410`s,
    - Or retire legacy routing.

These, combined with Netlify logs, give a complete view of misbehaving clients and bots.

---

## 9. Nitro Caching (Quota Protection)

Nitro provides several mechanisms used in this project to reduce Airtable usage:

- `defineCachedEventHandler`
- `defineCachedFunction`
- `routeRules` with `cache` options

These are applied to **stable or slow-changing** payloads such as:

- Ticker messages
- FAQs
- Policies
- Parties list
- Camps list
- Clubs list
- Other CMS pages

Under load, this ensures repeat requests are served from cache where applicable rather than hitting Airtable every time.

---

## 10. Testing

Testing uses:

- **Vitest**
- **`@nuxt/test-utils`** (Nuxt 4 compatible)

---

## 11. Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on <http://localhost:3000>

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
