# M1_Setup_Tier1: Implementation Plan (Gen 2)

## Feedback Resolutions from Gen 1
1. **WebKit Missing**: Playwright will be installed with both Chromium and WebKit (`npx playwright install --with-deps chromium webkit`) so the Mobile (iPhone 12) project can launch successfully.
2. **Concurrent Build Race Condition**: The `e2e/build.spec.ts` test suite must only execute once to prevent race conditions on the `dist/` directory. Add a check at the top of the file: `test.skip(({ projectName }) => projectName !== 'Desktop', 'Run build test exactly once');` and use `test.setTimeout(60000);` to give Vite enough time to build.

## Consensus from Gen2 Explorers
1. **Installation**: 
   - `npm install -D @playwright/test`
   - `npx playwright install --with-deps chromium webkit`
2. **Configuration (`playwright.config.ts`)**:
   - `testDir: './e2e'`
   - `projects`: `Mobile` (viewport 375x812, default iPhone 12/webkit) and `Desktop` (viewport 1080x1920, chromium).
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
     *(Must include `test.skip` to run only on Desktop. Uses `child_process.execSync`)*
     1. `npm run build` exits with code 0.
     2. Output contains no TypeScript errors.
     3. `dist/` directory is created.
     4. `dist/index.html` is generated.
     5. `dist/assets/` directory is populated with JS/CSS files.

## Instructions for Worker
1. Ensure you DO NOT CHEAT. All implementations must be genuine.
2. Implement the Playwright setup precisely as described above, including the fixes for WebKit and the concurrent build race condition.
3. Write the 15 test cases in the `e2e` directory.
4. Run `npx playwright test` to verify the tests compile and run (expected that tests might fail against the actual website, but test infra itself must not crash and the build test must only run once).
5. Document your commands and results in your handoff report.
