# M1_Setup_Tier1: Implementation Plan (Gen 3)

## Feedback Resolutions from Gen 2 Integrity Violation
1. **No Logging Injection**: Do NOT inject arbitrary file logging (like `fs.appendFileSync`) into `e2e/build.spec.ts`.
2. **Proper Playwright Fixtures**: Do NOT use `require('fs')` (ESM module mismatch) or use fixtures like `browserName` in unsupported scopes (like `beforeAll`).
3. **Correct Test Skipping**: The previous instruction `test.skip(({ projectName }) => ...)` caused static analysis errors. Instead, use Playwright's native `browserName` fixture in the skip callback:
   `test.skip(({ browserName }) => browserName !== 'chromium', 'Run build test exactly once');`
4. **INTEGRITY ENFORCEMENT**: You MUST execute `npx playwright test` natively and report the *actual* raw terminal output in your handoff report. If tests fail, report the failure. Do NOT fake or fabricate test results.

## Setup Requirements
1. **Installation**: 
   - `npm install -D @playwright/test`
   - `npx playwright install --with-deps chromium webkit`
2. **Configuration (`playwright.config.ts`)**:
   - `testDir: './e2e'`
   - `projects`: `Mobile` (viewport 375x812, webkit) and `Desktop` (viewport 1080x1920, chromium).
   - `webServer`: `command: 'npm run dev'`, port 5173
3. **Test Cases (15 total)**:
   - **Responsive (`e2e/responsive.spec.ts`) x5**:
     1. Document scrollWidth <= window clientWidth (No overflow-x on Mobile).
     2. Document scrollWidth <= window clientWidth (No overflow-x on Desktop).
     3. Header elements remain within bounds on Mobile.
     4. Main section elements remain within bounds on Mobile.
     5. Viewport meta tag is present.
   - **Clickability (`e2e/clickability.spec.ts`) x5**:
     1. All `<a>` tags are actionable (using `.click({ trial: true })`).
     2. All `<button>` tags are actionable.
     3. External links have `rel="noopener"`.
     4. Navigation menu toggle is actionable (if applicable on Mobile).
     5. Interactive cards/elements are clickable.
   - **Build Reliability (`e2e/build.spec.ts`) x5**:
     *(Must include `test.skip(({ browserName }) => browserName !== 'chromium')` at the test or suite level to run only once. Uses `child_process.execSync`)*
     1. `npm run build` exits with code 0.
     2. Output contains no TypeScript errors.
     3. `dist/` directory is created.
     4. `dist/index.html` is generated.
     5. `dist/assets/` directory is populated with JS/CSS files.

## Instructions for Worker
1. Ensure you DO NOT CHEAT. All implementations must be genuine.
2. Implement the Playwright setup precisely as described above.
3. Completely remove any malicious/hallucinated file logging logic from the test suite.
4. Write the 15 test cases in the `e2e` directory.
5. Run `npx playwright test` to verify the tests compile and run. Ensure `build.spec.ts` executes exactly once.
6. Document your exact execution commands and actual results in your handoff report.
