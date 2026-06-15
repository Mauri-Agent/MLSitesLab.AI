# Synthesized Implementation Plan for Milestone 2

Based on the analysis of 3 Explorers, here is the unified implementation strategy. You must implement all of the following:

## 1. Magnetic Cursor
- Create `src/components/Cursor.tsx`.
- Use `motion.div` with `useMotionValue` and `useSpring` bound to window `mousemove` (`clientX`/`clientY`).
- Add hover states (e.g., scaling or morphing) when hovering over interactive elements (`a`, `button`, `.service-card`).
- The custom cursor must have `pointer-events: none` so clicks pass through.
- Update `src/styles/App.css` to hide the default cursor (`cursor: none` for `body`, `a`, `button`) **only on desktop** using `@media (pointer: fine)`. Do not hide the cursor on mobile/touch devices.
- Render `<Cursor />` in `src/App.tsx`.

## 2. 3D Card Effect (Services)
- Update `src/components/Services.tsx`.
- Convert the `.service-card` `<article>` into a `<motion.article>`.
- Use `onMouseMove` and `onMouseLeave` to track the cursor position relative to the card's center.
- Use `useMotionValue`, `useTransform`, and `useSpring` to map the position to `rotateX` and `rotateY` (e.g., -15deg to 15deg).
- Set `transformStyle: "preserve-3d"`, `perspective: 1000px` on the parent or card, and apply `translateZ(30px)` to the inner content (like the icon or text) to create depth.
- **Crucial**: Remove the existing CSS `transform` and `transition` from `.service-card:hover` in `src/styles/App.css` to prevent stuttering/conflicts with framer-motion.
- Disable this 3D tilt effect on mobile devices (fallback to static or simple fade).

## 3. Parallax Effect (Hero)
- Update `src/components/Hero.tsx`.
- Convert `.hero-content` and `.hero-glow` to `<motion.div>`.
- Use `useScroll` and `useTransform` to move `.hero-glow` and `.hero-content` along the Y-axis at distinctly different rates as the user scrolls.

## 4. General Entrance Animations
- Update `src/components/Navbar.tsx` to `<motion.nav>` and add an initial slide-down animation (e.g., `initial={{ y: -100 }} animate={{ y: 0 }}`).
- Update sections like `Services.tsx` and `Portfolio.tsx` to use `whileInView` for smooth fade-in/slide-up entrance animations (`viewport={{ once: true, amount: 0.2 }}`).

## General Requirements
- Ensure `overflow-x: hidden` is maintained (check `index.css`) to prevent horizontal scrollbars from transforms.
- Run `npm run build` to ensure no TypeScript or build errors are introduced by `framer-motion` types.
