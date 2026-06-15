# Handoff Report — Tier 1 Feature Coverage Design

## 1. Observation
We analyzed the following files in the project workspace `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/`:

1.  **`src/App.tsx`**:
    Lines 26-28:
    ```tsx
    <Navbar />
    <Hero />
    <div className="divider" />
    <InteractiveFunnel />
    ```
    This shows the current layout order renders `Hero` above `InteractiveFunnel`, which violates Feature 8 layout order.

2.  **`src/components/InteractiveFunnel.tsx`**:
    Lines 43-47:
    ```typescript
    // Initial trigger to get first AI message
    useEffect(() => {
      if (messages.length === 1 && messages[0].role === 'system') {
        fetchAIResponse(messages);
      }
    }, []);
    ```
    This triggers double greeting when mounted twice in development mode under React 18 `StrictMode`.

3.  **`src/components/Loader.tsx`**:
    Lines 118-123:
    ```tsx
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
    ```
    This shows the current loader uses a 2D SVG layout rather than a WebGL `<canvas>` container (Feature 7).

4.  **`tests/empirical.spec.ts`**:
    Tests failed under the default `playwright.config.ts` because it lacked a `webServer` key, causing a `net::ERR_CONNECTION_REFUSED` error.
    Verbatim error:
    ```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4173/
    ```

5.  **`e2e/` Specs**:
    Running `npx playwright test --config=playwright-e2e.config.ts` executed 17 test cases successfully across `build.spec.ts`, `clickability.spec.ts`, and `responsive.spec.ts`:
    ```
    17 passed (21.4s)
    ```

---

## 2. Logic Chain
- **Build, Responsive, and Clickability (Features 1, 2, 3)**:
  - Existing tests in `e2e/` cover viewport checks, trial clicks, and exit codes. They pass under `playwright-e2e.config.ts` because it starts the Vite server automatically.
  - Adding 5 distinct cases for each is achieved by partitioning screen sizes, verifying element properties (like `rel="noopener"`), and checking compiled bundles.
- **Chat Greetings & Auto-Scroll (Features 4, 6)**:
  - Under StrictMode, double-mount is a known behavior. A robust test must intercept `/v1/chat/completions` using `page.route` to assert that exactly 1 request is fired on initialization, preventing duplications.
  - Auto-scroll must be tested by evaluating `scrollTop` before/after text entry (typing characters must NOT scroll) and checking that message insertions DO scroll to the bottom.
- **Scroll Functionality (Feature 5)**:
  - The menu component handles scroll toggling inline. Tests must check body overflow values during state shifts (loader active, menu open, menu closed).
- **3D Loader (Feature 7)**:
  - Replacing SVG with R3F canvas will introduce a `canvas` node. Verification requires hit-testing and fast-forwarding the timer in Playwright to avoid waiting 3.2s on every test run.
- **Layout Order (Feature 8)**:
  - When reordered, InteractiveFunnel goes first. We can verify structure by comparing child elements in the DOM tree, or testing that the vertical y-coordinate `funnelBox.y < heroBox.y`.

---

## 3. Caveats
- No implementation has been done since this is a read-only investigation.
- Canvas testing assumes a headless browser environment that supports standard WebGL contexts. If WebGL is unsupported in headless, tests may need to fall back to canvas existence checks or run with headful settings.
- The 40 test cases proposed assume that future element selectors (like class names) will match the design pattern outlined in `analysis.md`.

---

## 4. Conclusion
We have formulated a robust testing blueprint containing exactly 5 distinct test cases for each of the 8 features, documenting selectors, actions, and assertions. The strategy is compiled in `analysis.md`.

---

## 5. Verification Method
To verify the design:
1.  Read the strategic proposals in `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/.agents/teamwork_preview_explorer_M1_gen5_1/analysis.md`.
2.  Run the existing tests to confirm setup integrity:
    ```bash
    npx playwright test --config=playwright-e2e.config.ts
    ```
