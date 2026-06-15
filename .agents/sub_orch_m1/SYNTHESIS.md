# Componentization & Layout Synthesis

## Consensus
All three Explorers agree on the following componentization and styling strategy:
1. **Remove `framer-motion`**: Since complex animations are forbidden in Milestone 1, all `<motion.div>`, `<motion.button>`, etc., must be replaced with standard HTML elements (`<div>`, `<button>`). The `framer-motion` import must be removed from `App.tsx`.
2. **Component Breakout**: Split `App.tsx` into four modular components inside `src/components/`:
   - `Navbar.tsx` (using `<header>` and `<nav>`)
   - `Hero.tsx` (using `<section id="inicio">` and standard DOM tags)
   - `Services.tsx` (using `<section id="servicios">`, `<article>` for cards, and moving the `services` data array here)
   - `Portfolio.tsx` (using `<section id="portfolio">` and converting inline styles to CSS classes)
3. **App.tsx Refactor**: `App.tsx` should serve as the root layout wrapper rendering the four components.
4. **Styling / Dark Green Palette**: The variables for the "Dark Green" ("Green Arrow") palette are already correctly defined in `src/index.css`. The component-specific styles currently in `src/App.css` should be moved to a dedicated `src/styles/App.css` (or `src/index.css` directly) to consolidate styles while preserving class names.

## Resolved Conflicts
No conflicts. All Explorers identified the same 4 semantic regions and the same necessity to strip `framer-motion`.

## Gaps
None. The migration of Lucide React icons was correctly noted by Explorer 2 to be split into their respective new components.

## Implementation Instructions for Worker
1. Create `src/components/` and `src/styles/` directories.
2. Create `Navbar.tsx`, `Hero.tsx`, `Services.tsx`, and `Portfolio.tsx` in `src/components/`. Extract the relevant code from `App.tsx` into these components.
3. Remove ALL `framer-motion` elements and imports. Replace `<motion.div>` with `<div>`, `<motion.button>` with `<button>`. Keep the CSS classNames intact.
4. Move the `services` array and required `lucide-react` imports to `Services.tsx`.
5. Move `src/App.css` to `src/styles/App.css` and update the import in `App.tsx`. Convert any inline styles in the Portfolio placeholder to CSS classes in the stylesheet.
6. Refactor `src/App.tsx` to just import and render the 4 components.
7. Run `npm run build` or `npm run dev` to verify compilation and layout without errors. Ensure the Dark Green palette renders correctly.
