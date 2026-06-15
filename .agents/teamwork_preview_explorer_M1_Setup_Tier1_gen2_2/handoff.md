# Handoff Report: M1_Setup_Tier1 Strategy

## 1. Observation
- The previous iteration failed due to two critical bugs reported in `.agents/sub_orch_e2e/ITERATION_1_FEEDBACK.md`:
  1. **Browser Dependency Mismatch**: The `Mobile` project used `devices['iPhone 12']`, which defaults to `webkit`. Since only `chromium` was installed, tests crashed.
  2. **Concurrent Build Race Condition**: `execSync('npm run build')` ran in `e2e/build.spec.ts` across parallel projects (`Mobile` and `Desktop`), causing race conditions and thrashing the Vite `dist/` directory.
- `TEST_INFRA.md` dictates Tier 1 coverage: 5 tests for Responsive Layout, 5 for Clickability, and 5 for Build Reliability.
- `ORIGINAL_REQUEST.md` specifies the tech stack is Vite + React.

## 2. Logic Chain
- **Resolving the WebKit Issue**: To ensure the Mobile project can run without crashing, the worker must explicitly install both `chromium` and `webkit` dependencies. This allows standard mobile emulators (like `iPhone 12`) to function as intended.
- **Resolving the Build Race Condition**: Playwright runs test files for each configured project in parallel. To prevent `build.spec.ts` from executing multiple times concurrently, we must restrict it to run in exactly one project. This can be achieved natively in Playwright by adding a skip guard at the top of the test file: `test.skip(({ projectName }) => projectName !== 'Desktop');`.
- **Tier 1 Test Design Strategy**:
  - **Responsive Layout (5 tests)**:
    1. Verify viewport meta tag exists and is correctly configured.
    2. Verify `document.documentElement.scrollWidth === document.documentElement.clientWidth` (no horizontal overflow) on Desktop.
    3. Verify no horizontal overflow on Mobile.
    4. Verify main content containers do not overflow their bounds.
    5. Verify CSS flex/grid structures remain intact under mobile widths.
  - **Clickability (5 tests)**:
    1. Ensure all `<a>` tags in the navigation are actionable (visible, not obscured).
    2. Ensure all `<button>` elements pass Playwright's clickability checks.
    3. Ensure social/external links have `rel="noopener"` and are clickable.
    4. Ensure interactive portfolio cards are clickable.
    5. Ensure the mobile hamburger menu (if present at 375px) is clickable.
  - **Build Reliability (5 tests)**:
    1. Verify `npm run build` completes with exit code 0.
    2. Verify `dist/` directory is created.
    3. Verify `dist/index.html` is successfully generated.
    4. Verify `dist/assets/` directory is populated with JS/CSS files.
    5. Verify the build output (stderr) contains no fatal TypeScript errors.

## 3. Caveats
- The build test will take additional time. It is highly recommended to increase the timeout for the `build.spec.ts` suite using `test.setTimeout(60000)` to avoid flaky timeout failures.
- It's assumed the Vite build outputs to the default `dist/` directory. If a custom `outDir` is used, the build test validations will need adjustment.

## 4. Conclusion
The implementation strategy for M1_Setup_Tier1 is fully defined. 
1. **Installation**: `npm install -D @playwright/test` followed by `npx playwright install --with-deps chromium webkit`.
2. **Config**: Define `playwright.config.ts` with `Desktop` (using Desktop Chrome, viewport 1080px width) and `Mobile` (using iPhone 12, viewport 375px width).
3. **Tests**: Create three spec files in `e2e/`: `responsive.spec.ts`, `clickability.spec.ts`, and `build.spec.ts`. Implement the 15 specific tests outlined above.
4. **Race Condition Fix**: In `e2e/build.spec.ts`, implement the project-specific guard and set a 60-second timeout.

## 5. Verification Method
- Execute `npx playwright test`.
- Verify the test summary shows exactly 15 passed tests.
- Verify that `npm run build` is logged in the console exactly once during the test run.
- Ensure no WebKit browser initialization errors appear in the test logs.
