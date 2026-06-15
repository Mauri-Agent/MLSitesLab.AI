# Tier 1 Feature Coverage Strategy — MLSitesLab.AI Redesign

This document outlines the comprehensive E2E test strategy designed to implement Tier 1 Feature Coverage (at least 5 distinct test cases per feature) for all 8 core features of MLSitesLab.AI. All test cases are detailed with specific Playwright selectors, user/test actions, and expected assertions.

---

## Feature 1: Responsive Layout
**Description**: Verification that the page is fully responsive, ensuring no horizontal scroll (`overflow-x: hidden`) occurs on mobile (375px) and desktop (1080px) viewports, and that elements scale correctly.

### Test Case 1.1: Mobile Viewport Horizontal Fit
*   **Selector**: `document.documentElement`
*   **Action**: Set viewport size to 375x812 (Mobile profile). Navigate to `/` and wait for the loader to complete.
*   **Assertion**: 
    ```typescript
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    ```

### Test Case 1.2: Desktop Viewport Horizontal Fit
*   **Selector**: `document.documentElement`
*   **Action**: Set viewport size to 1080x1920 (Desktop profile). Navigate to `/` and wait for the loader to complete.
*   **Assertion**: 
    ```typescript
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    ```

### Test Case 1.3: Mobile Section Boundaries Containment
*   **Selector**: `header`, `main.app-container`, `footer.footer`, `#inicio`, `.interactive-funnel`
*   **Action**: Set viewport size to 375x812. Identify bounding boxes for all key elements and sections.
*   **Assertion**: 
    ```typescript
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    for (const locator of [page.locator('header'), page.locator('.interactive-funnel'), page.locator('footer')]) {
      const box = await locator.boundingBox();
      if (box) expect(box.x + box.width).toBeLessThanOrEqual(clientWidth + 1);
    }
    ```

### Test Case 1.4: Mobile Navigation Menu Fit
*   **Selector**: `.mobile-menu`
*   **Action**: Set viewport to 375x812. Click `button#hamburger-btn` to open the navigation menu. Locate `.mobile-menu`.
*   **Assertion**: Bounding box width of `.mobile-menu` must be equal to viewport width (`375px`), and its horizontal position must align with the screen borders (x = 0).

### Test Case 1.5: Presence and Integrity of Meta Viewport Tag
*   **Selector**: `meta[name="viewport"]`
*   **Action**: Navigate to page and locate the meta tag.
*   **Assertion**: 
    ```typescript
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveCount(1);
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
    ```

---

## Feature 2: Clickability
**Description**: Verification that all links, buttons, and interactive components are fully clickable and not obscured or intercepted by overlays (such as custom cursors, background noise grids, or loader remnants).

### Test Case 2.1: Actionability of All Anchor Links
*   **Selector**: `a`
*   **Action**: Find all visible `<a>` elements on the page. Loop through them.
*   **Assertion**: Perform a trial click `await link.click({ trial: true })` to verify that they are visible and not covered by other elements in the viewport.

### Test Case 2.2: Actionability of All Buttons
*   **Selector**: `button`
*   **Action**: Retrieve all visible `<button>` elements on the page (e.g. CTA buttons, navigation triggers).
*   **Assertion**: Perform `await button.click({ trial: true })` on each. Assert that no element intercepts the click event.

### Test Case 2.3: Actionability of Focusable Interactive Cards
*   **Selector**: `[role="button"]:not(button), [tabindex="0"]:not(a):not(button):not(input):not(textarea)` (e.g. services grid items)
*   **Action**: Target interactive service cards on the page.
*   **Assertion**: Perform trial clicks to ensure cards are hit-testable and receive click events.

### Test Case 2.4: Mobile Navigation Toggles clickability
*   **Selector**: `button#hamburger-btn`, `.mobile-menu a.nav-link`
*   **Action**: Set viewport to 375px. Perform a trial click on `button#hamburger-btn`. Once opened, trial click a navigation link inside the menu.
*   **Assertion**: Toggles and inner menu links are actionable and visible.

### Test Case 2.5: Security Attribute (rel="noopener") on External Links
*   **Selector**: `a[target="_blank"]`
*   **Action**: Select all links that open in a new tab.
*   **Assertion**: Verify that each link possesses the `rel` attribute containing `noopener` (to prevent reverse tab-nabbing attacks).
    ```typescript
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel') || '';
      expect(rel).toContain('noopener');
    }
    ```

---

## Feature 3: Build Reliability
**Description**: Ensuring that the project compiles into static HTML/JS/CSS assets without TypeScript compilation errors or Vite bundling warnings.

### Test Case 3.1: Build Command Exit Status
*   **Action**: Run `npm run build` in the workspace environment via a node child process.
*   **Assertion**: The process exits with code `0`.

### Test Case 3.2: Clean Compiler Output (No TS Errors)
*   **Action**: Inspect the standard output and standard error from the build process.
*   **Assertion**: Assert that the build log does not contain patterns matching `/error TS/` or compilation error flags.

### Test Case 3.3: Output Build Directory Creation
*   **Action**: Query the filesystem for the production output folder.
*   **Assertion**: A `dist` directory exists in the project root and is a directory.

### Test Case 3.4: Main HTML Bundle Generation
*   **Action**: Query the `dist` directory contents.
*   **Assertion**: A `dist/index.html` file exists, is a file, and is non-empty.

### Test Case 3.5: Client Asset Bundle Generation
*   **Action**: Inspect the contents of the `dist/assets` directory.
*   **Assertion**: The directory contains at least one compiled Javascript (`.js`) file and one compiled CSS (`.css`) file.

---

## Feature 4: Chat Greetings
**Description**: Verification that the auditor chat launches with exactly one greeting message, ensuring that React 18 strict mode double-mounting does not double-trigger the initialization fetch.

### Test Case 4.1: Welcome Message Initialization Count
*   **Selector**: `.terminal-body .terminal-message.assistant`
*   **Action**: Intercept OpenAI requests using Playwright `page.route()`. Load the page and wait for the typing indicator to disappear.
*   **Assertion**: Check that exactly one AI greeting element is rendered in the chat log:
    ```typescript
    await expect(page.locator('.terminal-body .terminal-message.assistant')).toHaveCount(1);
    ```

### Test Case 4.2: Intercepted Request Count (Strict Mode Guard)
*   **Selector**: Intercepted network request to `https://api.openai.com/v1/chat/completions`
*   **Action**: Mock the OpenAI completions API endpoint using `page.route()`. Navigate to the page.
*   **Assertion**: Assert that the endpoint is requested exactly 1 time during component initialization, verifying the double-mount race condition is solved.

### Test Case 4.3: Valid Response Content Check
*   **Selector**: `.terminal-body .terminal-message.assistant .terminal-content`
*   **Action**: Intercept the initial OpenAI chat request and respond with a mock greeting: `"Iniciando escaneo..."`.
*   **Assertion**: Assert that the greeting text rendered matches the mock response, and does not fall back to the error string:
    ```typescript
    await expect(page.locator('.terminal-body .terminal-message.assistant .terminal-content')).toHaveText("Iniciando escaneo...");
    ```

### Test Case 4.4: System Message Privacy
*   **Selector**: `.terminal-body .terminal-message`
*   **Action**: Query all messages rendered in the terminal.
*   **Assertion**: The system configuration prompt (`systemPrompt`) is filtered out and never rendered in the UI. Ensure no elements have a role/content containing system instructions.

### Test Case 4.5: Typing Indicator Transitions
*   **Selector**: `.terminal-typing-indicator`
*   **Action**: Intercept the request and delay the response by 1 second.
*   **Assertion**: The `.terminal-typing-indicator` is visible during the pending request, and transitions to hidden once the single greeting message completes loading.

---

## Feature 5: Scroll Functionality
**Description**: Verification that general page scrolling is functional and not locked by overflow properties, and that the scroll lock correctly coordinates with the mobile menu.

### Test Case 5.1: Page Scroll Capability (Post-Loader)
*   **Selector**: `html` / `body`
*   **Action**: Wait for the loader to complete. Attempt to scroll programmatically.
*   **Assertion**: 
    ```typescript
    await page.evaluate(() => window.scrollTo(0, 200));
    const yOffset = await page.evaluate(() => window.scrollY);
    expect(yOffset).toBe(200);
    ```

### Test Case 5.2: CSS Scroll Locking Inspection
*   **Selector**: `html`, `body`
*   **Action**: Check computed CSS styles on page body after loader completion.
*   **Assertion**: Computed `overflow-y` and `overflow` values must not be `hidden` or `scroll-lock`.

### Test Case 5.3: Mobile Menu Scroll Lock Activation
*   **Selector**: `body`
*   **Action**: Set viewport to 375px. Click `button#hamburger-btn` to open the mobile menu overlay.
*   **Assertion**: Computed style of `body` has `overflow` set to `hidden`, confirming scroll lock is active to prevent page sliding behind the menu.

### Test Case 5.4: Mobile Menu Scroll Lock Release
*   **Selector**: `body`
*   **Action**: Open the mobile menu. Click `button#hamburger-btn` or a mobile navigation link to close the menu.
*   **Assertion**: Computed style of `body` has `overflow` restored to `""` (empty), allowing smooth natural scrolling again.

### Test Case 5.5: Loader Completion Scroll Unlock
*   **Selector**: `body`
*   **Action**: Navigate to the page. During the loading animation, check scroll lock styles. Wait for loader completion.
*   **Assertion**: Verify that once the WebGL canvas loader completes and is unmounted, no scroll-locking classes or inline overflow styles are left on the `body` or `html`.

---

## Feature 6: Chat Auto-Scroll
**Description**: Verification that the chat terminal automatically scrolls to the bottom on sending and receiving messages, but is isolated from scrolling during keystrokes (typing).

### Test Case 6.1: Auto-Scroll on Message Submission
*   **Selector**: `.terminal-body`, `input.terminal-input`
*   **Action**: Intercept completions API. Focus the input field, type a response, and submit.
*   **Assertion**: Verify that the terminal body container immediately scrolls to the bottom:
    ```typescript
    const isScrolledToBottom = await page.evaluate(() => {
      const container = document.querySelector('.terminal-body');
      if (!container) return false;
      return container.scrollTop + container.clientHeight >= container.scrollHeight - 5;
    });
    expect(isScrolledToBottom).toBeTruthy();
    ```

### Test Case 6.2: Auto-Scroll on Message Reception
*   **Selector**: `.terminal-body`
*   **Action**: Mock OpenAI API to return a paragraph response. Submit a query. Wait for response rendering to finish.
*   **Assertion**: Verify that the container scrolls to the bottom to display the complete response.

### Test Case 6.3: Scroll Position Isolation During Typing
*   **Selector**: `.terminal-body`, `input.terminal-input`
*   **Action**: Send multiple messages to fill the terminal container and enable scroll. Scroll manually to the top (`scrollTop = 0`). Focus the input field and type a long command.
*   **Assertion**: Verify that typing does not force scroll. The `scrollTop` must remain at `0` while keystrokes are recorded.

### Test Case 6.4: Auto-scroll on Typing Indicator Mount
*   **Selector**: `.terminal-body`, `.terminal-typing-indicator`
*   **Action**: Send a message. Wait for the typing indicator to render before the mock API resolves.
*   **Assertion**: Verify that the scroll adjusts to show the typing indicator in full view at the bottom of the window.

### Test Case 6.5: User Manual Scroll Override
*   **Selector**: `.terminal-body`
*   **Action**: While the typing indicator is active, programmatically or manually scroll up.
*   **Assertion**: Assert that the scrolling position does not snap back to the bottom on subsequent state updates or cursor ticks until a new text message is appended.

---

## Feature 7: 3D Loader
**Description**: Verification that the loader renders a 3D WebGL `<canvas>` (instead of 2D SVG), completes successfully, and triggers `onComplete` to transition to the main app container.

### Test Case 7.1: WebGL Canvas Detection
*   **Selector**: `canvas`
*   **Action**: Navigate to the site. Locate the canvas within the loader before the completion timeout.
*   **Assertion**: Verify that a `<canvas>` element exists and is visible.
    ```typescript
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    ```

### Test Case 7.2: Loader Viewport Coverage
*   **Selector**: Loader parent container
*   **Action**: Measure dimensions of the loader overlay container.
*   **Assertion**: Bounding box size matches full screen (width = `100vw`, height = `100vh`) and is overlaying other elements (e.g. `z-index: 9999`).

### Test Case 7.3: Transition to Main Content on Complete
*   **Selector**: `main.app-container`, `canvas`
*   **Action**: Wait for loader completion timeout (3.2 seconds or via mocked clock).
*   **Assertion**: The canvas loader is unmounted and the main application container `.app-container` becomes visible.
    ```typescript
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('main.app-container')).toBeVisible();
    ```

### Test Case 7.4: Fast-Forward Time Optimization (E2E Speedup)
*   **Action**: Use Playwright's Clock API to intercept the loader timer.
    ```typescript
    await page.clock.install();
    await page.goto('/');
    // verify loader visible...
    await page.clock.fastForward(3500);
    ```
*   **Assertion**: Verify that the main app container loads immediately, confirming E2E tests skip the 3.2s delay.

### Test Case 7.5: Transition Animating Styles
*   **Selector**: Loader wrapper container
*   **Action**: Measure opacity style during the exit transition (just after `onComplete` triggers).
*   **Assertion**: Confirm the opacity animates toward 0 before removal (e.g. inline style contains opacity or exit transition runs).

---

## Feature 8: Layout Order
**Description**: Verification that the main layout is reordered: the interactive funnel (auditor terminal + graph) must act as the primary Hero component (top of the page), while the classical Hero is below it.

### Test Case 8.1: DOM Tree Structural Ordering
*   **Selector**: `main.app-container`
*   **Action**: Fetch all direct children of the main container.
*   **Assertion**: 
    ```typescript
    const children = await page.evaluate(() => {
      const main = document.querySelector('main.app-container');
      if (!main) return [];
      return Array.from(main.children).map(c => c.className || c.id || c.tagName.toLowerCase());
    });
    
    // Find the relative order of InteractiveFunnel and classical Hero
    const funnelIndex = children.findIndex(c => c.includes('interactive-funnel'));
    const heroIndex = children.findIndex(c => c === 'inicio');
    
    expect(funnelIndex).toBeLessThan(heroIndex);
    ```

### Test Case 8.2: Visual Bounding Box Coordinates Comparison
*   **Selector**: `.interactive-funnel`, `section#inicio`
*   **Action**: Wait for loader to complete and fetch coordinates.
*   **Assertion**: Bounding box vertical coordinates confirm the funnel is visually higher:
    ```typescript
    const funnelBox = await page.locator('.interactive-funnel').boundingBox();
    const heroBox = await page.locator('section#inicio').boundingBox();
    if (funnelBox && heroBox) {
      expect(funnelBox.y).toBeLessThan(heroBox.y);
    }
    ```

### Test Case 8.3: Top Layout Viewport Alignment on Load
*   **Selector**: `.interactive-funnel`
*   **Action**: Load page and wait for loader completion. Check bounding box.
*   **Assertion**: Bounding box `y` matches the navigation bar height (approx. `72px`), confirming it is placed directly below the navbar.

### Test Case 8.4: Divider Node Separation
*   **Selector**: `main.app-container` children
*   **Action**: Retrieve siblings between `.interactive-funnel` and `section#inicio`.
*   **Assertion**: Verify that a `.divider` element is placed in between the two components.

### Test Case 8.5: Navigation Link Focus Alignment
*   **Selector**: `a[href="#inicio"]`
*   **Action**: Click the "Inicio" navigation link.
*   **Assertion**: Bounding box coordinate of the targeted element (`section#inicio`) is scrolled into view (its top aligns below the navbar).
