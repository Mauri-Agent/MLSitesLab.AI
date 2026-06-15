# Synthesis Report — Milestone 2 Exploration (Clarified Layout)

## Consensus
All Explorer findings and requirements have been clarified by the user. The welcome/Hero section (`Hero.tsx`) must remain at the very top of the page, and the `InteractiveFunnel` (chat + node graph) must be positioned immediately below it.

1. **Hero Layout Restructuring (`src/App.tsx` & `PROJECT.md`)**:
   - Swapping `<Hero />` and `<InteractiveFunnel />` in `src/App.tsx` must be undone. `<Hero />` must remain at the very top of `<main>`, and `<InteractiveFunnel />` must render immediately below it.
   - Restore standard top padding to `.hero` in `src/styles/App.css` (`padding-top: var(--nav-h)`).
   - Restore standard padding to `.interactive-funnel` in `src/styles/InteractiveFunnel.css` (`padding-block: var(--section-py)`).
   - Copy the updated `PROJECT.md` from `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/.agents/orchestrator/PROJECT.md` to `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/PROJECT.md` to keep the project-root specification up-to-date.

2. **Double Welcome Greeting in Chat (`src/components/InteractiveFunnel.tsx`)**:
   - The initial AI greeting fetches twice because of React 18 StrictMode mount/unmount simulation in development.
   - Reconciled Solution: Introduce an `AbortController` in the mounting `useEffect` of `InteractiveFunnel.tsx`. Pass its `AbortSignal` to the fetch query inside `fetchAIResponse()`. Handle `AbortError` gracefully by skipping state updates.

3. **Stuck General Page Scroll (`src/index.css`)**:
   - `overflow-x: hidden` simultaneously on `html` and `body` blocks vertical scrolling on some mobile/webkit browsers.
   - Solution: Remove `overflow-x: hidden` from `html` and use `overflow-x: clip` on `body` to restrict horizontal overflow without creating nested scroll contexts.

4. **Chat Auto-scroll viewport jump (`src/components/CommandTerminal.tsx`)**:
   - The native `scrollIntoView()` on a placeholder div triggers window-level viewport jumps on typing or new messages.
   - Solution: Remove `endOfMessagesRef` and its placeholder div. Add a ref to the scrollable container `.terminal-body` and use `.scrollTo({ top: scrollHeight, behavior: 'smooth' })` inside `useEffect` to scroll only the container internally.

## Implementation Details
We will request the Worker to perform the exact edits detailed in this synthesis.

### App.tsx
Keep `Hero` first, followed by `InteractiveFunnel`:
```tsx
        <main className="app-container">
          <Cursor />
          <Navbar />
          <Hero />
          <div className="divider" />
          <InteractiveFunnel />
          <div className="divider" />
          <Services />
```

### App.css
Restore `padding-top: var(--nav-h)` to `.hero`:
```css
.hero {
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  padding-top: var(--nav-h);
  padding-block: var(--section-py);
  overflow: hidden;
  position: relative;
}
```

### InteractiveFunnel.css
Restore standard padding to `.interactive-funnel`:
```css
.interactive-funnel {
  padding-block: var(--section-py);
}
```

### InteractiveFunnel.tsx
Update `fetchAIResponse` to take `signal?: AbortSignal` and catch `AbortError`.
Update mounting `useEffect` with `AbortController` instantiation and cleanup.

### index.css
Adjust `html` and `body` selectors:
```css
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-dark);
  color: var(--text-primary);
  line-height: 1.65;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### CommandTerminal.tsx
Replace `endOfMessagesRef` with `terminalBodyRef` on `.terminal-body` element.
Scroll container scrollHeight via `scrollTo`.
