# Nuxt 4 + Airtable – CLI Cheatsheet & Status Script

## 1. Install Helpers

**Install tree (if not installed):**

```sh
brew install tree
```

---

## 2. Daily Git / Project Snapshot

**Short git status:**

```sh
git status -s
```

**List modified + untracked files:**

```sh
git diff --name-only
```

**Summary of unstaged changes:**

```sh
git diff --stat
```

**Summary of staged changes:**

```sh
git diff --cached --stat
```

**Recent commits (last 5):**

```sh
git log --oneline -5
```

---

## 3. Project Structure

**Tree of project (ignore build artifacts):**

```sh
tree -I "node_modules|.nuxt|dist|.output|.git" -L 3
```

---

## 4. Nuxt & Airtable Hotspots

**Diff Airtable helper:**

```sh
git diff server/api/utils/airtable.ts
```

**Diff main layout (ticker, guards, etc.):**

```sh
git diff app/layouts/default.vue
```

**Diff booking guard composable:**

```sh
git diff app/composables/useBookingApi.ts
```

**Diff all pages (for UX/booking changes):**

```sh
git diff app/pages | less
```

**Find Airtable usages in API:**

```sh
grep -R "airtable" -n server/api
grep -R "airtableSelect" -n server/api
```

---

## 5. Nuxt Health & Type Safety

**Typecheck:**

```sh
npm run typecheck
```

**Run dev server:**

```sh
npm run dev
```

---

## 6. HTTP Health Checks (requires server running)

**Homepage:**

```sh
curl -v http://localhost:3000/
```

**Booking-paused page:**

```sh
curl -v http://localhost:3000/booking-paused
```

---

## 7. STATUS Snapshot Script

Save the following as `status.sh` in your project root, then make it executable and run it.

**Make executable:**

```sh
chmod +x status.sh
```

**Run (default output to STATUS.txt):**

```sh
./status.sh
```

**Run with custom filename:**

```sh
./status.sh MY_STATUS_SNAPSHOT.txt
```

**status.sh contents:**

```bash
#!/bin/bash

# Usage:
#   ./status.sh              # writes STATUS.txt in project root
#   ./status.sh custom.txt   # writes to custom.txt instead
#
# Generates a snapshot of git state, recent changes, project tree,
# Nuxt diagnostics, and local HTTP health checks (if server is running).

OUTPUT_FILE="${1:-STATUS.txt}"

{
  echo "=================================================="
  echo "PROJECT STATUS SNAPSHOT"
  echo "Timestamp: $(date)"
  echo "=================================================="
  echo ""

  echo "=== GIT STATUS ==================================="
  git status
  echo ""

  echo "=== MODIFIED FILES ==============================="
  git diff --name-only
  echo ""

  echo "=== DIFF SUMMARY ================================="
  git diff --stat
  echo ""

  echo "=== RECENT COMMITS (LAST 5) ======================"
  git log --oneline -5
  echo ""

  echo "=== PROJECT TREE (3 LEVELS) ======================"
  if command -v tree &> /dev/null; then
    tree -I "node_modules|.nuxt|dist|.output|.git" -L 3
  else
    echo "tree not installed. Install via: brew install tree"
  fi
  echo ""

  echo "=== NUXT DIAGNOSTICS ============================="
  if command -v npx &> /dev/null; then
    echo "-> npx nuxi info"
    npx nuxi info || echo "nuxi info failed (Nuxt CLI not available?)"
  else
    echo "npx not found on PATH."
  fi
  echo ""

  echo "-> npm run typecheck (may take a while)"
  if command -v npm &> /dev/null; then
    npm run typecheck || echo "Typecheck failed (see above for details)."
  else
    echo "npm not found on PATH."
  fi
  echo ""

  echo "=== LOCAL HTTP HEALTH CHECKS ====================="
  if command -v curl &> /dev/null; then
    echo "-> curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:3000/"
    curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:3000/ || echo "Homepage check failed (dev/prod server not running?)"
    echo ""
    echo "-> curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:3000/booking-paused"
    curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:3000/booking-paused || echo "booking-paused check failed (route or server unavailable?)"
  else
    echo "curl not installed; skipping HTTP checks."
  fi

} > "$OUTPUT_FILE"

echo "Status snapshot written to $OUTPUT_FILE"
```

---

Keep this cheatsheet in your repo (e.g. `CHEATSHEET.md`) so you can quickly copy/paste into your terminal whenever needed.
