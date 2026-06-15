# Handoff Report — Explorer 2 (Milestone 2)

## 1. Observation

Direct observations made in the codebase:

- **Hero Layout Swap**:
  `src/App.tsx` (lines 23-34) renders:
  ```tsx
        <main className="app-container">
          <Cursor />
          <Navbar />
          <Hero />
          <div className="divider" />
          <InteractiveFunnel />
          ...
  ```
- **React StrictMode double-greeting fetch issue**:
  `src/components/InteractiveFunnel.tsx` (lines 43-47) includes this `useEffect`:
  ```tsx
    // Initial trigger to get first AI message
    useEffect(() => {
      if (messages.length === 1 && messages[0].role === 'system') {
        fetchAIResponse(messages);
      }
    }, []);
  ```
- **Stuck general page scroll CSS**:
  `src/index.css` (lines 60-73) contains:
  ```css
  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  body {
    ...
    overflow-x: hidden;
    ...
  }
  ```
  `src/components/Navbar.tsx` (lines 22-25) locks scroll programmatically:
  ```tsx
    // Prevent scroll when menu open
    useEffect(() => {
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);
  ```
- **Chat Auto-Scroll behavior**:
  `src/components/CommandTerminal.tsx` (lines 20-22) scroll effect:
  ```tsx
    useEffect(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
  ```
  At line 68, the target element is:
  ```tsx
          <div ref={endOfMessagesRef} />
  ```
  At line 40, the terminal scroll container is:
  ```tsx
        <div className="terminal-body">
  ```

---

## 2. Logic Chain

1. **Layout swap**: To set `InteractiveFunnel` as the primary hero block immediately beneath the navigation structure inside the `<main>` container, reordering the JSX elements so that `<InteractiveFunnel />` is mounted before `<Hero />` is sufficient (Observation 1).
2. **Double greeting**: Under React 18 StrictMode, the setup phase of `useEffect` with an empty dependency array executes twice sequentially, resetting components in the dev build. Since `fetchAIResponse` fetches from an API and updates `messages` asynchronously, both concurrent network requests trigger state updates. We must bind an `AbortController` to the `useEffect` trigger and supply its `signal` to `fetch()`, rejecting state resolution upon early unmount (Observation 2).
3. **Stuck scroll**: `overflow-x: hidden` simultaneously defined on `html` and `body` leads to scrolling container overlaps that lock vertical scrolling on certain mobile viewports. By removing `overflow-x: hidden` on `html` and changing it to `overflow-x: clip` on `body` (which hides horizontal overflow without creating a scroll context), vertical scroll capability remains uninhibited (Observation 3).
4. **Chat auto-scroll jump**: Calling `scrollIntoView()` on an internal DOM node forces the browser viewport (window level) to scroll to fit that element. By mapping a `useRef` directly to the `.terminal-body` scroll container and substituting `scrollIntoView()` with a direct `.scrollTo()` scroll call, we constrain the scrolling behavior entirely within the container (Observation 4).

---

## 3. Caveats

- Development build behavior is simulated under React 18 StrictMode which runs effects twice. The `AbortController` pattern fixes this in dev builds without changing functionality in production builds.
- Using CSS `overflow-x: clip` requires modern browser support (which is standard across active modern browsers today). If legacy browsers are targeted, wrapping the page content in an additional layout wrapper with `overflow-x: hidden` is a standard alternative.

---

## 4. Conclusion

The analysis of the 4 target areas is complete. The solution plan covers all requirements of Milestone 2:
- Reorders components in `src/App.tsx`.
- Connects `AbortController` to `useEffect` and `fetch` in `InteractiveFunnel.tsx`.
- Cleans up html/body overflow tags in `src/index.css`.
- Swaps `scrollIntoView()` with container `scrollTo()` in `CommandTerminal.tsx`.

---

## 5. Verification Method

To verify the proposals post-implementation:
1. **Compilation**: Run `npm run build` and `npm run lint` to ensure no TypeScript or syntax issues are introduced.
2. **Double Greeting Verification**: Inspect the chat window in development mode. The initial greeting should load exactly once, despite StrictMode unmounting and remounting the component.
3. **Scroll Actionability**: Verify page vertical scroll works smoothly on both Desktop and Mobile viewports without locking or getting stuck.
4. **Chat Scroll Lock**: Type in the console terminal input and verify that the chat scroll stays confined within the console's terminal viewport container and does not cause the page/window viewport to jump vertically.
