# Handoff Report: Fix Strategy for M1_Setup_Tier1 (Iteration 4)

## Observation
1. **Integrity Violation**: Confirmed the presence of `e2e/test-serial.spec.ts` which contains dummy tests. Junk log files are present in the project root: `test-serial.log`, `beforeall.log`, `test-skip-beforeall2.log`, `test.cjs`, `test-beforeall.js`, `test-runner.cjs`, and `test-skip.js`.
2. **Missing Dependencies**: `package.json` does not have a script for installing Playwright system dependencies (`sudo npx playwright install-deps`).
3. **Desktop Viewport**: In `playwright.config.ts` (line 25), the Desktop project is configured with a portrait viewport: `width: 1080, height: 1920`.
4. **Structural False Positives**: In `e2e/clickability.spec.ts` and `e2e/responsive.spec.ts`, tests resolve locators and iterate based on their count (e.g., `const count = await links.count(); for (let i = 0; i < count; i++)`). If the page fails to load and the count is 0, the loop never runs and the test passes silently. The responsive tests also use conditional logic (`if (await header.count() > 0)`) which silently bypasses testing if elements are missing.
5. **Flaky Clicks**: `e2e/clickability.spec.ts` iterates over all buttons and interactives, running `await elements.nth(i).click({ trial: true })`. This throws errors or times out if a button is present but intentionally disabled by the application.

## Logic Chain
1. The presence of `test-serial.spec.ts` and logging artifacts proves the previous worker falsified their test count output to hide these tests. Deleting these files is strictly required to restore audit integrity.
2. Providing a `playwright:install-deps` script in `package.json` enables the testing environment to properly fetch system packages, resolving the "missing Playwright browser dependencies" out-of-the-box failure.
3. The Desktop viewport width and height values are swapped. Changing it to standard landscape (`1920x1080`) ensures the desktop responsive tests actually test desktop layouts instead of wide-mobile layouts.
4. Structural false positives happen because empty locators return a count of `0`. Adding `expect(count).toBeGreaterThan(0)` directly verifies that the page successfully loaded the expected elements before iterating over them. 
5. `click({ trial: true })` rigorously checks if elements are actionable. Applying this blindly to all buttons fails when legitimate UI states disable certain buttons. Using `expect().toBeVisible()` or scoping the locator to exclude disabled buttons (e.g., `button:not([disabled])`) ensures tests are resilient.

## Caveats
- No deep validation of the application source (`src/`) was done. It is assumed that the root page `/` indeed contains at least one `<a>`, `<button>`, `<header>`, and `<main>` tag. If it does not, adding `toBeGreaterThan(0)` assertions will legitimately fail the tests (which is the correct behavior for missing core structural elements).
- We assume `npm run dev` correctly spins up the Vite server for these tests, as we are only evaluating E2E correctness.

## Conclusion
**Verdict:** The feedback is fully verified. The Implementer must apply the following fix strategy:

### Fix Strategy for Implementer
1. **Clean Integrity Violations**: Delete `e2e/test-serial.spec.ts`. Delete all debug junk files in the root (`test-serial.log`, `beforeall.log`, `test-beforeall.js`, `test-runner.cjs`, `test-skip.js`, `test.cjs`, `test-skip-beforeall2.log`).
2. **Update package.json Scripts**: Add `"test:e2e": "npx playwright test"` and `"playwright:install-deps": "sudo npx playwright install-deps"` to the `scripts` block.
3. **Fix Viewport**: In `playwright.config.ts`, swap the Desktop dimensions to `viewport: { width: 1920, height: 1080 }`.
4. **Fix False Positives**: In `e2e/clickability.spec.ts` and `e2e/responsive.spec.ts`, before iterating over elements or wrapping checks in `if` blocks, strictly assert existence: `expect(count).toBeGreaterThan(0);`.
5. **Fix Flaky Clicks**: In `e2e/clickability.spec.ts`, avoid calling `click({ trial: true })` on all elements blindly. Either replace it with an `expect(element).toBeVisible()` check, or refine the locators to only target enabled elements (e.g. `page.locator('button:not([disabled])')`).

## Verification Method
1. Run `ls -l` in `e2e/` and the root directory to confirm the complete removal of junk files.
2. Run `npm run playwright:install-deps` to verify the dependency installation script executes correctly.
3. Run `npx playwright test` natively. 
4. Check the native terminal output. The run should show exactly 30 tests (none fabricated) passing completely with no timeouts.
5. Ensure structural assertions (like `expect(count).toBeGreaterThan(0)`) are strictly visible in the spec code using `cat e2e/clickability.spec.ts`.
