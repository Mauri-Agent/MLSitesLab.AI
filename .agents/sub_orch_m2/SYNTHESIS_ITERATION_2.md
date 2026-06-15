# Synthesized Implementation Plan for Milestone 2 - Iteration 2

Based on the analysis of 3 Explorers, the following fixes must be implemented to resolve the bugs from Iteration 1.

## 1. Hero Parallax Conflict (Hero.tsx)
- **Problem**: `y` is dual-bound by `style={{ y: contentY }}` and `animate={{ y: 0 }}`.
- **Fix**: Separate the concerns by nesting two `motion.div`s.
  - The outer `motion.div` should handle the scroll parallax: `style={{ y: contentY }}`.
  - The inner `motion.div` should handle the entrance animation: `initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}`.

## 2. Service Card Type Switching (Services.tsx)
- **Problem**: `rotateX: isDesktop ? rotateX : 0` causes unhandled Framer Motion warnings.
- **Fix**: Pass the `rotateX` and `rotateY` `MotionValue`s unconditionally to the `style` prop. Do not use ternaries switching between `MotionValue` and primitives for transforms. Disable the effect for mobile by ensuring the `onMouseMove` events only update the `MotionValue` on desktop, or by returning `0` inside a `useTransform`.

## 3. Cursor Transition Jitter (Cursor.tsx)
- **Problem**: Native CSS `transition` applied to a `motion.div` fights with Framer Motion `useSpring`.
- **Fix**: Remove the CSS `transition` string from the `style` prop. Use Framer Motion's `animate` prop (e.g., `animate={{ scale, backgroundColor }}`) and `transition` prop to handle hover states, while letting `useSpring` strictly handle `x` and `y`.

## 4. Global Cursor Lock (App.css & Cursor.tsx)
- **Problem**: `@media (pointer: fine) { body { cursor: none !important; } }` hides the cursor globally even if JS crashes or is disabled.
- **Fix**: Remove this CSS rule. Instead, inside `Cursor.tsx`, use a `useEffect` to add a class (e.g., `has-custom-cursor`) to `document.body` only when the component mounts (meaning JS is active). Add a CSS rule in `App.css`: `body.has-custom-cursor { cursor: none; }` and also hide the cursor for interactive elements `body.has-custom-cursor a, body.has-custom-cursor button`.

## 5. Mouse Event Performance (Cursor.tsx)
- **Problem**: Calling `target.closest(...)` on every `mousemove` (120Hz) blocks the main thread.
- **Fix**: Remove hover detection from the `mousemove` event listener. Instead, add separate `mouseover` and `mouseout` event listeners to `window` (or attach them globally) to toggle the `isHovering` state when the event target matches interactive elements.

## Final Step
- Run `npm run build` and ensure all TypeScript errors are resolved and the build completes successfully.
