# Handoff Report: M1_Setup_Tier1 Analysis and Strategy

## 1. Observation
- `TEST_INFRA.md` requires `playwright.config.ts` to support Mobile (375px) and Desktop (1080px).
- `TEST_INFRA.md` requires Tier 1 tests: Responsive Layout (5 tests), Clickability (5 tests), and Build Reliability (5 tests).
- `ITERATION_1_FEEDBACK.md` reports two critical bugs from the previous attempt:
  1. **Browser Dependency Mismatch**: The `Mobile` project used a device (like `iPhone 12`) that defaults to `webkit`, but only `chromium` was installed, causing crashes.
  2. **Concurrent Build Race Condition**: `build.spec.ts` ran `npm run build` inside a `beforeAll` block. Since tests run in parallel across `Mobile` and `Desktop` projects, the build command ran concurrently, thrashing the `dist/` folder and causing flakiness/deadlocks.

## 2. Logic Chain
- **Browser Issue Resolution**: To fix the browser mismatch without requiring the installation of the heavy `webkit` dependency, the `Mobile` project in `playwright.config.ts` must be explicitly configured to use `chromium`. Instead of using an iPhone preset, we can use `devices['Pixel 5']` (which uses chromium) or define a custom mobile configuration with `{ browserName: 'chromium', viewport: { width: 375, height: 812 } }`.
- **Concurrent Build Resolution**: To prevent race conditions while fulfilling the 5 "Build Reliability" test cases, `build.spec.ts` must be restricted to run in exactly one Playwright project. By adding `test.skip(({ projectName }) => projectName !== 'Desktop', 'Run build tests only once');` at the top of the file, or wrapping the tests in a condition, Playwright will safely execute the build and the 5 assertions sequentially in the Desktop environment and skip them entirely in the Mobile environment.
- **Tier 1 Test Design Strategy**:
  - *Responsive Layout (x5)*: Check 5 key sections (e.g., Header, Hero, Portfolio, About, Footer) to ensure `element.scrollWidth <= element.clientWidth` (no horizontal overflow).
  - *Clickability (x5)*: Verify 5 distinct interactive elements (e.g., Main CTA, Nav Links, Social Links) are visible, enabled, and clickable without overlapping elements.
  - *Build Reliability (x5)*: Inside the single-project `build.spec.ts`, run `execSync('npm run build')` once in a `beforeAll` (or first test), then have 5 tests verifying: 1) Build exits with code 0, 2) `dist/` directory exists, 3) `dist/index.html` exists, 4) `dist/assets/` contains generated JS/CSS, 5) Build output contains no TypeScript/ESLint errors.

## 3. Caveats
- Relying on `test.skip()` in `build.spec.ts` assumes the test file is run by the standard Playwright test runner without filtering that excludes the target project (e.g., if a user runs `npx playwright test --project Mobile`, the build test will be skipped entirely). If build reliability is strictly needed on every test run regardless of project filtering, configuring a `globalSetup` script to run the build would be more robust, though it makes asserting 5 granular build tests slightly more awkward (they would just verify the already-built `dist/` folder).

## 4. Conclusion
The implementation for M1_Setup_Tier1 must:
1. Configure `playwright.config.ts` with two projects: `Desktop` (1080px, chromium) and `Mobile` (375px, explicitly setting `browserName: 'chromium'` or using a chromium-based device like `Pixel 5`).
2. Implement `build.spec.ts` with a project-level skip (`test.skip(({ projectName }) => projectName !== 'Desktop')`) so the `npm run build` command runs exactly once, avoiding race conditions.
3. Provide 5 granular test cases in `build.spec.ts` to evaluate the build artifacts.
4. Provide 5 tests in `responsive.spec.ts` checking for overflow-x.
5. Provide 5 tests in `clickability.spec.ts` checking interaction readiness of core elements.

## 5. Verification Method
1. Inspect `playwright.config.ts` to ensure the Mobile project explicitly uses `chromium` or a chromium device.
2. Run `npx playwright test` and verify that `build.spec.ts` only executes its setup block once (no concurrent `npm run build` commands).
3. Ensure the test output shows 15 passing tests (5 for each of the 3 features).
