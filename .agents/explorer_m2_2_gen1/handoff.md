# Handoff Report: Milestone 2 (Animations & Interactions)

**Observation**
- `framer-motion` (v12.40.0) is installed and available in the project (`package.json`).
- `src/App.tsx` imports standard React components: `Hero`, `Navbar`, `Services`, `Portfolio`.
- `src/styles/App.css` defines the base layout, including a `.service-card` with basic hover transformations and a `.hero-glow` element.
- The `Services.tsx` component iterates over a list of services to render `.service-card` articles.
- There is currently no custom cursor or 3D rotation logic in any component.

**Logic Chain**
1. **Parallax Effect**: The `Hero.tsx` component contains `.hero-glow` and `.hero-content` elements. Using `framer-motion`'s `useScroll` and `useTransform`, we can tie the vertical translation (`y`) of these elements to the window's scroll position, moving them at different speeds to create depth.
2. **Magnetic Cursor**: A custom global cursor requires tracking the mouse position across the app. We can implement a `Cursor.tsx` component that uses `useMotionValue` and `useSpring` to follow `clientX` and `clientY`. By adding a global `mouseover` listener, we can scale or restyle the cursor when it hovers over interactive elements like `a`, `button`, or `.service-card`. We must also hide the default cursor in `App.css` (`body, a, button { cursor: none; }`).
3. **3D Card Effects**: To make `.service-card` 3D, we need to extract the card into a separate sub-component or modify the existing map inside `Services.tsx`. By wrapping the article in `motion.article` and tracking `onMouseMove`, we can calculate the mouse's relative percentage position `[-0.5, 0.5]` from the card's center. Using `useTransform`, we map this to `rotateX` and `rotateY` (e.g., `-15deg` to `15deg`). We must also set `transformStyle: "preserve-3d"` and translate the inner contents along the Z-axis (`translateZ(30px)`) to complete the 3D illusion.

**Caveats**
- **Mobile Experience**: 3D hover effects and custom magnetic cursors are primarily for desktop (devices with a pointer). We should ensure these effects are either disabled or gracefully fall back on touch devices (e.g., using CSS `@media (pointer: fine)` or conditionally rendering the cursor).
- **Performance**: Excessive `mousemove` listeners can cause layout thrashing. `framer-motion`'s `useMotionValue` and `useSpring` are optimized for this (they update outside the React render cycle), but we should ensure we do not trigger unnecessary React state updates.

**Conclusion**
The implementation of M2 is straightforward and well-supported by the existing architecture.
1. **Create `src/components/Cursor.tsx`**: Add the magnetic cursor component and render it in `App.tsx`. Update `src/styles/App.css` to hide the default cursor on desktop.
2. **Update `src/components/Hero.tsx`**: Replace standard elements with `motion.div` and apply `useScroll` to create parallax for the glow and content.
3. **Update `src/components/Services.tsx`**: Convert the `.service-card` to a `motion.article`, add mouse tracking for 3D rotation, and apply `translateZ` to the inner content.

**Verification Method**
- Build the project using `npm run build` to ensure TypeScript and Vite compile correctly without warnings.
- Run `npm run dev` and manually verify:
  - Scrolling down the Hero section moves the background glow at a different rate than the text.
  - The custom cursor follows the mouse smoothly and changes shape/color when hovering over buttons or cards.
  - Hovering and moving the mouse inside a Service Card tilts the card in 3D relative to the mouse position.
- Run the Playwright E2E tests (`npx playwright test`, if configured) to ensure no clickability regressions were introduced by the custom cursor (e.g., ensure `pointer-events: none` is set on the custom cursor).
