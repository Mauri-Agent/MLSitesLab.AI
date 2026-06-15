# Handoff Report

## 1. Observation
- **Hero.tsx (Lines 24-28):** Parallax is configured with `style={{ y: contentY }}` while an entrance animation uses `initial={{ y: 30 }}` and `animate={{ y: 0 }}` on the same `<motion.div>`.
- **Services.tsx (Lines 52-53):** The 3D rotation conditionally applies MotionValues or primitive numbers: `rotateX: isDesktop ? rotateX : 0`.
- **Cursor.tsx (Line 61):** Framer Motion values `x: cursorXSpring` and `y: cursorYSpring` are used alongside native CSS `transition: 'scale 0.2s ease...'`.
- **Cursor.tsx (Lines 40-42):** Within the high-frequency `mousemove` event, `target.closest('a, button, .service-card')` and a React state setter (`setIsHovering`) are invoked repeatedly.
- **Cursor.tsx (Lines 37-38):** The cursor's position is strictly bound to `e.clientX` and `e.clientY`, lacking the logic to pull the coordinates toward the center of a hovered element (the "magnetic" gap).
- **App.css (Lines 159-163):** `cursor: none !important;` is applied via a static CSS media query `@media (pointer: fine)`, regardless of whether JavaScript successfully mounts the custom cursor component.

## 2. Logic Chain
- **Hero Parallax Conflict:** Framer Motion struggles to reconcile driving the `y` axis via a scroll-linked `MotionValue` (`style={{y}}`) and a time-based animation (`animate={{y}}`) simultaneously. They must be decoupled into separate nested elements.
- **Services Rotate Warning:** React and Framer Motion warn when a style property switches between a `MotionValue` instance and a raw number across renders. Unconditionally passing `rotateX` / `rotateY` to `style` and merely leaving their values at `0` on mobile avoids the warning.
- **Cursor Jitter:** Native CSS `transition` applies broadly and fights Framer Motion's frame-by-frame inline style `transform` updates. Migrating non-positional transitions (`scale`, `backgroundColor`) to Framer Motion's native `animate` and `transition` props resolves the jitter.
- **Cursor Performance:** DOM traversal (`closest`) and state updates on every `mousemove` event block the main thread. Transitioning to `mouseover` and `mouseout` events for state management decouples hover detection from coordinate tracking.
- **Magnetic Cursor:** To achieve a magnetic effect, the script needs a reference to the currently hovered element to compute its bounding box center, applying a gravitational "pull" (e.g., 20%) to the standard mouse coordinates.
- **CSS Global Cursor:** Hardcoding `cursor: none` harms accessibility if the JS payload fails. Dynamically injecting a class like `.custom-cursor-enabled` into `document.body` during the `useEffect` ensures the default cursor hides *only* when the custom one is active.

## 3. Caveats
- The magnetic cursor logic uses a linear pull towards the center of an element. The specific interpolation factor (e.g., 0.2) may need tuning based on UX preference.
- I assume all interactive elements are covered by the `'a, button, .service-card'` selector.
- The `Hero.tsx` fix requires an extra DOM node (a wrapper `motion.div`), which slightly alters the DOM tree but will not affect flexbox layout if structured correctly.

## 4. Conclusion
The reported bugs are directly present in the source files and correctly identified. The resolution strategy requires:
1. **Hero.tsx:** Nesting `animate` logic inside the `style` parallax container.
2. **Services.tsx:** Removing the ternary operator in `style` for `rotateX`/`rotateY`.
3. **Cursor.tsx:** Replacing CSS transitions with Framer Motion `animate` props.
4. **Cursor.tsx:** Changing hover detection to `mouseover`/`mouseout` listeners and applying a center-biased coordinate calculation for the magnetic effect.
5. **App.css:** Scoping `cursor: none` to `body.custom-cursor-enabled` and toggling this class via `Cursor.tsx`'s lifecycle.

## 5. Verification Method
- **Hero Parallax:** Scroll down; the text should rise smoothly while simultaneously sliding based on scroll depth.
- **Services Warnings:** Open browser DevTools console; verify no Framer Motion `MotionValue` warnings appear on load or resize.
- **Cursor Jitter & Performance:** Rapidly move the mouse; ensure smooth frame rates without visual tearing. DevTools Performance tab should show minimal `mousemove` execution time.
- **Magnetic Cursor:** Hover over a button; verify the cursor dot deviates from the literal mouse pointer and snaps partially toward the center of the button.
- **Graceful Degradation:** Disable JavaScript; verify the system cursor is visible.

---

### Implementation Details for the Worker:

**Hero.tsx Fix:**
```tsx
<motion.div style={{ y: contentY }}>
  <motion.div
    className="hero-content"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {/* content */}
  </motion.div>
</motion.div>
```

**Services.tsx Fix:**
```tsx
style={{
  rotateX: rotateX,
  rotateY: rotateY,
  transformStyle: "preserve-3d"
}}
// Ensure x.set(0) and y.set(0) handles the mobile state.
```

**Cursor.tsx Fix:**
```tsx
// State and Refs
let hoverTarget: HTMLElement | null = null;

// Inside useEffect for events:
const handleMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const hoverable = target?.closest?.('a, button, .service-card') as HTMLElement;
  if (hoverable) {
    setIsHovering(true);
    hoverTarget = hoverable;
  }
};

const handleMouseOut = (e: MouseEvent) => {
  setIsHovering(false);
  hoverTarget = null;
};

const moveCursor = (e: MouseEvent) => {
  if (hoverTarget) {
    const rect = hoverTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const magneticX = centerX + (e.clientX - centerX) * 0.2;
    const magneticY = centerY + (e.clientY - centerY) * 0.2;
    cursorX.set(magneticX - 16);
    cursorY.set(magneticY - 16);
  } else {
    cursorX.set(e.clientX - 16);
    cursorY.set(e.clientY - 16);
  }
};

// Also apply body class:
document.body.classList.add('custom-cursor-enabled');
// In cleanup: document.body.classList.remove('custom-cursor-enabled');

// Return component:
return (
  <motion.div
    style={{
      position: 'fixed', left: 0, top: 0, width: 32, height: 32,
      borderRadius: '50%', pointerEvents: 'none', zIndex: 9999,
      x: cursorXSpring, y: cursorYSpring,
    }}
    animate={{
      scale: isHovering ? 1.5 : 1,
      backgroundColor: isHovering ? 'rgba(15, 203, 84, 0.4)' : 'rgba(15, 203, 84, 0.8)',
      border: isHovering ? '1px solid rgba(15, 203, 84, 0.8)' : 'none',
    }}
    transition={{ duration: 0.2 }}
  />
);
```

**App.css Fix:**
```css
@media (pointer: fine) {
  body.custom-cursor-enabled, 
  body.custom-cursor-enabled a, 
  body.custom-cursor-enabled button, 
  body.custom-cursor-enabled .service-card {
    cursor: none !important;
  }
}
```
