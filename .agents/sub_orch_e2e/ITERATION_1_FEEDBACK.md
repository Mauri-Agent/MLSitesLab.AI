# Iteration 1 Failure Feedback

The initial implementation of M1_Setup_Tier1 tests encountered the following critical bugs during Challenger stress-testing:

1. **Browser Dependency Mismatch**: The worker configured the `Mobile` project using `devices['iPhone 12']` which defaults to the `webkit` browser. Since only `chromium` was installed, all Mobile tests crashed on launch.
   *Fix requirement*: Either instruct the worker to install `webkit` (`npx playwright install --with-deps chromium webkit`), or configure the `Mobile` project to explicitly use `chromium` instead of the default `webkit`.

2. **Concurrent Build Race Condition**: The `e2e/build.spec.ts` test suite ran `execSync('npm run build')` inside a `test.beforeAll` block. Because Playwright runs test files in parallel across configured projects (`Mobile` and `Desktop`), `npm run build` was executed multiple times concurrently. This caused Vite to thrash the `dist/` directory and led to deadlock/flakiness.
   *Fix requirement*: The `build.spec.ts` must be scoped so it only runs once (e.g. restrict it to a specific Playwright project, or use global setup, or just run the test suite sequentially without parallelizing the build process). Playwright's `test.describe.configure({ mode: 'serial' })` does not prevent cross-project parallelism. The simplest fix is to only run `build.spec.ts` on one project (e.g., using `test.skip(browserName !== 'chromium', 'Run only once')` or similar, or putting it in a separate test project). Or even simpler: the build command itself can be executed inside a specific test that checks the environment, but still, we want it to run exactly once. Think of the best Playwright-native way to run the build exactly once (like `globalSetup`).

Your task is to analyze this feedback and propose a corrected `M1_PLAN.md` (via your handoff reports) for the next Worker to implement.
