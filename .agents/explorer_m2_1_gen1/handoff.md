# Handoff Report: Milestone 2 Implementation Strategy

## 1. Observation
- `package.json` confirms `framer-motion` (v12.40.0) is installed.
- The UI is split into clean, modular components: `src/components/Hero.tsx`, `src/components/Services.tsx`, `src/components/Portfolio.tsx`, and `src/components/Navbar.tsx`.
- Currently, standard HTML tags (`div`, `section`, `article`) are used without animations.
- `App.css` handles hover effects via standard CSS transitions (e.g. `transform: translateY(-5px)` on `.service-card:hover`).
- `ORIGINAL_REQUEST.md` requires: 3D card effects, magnetic cursors, and parallax effects to achieve a "WOW effect" while maintaining responsiveness and avoiding horizontal overflow (`overflow-x: hidden` is set in `index.css`).

## 2. Logic Chain
- **Magnetic Cursor**: To implement a magnetic cursor, we need a new component (`src/components/Cursor.tsx`) that uses `motion.div` bound to window mouse coordinates. For the "magnetic" snap effect on buttons, buttons in `Hero.tsx` can calculate mouse proximity and apply subtle translations using `framer-motion`'s `useMotionValue` and `useSpring`.
- **3D Card Effects**: The `Services.tsx` component iterates over an array to render cards. Converting `<article>` to `<motion.article>` and listening to `onMouseMove` allows calculating cursor position relative to the card center. Binding these calculations to `rotateX` and `rotateY` via `useTransform` will create the 3D tilt effect.
- **Parallax**: In `Hero.tsx`, the background glow (`.hero-glow`) and text can be decoupled from standard scrolling. Using `useScroll` and `useTransform` from `framer-motion`, their `y` values can move at different rates relative to the scroll position.
- **Scroll Reveal**: Sections like `Services` and `Portfolio` should fade and slide in when entering the viewport using `<motion.section>` with `initial`, `whileInView`, and `viewport={{ once: true, amount: 0.2 }}`.

## 3. Caveats
- **Performance & Mobile**: Complex 3D transformations and custom cursors can degrade performance or UX on mobile devices. Custom cursors should be hidden via CSS for touch devices (`@media (pointer: coarse) { display: none; }`). Parallax effects should be subtle to avoid painting lag.
- **Overflow Issues**: `framer-motion` animations, particularly transforms and scaling, can inadvertently cause elements to exceed the viewport width, triggering horizontal scrollbars. We must ensure `overflow: hidden` on parent containers or keep transform values conservative.
- **Existing CSS Transitions**: Mixing `framer-motion` with existing CSS `transition: all 0.4s ease` (like on `.service-card`) can cause stuttering. We should remove CSS `transform` and `transition` properties from elements that will be animated by `framer-motion`.

## 4. Conclusion
**Action Plan for Implementer**:
1. **Create `Cursor.tsx`**: Implement a global custom cursor using `motion.div` and add it to `App.tsx`. Apply magnetic pull effects to `<button>` elements in `Hero.tsx` using `onMouseMove`.
2. **Update `Services.tsx`**: Change `<article>` to `<motion.article>`. Implement `onMouseMove` to calculate mouse offsets and map them to `rotateX`/`rotateY` with a `transformPerspective: 1000`. Remove existing CSS hover transforms.
3. **Update `Hero.tsx`**: Use `useScroll` to apply a parallax effect (slower scrolling) to `.hero-glow` and `.hero-content`.
4. **General Animations**: Wrap key sections in `motion.section` and add `whileInView` for smooth entrance animations (fade-in + slide-up).

## 5. Verification Method
- **Visual Testing**: Run `npm run dev`. Navigate the site to ensure the custom cursor is active, Services cards tilt in 3D on hover, and the Hero section moves with parallax when scrolling.
- **Responsiveness Check**: Use DevTools to simulate 375px (Mobile) and 1080px (Desktop). Ensure the custom cursor does not interfere with touch events and there is absolutely no horizontal scrolling.
- **Automated Testing**: Run Playwright tests (`npx playwright test` if configured) to verify no elements fall outside the horizontal viewport, and that all buttons/links remain clickable after animations resolve.
- **Build**: Run `npm run build` to verify no TypeScript or build errors are introduced by `framer-motion` types.
