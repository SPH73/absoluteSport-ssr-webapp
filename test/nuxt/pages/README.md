# Redirect Empty API Routes - Test Suite

This directory contains tests for the empty-state redirect mechanism that ensures CMS-driven pages gracefully handle Airtable throttling and empty data scenarios.

## Test Structure

### 1. Composable Tests (`test/nuxt/composables/useBookingApi.nuxt.spec.ts`)

Tests the `useBookingApi` composable that provides `guardedFetch()`:

- **Successful requests**: Returns data normally, no redirect
- **429/503 errors**: Redirects to `/booking-paused?context=booking` (client-side) or throws error (SSR)
- **Other errors**: Rethrows for error page handling
- Uses `navigateTo()` for client-side redirects (not `useRouter()`)
- Mocks `$fetch` using `vi.stubGlobal()` for global auto-imports

### 2. Ticker Tests (`test/nuxt/utils/ticker.nuxt.spec.ts`)

Tests the ticker message system that displays on the home page:

- **When Airtable returns visible ticker content**: Shows CMS content, no forced redirect
- **When Airtable returns empty array**: Shows fallback message with link to `/booking-paused`
- **When no visible ticker row exists**: Falls back to booking-paused ticker
- **When guardedFetch throws**: Falls back to booking-paused ticker
- **When unexpected data shape**: Safely falls back to booking-paused ticker

### 3. Page-Level Redirect Tests (`test/nuxt/pages/`)

Tests individual CMS-driven pages to ensure they redirect to `/booking-paused` when content is unavailable:

#### `faqs.nuxt.spec.ts`

- Tests FAQ page redirects when FAQ list is empty
- Context: `contact` (support-oriented)

#### `camps-index.nuxt.spec.ts`

- Tests camps index redirects when both campList and campImages are empty
- Only redirects when BOTH are empty (allows partial data)
- Context: `booking`

#### `parties-index.nuxt.spec.ts`

- Tests parties page redirects when no featured parties exist
- Context: `contact`

#### `legal-policies.nuxt.spec.ts`

- Tests policies page redirects when policy list is empty
- Context: `info`

## Running Tests

### Run all tests

```bash
npm run test
```

### Run only Nuxt environment tests

```bash
npm run test:nuxt
```

### Run specific test file

```bash
npm run test test/nuxt/utils/ticker.nuxt.spec.ts
```

### Run with watch mode

```bash
npm run test -- --watch
```

## Test Patterns

### Mocking Pattern

All tests use Vitest's `vi.hoisted()` to create mocks before imports are processed:

```typescript
const { navigateToMock, guardedFetchMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn(),
  guardedFetchMock: vi.fn(),
}));
```

### Testing Empty State Redirects

Each page test validates three scenarios:

1. **Empty CMS data** - Returns empty array
2. **Throttled/Failed fetch** - Returns undefined (guardedFetch handled 429/503)
3. **Valid data** - Returns expected content structure

### Context Values

Different pages use different context query parameters:

- `booking` - For booking-related pages (camps, clubs, events)
- `contact` - For support/enquiry pages (FAQs, parties, contact)
- `info` - For informational pages (policies)

## Integration with Production Behaviour

These tests validate the two-layer resilience strategy:

1. **guardedFetch Layer**: Catches 429/503 errors and redirects to `/booking-paused`
2. **Empty-State Layer**: Detects when CMS returns no meaningful content and redirects

This ensures:

- Airtable throttling is handled gracefully
- Empty content states don't render broken pages
- Users always see actionable information
- Bot traffic is pushed through the same flow

## TypeScript Issues

Some tests may show TypeScript errors about missing module declarations for Vue components. These are benign and don't affect test execution in the Nuxt environment. The tests run successfully using `@nuxt/test-utils/runtime`.
