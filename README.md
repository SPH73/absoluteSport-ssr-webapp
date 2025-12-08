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
    10.route-allowlist.ts
    bot-protect.global.ts
    cors.ts
    legacy-gone.global.ts

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

## 7. Phase 1 Bot Hardening (Middleware Stack)

Phase 1 bot hardening implements a multi-layered defense to reduce Airtable API calls and block malicious bot traffic before it reaches expensive SSR processing.

### Middleware Execution Order

Middleware executes in alphabetical order by filename. The current stack:

1. **`10.route-allowlist.ts`** (prefixed with `10.` to run first)
2. **`bot-protect.global.ts`** (global middleware)
3. **`cors.ts`** (CORS handling)
4. **`legacy-gone.global.ts`** (global middleware)

### 7.1 Route Allow-List (`10.route-allowlist.ts`)

**Purpose:** Pre-routing protection that maintains a manifest of allowed public routes and rejects invalid paths early.

**Implementation:**

- Maintains a whitelist of valid public HTML routes
- Blocks known probe patterns (WordPress, .env files, PHP info, config files, security probes)
- Returns `410 Gone` for known legacy URLs
- Returns `404 Not Found` for unknown routes
- Bypasses static assets (`/_nuxt/`, `/img/`, `/fonts/`, etc.) and API routes

**Benefits:**

- Short-circuits before layout initialization
- Prevents Airtable calls for invalid routes
- Reduces SSR execution for bot probes
- Substantially reduces Airtable/API calls under bot or crawler pressure

**Route Handling:**

- Allowed HTML routes → normal SSR
- Known bad legacy URLs → `410 Gone`
- Unknown HTML routes → lightweight `404 Not Found`
- Static assets and internal routes → bypassed

### 7.2 Bot Protection (`bot-protect.global.ts`)

**Purpose:** Global middleware that blocks malicious bot traffic based on URL patterns and User-Agent headers.

**Features:**

- **Pattern Blocking:** Blocks common attack/probe patterns:

  - PHP file requests (`.php` extensions)
  - WordPress probes (`/wp-admin`, `/wp-login.php`, `/wp-content/plugins`, `xmlrpc.php`)
  - `.env` file probes (50+ variations: `.env.bak`, `.env.example`, `.env.local`, etc.)
  - PHP info probes (`phpinfo.php`, `info.php`, `php-info.php`, etc.)
  - Config file probes (JSON config files, AWS credentials, database configs)
  - Security probes (`/debug`, `/admin`, `/phpmyadmin`)

- **User-Agent Filtering:**
  - Allows legitimate crawlers (Googlebot, Bingbot, DuckDuckBot, Slurp)
  - Blocks requests with suspicious or empty User-Agents
  - Returns `403 Forbidden` for blocked patterns

**Response:** Returns `403 Forbidden` for blocked requests.

### 7.3 Legacy URL Handler (`legacy-gone.global.ts`)

**Purpose:** Returns `410 Gone` for known legacy URLs from previous site versions.

**Implementation:**

- Maintains a list of legacy paths that should return `410 Gone`
- Currently handles:
  - `/contact-us` (old Wix URL)
  - `/store` (old Wix URL)
  - `/faq's` (malformed apostrophe URL)
  - `/about-us` (from Airtable LEGACY-URLS table)

**Benefits:**

- Happens before any Airtable calls
- Clear signal to search engines that URLs are permanently gone
- Reduces unnecessary processing for known legacy paths

**Response:** Returns `410 Gone` for known legacy URLs.

### Phase 1 Combined Effect

The three middleware files work together to:

1. **Reduce Airtable API calls:** Invalid routes and bot probes are blocked before Airtable queries
2. **Improve performance:** Less SSR processing for malicious traffic
3. **Enhance security:** Block common attack patterns and probes
4. **Better SEO:** Proper HTTP status codes (410 Gone) for legacy URLs

**Monitoring:**

- Blocked requests are logged with timestamps
- Legacy URL patterns can be expanded from Airtable LEGACY-URLS table
- Unknown routes are logged for analysis and potential addition to allowlist or legacy list

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

Typical command:

```bash
npm run test
```

Tests include:

- Page-level redirects (e.g. booking paused)
- API handler behaviour
- CMS / ticker utilities
- Guarded `$fetch` flows

For integration-style tests that must not hit Airtable, set:

```env
AIRTABLE_DISABLED=true
```

and ensure your tests assert the correct redirect / paused behaviour.

---

## 11. Local Development Workflow

### Install dependencies

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

The app will be available at:

- [http://localhost:3000]

### Type checking

```bash
npm run typecheck
```

### Tailwind Viewer

Nuxt Tailwind module exposes an inspector at:

-[http://localhost:3000/_tailwind/]

---

## 12. Build & Production Bundle

### Build for production (Netlify preset)

```bash
npm run build
```

This:

- Builds client and server (Nitro)
- Generates a Netlify-compatible functions bundle in `.netlify/functions-internal`

`nuxt preview` is **not supported** for the Netlify preset bundle.
Use:

- `npm run dev` locally, or
- `netlify dev` if using Netlify CLI for local simulation.

---

## 13. Deployment Workflow (Netlify)

1. **Feature branch** → Push → Netlify **deploy preview**
2. Validate:
   - API routes respond as expected
   - Airtable calls are correctly logged / cached
   - Booking behaviour under quotas is stable
3. **Merge to `main`** → Netlify **production deploy**

### Operational toggles

Use **Netlify Environment Variables** for:

- `AIRTABLE_DISABLED`
- `NUXT_PUBLIC_BOOKING_PAUSED`

This allows operational changes (maintenance, outage-mode, seasonal pause) **without code changes**.

---

## 14. Troubleshooting Guide

### 14.1 500 Errors on Booking / CMS Pages

- Check server logs for:

  - `[airtable] getAirtableBase()` output
  - Stack traces in Netlify function logs

- Confirm:

  - `AT_API_KEY` is set
  - `AT_BASE_ID` is correct
  - `AIRTABLE_DISABLED` is set as expected

### 14.2 Blank or Partially Rendered CMS Pages

- Check Airtable workspace quotas.
- Confirm relevant Nitro caching is working (and not caching error payloads).
- Confirm the allow-list middleware is not incorrectly blocking the route.

### 14.3 Booking appears paused unexpectedly

- Verify:

  ```env
  NUXT_PUBLIC_BOOKING_PAUSED
  ```

- Check client-side redirects and layout banners that depend on `config.public.bookingPaused`.

### 14.4 No Airtable calls when expected

- Verify:

  ```env
  AIRTABLE_DISABLED
  ```

- Confirm `airtableDisabled` is read correctly from `runtimeConfig.private`.

---

## 15. Versioning

- Current app version: **1.0.0**
- Uses Semantic Versioning for logical releases.
- Production deployments are driven by Netlify builds from the `main` branch.

---

## 16. Notes for Contributors

- Do **not** read `process.env` directly in application code.
  - Always use `useRuntimeConfig()` and the keys defined in `nuxt.config.ts`.
- When introducing new feature flags:
  - Use `NUXT_PUBLIC_` prefix for anything the browser needs,
  - Otherwise keep them private.
- Keep Airtable access centralised in `server/api/utils/airtable.ts`.
- Respect the allow-list and CSP logging structures when adding new routes or telemetry.
