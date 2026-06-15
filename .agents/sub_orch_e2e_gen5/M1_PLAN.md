# Milestone 1: Tier 1 Feature Coverage Implementation Plan

## Objective
Implement exactly 5 distinct, robust test cases for each of the 8 features listed in `TEST_INFRA.md`. This will give a total of 40 test cases for Tier 1.

## Target Config
The E2E tests should run across both Desktop (1080px wide) and Mobile (375px wide) using `playwright-e2e.config.ts`.
We must ensure `playwright-e2e.config.ts` has two projects defined:
1. `Desktop`: width 1080px, height 900px
2. `Mobile`: width 375px, height 667px

## Feature Checklist & Test Cases to Implement

### Feature 1: Responsive Layout (in `e2e/responsive.spec.ts`)
1. **Document-Level No-Overflow (Mobile 375px)**: Asserts `scrollWidth <= clientWidth` on mobile viewport.
2. **Document-Level No-Overflow (Desktop 1080px)**: Asserts `scrollWidth <= clientWidth` on desktop viewport.
3. **Viewport Meta Tag Check**: Checks `meta[name="viewport"]` contains `width=device-width` and `initial-scale=1`.
4. **Header/Navbar Boundary Check (Mobile)**: Bounding box of navigation/navbar fits in 375px.
5. **Interactive Funnel Boundary Check (Mobile)**: Bounding box of `.interactive-funnel` fits in 375px.

### Feature 2: Clickability (in `e2e/clickability.spec.ts`)
1. **All Anchor (`a`) Links Actionability**: Calls `.click({ trial: true })` on all visible `<a>` elements.
2. **All Button (`button`) elements Actionability**: Calls `.click({ trial: true })` on all visible `<button>` elements.
3. **Mobile Hamburger Menu Toggle clickability**: Clicking `#hamburger-btn` on mobile makes `.mobile-menu` visible or updates class.
4. **Interactive Funnel Service/Node Cards Actionability**: Checks clickability of role="button" elements.
5. **Hero Primary CTA Actionability**: Checks clickability of `#hero-cta-primary`.

### Feature 3: Build Reliability (in `e2e/build.spec.ts`)
*Must execute `npm run build` exactly once using `test.skip(({ browserName }) => browserName !== 'chromium')` at suite/test level to avoid race conditions. Use ES module imports, remove any invalid `fs.appendFileSync` logging in hooks.*
1. `npm run build` exits with code 0.
2. Output contains no TypeScript errors.
3. `dist/` directory is created.
4. `dist/index.html` is generated.
5. `dist/assets/` is populated with `.js` and `.css` files.

### Feature 4: Chat Greetings (in `e2e/chat.spec.ts`)
1. **Verify Single Greeting Welcome Bubble**: Asserts exactly 1 assistant message `.terminal-message.assistant` upon page load.
2. **Ensure System Prompt is Excluded from UI**: Verifies no bubble contains internal instructions/systemPrompt content.
3. **Validate Greeting Content Persona**: Checks text contents for brand-specific keywords like "AI_AUDITOR", "escaneo", etc.
4. **Initial Typing Indicator Lifecycle**: Verifies typing indicator is visible first and disappears after greeting completes.
5. **No Greeting Stacking**: Focusing or clicking inside `.terminal-input` does not trigger additional greeting messages.

### Feature 5: Scroll Functionality (in `e2e/scroll.spec.ts`)
1. **HTML Element Scroll Clearance**: Computes `overflowY` style of html, asserts it is not `hidden`.
2. **Body Element Scroll Clearance**: Computes `overflowY` style of body, asserts it is not `hidden`.
3. **Execution of Scroll Offsets**: Programmatically scrolls window by 500px and asserts `window.scrollY` moves.
4. **Scroll Indicator Integration**: Clicks `#hero-scroll-btn` (or equivalent down-arrow indicator) and verifies scroll position moves.
5. **Body Style Restored**: Opening and closing mobile hamburger menu restores body style `overflow` to empty `""` or `visible`.

### Feature 6: Chat Auto-Scroll (in `e2e/chat.spec.ts`)
1. **Initial scroll at bottom**: Asserts terminal body scroll offset is at bottom upon load.
2. **Auto-Scroll on Message Dispatch**: Submitting a user message scrolls terminal body to bottom.
3. **Auto-Scroll on Response Reception**: Receiving assistant message scrolls terminal body to bottom.
4. **No Scroll During Keyboard Typing**: Typing text into input box when scrolled up does NOT force scroll position to jump back to bottom.
5. **Manual Scroll Position Retained on Focus**: Focusing the terminal input does not force scroll back down if scrolled up.

### Feature 7: 3D Loader (in `e2e/loader.spec.ts`)
1. **WebGL Canvas Visibility on Load**: Loader container and `<canvas>` are visible initially.
2. **WebGL Context Initialization**: Evaluates that canvas.getContext('webgl') or getContext('webgl2') is not null.
3. **App Container Hidden during Load**: Main app layout is hidden when loader is active.
4. **Loader Lifecycle Complete**: Wait for loader transition time (e.g. 3.5s) and verify loader container/canvas is unmounted.
5. **App Container Mounted & Visible Post-Load**: Main app container is visible after loader finishes.

### Feature 8: Layout Order (in `e2e/layout.spec.ts`)
1. **DOM Tree Precedence**: The Hero (`#inicio`) container is structured above `.interactive-funnel` in DOM.
2. **Vertical Coordinates Comparison**: `heroBoundingBox.y < funnelBoundingBox.y` on page load.
3. **Hero in Initial Viewport**: Hero is visible immediately without scrolling.
4. **InteractiveFunnel Positioned Below the fold**: InteractiveFunnel `y` is below the Hero (or immediately after it).
5. **Layout Divider Separation**: Standard divider sits between the two layout blocks.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. Do not hardcode test results, create dummy/facade implementations, or circumvent the intended task. The tests must run against a real dev server or build and execute assertion logic dynamically.
