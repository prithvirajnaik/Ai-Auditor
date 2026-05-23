# Auto Audit - Testing Documentation

This document describes the testing setup, test suite structure, and execution instructions for the Auto Audit deterministic heuristics engine.

## Test Stack

- **Testing Framework**: [Vitest](https://vitest.dev/)
- **Target Component**: Heuristics Audit Engine (`src/lib/auditEngine.ts` & `src/lib/calculations.ts`)
- **Execution Script**: `npm run test` (which triggers `vitest run`)

---

## Implemented Unit Tests

The test suite is located at [tests/auditEngine.test.ts](file:///c:/Users/prith/OneDrive/Desktop/auto-audit/tests/auditEngine.test.ts) and covers the following requirements:

### 1. Duplicate Tool Detection
- **Test Case**: `should detect duplicate code editors (Cursor + Copilot) in the same department`
- **Logic**: Asserts that if a department (Engineering) is running concurrent active seat allocations for both Cursor and GitHub Copilot, a recommendation type `remove_redundant` is generated for GitHub Copilot. It validates that the `duplicateToolsCount` increases by 1, and the savings are mathematically computed based on the overlapping seat count times the cost per seat.

### 2. Plan Downgrade Recommendations
- **Test Case A**: `should recommend downgrading Claude Team plan with less than 5 seats to Individual Pro`
- **Logic**: Asserts that Claude Team plans (which enforce a 5-seat minimum) generate a downgrade recommendation if active seats are below 5 (e.g., 3 seats), saving `$65/mo` (billed for 5 seats at $25/mo vs. 3 individual seats at $20/mo).
- **Test Case B**: `should recommend downgrading ChatGPT Team plan with 1 seat to Plus`
- **Logic**: Asserts that ChatGPT Team plans (which enforce a 2-seat minimum) generate a downgrade recommendation if only 1 seat is declared, saving `$30/mo` (billed for 2 seats at $25/mo vs. 1 individual seat at $20/mo).

### 3. Ghost Seat Detection
- **Test Case**: `should detect ghost seats when active seats exceed 130% of headcount`
- **Logic**: Asserts that if the total declared active seat licenses exceed 130% of the organization headcount, the surplus seats are flagged as ghost seats. It verifies that `inactiveSeatsCount` maps the surplus seats correctly and generates a downgrade/prune recommendation for the excess slots.

### 4. API Overspending Recommendations
- **Test Case**: `should recommend semantic caching layer for OpenAI API active developer spend`
- **Logic**: Asserts that developer API endpoints (OpenAI / Anthropic APIs) generate a `usage_routing` recommendation to implement a semantic caching layer (e.g., GPTCache), estimating a 20% reduction in total monthly API credit costs.

### 5. Annual Savings Calculations
- **Test Case**: `should accurately calculate total annual savings based on monthly recommendations`
- **Logic**: Asserts that total monthly savings (the sum of all pending recommendations) scales exactly to annual savings (monthly savings multiplied by 12) with no mathematical drift or formatting errors.

---

## Running the Tests Locally

Ensure that you have installed all dependencies first:

```bash
npm install
```

To run the Vitest suite in single-run mode:

```bash
npm run test
```

To run the Vitest suite in watch mode during development:

```bash
npx vitest
```

---

## CI Pipeline Integration

These tests are integrated into the GitHub Actions CI workflow [ci.yml](file:///c:/Users/prith/OneDrive/Desktop/auto-audit/.github/workflows/ci.yml) and run automatically on every push or pull request to the `main` branch. Any test failures will block merging.
