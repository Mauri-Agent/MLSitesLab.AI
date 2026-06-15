# Handoff Report: Milestone 2 Implementation Strategy

## 1. Observation
- `framer-motion` (v12.40.0) is already installed as per `package.json`.
- The UI structure is split into `Hero.tsx`, `Navbar.tsx`, `Services.tsx`, and `Portfolio.tsx` inside `src/components/`.
- Styling is primarily handled in `src/styles/App.css` and `src/index.css`.
- The user requires 3 specific animation types: 3D card effects, magnetic cursors, and parallax.
- The `Services.tsx` currently maps an array of objects into standard `<article className="service-card">` elements.
- The `Hero.tsx` has a `.hero-glow` background element and `.hero-content` wrapper, perfect for parallax.
- `App.tsx` directly renders the four components.

## 2. Logic Chain
- **Magnetic Cursor**: Needs a globally mounted custom cursor component. Since we are using standard CSS/HTML tags for links and buttons, the cursor can track mouse position globally and apply scaling/morphing when hovering over clickable elements (`a`, `button`). This should only apply to desktop (can hide the cursor on devices without hover support). 
- **3D Card Effect**: The `<article>` elements in `Services.tsx` are static. By abstracting the individual card into a `<motion.article>` (or a sub-component `<ServiceCard />`), we can listen to `onMouseMove` to calculate relative cursor position and map it to `rotateX` and `rotateY` transforms, creating a 3D tilt. This achieves the required "efecto WOW" for the cards.
- **Parallax**: In `Hero.tsx`, tracking `useScroll` allows us to apply a `useTransform` to the `.hero-glow` and `.hero-content` elements on the Y-axis. This causes the background and foreground to scroll at different rates.
- **Micro-interactions (General)**: `Navbar.tsx` and text sections currently load instantly. Wrapping them in `motion` tags and using `initial`, `animate`, and `whileInView` will ensure smooth, fluid page transitions, aligning with "transiciones de página fluidas."

## 3. Caveats
- **Performance**: High use of framer-motion (especially `onMouseMove` for 3D tilt and cursors) can affect performance on low-end devices. Suggest checking `window.matchMedia('(prefers-reduced-motion: reduce)')` or disabling cursor/3D effects on mobile breakpoints.
- **CSS Conflicts**: A custom magnetic cursor requires disabling the default pointer (`cursor: none` in CSS). Ensure that hover events still trigger properly and only apply `cursor: none` for non-touch devices to avoid breaking mobile interactions.

## 4. Conclusion
The implementation strategy is solid and divided into four actionable steps for the implementer:
1.  **Create `src/components/MagneticCursor.tsx`**: Implement a global `motion.div` that tracks `window` mouse events using `useSpring` and `useMotionValue`. Mount it in `App.tsx` and update CSS to hide the default cursor on desktop.
2.  **Update `src/components/Services.tsx`**: Extract the card mapping into a new `<ServiceCard>` component that wraps the content in a `<motion.article>`. Use `onMouseMove` to calculate bounds and apply `rotateX` and `rotateY` via `useTransform`.
3.  **Update `src/components/Hero.tsx`**: Convert `.hero-glow` and `.hero-content` to `motion.div`. Use `useScroll` and `useTransform` to move `.hero-glow` down and `.hero-content` slightly up as the user scrolls down, achieving the parallax effect.
4.  **Update `src/components/Navbar.tsx`**: Convert to `<motion.nav>` and add an initial slide-down animation (`initial={{ y: -100 }} animate={{ y: 0 }}`).

## 5. Verification Method
- **Verify 3D cards**: Hover over the Service cards; they should tilt dynamically based on the mouse position.
- **Verify Parallax**: Scroll down on the homepage; the Hero text and the background green glow should move at distinctly different speeds.
- **Verify Magnetic Cursor**: Move the mouse on desktop; a custom cursor should follow smoothly (spring physics) and react/grow when hovering over buttons.
- **Automated Tests**: Run the existing E2E or check responsiveness via `npm run dev`. Verify no horizontal overflow occurs using the `playwright` tests when completed.
