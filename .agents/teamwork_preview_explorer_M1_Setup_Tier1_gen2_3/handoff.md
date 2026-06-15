# M1 Setup Tier 1 Analysis & Fix Strategy

**Summary**: The previous test implementation failed due to missing browser dependencies (`webkit`) and parallel execution race conditions during the build test. The strategy below uses native Playwright configuration features to resolve both issues safely, with no extra browser downloads required.

## 1. Observation
- `playwright.config.ts` currently defines a `Mobile` project using `...devices['iPhone 12']`. The default browser for this device profile is `webkit`.
- The test runner crashed because only `chromium` was installed natively in the environment.
- `e2e/build.spec.ts` executes `execSync('npm run build')` within a `test.beforeAll` hook.
- Because Playwright runs test files in parallel across projects (Mobile and Desktop), `build.spec.ts` was executed twice simultaneously, causing Vite to thrash the `dist/` directory.

## 2. Logic Chain
1. **Resolving `webkit` dependency**: To avoid downloading heavy `webkit` binaries while keeping the exact iPhone 12 viewport, we can override the browser in the Playwright config. By appending `browserName: 'chromium'` directly inside the `Mobile` project's `use` block, Playwright will emulate the iPhone 12 viewport using the installed Chromium engine.
2. **Resolving Concurrent Build Race Condition**: To ensure `build.spec.ts` only runs exactly once globally, we can exclude it from the `Mobile` project. Adding `testIgnore: '**/build.spec.ts'` to the `Mobile` project definition in `playwright.config.ts` natively prevents Playwright from scheduling it twice. The `Desktop` project will exclusively run the build test, securely avoiding the race condition.
3. **Tier 1 Coverage**: The existing files `responsive.spec.ts` (5 tests), `clickability.spec.ts` (5 tests), and `build.spec.ts` (5 tests) already contain the required number of tests for Tier 1 compliance.

## 3. Caveats
- Using Chromium to emulate an iPhone 12 is sufficient for layout (viewport) and clickability tests (Tier 1), but won't catch Safari-specific rendering bugs. Given the constraints and the explicit option to use Chromium, this is an acceptable tradeoff for efficiency.

## 4. Conclusion & Implementation Strategy
The worker agent should execute the following modifications:

**A. Dependency Installation**:
Run `npm install -D @playwright/test` and `npx playwright install --with-deps chromium`.

**B. Configuration Updates (`playwright.config.ts`)**:
Update the projects array to override the mobile browser and ignore the build test in the Mobile project:
```typescript
  projects: [
    {
      name: 'Mobile',
      testIgnore: '**/build.spec.ts', // Prevents concurrent build race condition
      use: {
        ...devices['iPhone 12'],
        browserName: 'chromium', // Fixes webkit crash
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: 'Desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1080, height: 1920 },
      },
    },
  ],
```

**C. Test Suite**:
Retain the 5 tests in `e2e/responsive.spec.ts`, `e2e/clickability.spec.ts`, and `e2e/build.spec.ts` as they are currently written, since the configuration change completely mitigates the parallel execution issues.

## 5. Verification Method
- **Command**: Run `npx playwright test`.
- **Expected Outcome**:
  1. No "browser missing" errors for webkit.
  2. The `build.spec.ts` suite runs exactly once (under the Desktop project) without Vite thrashing errors.
  3. A total of ~15 tests pass successfully.
