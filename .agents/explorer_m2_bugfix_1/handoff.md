# Handoff Report: Milestone 2 Bug Fixes

## 1. Observation
1. **Magnetic Cursor Gap**: `Cursor.tsx` changes scale/color via `isHovering` state, but the `mousemove` event strictly tracks `e.clientX/Y` without any magnetic snapping to element centers.
2. **Hero.tsx Conflict**: Line 26 uses `style={{ y: contentY }}` (parallax) and line 28 uses `animate={{ opacity: 1, y: 0 }}` on the same `.hero-content` `motion.div`.
3. **Services.tsx MotionValue Warning**: Line 62 applies a conditional hook: `rotateX: isDesktop ? rotateX : 0`, which violates Framer Motion's hook rules for style props.
4. **Cursor.tsx Jitter**: Line 70 defines a native CSS `transition: 'scale 0.2s ease, background-color 0.2s ease'` on a `motion.div` that is actively being manipulated by Framer Motion's `x` and `y` springs.
5. **App.css Global Cursor**: Lines 219-223 unconditionally set `cursor: none !important;` inside a `@media (pointer: fine)` block, hiding the cursor even if JavaScript fails.
6. **Cursor.tsx Main-thread Blocking**: Lines 34-43 run `target.closest` and `setIsHovering` on every single `mousemove` event, triggering React state updates constantly.

## 2. Logic Chain
1. **Magnetic Cursor**: The term "gap" means the magnetic snapping requirement is unfulfilled. To fix this, the cursor must lock or pull towards the center of hovered interactive elements.
2. **Hero.tsx**: Mixing `style` transformations driven by `useScroll` with `animate` transformations on the exact same property (`y`) causes collisions in Framer Motion. They must be decoupled into nested elements.
3. **Services.tsx**: Framer Motion expects a stable reference type for motion values. By always passing the `rotateX` and `rotateY` variables to `style` unconditionally, we avoid the warning. Mobile protection is already handled via event early-returns.
4. **Cursor.tsx Jitter**: Native CSS transitions fight with Framer Motion's per-frame updates. Moving `scale` and `backgroundColor` logic to the `animate` prop using Framer Motion's `transition` property eliminates jitter.
5. **App.css Global Cursor**: Hardcoded CSS makes the site inaccessible without JS. Scoping the hidden cursor to a class (e.g., `.custom-cursor-active`) added by JS ensures graceful degradation.
6. **Cursor.tsx Blocking**: High-frequency `mousemove` events shouldn't contain DOM traversal (`closest`) or trigger React re-renders. Moving hover detection to low-frequency `mouseover`/`mouseout` events solves the performance issue.

## 3. Caveats
- For the magnetic cursor, if an element moves or the page scrolls while hovered, a static bounding box calculation might become slightly misaligned. This is acceptable for a simple portfolio magnetic effect, but for robustness, calculating the bounding box dynamically or using the element ref on `mousemove` might be needed.
- Ensuring `App.css` only hides the cursor when JS is loaded requires modifying both `Cursor.tsx` (to add/remove the class) and `App.css`.

## 4. Conclusion & Fix Strategy
**Proposed Fixes for the Worker:**

1. **Magnetic Cursor Gap**: In `Cursor.tsx`, update the logic so that when an element is hovered, the cursor calculates the target's center and uses `cursorX.set()` / `cursorY.set()` to pull towards that center, creating the magnetic effect.
2. **Hero.tsx Parallax**: Wrap the content inside `.hero-content` with a second nested `motion.div`. Assign `style={{ y: contentY }}` to the outer div, and `initial/animate` for entrance to the inner div.
3. **Services.tsx Warning**: Remove the conditional `isDesktop ? ... : 0` from the `style` prop. Always pass `rotateX` and `rotateY`. The `!isDesktop` checks in the mouse handlers already keep these values at `0` for mobile.
4. **Cursor.tsx Jitter**: Remove the native CSS `transition` property from `Cursor.tsx`. Use Framer Motion's `animate` prop for `scale`, `backgroundColor`, and `border`, combined with a `transition={{ duration: 0.2 }}`.
5. **App.css Global Cursor**: Modify `App.css` to use `body.custom-cursor-active`. In `Cursor.tsx`, add `document.body.classList.add('custom-cursor-active')` inside the `useEffect` when `isDesktop` is true.
6. **Cursor.tsx Blocking**: Refactor `Cursor.tsx` to use `mouseover` and `mouseout` event listeners for setting `isHovering`. Strip the `mousemove` handler down to only call `cursorX.set()` and `cursorY.set()`.

## 5. Verification Method
- **Hero**: Run `npm run dev` and verify `Hero` parallax and fade-in both execute without console warnings.
- **Services**: Open console and ensure no "MotionValue" warnings appear when resizing or interacting.
- **Cursor Jitter / Perf**: Profile performance in Chrome DevTools to ensure `mousemove` runs within ~1ms and does not trigger React commits.
- **JS Disabled**: Disable JS in Chrome, reload the page, and verify the default system cursor appears.
- **Magnetic**: Hover over `.service-card` and observe the cursor snapping or pulling towards its center.
