# Handoff Report: Milestone 2, Iteration 1 Failure Analysis

## 1. Observation

1. **Hero Parallax Conflict**: In `src/components/Hero.tsx`, `.hero-content` explicitly sets `style={{ y: contentY }}` (where `contentY` is bound to scroll) while simultaneously defining `initial={{ opacity: 0, y: 30 }}` and `animate={{ opacity: 1, y: 0 }}`.
2. **Service Card Type Switching**: In `src/components/Services.tsx`, `.service-card` defines its inline style as `style={{ rotateX: isDesktop ? rotateX : 0, rotateY: isDesktop ? rotateY : 0 }}`. `rotateX` and `rotateY` are Framer Motion `MotionValue` objects, while `0` is a primitive number.
3. **Cursor Transition Jitter**: In `src/components/Cursor.tsx`, the cursor's `motion.div` includes inline standard CSS transitions: `transition: 'scale 0.2s ease, background-color 0.2s ease'`, mixed with Framer Motion bounds `x: cursorXSpring` and `y: cursorYSpring`. `scale` and `backgroundColor` are updated conditionally in the `style` object.
4. **Global Cursor Lock**: In `src/styles/App.css`, the default cursor is hidden globally via `@media (pointer: fine) { body, a, button, .service-card { cursor: none !important; } }`. There is no check to ensure JavaScript has successfully initialized the custom cursor.
5. **Mouse Event Performance**: In `src/components/Cursor.tsx`, the `mousemove` event handler executes `e.target.closest('a, button, .service-card')` directly inside `moveCursor`. This handler fires sequentially at the screen's refresh rate.

## 2. Logic Chain

1. **Hero Race Condition**: Framer Motion cannot reliably orchestrate the `y` property when it's simultaneously driven by scroll progress (via `style` binding) and an entrance animation (via `animate`). This dual binding results in a race condition causing erratic jumping.
2. **Type Switching Warning**: Framer Motion expects stable data types in `style` bindings. Switching from a `MotionValue` object to a primitive number (`0`) when `isDesktop` toggles violates this expectation, throwing unhandled warnings.
3. **Cursor Jitter**: Standard CSS `transition` applied to a `motion.div` that is rapidly updating its `transform` (due to x/y springs) causes layout thrashing and jitter, as CSS attempts to transition the entire `transform` matrix every time `x` or `y` update.
4. **JS-Disabled Accessibility**: Applying `cursor: none !important` via plain CSS means if the React application crashes or JS is disabled, users on desktop will have absolutely no pointer visibility.
5. **Main-Thread Blocking**: The `closest()` DOM query forces layout recalculations. Running it synchronously inside `mousemove` events blocks the main thread and noticeably reduces animation frame rates.

## 3. Caveats

- I solely investigated the files responsible for the reported failures (`Hero.tsx`, `Services.tsx`, `Cursor.tsx`, `App.css`).
- Other components utilizing Framer Motion (`Portfolio.tsx`, `Navbar.tsx`) were not fully evaluated for similar overlapping animation bindings, assuming they function properly as they were not cited in the failure list.
- Fallback strategies for mobile users (`!isDesktop`) were verified structurally but not tested on touch interfaces.

## 4. Conclusion

To resolve the 5 listed issues, implement the following architectural fixes:

1. **Hero Parallax**: Separate the concerns by wrapping `.hero-content`. Use an outer `<motion.div>` for the scroll-bound `style={{ y: contentY }}` and an inner `<motion.div>` exclusively for the `initial` and `animate` entrance animations.
2. **Service Card Types**: Bind `style={{ rotateX, rotateY }}` unconditionally to the `MotionValue` variables. Remove the inline ternary operators. Instead, manage the reset in a `useEffect` that calls `x.set(0); y.set(0);` when `isDesktop` becomes false.
3. **Cursor Transitions**: Remove the inline CSS `transition` property. Move `scale` and `backgroundColor` out of `style` and into the Framer Motion `animate={{ scale: isHovering ? 1.5 : 1, backgroundColor: ... }}` prop. Allow Framer Motion to natively tween these attributes.
4. **Cursor Lock**: Modify `Cursor.tsx` to add a specific class (e.g., `document.body.classList.add('custom-cursor')`) on mount if `isDesktop` is true. Update `App.css` to only apply `cursor: none !important` when the `body` contains that `.custom-cursor` class.
5. **Mouse Event Performance**: Remove the DOM querying from the `mousemove` event. Bind `e.clientX` and `e.clientY` exclusively during `mousemove`. Introduce separate `mouseover` and `mouseout` event listeners to the `document` that handle the `e.target.closest(...)` hover state logic.

## 5. Verification Method

- **Hero Parallax**: Reload the page at the top (`#inicio`), verify the entrance animation runs smoothly, then scroll down to verify parallax tracking without jumping.
- **Service Cards**: Resize the browser width or toggle device mode in DevTools to flip `isDesktop` logic back and forth. Verify the React console remains free of `MotionValue` warnings.
- **Cursor Transitions**: Hover over buttons and service cards. Verify the scale morphs cleanly without staggering or stuttering the position.
- **Global Lock**: Disable JavaScript in DevTools and reload. Verify the default OS cursor remains visible.
- **Mouse Event Performance**: Open Chrome DevTools > Performance tab. Record a session while violently moving the mouse. Verify the `mousemove` event duration is minimal and devoid of synchronous DOM layout recalculations.
