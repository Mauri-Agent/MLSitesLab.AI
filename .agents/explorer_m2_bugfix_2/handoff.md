# Handoff Report: Milestone 2 (Iteration 2) Bug Fixes

## 1. Observation
I reviewed the files specified in the bug report: `src/components/Hero.tsx`, `src/components/Services.tsx`, `src/components/Cursor.tsx`, and `src/styles/App.css`. I observed the following directly matching the Challenger gaps:

1. **Magnetic Cursor gap**: `Cursor.tsx` scales up and changes color on hover, but does not pull/snap towards the hovered element, which is standard for "magnetic cursors" requested in the scope.
2. **Hero.tsx**: Lines 24-30 contain a `<motion.div className="hero-content">` with both `style={{ y: contentY }}` and `initial={{ y: 30 }} animate={{ y: 0 }}`.
3. **Services.tsx**: Lines 61-65 conditionally pass MotionValues vs primitives: `rotateX: isDesktop ? rotateX : 0`. 
4. **Cursor.tsx**: Line 70 uses a native CSS string: `transition: 'scale 0.2s ease, background-color 0.2s ease'`. `scale` targets the CSS `transform` property, which Framer Motion is simultaneously updating on every frame via `cursorXSpring` and `cursorYSpring`.
5. **App.css**: Lines 219-223 use `@media (pointer: fine) { ... cursor: none !important; }`. This applies globally regardless of JS state.
6. **Cursor.tsx**: Lines 38-42 call `target.closest('a, button, .service-card')` and `setIsHovering(...)` inside the `mousemove` event listener, which executes continuously as the mouse moves.

## 2. Logic Chain

1. **Magnetic Cursor gap**: A magnetic cursor should attract the cursor position towards the center of the hovered element. The current implementation only tracks raw mouse coordinates. We need to calculate the target element's center and interpolate the cursor's position towards it.
2. **Hero.tsx Conflict**: In Framer Motion, applying both a static animation (`animate={{ y: 0 }}`) and a dynamic scroll transform (`style={{ y: contentY }}`) to the same property (`y`) on the same element causes conflicts. Separating these concerns into nested `motion.div`s resolves the clash.
3. **Services.tsx Warning**: Switching between a `MotionValue` object and a raw primitive (`0`) breaks Framer Motion's internal value bindings. Because `x` and `y` are only updated when `isDesktop` is true, the `rotateX` and `rotateY` values will naturally evaluate to `0deg` when idle. Thus, the ternary operator is unnecessary and harmful.
4. **Cursor.tsx Jitter**: Native CSS transitions on `transform` (via `scale`) fight against Framer Motion's frame-by-frame `transform` updates driven by the springs (`x` and `y`). Handing over state-driven animations to Framer Motion's `animate` prop eliminates this conflict.
5. **App.css Global Hide**: Hardcoding `cursor: none` in CSS means if JavaScript crashes or is disabled, the user has no custom cursor *and* no system cursor. Toggling a global class from React ensures the cursor is only hidden when the custom JS cursor is actively mounted and functioning.
6. **Cursor.tsx Main-thread Block**: The `mousemove` event fires dozens of times per second. Running DOM traversals (`closest`) and React state setters so frequently blocks the main thread. Evaluating hover state via `mouseover` and `mouseout` events instead restricts DOM lookups strictly to when the mouse crosses element boundaries.

## 3. Caveats
- For the magnetic cursor, caching the bounding rectangle of the hovered element on `mouseover` is recommended to avoid calling `getBoundingClientRect()` on every `mousemove`, which would cause layout thrashing.
- I assumed the magnetic effect should apply to the custom cursor itself (pulling it towards the center), rather than the buttons moving (which would require modifying every button).
- The analysis was restricted to read-only investigation. No code changes were executed.

## 4. Conclusion
All reported bugs have been verified in the codebase. The implementation strategies are straightforward and isolated to a few files. 

**Recommended Fix Strategy for the Worker:**

1. **Bug 1 (Magnetic Cursor)**: In `Cursor.tsx`, track the hovered element's bounding rect inside `mouseover`. Inside `mousemove`, if hovering, calculate the element's center and set `cursorX`/`cursorY` to an interpolated value (e.g., `center + (mouse - center) * 0.1`).
2. **Bug 2 (Hero Parallax)**: In `Hero.tsx`, wrap `.hero-content` in an outer `<motion.div>` that handles the entry animation (`animate={{ opacity: 1, y: 0 }}`). Apply the parallax `style={{ y: contentY }}` to the inner element.
3. **Bug 3 (Services MotionValue)**: In `Services.tsx`, change the inline style to always pass the MotionValues directly: `rotateX, rotateY`. Remove the `isDesktop ? ... : 0` ternary.
4. **Bug 4 (Cursor Jitter)**: In `Cursor.tsx`, remove the inline `transition` string. Move `scale` and `backgroundColor` into an `animate={{ ... }}` prop on the `<motion.div>`, and add a Framer Motion `transition={{ duration: 0.2 }}` prop.
5. **Bug 5 (Hidden System Cursor)**: Remove the `cursor: none !important` block from `App.css`. In `Cursor.tsx`'s `useEffect`, conditionally add a class `document.body.classList.add('custom-cursor-enabled')`, and define that class in CSS to hide the cursor. Clean up on unmount.
6. **Bug 6 (Performance)**: In `Cursor.tsx`, strip `closest()` out of the `mousemove` handler. Add standard `window.addEventListener('mouseover', ...)` and `mouseout` handlers to run `closest()` and toggle `setIsHovering` only when entering/leaving elements.

## 5. Verification Method
- **Bug 1**: Hover over a button; the custom cursor should pull toward the button's center.
- **Bug 2**: Scroll down the Hero section; the text should parallax smoothly without jumping at the start/end of the load animation.
- **Bug 3**: Inspect the browser console on the Services section; no Framer Motion warnings should appear when resizing or moving the mouse.
- **Bug 4**: Move the mouse quickly while entering/leaving a button; the custom cursor should not stutter or lag.
- **Bug 5**: Disable JavaScript in the browser; the native system cursor should remain visible.
- **Bug 6**: Open Chrome DevTools Performance tab and record a trace while moving the mouse; `mousemove` events should take <1ms, with no forced reflows or heavy scripting blocks.
