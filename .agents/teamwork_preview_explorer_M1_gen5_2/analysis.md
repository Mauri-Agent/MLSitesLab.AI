# Analysis and Test Strategy Report: Tier 1 Feature Coverage

## 1. Executive Summary

This analysis report provides a comprehensive strategy and design to achieve Tier 1 Feature Coverage (at least 5 distinct test cases per feature) for MLSitesLab.AI, covering all 8 features. Additionally, it identifies critical bugs and architectural issues in the codebase and proposes precise remediation strategies.

The codebase is built on **Vite + React (TypeScript)**. We have analyzed the core components:
- `src/App.tsx` (Layout management, Loader logic)
- `src/components/Loader.tsx` (Initial screen animation)
- `src/components/InteractiveFunnel.tsx` (AI Terminal & Node Graph parent)
- `src/components/CommandTerminal.tsx` (User/AI console)
- `src/components/Hero.tsx` (Welcome component)
- Styling sheets (`src/index.css`, `src/styles/App.css`, `src/styles/InteractiveFunnel.css`)

---

## 2. Feature-by-Feature Strategy & Test Cases

---

### Feature 1: Responsive Layout (No overflow-x on mobile 375px and desktop 1080px)

* **Requirements & Context:** Ensure that no elements exceed the horizontal limits of the viewport on either Mobile (375px) or Desktop (1080px).
* **Code References:** Media queries in `src/styles/App.css` (lines 675-757) and reset properties in `src/index.css` (lines 60-73).
* **Remediation Note:** If elements like `.services-grid` or `.hero-title` exceed the screen bounds at 375px, flex/grid wrap rules or font clamps (`clamp()`) must be updated.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 1.1: Global Document Width Bounding**
   - **Objective:** Verify `document.documentElement` scrollWidth is equal to clientWidth.
   - **Selector:** `page` (global context)
   - **Action:** Evaluate `document.documentElement.scrollWidth` and `document.documentElement.clientWidth` in browser context.
   - **Assertion:** `expect(scrollWidth).toBeLessThanOrEqual(clientWidth)`

2. **Test Case 1.2: Navigation Header Containment**
   - **Objective:** Ensure the navigation bar wrapper `.navbar-inner` fits within the viewport.
   - **Selector:** `.navbar-inner`
   - **Action:** Measure the bounding box of `.navbar-inner`.
   - **Assertion:** `expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 1)` (allows 1px browser layout rounding margin).

3. **Test Case 1.3: Interactive Funnel Section Boundary**
   - **Objective:** Verify the main container for the chatbot funnel does not overflow the viewport bounds.
   - **Selector:** `.interactive-funnel`
   - **Action:** Retrieve the bounding box of `.interactive-funnel`.
   - **Assertion:** `expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 1)`

4. **Test Case 1.4: Service Cards Grid Wrapping**
   - **Objective:** Ensure the services grid `.services-grid` wraps correctly on mobile without extending past screen edges.
   - **Selector:** `.services-grid`
   - **Action:** Retrieve the bounding box of `.services-grid`.
   - **Assertion:** `expect(gridBox.x + gridBox.width).toBeLessThanOrEqual(viewportWidth + 1)`

5. **Test Case 1.5: Meta Viewport Tag Presence**
   - **Objective:** Verify that the HTML contains the correct responsive configuration.
   - **Selector:** `meta[name="viewport"]`
   - **Action:** Query the DOM for viewport configuration.
   - **Assertion:** `await expect(viewportMeta).toHaveAttribute('content', /width=device-width/)`

---

### Feature 2: Clickability (All links/buttons are clickable and not blocked)

* **Requirements & Context:** All links, buttons, and custom triggers in the DOM must be clickable and not blocked by overlays, hidden containers, or the custom cursor.
* **Code References:** Custom cursor in `src/components/Cursor.tsx` (rendering `.cursor-dot` and `.cursor-ring`), and buttons (`.btn`, `.nav-link`, `.hamburger`) in styles.
* **Remediation Note:** The custom cursor must have `pointer-events: none` in CSS to prevent blocking click events on elements underneath.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 2.1: Custom Cursor Non-Blocking Property**
   - **Objective:** Confirm that the custom cursor does not block pointer interaction.
   - **Selector:** `.cursor-dot`, `.cursor-ring`
   - **Action:** Evaluate the computed style `pointer-events` of both elements.
   - **Assertion:** `expect(computedStyle.pointerEvents).toBe('none')`

2. **Test Case 2.2: Global Anchors Clickability**
   - **Objective:** Ensure all visible `<a>` elements on the page are actionable.
   - **Selector:** `a:visible`
   - **Action:** Loop through all visible anchor tags and execute `click({ trial: true })` (which checks if standard click would be intercepted).
   - **Assertion:** Trial click succeeds for all items.

3. **Test Case 2.3: Global Buttons Actionability**
   - **Objective:** Verify all visible `<button>` elements are clickable.
   - **Selector:** `button:visible`
   - **Action:** Loop through visible buttons and execute `click({ trial: true })`.
   - **Assertion:** Trial click completes without interception errors.

4. **Test Case 2.4: Mobile Hamburger Menu Actionability**
   - **Objective:** On mobile viewport, verify the menu button is clickable and opens the mobile navbar menu.
   - **Selector:** `.hamburger`, `.mobile-menu`
   - **Action:** Click `.hamburger`, check `.mobile-menu` visibility, then test clickability on a menu item `.mobile-menu .nav-link`.
   - **Assertion:** Mobile menu displays, and menu link trial click succeeds.

5. **Test Case 2.5: Interactive Funnel Terminal Input Actionability**
   - **Objective:** Ensure the terminal text input is ready and focusable.
   - **Selector:** `.terminal-input`
   - **Action:** Click and focus `.terminal-input`.
   - **Assertion:** Input box accepts keyboard typing, is not disabled or blocked.

---

### Feature 3: Build Reliability (Build compiles with no TS errors/warnings)

* **Requirements & Context:** The project build must execute successfully without type-check failures, syntax errors, or major Vite compiler warnings.
* **Code References:** `package.json` script `"build": "tsc && vite build"`.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 3.1: Build Command Exit Code**
   - **Objective:** Verify running `npm run build` exits with code 0.
   - **Action:** Run `npm run build` via child process execution inside a serial test run block.
   - **Assertion:** `expect(buildStatus).toBe(0)`

2. **Test Case 3.2: Clean TS Compiler Output**
   - **Objective:** Confirm the compilation log contains no type-checking errors.
   - **Action:** Parse build stdout and stderr.
   - **Assertion:** `expect(buildOutput).not.toMatch(/error TS\d+/)`

3. **Test Case 3.3: Production Dist Directory Structure**
   - **Objective:** Verify that compilation creates the production folder.
   - **Action:** Check filesystem structure for `dist` directory.
   - **Assertion:** `expect(fs.statSync('dist').isDirectory()).toBe(true)`

4. **Test Case 3.4: Production Entry File Integrity**
   - **Objective:** Verify `index.html` is generated within `dist/`.
   - **Action:** Check filesystem for `dist/index.html`.
   - **Assertion:** `expect(fs.statSync('dist/index.html').isFile()).toBe(true)`

5. **Test Case 3.5: Bundled Asset Generation**
   - **Objective:** Confirm that Vite successfully generated compiled CSS/JS code.
   - **Action:** Scan files inside `dist/assets`.
   - **Assertion:** Assert at least one `.js` and one `.css` file exist and have non-zero size.

---

### Feature 4: Chat Greetings (Chat initializes with a single message, no double greeting)

* **Requirements & Context:** The chat terminal must display exactly one welcoming message from the AI on startup. Double greetings caused by React's StrictMode double-rendering side-effects must be avoided.
* **Code References:** Initial message state and initial fetch invocation in `src/components/InteractiveFunnel.tsx` (lines 36-47).
* **Remediation Note:** Use a ref or status tracker (`hasInitializedRef = useRef(false)`) inside the initial trigger `useEffect` to ensure `fetchAIResponse` is invoked exactly once, even if the component mounts multiple times.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 4.1: Welcome Message Singularity**
   - **Objective:** Verify that exactly one greeting is shown in the terminal.
   - **Selector:** `.terminal-message.assistant`
   - **Action:** Load page, wait for loader to fade, then locate assistant terminal messages.
   - **Assertion:** `await expect(page.locator('.terminal-message.assistant')).toHaveCount(1)`

2. **Test Case 4.2: Welcome Message Content Validity**
   - **Objective:** Ensure the greeting contains genuine guidance text.
   - **Selector:** `.terminal-message.assistant .terminal-content`
   - **Action:** Extract the text value.
   - **Assertion:** `expect(text.length).toBeGreaterThan(15)`

3. **Test Case 4.3: Greeting Sender Label Verification**
   - **Objective:** Ensure the prompt labels the sender as the AI system.
   - **Selector:** `.terminal-message.assistant .terminal-prompt`
   - **Action:** Read the prefix of the greeting message.
   - **Assertion:** `await expect(element).toHaveText('AI_SYSTEM> ')`

4. **Test Case 4.4: Prevention of Greeting Duplication on Activity**
   - **Objective:** Ensure interaction or re-renders do not spawn duplicate greetings.
   - **Selector:** `.terminal-message.assistant`
   - **Action:** Type into input and check the count of greeting nodes.
   - **Assertion:** Message count stays exactly 1.

5. **Test Case 4.5: System Settings Exclusivity**
   - **Objective:** Verify that the system context prompt details are never directly printed to the user.
   - **Selector:** `.terminal-message`
   - **Action:** Inspect the text of all messages.
   - **Assertion:** Ensure no message content includes system-level instructions like `systemPrompt` text.

---

### Feature 5: Scroll Functionality (Body/html does not have style or classes blocking scroll)

* **Requirements & Context:** The user must be able to scroll the page normally. The styles must not lock scroll via properties like `overflow: hidden` on HTML or body.
* **Code References:** `src/index.css` (lines 60-73).
* **Remediation Note:** Ensure that neither `html` nor `body` maintains styling (e.g. `overflow: hidden`, `height: 100vh`) that blocks vertical scroll interaction, especially after the loading screen fades.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 5.1: HTML Node Overflow Style Check**
   - **Objective:** Confirm `html` does not lock overflow.
   - **Selector:** `html`
   - **Action:** Read computed styling for `overflow` and `overflow-y`.
   - **Assertion:** `expect(computedStyle.overflowY).not.toBe('hidden')`

2. **Test Case 5.2: Body Node Overflow Style Check**
   - **Objective:** Confirm `body` does not lock overflow.
   - **Selector:** `body`
   - **Action:** Read computed styling for `overflow` and `overflow-y`.
   - **Assertion:** `expect(computedStyle.overflowY).not.toBe('hidden')`

3. **Test Case 5.3: Document Scroll Height Verification**
   - **Objective:** Verify document contents exceed window height, creating natural scrolling space.
   - **Action:** Compare `document.documentElement.scrollHeight` with `window.innerHeight`.
   - **Assertion:** `expect(scrollHeight).toBeGreaterThan(windowHeight)`

4. **Test Case 5.4: Interactive Scroll Offset Validation**
   - **Objective:** Confirm scroll offset changes programmatically.
   - **Action:** Run `window.scrollTo(0, 300)` and inspect `window.scrollY`.
   - **Assertion:** `expect(scrollY).toBe(300)`

5. **Test Case 5.5: Scroll Locking Classes Cleanliness**
   - **Objective:** Confirm the body element is free of styling class overrides that disable touch/mouse scroll.
   - **Selector:** `body`
   - **Action:** Read the class list of the body tag.
   - **Assertion:** Class list does not contain `.no-scroll` or `.lock-scroll`.

---

### Feature 6: Chat Auto-Scroll (Chat terminal scrolls to bottom on sending/receiving, not during typing)

* **Requirements & Context:** The terminal should scroll to the bottom upon sending a user command or receiving an assistant response, but NOT when the user is simply typing.
* **Code References:** `src/components/CommandTerminal.tsx` (lines 20-22).
* **Remediation Note:** The `useEffect` dependencies `[messages, isTyping]` cause a scroll-to-bottom every time `isTyping` changes (including when the AI transitions state). We must ensure that changes in the local typing input text (`input` state) do not invoke scrolling, and if the user has manually scrolled up to view terminal history, typing text doesn't jump the scrollbar back down.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 6.1: Initial Welcome Auto-Scroll**
   - **Objective:** Verify the terminal scrolls to the greeting message and prompt input area on load.
   - **Selector:** `.terminal-body`
   - **Action:** Retrieve `.terminal-body` dimensions.
   - **Assertion:** `expect(scrollTop + clientHeight).toBeCloseTo(scrollHeight, 5)`

2. **Test Case 6.2: Auto-Scroll on Command Submission**
   - **Objective:** Ensure sending a message scrolls the box immediately to the end of user input.
   - **Selector:** `.terminal-input`, `.terminal-body`
   - **Action:** Fill text into `.terminal-input`, press `Enter`, and query scroll values.
   - **Assertion:** Scroll position is updated to the bottom.

3. **Test Case 6.3: Auto-scroll on AI Reply Completion**
   - **Objective:** Verify scroll updates once the AI completes generating content.
   - **Selector:** `.terminal-body`
   - **Action:** Type command, submit, wait for `isTyping` state loader to vanish, check scroll.
   - **Assertion:** Scroll position matches the new bottom height.

4. **Test Case 6.4: Zero Scroll Jumps During Typing**
   - **Objective:** Ensure manual scroll position remains stable while user types into input.
   - **Selector:** `.terminal-input`, `.terminal-body`
   - **Action:** Populate terminal with history. Scroll up by 150px. Focus input and type characters.
   - **Assertion:** `scrollTop` value remains at the manual location (no scroll jumps occur).

5. **Test Case 6.5: Input Focus Position Retention**
   - **Objective:** Ensure focusing the input does not jump the scroll when viewing history.
   - **Selector:** `.terminal-input`, `.terminal-body`
   - **Action:** Scroll terminal up manually, trigger input `.focus()`.
   - **Assertion:** Scroll coordinates remain unchanged.

---

### Feature 7: 3D Loader (Main page displays WebGL Canvas loader, triggers onComplete)

* **Requirements & Context:** The SVG loader must be replaced by a WebGL/Canvas-based 3D neural network representation that triggers `onComplete` to mount the main app.
* **Code References:** `src/components/Loader.tsx` (SVG nodes/edges to be replaced by a canvas).
* **Remediation Note:** Replace SVG nodes inside `Loader.tsx` with a `<canvas>` element. Use standard WebGL or Three.js/React Three Fiber to construct the 3D network. Ensure `onComplete()` is called once the 3D render loads.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 7.1: Loader Canvas Element Mounting**
   - **Objective:** Verify that a `<canvas>` element exists within the loader screen during startup.
   - **Selector:** `canvas`
   - **Action:** Load page, verify visibility of `<canvas>`.
   - **Assertion:** `await expect(page.locator('canvas')).toBeVisible()`

2. **Test Case 7.2: WebGL Context Verification**
   - **Objective:** Confirm the canvas is rendering a 3D context.
   - **Selector:** `canvas`
   - **Action:** Execute page-level script checking if context is `webgl` or `webgl2`.
   - **Assertion:** `expect(isWebGL).toBe(true)`

3. **Test Case 7.3: Loader Dismissal and Timing**
   - **Objective:** Verify that the loader is unmounted and hidden after the completion sequence (e.g. ~3.2 seconds).
   - **Selector:** `.loader-container` (or loading display)
   - **Action:** Wait for loader element to disappear.
   - **Assertion:** `await expect(loader).toBeHidden({ timeout: 5000 })`

4. **Test Case 7.4: Content Transition Visibility**
   - **Objective:** Ensure the main application container is displayed once the loader completes.
   - **Selector:** `main.app-container`
   - **Action:** Wait for loader dismissal, then check visibility of `main.app-container`.
   - **Assertion:** `await expect(page.locator('main.app-container')).toBeVisible()`

5. **Test Case 7.5: onComplete Callback State Execution**
   - **Objective:** Verify the React state changes from loading to loaded.
   - **Action:** Inspect components or document layout states before and after the 3.2-second mark.
   - **Assertion:** Loader vanishes and App container displays.

---

### Feature 8: Layout Order (InteractiveFunnel is the Hero first, classical Hero is below it)

* **Requirements & Context:** The funnel component must act as the Hero section at the top of the main stack, while the classical Welcome Hero sits below it.
* **Code References:** `src/App.tsx` where components are currently rendered as:
  ```tsx
  <Hero />
  <div className="divider" />
  <InteractiveFunnel />
  ```
* **Remediation Note:** In `src/App.tsx`, reorder the components to place `<InteractiveFunnel />` above `<Hero />`.

#### Projections of exactly 5 Tier 1 Test Cases:

1. **Test Case 8.1: DOM Node Hierarchy Order**
   - **Objective:** Confirm that the `.interactive-funnel` element precedes the `.hero` in the page DOM hierarchy.
   - **Selector:** `main.app-container > *`
   - **Action:** Read child nodes of `main.app-container` and check order of classes.
   - **Assertion:** Index of `.interactive-funnel` element is less than index of `.hero` element.

2. **Test Case 8.2: Visual Placement Y-Coordinate Compare**
   - **Objective:** Ensure `.interactive-funnel` is visually rendered higher on the screen than `.hero`.
   - **Selector:** `.interactive-funnel`, `.hero`
   - **Action:** Query the visual bounding boxes of both elements.
   - **Assertion:** `expect(funnelBox.y).toBeLessThan(heroBox.y)`

3. **Test Case 8.3: Top-Fold Viewport Visibility**
   - **Objective:** Ensure `InteractiveFunnel` is immediately visible in the initial top fold of the page without scrolling.
   - **Selector:** `.interactive-funnel`
   - **Action:** Reset scroll position to top (0,0) and check element viewport visibility.
   - **Assertion:** `await expect(page.locator('.interactive-funnel')).toBeInViewport()`

4. **Test Case 8.4: Classical Hero Pushed Down**
   - **Objective:** Verify that the classical Hero starts below the InteractiveFunnel.
   - **Selector:** `.hero`, `.interactive-funnel`
   - **Action:** Verify top of Hero is at or below the bottom edge of the InteractiveFunnel.
   - **Assertion:** `expect(heroBox.y).toBeGreaterThanOrEqual(funnelBox.y + funnelBox.height)`

5. **Test Case 8.5: Visual Overlap Prevention**
   - **Objective:** Ensure elements stack properly without overlapping.
   - **Selector:** `.interactive-funnel`, `.hero`
   - **Action:** Inspect height and margins between sections.
   - **Assertion:** `expect(funnelBox.y + funnelBox.height).toBeLessThanOrEqual(heroBox.y + 2)` (allowing a 2px margin).

---

## 3. Bug/Issue Analysis & Remediation Strategy

1. **Feature 4: Double Greeting Bug**
   - **Cause:** In React 18, `useEffect` running twice during developmental mounting initiates two separate requests to `fetchAIResponse()`.
   - **Fix:** Add a mounting state tracker ref:
     ```tsx
     const hasFetched = useRef(false);
     useEffect(() => {
       if (hasFetched.current) return;
       if (messages.length === 1 && messages[0].role === 'system') {
         hasFetched.current = true;
         fetchAIResponse(messages);
       }
     }, []);
     ```

2. **Feature 5: Scroll Trabado (Scroll Locked)**
   - **Cause:** Potential layout locks in CSS resets or container rules (e.g. `overflow: hidden` on HTML/body or custom scroll modifiers).
   - **Fix:** Keep `overflow-x: hidden` to block horizontal scroll but ensure `overflow-y` is set to `auto` or is completely unconstrained on `html, body`. Ensure height constraints like `100vh` are only applied to the loader screen (`Loader.tsx`) or specific sub-components, never global containers.

3. **Feature 6: Terminal Auto-Scroll Jumps**
   - **Cause:** The current dependency array in `CommandTerminal.tsx` scrolls to bottom whenever the component re-renders on properties change, including isTyping updates, which shifts focus when the user is trying to read history.
   - **Fix:** Implement a ref to monitor messages count and scroll only if a new message was added, and bypass it if the user has manually scrolled up.
     ```tsx
     const prevLength = useRef(messages.length);
     useEffect(() => {
       if (messages.length > prevLength.current) {
         endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
         prevLength.current = messages.length;
       }
     }, [messages]);
     ```

4. **Feature 7: SVG to WebGL 3D Loader**
   - **Cause:** The current `Loader.tsx` rendering is purely a 2D SVG illustration.
   - **Fix:** Replace the SVG node in `src/components/Loader.tsx` with a canvas context. Add a library such as Three.js or standard Canvas 3D particle script mimicking a neural network. Ensure standard context initialization passes `webgl` tests.

5. **Feature 8: Main Layout Reordering**
   - **Cause:** Classical `Hero` precedes `<InteractiveFunnel />` in `src/App.tsx`.
   - **Fix:** Simply swap layout elements:
     ```tsx
     <main className="app-container">
       <Cursor />
       <Navbar />
       <InteractiveFunnel />
       <div className="divider" />
       <Hero />
       ...
     ```

---

## 4. Proposed E2E Playwright Implementation (Code Sketches)

Below are the test implementations for the new features to be added to the test suite (e.g. in a new spec file `e2e/tier1-coverage.spec.ts` or updated files):

```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Tier 1: Feature 4 - Chat Greetings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the loader to finish
    await page.waitForSelector('.interactive-funnel', { timeout: 10000 });
  });

  test('Welcome message is singular, has correct prompt and content', async ({ page }) => {
    const greetings = page.locator('.terminal-message.assistant');
    await expect(greetings).toHaveCount(1);

    const prompt = greetings.locator('.terminal-prompt');
    await expect(prompt).toHaveText('AI_SYSTEM> ');

    const content = await greetings.locator('.terminal-content').textContent();
    expect(content?.length).toBeGreaterThan(15);
  });
});

test.describe('Tier 1: Feature 5 - Scroll Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.interactive-funnel', { timeout: 10000 });
  });

  test('Page html/body allows scroll and has natural content height', async ({ page }) => {
    const overflowHtml = await page.evaluate(() => window.getComputedStyle(document.documentElement).overflowY);
    const overflowBody = await page.evaluate(() => window.getComputedStyle(document.body).overflowY);
    expect(overflowHtml).not.toBe('hidden');
    expect(overflowBody).not.toBe('hidden');

    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const windowHeight = await page.evaluate(() => window.innerHeight);
    expect(scrollHeight).toBeGreaterThan(windowHeight);

    await page.evaluate(() => window.scrollTo(0, 200));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(200);
  });
});

test.describe('Tier 1: Feature 6 - Chat Auto-Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.interactive-funnel', { timeout: 10000 });
  });

  test('Auto-scrolls on send/receive, but not during typing', async ({ page }) => {
    const terminalBody = page.locator('.terminal-body');
    
    // Fill terminal with scrollable content
    const input = page.locator('.terminal-input');
    await input.fill('test message');
    await input.press('Enter');

    // Wait for response and typing indicators to settle
    await page.waitForTimeout(1000);

    // Scroll up manually
    await terminalBody.evaluate((el) => el.scrollTop = 50);
    const initialScrollTop = await terminalBody.evaluate((el) => el.scrollTop);

    // Type text in input box
    await input.fill('typing text...');
    
    // Scroll height should not change during typing
    const typingScrollTop = await terminalBody.evaluate((el) => el.scrollTop);
    expect(typingScrollTop).toBe(initialScrollTop);
  });
});

test.describe('Tier 1: Feature 7 - 3D Loader', () => {
  test('Canvas elements mounting, context WebGL, and callback transition', async ({ page }) => {
    await page.goto('/');
    
    // Canvas is present during loading
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const isWebGL = await canvas.evaluate((el) => {
      const gl = (el as HTMLCanvasElement).getContext('webgl') || (el as HTMLCanvasElement).getContext('webgl2');
      return !!gl;
    });
    expect(isWebGL).toBe(true);

    // Loader container disappears
    await expect(page.locator('canvas')).toBeHidden({ timeout: 5000 });
    await expect(page.locator('main.app-container')).toBeVisible();
  });
});

test.describe('Tier 1: Feature 8 - Layout Order', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.interactive-funnel', { timeout: 10000 });
  });

  test('InteractiveFunnel is placed above classical Hero in layout', async ({ page }) => {
    const funnel = page.locator('.interactive-funnel');
    const hero = page.locator('.hero');

    const funnelBox = await funnel.boundingBox();
    const heroBox = await hero.boundingBox();

    if (funnelBox && heroBox) {
      expect(funnelBox.y).toBeLessThan(heroBox.y);
      expect(funnelBox.y + funnelBox.height).toBeLessThanOrEqual(heroBox.y + 2);
    } else {
      throw new Error('Bounding boxes not found');
    }
  });
});
```

---

## 5. Verification Plan

To verify that these Tier 1 tests and strategies are fully compliant and correctly run:
1. Compile the build and verify no compiler warning triggers.
2. Execute tests in sequential / serial and parallel formats using the custom challenger profile:
   ```bash
   npx playwright test --config=playwright.challenger.config.ts
   ```
3. Look at HTML outputs, screenshot reports, and CLI results to ensure 100% test case pass status.
