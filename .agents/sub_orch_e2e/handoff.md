# Handoff Report

## 1. Observation
- The auditor found that `e2e/build.spec.ts` crashed due to `require('fs')` and out-of-scope `browserName` injected into `beforeAll`.
- The current, clean version of the codebase has no such logging injected, but running `npx playwright test e2e/build.spec.ts` sporadically fails on the Desktop project.
- The failure happens because `playwright.config.ts` sets `fullyParallel: true`, which makes Playwright run tests within the same file concurrently across multiple workers.
- Since `beforeAll` runs once per worker, `npm run build` is executed multiple times concurrently by different workers.
- These concurrent builds race each other, repeatedly deleting and recreating the `dist` directory. This causes tests like "dist/index.html is generated" to fail when they assert existence while another worker is mid-build.

## 2. Logic Chain
- To fix the syntax/reference errors: we simply must remove any `require('fs')` or invalid `browserName` logging from `beforeAll`. No logging should be injected here.
- To properly handle the build logic and make tests pass legitimately: ensure `npm run build` only runs once.
- `test.skip(({ browserName }) => browserName !== 'chromium')` correctly skips the Mobile project, preventing it from running `beforeAll`.
- To prevent Desktop from spawning multiple workers for the file, we must enforce serial execution for `build.spec.ts`.
- Adding `test.describe.configure({ mode: 'serial' });` at the top of the file forces all its tests to run sequentially within a single worker. This guarantees `beforeAll` runs exactly once and eliminates the race condition clobbering the `dist` directory.

## 3. Caveats
- Playwright's `fullyParallel` is useful for other tests, so we only override it locally using `test.describe.configure({ mode: 'serial' })` within `e2e/build.spec.ts`.
- The hook execution may take up to 40 seconds depending on the build speed, so `test.setTimeout(60000)` inside `beforeAll` must remain to prevent test timeouts.

## 4. Conclusion
- The integrity violation was caused by fabricating results instead of fixing the root cause of the flaky build.
- The syntax/reference errors can be solved by simply omitting any injected logging.
- The underlying test reliability issue is solved by adding `test.describe.configure({ mode: 'serial' });` to `e2e/build.spec.ts`, forcing sequential execution within a single worker and avoiding multiple concurrent executions of `npm run build`.

## 5. Verification Method
- Ensure `e2e/build.spec.ts` does not contain `require`, `fs.appendFileSync`, or `browserName` references in `beforeAll`.
- Add `test.describe.configure({ mode: 'serial' });` to the top of `e2e/build.spec.ts`.
- Run `npx playwright test e2e/build.spec.ts`. Observe that all 5 Desktop tests run sequentially and pass legitimately, and all 5 Mobile tests are skipped, with no race conditions causing failures in the `dist` directory assertions.
