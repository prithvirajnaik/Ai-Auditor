# Auto Audit — Test Documentation

## Overview

Testing is focused on the deterministic audit engine, which is the core mathematical logic of the product. Since the engine is a pure TypeScript function with no external dependencies, it's straightforward to test with precise numerical assertions.

The test runner is **Vitest**, configured through Vite's toolchain (no separate config file required). Tests import `runAuditAnalysis` directly and verify outputs against expected values.

---

## Test File

**`tests/auditEngine.test.ts`**

5 test cases covering all major heuristic rules in the audit engine.

---

## Running Tests

```bash
# Run the full test suite (exits with pass/fail)
npm run test

# Run TypeScript type check (no emit, catches type errors)
npm run lint
```

Expected output on pass:
```
✓ tests/auditEngine.test.ts (5)
  ✓ Auto Audit Heuristics Engine
    ✓ should detect duplicate code editors (Cursor + Copilot) in the same department
    ✓ should recommend downgrading Claude Team plan with less than 5 seats to Individual Pro
    ✓ should recommend downgrading ChatGPT Team plan with 1 seat to Plus
    ✓ should detect ghost seats when active seats exceed 130% of headcount
    ✓ should recommend semantic caching layer for OpenAI API active developer spend
    ✓ should accurately calculate total annual savings based on monthly recommendations

Test Files  1 passed (1)
Tests       5 passed (5)
```

---

## Test Cases

### Test 1: Duplicate Code Editor Detection (Rule A)

**File:** `tests/auditEngine.test.ts`, line 8

**What it tests:**
Verifies that when Cursor and GitHub Copilot are both active in the same department, the engine detects 1 duplicate tool and generates a `remove_redundant` recommendation for Copilot.

**Input:**
- Cursor Pro: 5 seats × $20/seat = $100/mo, Engineering
- GitHub Copilot Individual: 5 seats × $10/seat = $50/mo, Engineering

**Expected assertions:**
```
report.duplicateToolsCount === 1
recommendation type === 'remove_redundant'
recommendation toolId === 'copilot'
recommendation.estimatedMonthlySavings === 50  // 5 overlapping seats × $10/seat
```

**Why this test matters:** This is the most common pattern the engine is built to catch — developers paying for two code editors concurrently. The savings formula is straightforward (overlapping seats × cheaper seat cost) but the detection logic needs to correctly scope the overlap to the same department.

---

### Test 2: Claude Team Seat Minimum Downgrade (Rule D)

**File:** `tests/auditEngine.test.ts`, line 56

**What it tests:**
Claude's Team plan has a 5-seat billing minimum. If a team has only 3 users on a Team plan, they pay for 5 seats. The engine should detect this and recommend downgrading to individual Pro licenses.

**Input:**
- Claude Team: 3 seats × $25/seat, but billed for 5-seat minimum = $125/mo, Product dept

**Expected assertions:**
```
recommendation type === 'downgrade'
recommendation toolId === 'claude'
recommendation.estimatedMonthlySavings === 65  // billed $125 - alternative $60 (3×$20 Pro) = $65
```

**Why this test matters:** This is pricing knowledge encoded as a rule. If the savings formula is off by even one seat, this test catches it.

---

### Test 3: ChatGPT Team Single-Seat Downgrade (Rule D)

**File:** `tests/auditEngine.test.ts`, line 88

**What it tests:**
ChatGPT Team has a 2-seat billing minimum. A team with 1 user on Team is being billed for 2 seats. Should recommend downgrading to Plus.

**Input:**
- ChatGPT Team: 1 seat × $25/seat, but billed for 2-seat minimum = $50/mo, Operations

**Expected assertions:**
```
recommendation type === 'downgrade'
recommendation toolId === 'chatgpt'
recommendation.estimatedMonthlySavings === 30  // billed $50 - alternative $20 (1×$20 Plus) = $30
```

---

### Test 4: Ghost Seat Detection (Rule E)

**File:** `tests/auditEngine.test.ts`, line 121

**What it tests:**
If total active seats exceed `teamSize × 1.3`, the surplus is flagged as ghost seats. Savings are calculated as `ghostSeats × averageCostPerSeat`.

**Input:**
- ChatGPT Plus: 15 seats × $20/seat = $300/mo, Marketing
- Team size: 10 users
- `maxAllowedSeats = 10 × 1.3 = 13`
- `ghostSeats = 15 - 13 = 2`

**Expected assertions:**
```
report.inactiveSeatsCount === 2
ghostRec.estimatedMonthlySavings === 40  // 2 ghost seats × $20 avg cost
```

**Why this test matters:** The 1.3 multiplier is a deliberate design choice — it gives a 30% buffer for contractors, part-time workers, etc. before flagging surplus. If the threshold is wrong, this test fails immediately.

---

### Test 5: Annual Savings Totals (Composite)

**File:** `tests/auditEngine.test.ts`, line 192

**What it tests:**
End-to-end calculation accuracy across multiple concurrent recommendations. Verifies that individual rule savings add up correctly and the annual figure is exactly `monthly × 12`.

**Input:**
- OpenAI API: $250/mo → caching saves 20% = $50/mo
- Cursor Pro: 5 seats × $20 = $100/mo
- GitHub Copilot: 5 seats × $10 = $50/mo → duplicate with Cursor = $50/mo
- Cursor/Copilot overlap saves $50
- Cursor individual consolidation saves 15% of $100 = $15
- Copilot individual consolidation saves 15% of $50 = $8

**Expected assertions:**
```
report.potentialMonthlySavings === 123
report.potentialAnnualSavings === 1476  // 123 × 12
```

**Why this test matters:** Compound scenarios reveal off-by-one errors in the accumulation logic. If two rules fire on the same subscription and count savings twice, this test catches the drift.

---

## CI Integration

Tests run automatically via GitHub Actions on every push to `main` or `master`, and on every pull request.

**Workflow file:** `.github/workflows/ci.yml`

```yaml
name: Auto Audit CI

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
    - run: npm ci
    - run: npm run lint    # TypeScript type check
    - run: npm run test    # Vitest unit tests
```

The pipeline runs in ~45 seconds on GitHub's Ubuntu runner. Both `lint` and `test` must pass for a merge to be allowed.

---

## What's Not Tested

**API route handlers** — The Express routes in `server.ts` are not integration-tested. This includes the rate limiter behavior, the anonymization logic in the public reports endpoint, and the honeypot check on the leads route.

**Supabase service layer** — `auditService.ts` and `leadService.ts` make database calls that require a live Supabase instance. These aren't tested because setting up a test database with seeded data and RLS policies in CI would require significant additional configuration. In practice, these functions are simple wrappers around `supabase.from().insert()` and `.select()` calls.

**Gemini API** — The AI summary module isn't unit-tested because mocking the Gemini response doesn't add much value. The real logic to test is the fallback behavior, which could be tested by passing an invalid API key and asserting the output matches the template. That test should be added.

**React components** — No component-level tests. The UI is manually verified. Adding React Testing Library tests for the form validation and the dashboard savings display would be the next priority.
