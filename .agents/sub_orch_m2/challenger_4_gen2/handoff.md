# Handoff Report: Milestone 2 Animations & Interactions Empirical Challenge

## 1. Observation
- In `src/components/Hero.tsx`, the `y` property of the `.hero-content` `motion.div` is bound to a motion value via `style={{ y: contentY }}` (parallax based on scroll) and is simultaneously animated via `initial={{ opacity: 0, y: 30 }}` and `animate={{ opacity: 1, y: 0 }}`.
- In `src/components/Services.tsx`, `rotateX` and `rotateY` inside the `style` prop of the service card are conditionally set using a ternary operator switching between a raw number and a `MotionValue`: `rotateX: isDesktop ? rotateX : 0`.
- In `src/components/Cursor.tsx`, native CSS transitions (`transition: 'scale 0.2s ease, background-color 0.2s ease'`) are applied via `style` on a `motion.div` that is simultaneously having its transforms (`x` and `y`) updated by Framer Motion springs on every frame.
- In `src/styles/App.css`, `cursor: none !important;` is hardcoded globally for desktop users using `@media (pointer: fine)`, regardless of whether JavaScript or the custom cursor component has loaded successfully.
- In `src/components/Cursor.tsx`, `target.closest(...)` and state setter `setIsHovering` are invoked on *every* mousemove event without debouncing or requestAnimationFrame.

## 2. Logic Chain
- **Hero Parallax Conflict**: Framer Motion strictly controls the CSS `transform` property. Setting `animate={{ y: 0 }}` tells Framer Motion to animate `y` to 0, but `style={{ y: contentY }}` tells it to constantly bind `y` to the scroll position. This dual-binding creates a race condition where the static animation and scroll transform fight for control over the `y` axis, leading to severe layout jumping or breaking the parallax effect completely.
- **Service Card Type Switching**: Changing a style value from a literal primitive (`0`) to a `MotionValue` (`rotateX`) post-mount throws internal Framer Motion unhandled warnings and breaks the React rendering cycle bindings for the transform, because it expects homogeneous types for motion properties throughout the component lifecycle.
- **Cursor Transition Jitter**: Because Framer Motion optimizes `x`, `y`, and `scale` by batching them into a single inline `transform: translateX(...) translateY(...) scale(...)` rule, applying a standard CSS `transition` is either ignored or forces the browser to evaluate native CSS transitions simultaneously with Framer Motion's JS-driven requestAnimationFrame updates, leading to jitter, stutter, or dropped frames.
- **Global Cursor Lock**: If a user has JavaScript disabled or if the React app crashes, the CSS rule `@media (pointer: fine) { body { cursor: none; } }` will permanently hide their cursor with no fallback, rendering the site completely inaccessible.
- **Mouse Event Performance**: Querying the DOM (`target.closest`) synchronously inside high-frequency pointer events (`mousemove` fires up to 120 times per second) causes massive main-thread blocking, leading to scroll stutter and animation frame drops.

## 3. Caveats
- Playwright E2E rendering tests failed to mount successfully due to port allocation crashes in the background tasks, so the exact visual degradation of the Hero component was verified via theoretical API constraints of Framer Motion and codebase review rather than automated visual snapshots.
- The impact of the Cursor performance bottleneck is dependent on the end-user's device capabilities; modern CPUs might mask the layout thrashing.

## 4. Conclusion
**Overall risk assessment**: HIGH. The implementation contains critical anti-patterns for Framer Motion that cause degraded UI performance, layout shift conflicts, and severe accessibility failure modes (invisible cursors). The current code fails the robustness and boundary checks.

## 5. Verification Method
- To verify the **Hero conflict**, run `npm run dev` and scroll immediately upon page load; observe the `y` value jitter in DevTools as the initial animation fights the scroll transform.
- To verify the **Cursor accessibility bug**, disable JavaScript in the browser settings and load the page. The cursor will disappear entirely.
- To verify the **Services transform bug**, manually resize the browser window to toggle `isDesktop` while hovering over the service cards, and observe warnings in the DevTools console about unhandled MotionValue bindings.
