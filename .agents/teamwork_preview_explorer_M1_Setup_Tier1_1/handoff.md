# Handoff: M1_Setup_Tier1 Analysis & Strategy

## Observation
- **Project Structure**: Vite + React project using TypeScript (`package.json`, `vite.config.ts`, `tsconfig.json`).
- **Dependencies**: Currently missing `@playwright/test` in `devDependencies`.
- **Scripts**: `npm run dev` starts Vite server, `npm run build` compiles TS and builds with Vite.
- **Requirements**:
  - `TEST_INFRA.md` requires Playwright tests in `e2e/`, Mobile (375px) & Desktop (1080px) resolutions.
  - `ORIGINAL_REQUEST.md` mandates checking for horizontal overflow (overflow-x), verifying clickability without blocking elements, and ensuring `npm run build` succeeds without TS errors.
  - `SCOPE.md` defines Tier 1 tests: Responsive Layout (5), Clickability (5), Build Reliability (5).

## Logic Chain
1. **Playwright Installation**: Since this is an opaque-box E2E setup, `@playwright/test` needs to be installed as a dev dependency alongside its browser binaries.
2. **Playwright Configuration**: The `playwright.config.ts` must define the test directory (`./e2e`), set up a local development web server (Vite on port 5173), and configure the two requested viewports using Playwright's `projects` array.
3. **Test Design Strategy**:
   - *Responsive Layout*: Needs to address the core requirement of no horizontal overflow, plus visual adaptations for the two screen sizes.
   - *Clickability*: Needs to address the requirement that interactive elements (buttons, links) are actually clickable and not covered by other elements.
   - *Build Reliability*: Needs to verify `npm run build` succeeds (TS + Vite build) and that the resulting application loads without console/network errors.

## Test Design Strategy

### 1. Installation Strategy
- Run `npm install -D @playwright/test`
- Run `npx playwright install --with-deps chromium` (or all browsers, but Chromium is sufficient for initial layout/click tests).

### 2. `playwright.config.ts` Configuration
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Mobile',
      use: { viewport: { width: 375, height: 667 } },
    },
    {
      name: 'Desktop',
      use: { viewport: { width: 1080, height: 1080 } }, // Or 1920 height
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
```

### 3. Tier 1 Tests Design (x15 tests total)

**A. Responsive Layout (`e2e/responsive.spec.ts`) - x5 tests**
1. **Global Horizontal Overflow**: Assert that `document.documentElement.scrollWidth` does not exceed `window.innerWidth`.
2. **Viewport Meta Tag**: Verify the presence of `<meta name="viewport" content="width=device-width, initial-scale=1">`.
3. **Navigation Adaptation**: Verify header navigation adapts correctly (e.g., hamburger menu visible on mobile, hidden on desktop).
4. **Grid/Flex Stacking**: Verify that portfolio/services grid elements stack vertically on Mobile and display side-by-side on Desktop.
5. **Text Container Bounds**: Check that key text elements (Hero text, About text) do not overflow their parent containers bounds.

**B. Clickability (`e2e/clickability.spec.ts`) - x5 tests**
1. **Unblocked Buttons**: Verify main CTA buttons are not covered by overlays and trigger the expected action/scroll.
2. **Navigation Links**: Verify all header navigation links are functional and clickable.
3. **External Security**: Verify external links (e.g., social media) contain `rel="noopener"` and open in a new tab (`target="_blank"`).
4. **Interactive Cards**: Verify portfolio/project cards are clickable and their hover states do not cause layout shifts that block clicks.
5. **Form/Contact Elements**: Verify that contact form inputs or mailto links are accessible and clickable.

**C. Build Reliability (`e2e/build.spec.ts`) - x5 tests**
*Note: Some of these use Node's `child_process` within the Playwright test.*
1. **Compilation Success**: Execute `npm run build` programmatically and assert the exit code is `0` (No TS errors).
2. **Artifact Generation**: Verify the `dist/` directory and `dist/index.html` are created after the build.
3. **No Browser Console Errors**: Load the app and assert no `pageerror` or `console` errors (error level) are emitted.
4. **Network Asset Loading**: Assert all page assets (JS, CSS, images) load with `200` status codes (no 404s).
5. **Production Build Server**: Run `npm run preview`, navigate to `http://localhost:4173`, and verify the production bundle renders the Hero section correctly.

## Caveats
- The build reliability tests that execute shell commands (`npm run build`) within a Playwright test file might take longer and could be separated into a distinct testing phase (e.g., CI script), but placing them in Playwright fulfills the E2E requirement structurally.
- The desktop viewport height was arbitrarily chosen as 1080 to match standard desktop dimensions, as only the width (1080px) was specified.

## Conclusion
The project is a standard Vite + React setup. Implementing the proposed Playwright strategy will satisfy M1_Setup_Tier1 requirements by covering Mobile/Desktop layout checks, interaction validation, and build/runtime error detection.

## Verification Method
- **Implementation Validation**: The implementer will create the config and `e2e/*.spec.ts` files based on this strategy.
- **Execution**: Run `npx playwright test`. All 15 tests should execute.
- **Build**: Ensure the tests verify `npm run build` output and test execution against both `npm run dev` and `npm run preview`.
