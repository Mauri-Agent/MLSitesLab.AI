# Handoff Report: Iteration 2 - Animations & Interactions Fix Strategy

## 1. Observation
- **Hero Parallax Conflict**: In `src/components/Hero.tsx:24-29`, the `motion.div` (`.hero-content`) defines both `style={{ y: contentY }}` (scroll-driven `MotionValue`) and `animate={{ y: 0 }}` with `initial={{ y: 30 }}` (time-driven animation).
- **Service Card Type Switching**: In `src/components/Services.tsx:61-63`, the `.service-card` `motion.article` defines `style={{ rotateX: isDesktop ? rotateX : 0, ... }}`. It dynamically switches the prop value between a `MotionValue` (`rotateX`) and a primitive number (`0`).
- **Cursor Transition Jitter**: In `src/components/Cursor.tsx:55-71`, the `.cursor` `motion.div` defines `x: cursorXSpring` and `y: cursorYSpring` inside `style`, but also applies a raw CSS transition: `transition: 'scale 0.2s ease, background-color 0.2s ease'` within the `style` object, instead of using Framer Motion's native `animate` and `transition` props.
- **Global Cursor Lock**: In `src/styles/App.css:219-223`, `cursor: none !important` is applied globally inside a `@media (pointer: fine)` block, strictly independent of JavaScript state.
- **Mouse Event Performance**: In `src/components/Cursor.tsx:38-42`, `e.target.closest('a, button, .service-card')` is evaluated synchronously inside the `mousemove` event handler.

## 2. Logic Chain
- **Issue 1**: Framer Motion attempts to control the `y` transform via the `useScroll` `contentY` value and simultaneously via the `animate` lifecycle. This race condition causes jumpy animations. Separating the scroll transform and entrance animation into nested `motion.div`s resolves this conflict by composing the transforms.
- **Issue 2**: Framer Motion optimizes rendering by tracking `MotionValue` instances. When the value type switches from `MotionValue` to a primitive `0`, it triggers an internal warning. Because `handleMouseMove` already guards against updating `x` and `y` when `!isDesktop`, the `rotateX` and `rotateY` `MotionValue`s naturally evaluate to `0deg`. Therefore, we can safely pass the `MotionValue`s unconditionally.
- **Issue 3**: Mixing CSS `transition` with Framer Motion's style injection (which natively manages transforms) causes the browser to attempt to interpolate values that Framer Motion is already animating at 60fps, creating jitter. Moving `scale` and `backgroundColor` to the `animate` prop and using Framer Motion's `transition` prop centralizes animation logic and eliminates CSS conflicts.
- **Issue 4**: If JavaScript is disabled or fails to load, the user cannot see their cursor, violating basic accessibility. Tying the `cursor: none` CSS rule to a specific `body` class (e.g., `has-custom-cursor`) injected by `Cursor.tsx` upon mount ensures the default cursor is only hidden when the custom JS cursor is actively running.
- **Issue 5**: The `mousemove` event fires continuously. Running DOM traversal (`closest`) on every pixel movement blocks the main thread. Switching the hover detection to a `mouseover` event listener decouples it from cursor movement, as `mouseover` only fires when the cursor crosses element boundaries.

## 3. Caveats
- The global cursor lock fix assumes the `.has-custom-cursor` class is managed correctly in `Cursor.tsx` cleanup (removed in `useEffect` return).
- Applying `mouseover` for hover detection means the state will only update when elements are physically entered. If an interactive element dynamically renders or moves beneath a stationary cursor, it may not trigger the hover state immediately. However, this is standard behavior and acceptable for performance.
- Wrapping `.hero-content` in an additional `motion.div` adds an extra DOM node, which is negligible but alters the direct child hierarchy of `.hero`.

## 4. Conclusion
Implement the following fix strategy:
1. **Hero**: Wrap `.hero-content` in a parent `motion.div`. Apply `style={{ y: contentY }}` to the parent, and `initial/animate` to the inner `.hero-content` to safely decouple the transform sources.
2. **Services**: Remove the ternary operator from `style`. Pass `rotateX` and `rotateY` directly: `style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}`.
3. **Cursor (Jitter)**: Remove `scale`, `backgroundColor`, and `transition` from the `style` object. Use `animate={{ scale: isHovering ? 1.5 : 1, backgroundColor: isHovering ? 'rgba(15, 203, 84, 0.4)' : 'rgba(15, 203, 84, 0.8)', border: isHovering ? '1px solid rgba(15, 203, 84, 0.8)' : 'none' }}` and `transition={{ type: "tween", duration: 0.2 }}` on the `motion.div`.
4. **Cursor (Global Lock)**: Modify `App.css` to scope the cursor hiding: `body.has-custom-cursor, body.has-custom-cursor a, body.has-custom-cursor button, body.has-custom-cursor .service-card { cursor: none !important; }`. In `Cursor.tsx`, add `document.body.classList.add('has-custom-cursor')` on mount (and `classList.remove` on unmount).
5. **Cursor (Performance)**: In `Cursor.tsx`, remove `closest()` logic from the `moveCursor` mousemove listener. Create a separate `handleMouseOver` function bound to `window.addEventListener('mouseover', ...)` to efficiently handle the `isHovering` state.

## 5. Verification Method
- **Static Analysis**: Run `npm run build` to verify no TS errors are introduced.
- **Dynamic Testing** (via `npm run dev`):
  1. Scroll past the Hero section. It should smoothly slide up and parallax simultaneously without layout jumps.
  2. Inspect the browser console for Framer Motion warnings related to primitive vs `MotionValue` type switching in Services. None should appear.
  3. Move the custom cursor over buttons. The scale transition should be smooth without stuttering.
  4. Disable JavaScript in the browser settings. The default OS cursor should remain visible.
  5. Profile the React app using DevTools Performance tab. `mousemove` handlers should execute in < 1ms without Layout/DOM query spikes.
