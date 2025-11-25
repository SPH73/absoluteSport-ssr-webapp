# AbsoluteSport SSR Web Application — Developer Documentation

This repository contains the production codebase for the AbsoluteSport SSR platform.

For a client-friendly overview, see:
➡ **README-CLIENT.md**

---

## 1. Architecture Overview

### Runtime

- Nuxt 4.2.x (SSR)
- Nitro preset: netlify
- Deployed to Netlify Functions

### Key Domains

- Booking flows
- Enquiry flows
- Airtable CMS content
- GoCardless payments

---

## 2. Technology Stack

- Nuxt 4
- Vue 3
- TypeScript
- Airtable SDK
- Mailchimp
- GoCardless
- nuxt-security
- Vitest + Nuxt Test Utils

---

## 3. Project Structure

```plaintext
app/
  components/
  composables/
  pages/
server/
  api/
    utils/
test/
  nuxt/
```

---

## 4. Environment Variables

| Key                             | Purpose       |
| ------------------------------- | ------------- |
| NUXT_PRIVATE_AT_API_KEY         | Airtable key  |
| NUXT_PUBLIC_AT_BASE_ID          | Airtable base |
| NUXT_PRIVATE_MAILCHIMP_KEY      | Mailchimp     |
| NUXT_PRIVATE_GOCARDLESS_KEY     | GoCardless    |
| NUXT_PRIVATE_CSP_AIRTABLE_TOKEN | CSP logs      |

---

## 5. Airtable Pipeline

All calls pass through `server/api/utils/airtable.ts`
Ensures consistent API usage and proper type handling.

---

## 6. Booking Guard — useBookingApi

Centralised error handler for Airtable outages.

**Behaviour:**

- Success → return response
- 429/503 → redirect to `/booking-paused`
- Other errors → rethrow

Covered by full unit tests.

---

## 7. Security Features

- CSP headers (nuxt-security)
- CSP reporting API
- Legacy URL logging API
- Hardened SSR runtime

---

## 8. Testing

Uses:

- Vitest
- @nuxt/test-utils
- hoisted mocks

Run tests:

```plaintext
npm run test
```

---

## 9. Development Workflow

```plaintext
npm install
npm run dev
npm run typecheck
```

Tailwind viewer:
<http://localhost:3000/_tailwind/>

---

## 10. Deployment Workflow

- Push to feature branch → Netlify deploy preview
- Merge to main → Production deploy

---

## 11. Troubleshooting

**Airtable 429 loops**
→ Check Airtable usage + booking guard handling.

**Test failures**
→ Ensure mockNuxtImport is correct.

---

## 12. Versioning

Current version: **1.0.0**
Following semver.
