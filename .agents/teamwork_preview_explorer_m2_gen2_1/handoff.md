# Handoff Report: Iteration 1 Animation Failures

## 1. Observation
- **Issue 1 (Hero Parallax):** In `src/components/Hero.tsx:19` and `26`, `style={{ y: glowY }}` and `style={{ y: contentY }}` are applied to `motion.div` elements that simultaneously define `initial={{ opacity: 0, y: 30 }}` and `animate={{ opacity: 1, y: 0 }}`.
- **Issue 2 (Service Card):** In `src/components/Services.tsx:62`, `rotateX: isDesktop ? rotateX : 0` conditionally assigns either a `MotionValue` (`rotateX`) or a primitive `number` (`0`) to the style prop.
- **Issue 3 (Cursor Jitter):** In `src/components/Cursor.tsx:70`, the `motion.div` passes a string `transition: 'scale 0.2s ease, background-color 0.2s ease'` to the style object. This applies a raw CSS transition alongside `useSpring` bindings.
- **Issue 4 (Global Cursor Lock):** In `src/styles/App.css:219`, an unconditional CSS block `@media (pointer: fine) { body, a, button, .service-card { cursor: none !important; } }` hides the cursor globally.
- **Issue 5 (Mouse Event Performance):** In `src/components/Cursor.tsx:38-42`, `const isHoverable = target.closest('a, button, .service-card');` is executed synchronously inside the `mousemove` handler.

## 2. Logic Chain
- **Issue 1:** Framer Motion experiences race conditions when a property (like `y`) is controlled by both an animation prop (`initial`/`animate`) and a bound `MotionValue` (`style`). Separating these onto nested elements prevents them from fighting for control over the transform string.
- **Issue 2:** Framer Motion requires bound style values to maintain consistent types. Switching from `MotionValue` to a primitive primitive `number` triggers an internal warning and breaks the animation binding. Passing the `MotionValue` unconditionally avoids this; since the `mousemove` event ignores mobile interactions, the default `0` value is preserved natively.
- **Issue 3:** The inline CSS `transition` string applies browser-level CSS transitions to all properties, including `transform` (which `x` and `y` map to). These CSS transitions run asynchronously and fight with Framer Motion's `useSpring` continuous `requestAnimationFrame` updates, causing severe visual jitter. Using Framer's `animate` prop for scale/color correctly delegates the transition.
- **Issue 4:** A CSS-only approach hides the cursor immediately, even before React hydrates or if JS is disabled entirely. Injecting a CSS class to `document.body` strictly within a `useEffect` ensures the system cursor is only hidden when the custom React cursor is actively tracking.
- **Issue 5:** Querying the DOM via `.closest()` on every `mousemove` blocks the main thread due to the high polling rate of the mouse. Splitting hover detection into standard `mouseover`/`mouseout` events drastically reduces DOM queries, as they only fire when crossing element boundaries.

## 3. Caveats
- No major caveats. The fixes align completely with Framer Motion documentation and standard React performance patterns.

## 4. Conclusion
1. **Hero Parallax:** Wrap the animated contents in `Hero.tsx` with nested `motion.div`s. Let the parent handle the `initial` and `animate` lifecycle, and apply the scroll-based `style={{ y: contentY }}` to the inner element (or vice versa).
2. **Service Card:** Remove the conditional `isDesktop ? rotateX : 0` in `Services.tsx`. Pass `rotateX` and `rotateY` directly to the style object unconditionally.
3. **Cursor Jitter:** In `Cursor.tsx`, remove the raw CSS `transition` string from the style object. Move `scale`, `backgroundColor`, and `border` into an `animate={{}}` prop, and define a Framer Motion `transition={{ type: 'tween' }}` object.
4. **Cursor Lock:** Remove the `@media (pointer: fine)` block from `App.css`. In `Cursor.tsx`, add `document.body.classList.add('custom-cursor')` inside the mount `useEffect`, and define `.custom-cursor { cursor: none !important; }` (for body, a, button) in the CSS.
5. **Cursor Performance:** In `Cursor.tsx`, restrict the `mousemove` listener to purely update `cursorX.set()` and `cursorY.set()`. Move the `target.closest` logic to separate `mouseover` and `mouseout` event listeners on `window`.

## 5. Verification Method
- **Issue 1:** Check `Hero.tsx` rendering; the entrance animation should complete without snapping, followed by smooth scroll parallax.
- **Issue 2:** Toggle responsive mode in the browser. The console should be free of Framer Motion "type switching" unhandled warnings.
- **Issue 3:** Move the custom cursor rapidly; it should trail the mouse smoothly without jittering.
- **Issue 4:** Disable JavaScript in browser developer tools; the default OS cursor should remain visible on desktop.
- **Issue 5:** Profile the performance tab in Chrome DevTools while moving the mouse rapidly. The `mousemove` event duration should be <0.1ms, eliminating layout thrashing warnings.
