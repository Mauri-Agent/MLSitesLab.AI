# Tier 1 Feature Test Coverage Analysis & Strategy

**Project**: MLSitesLab.AI  
**Objective**: Propose a comprehensive test design and strategy to achieve Tier 1 Feature Coverage (≥5 test cases per feature) for all 8 features.

---

## 1. Executive Summary & Strategy
To guarantee the quality, responsiveness, performance, and correct behavior of the redesigned MLSitesLab.AI portfolio, we outline a comprehensive E2E testing strategy using **Playwright**.
- **Test Runner Configuration**: Tests will leverage `playwright.challenger.config.ts` to run across two distinct viewports:
  - **Mobile**: 375px width (representing iPhone 12 / typical mobile screen)
  - **Desktop**: 1080px width (representing typical desktop layout)
- **Methodology**: Categorized partitions per feature to ensure 5 distinct, robust, and independent assertions. Every test avoids hardcoded timeouts, instead utilizing Playwright's auto-waiting features and explicit visibility state assertions.

---

## 2. Feature-by-Feature Tier 1 Test Cases

### Feature 1: Responsive Layout
*Ensure layout elements scale cleanly and fit viewports without horizontal overflow (`overflow-x`) on Mobile (375px) and Desktop (1080px).*

1. **Document-Level No-Overflow (Mobile 375px)**
   - **Description**: Verifies that the document width matches client viewport width at 375px, showing no horizontal scrollbar.
   - **Selector**: `document.documentElement`
   - **Action**: Set viewport to 375x812, navigate to `/`, and wait for loader completion. Evaluate scroll width.
   - **Assertion**: `scrollWidth <= clientWidth`.
2. **Document-Level No-Overflow (Desktop 1080px)**
   - **Description**: Verifies that the document width matches client viewport width at 1080px, showing no horizontal scrollbar.
   - **Selector**: `document.documentElement`
   - **Action**: Set viewport to 1080x1920, navigate to `/`, and wait for loader completion. Evaluate scroll width.
   - **Assertion**: `scrollWidth <= clientWidth`.
3. **Viewport Meta Tag Check**
   - **Description**: Validates that viewport scaling configuration is set correctly in HTML metadata.
   - **Selector**: `meta[name="viewport"]`
   - **Action**: Locate the meta element in head.
   - **Assertion**: `await expect(viewportMeta).toHaveAttribute('content', /width=device-width/)` and `initial-scale=1` exists.
4. **Header/Navbar Boundary Check (Mobile)**
   - **Description**: Ensures the header navigation container fits within the horizontal boundary of 375px on mobile.
   - **Selector**: `nav.navbar` (or `.navbar-inner`)
   - **Action**: Get bounding box on Mobile viewport.
   - **Assertion**: `boundingBox.x + boundingBox.width <= 375`.
5. **Interactive Funnel Boundary Check (Mobile)**
   - **Description**: Ensures the newly positioned Hero component (`.interactive-funnel`) adapts dynamically and does not overflow on mobile.
   - **Selector**: `.interactive-funnel`
   - **Action**: Get bounding box on Mobile viewport.
   - **Assertion**: `boundingBox.x + boundingBox.width <= 375`.

---

### Feature 2: Clickability
*Ensure all navigation items, buttons, links, and custom cards are fully interactive, visible, stable, and not obscured by elements.*

1. **All Anchor (`a`) Links Actionability**
   - **Description**: Checks that every anchor tag in the DOM is clickable and not blocked by overlays.
   - **Selector**: `a`
   - **Action**: Iterate over visible links and perform trial click: `await link.click({ trial: true })`.
   - **Assertion**: All visible anchor links pass Playwright's actionability checks.
2. **All Button (`button`) elements Actionability**
   - **Description**: Verifies that every button element in the DOM is enabled and ready to receive clicks.
   - **Selector**: `button`
   - **Action**: Iterate over visible buttons and perform trial click: `await button.click({ trial: true })`.
   - **Assertion**: All visible buttons pass actionability checks.
3. **Mobile Hamburger Menu Toggle clickability**
   - **Description**: Confirms the mobile navbar menu button is interactable on mobile.
   - **Selector**: `#hamburger-btn`
   - **Action**: Click `#hamburger-btn` on mobile viewport.
   - **Assertion**: Hamburger menu changes class state (e.g. `open`) and displays `.mobile-menu` in viewport.
4. **Interactive Funnel Service/Node Cards Actionability**
   - **Description**: Asserts that custom interactive elements or nodes can be clicked without errors.
   - **Selector**: `[role="button"]:not(button), [tabindex="0"]:not(a):not(button):not(input):not(textarea)`
   - **Action**: Retrieve matching locators, filter by visibility, and call `.click({ trial: true })`.
   - **Assertion**: No card element is blocked or intercepted.
5. **Hero Primary CTA Actionability**
   - **Description**: Ensures the main Call-to-Action button in the top Hero works immediately.
   - **Selector**: `#hero-cta-primary`
   - **Action**: Perform trial click `await page.locator('#hero-cta-primary').click({ trial: true })`.
   - **Assertion**: CTA button is stable and ready to trigger the viewport scroll.

---

### Feature 3: Build Reliability
*Validate code linting, compiler diagnostics, directory output structure, and bundler compilation outputs.*

1. **Successful Build Exit Status**
   - **Description**: Verifies that running `npm run build` completes successfully.
   - **Action**: Execute `tsc && vite build` via `child_process.execSync` in a controlled test sandbox.
   - **Assertion**: Compilation exit code is `0`.
2. **No TypeScript Compiler Diagnostics Errors**
   - **Description**: Scans compilation stdout logs for TypeScript errors or warnings.
   - **Action**: Run `tsc --noEmit` or verify output of `npm run build`.
   - **Assertion**: Logs do not match `/error TS/` or `tsc` compiler warnings.
3. **Build Target Directory Creation**
   - **Description**: Asserts the static build target folder `dist/` is successfully written.
   - **Action**: Resolve directory path `dist/` and query file system using `fs.existsSync`.
   - **Assertion**: `dist` directory exists and is a folder.
4. **HTML Entrypoint Output Validation**
   - **Description**: Checks that an optimized HTML shell is generated.
   - **Action**: Verify `dist/index.html` file existence.
   - **Assertion**: `index.html` exists and is non-empty.
5. **Assets Directory Population**
   - **Description**: Confirms JS & CSS chunks are successfully bundled and outputted.
   - **Action**: Inspect folder contents of `dist/assets/`.
   - **Assertion**: At least one `.js` file and one `.css` file are present.

---

### Feature 4: Chat Greetings
*Validate that the chatbot welcome mechanism initializes cleanly with a single, authentic AI Auditor greeting message, excluding developer debug variables.*

1. **Verify Single Greeting Welcome Bubble**
   - **Description**: Confirms only one message bubble from the AI is displayed in the terminal upon initialization.
   - **Selector**: `.terminal-body .terminal-message.assistant`
   - **Action**: Load the application and wait for the loader to fade.
   - **Assertion**: Count of assistant messages is exactly `1`.
2. **Ensure System Prompt is Excluded from UI**
   - **Description**: Asserts that system prompts (system instructions) are never outputted inside the visible user chat history.
   - **Selector**: `.terminal-body .terminal-message`
   - **Action**: Scan all messages inside terminal body and read text content.
   - **Assertion**: No message contains the prompt metadata or system headers (`systemPrompt` details).
3. **Validate Greeting Content Persona**
   - **Description**: Checks that the greeting content reflects the brand's premium, cyberpunk AI Auditor style.
   - **Selector**: `.terminal-body .terminal-message.assistant .terminal-content`
   - **Action**: Retrieve inner text of assistant's first message bubble.
   - **Assertion**: String contains key introductory hooks (e.g., "AI_AUDITOR", "escaneo", or questions matching the system persona).
4. **Initial Typing Indicator Lifecycle**
   - **Description**: Verifies that the typing indicator behaves correctly during initialization.
   - **Selector**: `.terminal-typing-indicator`
   - **Action**: Check state before assistant greeting resolves.
   - **Assertion**: Typing indicator is visible initially, then is absent once the single message completes rendering.
5. **No Greeting Stacking on Focus or Interaction**
   - **Description**: Ensures that subsequent component updates or focusing of the chat input does not replicate the greeting.
   - **Selector**: `.terminal-input`, `.terminal-message.assistant`
   - **Action**: Focus the terminal input box (`.terminal-input`) and click in/out of the widget.
   - **Assertion**: Count of `.terminal-message.assistant` remains exactly `1`.

---

### Feature 5: Scroll Functionality
*Verify that global scrolling is not locked by stylesheets, body/html layout rules, or mobile overlays.*

1. **HTML Element Scroll Clearance**
   - **Description**: Validates that overflow styles on the top-level HTML node do not lock vertical navigation.
   - **Selector**: `html`
   - **Action**: Retrieve computed CSS `overflow` and `overflowY` rules after load.
   - **Assertion**: Computed value is not `hidden` and does not prevent scrolling.
2. **Body Element Scroll Clearance**
   - **Description**: Validates that overflow styles on the body element do not restrict scrolling.
   - **Selector**: `body`
   - **Action**: Retrieve computed CSS `overflow` and `overflowY` rules.
   - **Assertion**: Computed value is not `hidden` and does not prevent scrolling.
3. **Execution of Scroll Offsets**
   - **Description**: Tests that scroll positioning is fully operational programmatically.
   - **Action**: Scroll page down: `window.scrollTo(0, 500)`.
   - **Assertion**: Evaluated `window.scrollY` offset is equal to `500` (or matching bounds).
4. **Scroll Indicator Integration**
   - **Description**: Confirms the UI scroll button successfully navigates the viewport downwards.
   - **Selector**: `#hero-scroll-btn`
   - **Action**: Click `#hero-scroll-btn`.
   - **Assertion**: Scroll position `window.scrollY` moves to a positive non-zero value, scrolling the page.
5. **Body Style Restored on Mobile Menu Close**
   - **Description**: Verifies that closing the mobile navigation menu releases the body scroll lock.
   - **Selector**: `#hamburger-btn`
   - **Action**: Click to open mobile menu (locking scroll), then click again to close.
   - **Assertion**: Computed style `document.body.style.overflow` returns to an empty string `""` or `visible`.

---

### Feature 6: Chat Auto-Scroll
*Confirm that the chatbot terminal auto-scrolls down upon sending/receiving new bubbles, but stays stable when user typing is active.*

1. **Initial scroll at bottom**
   - **Description**: Ensures that the terminal scrolls down immediately to make the greeting visible.
   - **Selector**: `.terminal-body`
   - **Action**: Wait for first assistant greeting message to render.
   - **Assertion**: Terminal body scroll offset `scrollTop + clientHeight` matches `scrollHeight` within 2px bounds.
2. **Auto-Scroll on Message Dispatch**
   - **Description**: Validates auto-scrolling when the user submits a message.
   - **Selector**: `.terminal-input`, `.terminal-body`
   - **Action**: Fill the input with a command and press Enter.
   - **Assertion**: The container immediately scrolls, matching `scrollTop + clientHeight` to `scrollHeight`.
3. **Auto-Scroll on Response Reception**
   - **Description**: Validates that when a response is received, the container scrolls to reveal the new reply.
   - **Selector**: `.terminal-body`
   - **Action**: Wait for the assistant typing state to resolve to a response.
   - **Assertion**: Container scrolls to bottom once the typing indicator is replaced with the assistant bubble.
4. **No Scroll During Keyboard Typing**
   - **Description**: Asserts that as long as the user is typing (i.e. changing input state), scroll is not forced downward if scrolled up.
   - **Selector**: `.terminal-input`, `.terminal-body`
   - **Action**: Scroll up manually to read history, then type "Auditing engine..." into `.terminal-input` without hitting Enter.
   - **Assertion**: Scroll position remains constant and does not jump back to the bottom.
5. **Manual Scroll Position Retained on Focus**
   - **Description**: Asserts that focusing the terminal input does not force scroll back down if scrolled up.
   - **Selector**: `.terminal-input`, `.terminal-body`
   - **Action**: Scroll the terminal up, then click/focus `.terminal-input`.
   - **Assertion**: Scroll coordinates do not modify.

---

### Feature 7: 3D Loader
*Validate the initialization of the premium 3D WebGL Canvas loader and the lifecycle complete transition.*

1. **WebGL Canvas Visibility on Load**
   - **Description**: Verifies that the loader container initializes and embeds a canvas.
   - **Selector**: `.loader-container canvas` or `canvas` (during initial load).
   - **Action**: Load website root URL.
   - **Assertion**: Canvas element is present in DOM and visible.
2. **WebGL Context Initialization**
   - **Description**: Confirms the canvas is utilizing a 3D context (WebGL/WebGL2) for neural network rendering.
   - **Selector**: `canvas`
   - **Action**: Retrieve WebGL context via `canvas.getContext('webgl') || canvas.getContext('webgl2')`.
   - **Assertion**: Context return object is not null.
3. **App Container Hidden during Load**
   - **Description**: Asserts that main landing page sections are hidden until loading completes.
   - **Selector**: `main.app-container`
   - **Action**: Check element presence during loader display.
   - **Assertion**: `main.app-container` is not visible or not present.
4. **Loader Lifecycle Complete (Unmounting)**
   - **Description**: Validates that the loader completes and terminates itself.
   - **Action**: Wait for loader lifecycle duration (e.g. 3.5s).
   - **Assertion**: Canvas element and Loader container are removed from the DOM.
5. **App Container Mounted & Visible Post-Load**
   - **Description**: Asserts the main site container fades in and mounts once the loader unmounts.
   - **Selector**: `main.app-container`
   - **Action**: Wait for loader completion.
   - **Assertion**: `main.app-container` is visible.

---

### Feature 8: Layout Order
*Verify layout restructuring placing InteractiveFunnel as the main Hero above the classical hero section.*

1. **DOM Tree Precedence**
   - **Description**: Asserts the InteractiveFunnel DOM component is structured above the old Hero section.
   - **Selector**: `main.app-container` children.
   - **Action**: Query list of child elements.
   - **Assertion**: Index of `.interactive-funnel` in children array is smaller than the index of `#inicio` (classical hero).
2. **Vertical Coordinates Comparison (Visual Order)**
   - **Description**: Confirms the InteractiveFunnel is visually rendered above the old Hero component.
   - **Selector**: `.interactive-funnel`, `#inicio`
   - **Action**: Measure bounding boxes for both components.
   - **Assertion**: `funnelBoundingBox.y < heroBoundingBox.y`.
3. **InteractiveFunnel in Initial Viewport**
   - **Description**: Ensures the funnel is immediately visible in viewport on landing.
   - **Selector**: `.interactive-funnel`
   - **Action**: Check visibility on page load.
   - **Assertion**: The funnel component is visible in viewport without scrolling.
4. **Old Hero Positioned Below the fold**
   - **Description**: Asserts that the old hero is below the interactive funnel.
   - **Selector**: `#inicio`
   - **Action**: Retrieve bounding box coordinates on page load.
   - **Assertion**: Bounding box `y` is greater than or equal to the height of the interactive funnel.
5. **Layout Divider Separation**
   - **Description**: Checks that the divider element separates the two main layout blocks.
   - **Selector**: `main.app-container` children
   - **Action**: Query sequence of elements.
   - **Assertion**: A `div.divider` is situated in the DOM specifically between `.interactive-funnel` and `#inicio`.

---

## 3. Recommended E2E Test Suite Structure
We propose implementing these test cases in modular test spec files located under `e2e/`.

```bash
e2e/
├── build.spec.ts         # Feature 3: Build Reliability tests
├── responsive.spec.ts    # Feature 1: Responsive Layout tests
├── clickability.spec.ts  # Feature 2: Clickability tests
├── scroll.spec.ts        # Feature 5: Scroll Functionality tests
├── chat.spec.ts          # Feature 4: Greetings & Feature 6: Auto-scroll tests
├── loader.spec.ts        # Feature 7: 3D Loader tests
└── layout.spec.ts        # Feature 8: Layout Order tests
```

### Mocking Strategy (OpenAI API)
To prevent network dependence and API key leakage during tests:
- The `chat.spec.ts` suite should intercept calls to `https://api.openai.com/v1/chat/completions` using `page.route()`.
- Return mock responses mimicking the AI auditor's behavior to test the funnel progress (user input response triggers and final analysis message containing `[ANALYSIS_COMPLETE]`).
