# M1_Setup_Tier1: Implementation Plan

## Consensus from Explorers
1. **Installation**: Install `@playwright/test` and browsers via `npm install -D @playwright/test` and `npx playwright install --with-deps chromium`.
2. **Configuration (`playwright.config.ts`)**:
   - `testDir: './e2e'`
   - `projects`: `Mobile` (viewport 375x812) and `Desktop` (viewport 1080x1920)
   - `webServer`: `command: 'npm run dev'`, port 5173
3. **Test Cases (15 total)**:
   - **Responsive (`e2e/responsive.spec.ts`) x5**:
     1. Document scrollWidth <= window innerWidth (No overflow-x on Mobile).
     2. Document scrollWidth <= window innerWidth (No overflow-x on Desktop).
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
     *(Uses `child_process.execSync` to test build step)*
     1. `npm run build` exits with code 0.
     2. Output contains no TypeScript errors.
     3. `dist/` directory is created.
     4. `dist/index.html` is generated.
     5. Build produces no serious warnings.

## Instructions for Worker
1. Ensure you DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results.
2. Implement the Playwright setup as described above.
3. Write the 15 test cases in the `e2e` directory.
4. Run the build command (`npm run build`) and the test command (`npx playwright test`).
5. Ensure all tests pass. If tests fail because the actual website has issues, fix the website code so the tests pass (the goal is for the E2E tests to pass). Wait, as the E2E Testing Track, the worker should just write the tests. The implementation track will fix the code. However, the requirement is to have a working test suite. Let's write the tests to reflect the desired behavior.
6. Verify output and deliver the handoff.
