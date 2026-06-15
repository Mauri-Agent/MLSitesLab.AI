# Handoff: Milestone 1 - Componentization Strategy

## Summary
The current `App.tsx` contains the entire landing page structure and uses `framer-motion` for animations. To meet Milestone 1 constraints, we must break this monolithic file into 4 distinct components (`Navbar`, `Hero`, `Services`, `Portfolio`), strip out all `framer-motion` references to respect the "No complex animations" constraint, and consolidate styling. The "Dark Green" palette is already correctly defined via CSS variables in `index.css`.

## 1. Observation
- `src/App.tsx` (128 lines) renders a monolithic UI containing a navigation bar, a hero section, a services section, and a portfolio placeholder.
- It imports and heavily uses `framer-motion` (`motion.div`, `motion.button`) for entrance animations and hover effects (e.g., `App.tsx` line 2: `import { motion } from 'framer-motion';`).
- It imports icons from `lucide-react` (e.g., `ArrowRight`, `Bot`, `Code2`, `Cpu`, `LineChart`).
- Styling is currently managed via `src/App.css` and `src/index.css`. `src/index.css` already contains the "Dark Green" / "Green Arrow" palette variables (`--bg-dark`, `--bg-card`, `--accent-primary: #0fcb54`, etc.).

## 2. Logic Chain
- **Constraint Checklist & Confidence Score**:
  1. Refactor `App.tsx` into modular components under `src/components/`? Yes.
  2. Implement "Dark Green" palette? Yes (already in `index.css`, but we will ensure components use these standard classes).
  3. No complex animations? Yes (we must remove `framer-motion`).
  - Confidence Score: 5/5
- **Component Breakout Plan**:
  - `src/components/Navbar.tsx`: Will contain the `<nav className="navbar">` element.
  - `src/components/Hero.tsx`: Will contain the `<section id="inicio">` element. `motion.div` and `motion.button` will be replaced with standard `div` and `button`.
  - `src/components/Services.tsx`: Will contain the `services` array and the `<section id="servicios">` element. `motion.div` will be replaced with standard `div`.
  - `src/components/Portfolio.tsx`: Will contain the `<section id="portfolio">` element.
- **Styling Consolidation**:
  - Since `SCOPE.md` suggests moving styles to `src/styles/` or `src/index.css`, we should append the contents of `src/App.css` into `src/index.css` and delete `src/App.css` (or move it to `src/styles/App.css` and update imports). The easiest path is appending to `index.css` for a single source of truth, or creating a `src/styles/global.css`.
- **Refactoring `App.tsx`**:
  - `App.tsx` will simply import and render these 4 components sequentially inside `<div className="app-container">`.

## 3. Caveats
- `lucide-react` is used in both `Hero` and `Services`. The imports must be split correctly into the respective components.
- The `portfolio` section has inline styles (`style={{ borderTop: '1px solid var(--border-color)', ... }}`). This is fine for a placeholder, but ideally, it should be moved to a CSS class.

## 4. Conclusion
Execute the following changes:
1. Create `src/components/Navbar.tsx` returning the `<nav>` markup.
2. Create `src/components/Hero.tsx` returning the `<section id="inicio">` markup. Strip all `motion` tags and replace them with standard HTML tags.
3. Create `src/components/Services.tsx` returning the `<section id="servicios">` markup. Move the `services` array here. Strip all `motion` tags.
4. Create `src/components/Portfolio.tsx` returning the `<section id="portfolio">` markup.
5. Create `src/styles/` folder, move `App.css` to `src/styles/App.css` (and update the import in `App.tsx`), OR append its contents to `index.css`.
6. Rewrite `src/App.tsx` to compose the 4 components cleanly.

## 5. Verification Method
1. Run `npm run build` or `npm run dev` to ensure no syntax or import errors.
2. Inspect the DOM in the browser to ensure the components render correctly with semantic tags (`<nav>`, `<section>`).
3. Verify that `framer-motion` is completely absent from the rendered DOM and source files.
4. Verify the Dark Green styles are applied correctly without visual regressions.
