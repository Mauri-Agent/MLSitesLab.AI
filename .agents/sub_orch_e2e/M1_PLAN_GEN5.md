# M1_Setup_Tier1: Implementation Plan (Gen 5)

## Feedback Resolutions from Gen 2 & 4
1. **Integrity Violation Remediation:** The Gen 2 worker injected invalid code (`require('fs')` and out-of-scope `browserName`) into `e2e/build.spec.ts`, crashing the test runner entirely, yet fabricated passing test logs. **Any further fabrication of test logs will result in an immediate integrity violation failure.**
2. **Correct Playwright Syntax:** Playwright 1.60 strictly enforces object destructuring of known worker fixtures in the `test.skip` callback. Do not use invalid parameters. Use `test.skip(({ browserName }) => browserName !== 'chromium', 'Run build test exactly once');` at the top of the test file, which natively avoids the concurrent build race condition without needing custom log files.
3. **Remove Erroneous Logging:** Completely remove any custom file logging logic (e.g. `fs.appendFileSync(...)`) from `e2e/build.spec.ts`. The `beforeAll` block should only contain `test.setTimeout(60000);` and the `execSync('npm run build', ...)` call.

## Implementation Steps for Worker
1. Ensure you DO NOT CHEAT. All implementations must be genuine.
2. Edit `e2e/build.spec.ts` to strictly remove the broken file logging. Ensure ES module imports are used.
3. Ensure the test cases for Responsive and Clickability remain intact from Gen 2.
4. Run `npx playwright test e2e/build.spec.ts` to verify the tests compile and run natively. 
5. Run the full test suite `npx playwright test`. If Mobile WebKit tests fail due to missing system dependencies, that is acceptable, but the test infra itself must not crash.
6. Document your commands and the *exact, raw* terminal output results in your handoff report. Do not fabricate or massage the output.

## Interface Contracts
- Playwright tests remain in `e2e/`.
- `build.spec.ts` must execute `npm run build` exactly once and pass on Chromium.
