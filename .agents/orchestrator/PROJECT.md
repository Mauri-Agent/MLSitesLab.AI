# Project: MLSitesLab.AI Redesign

## Architecture
- Single Page Application built with Vite, React, and TypeScript.
- Using `framer-motion` for complex animations and micro-interactions.
- Using `three` and `@react-three/fiber` for premium 3D animations (3D neural network loader).
- Components split into modular files in `src/components/`.
- Styling: standard CSS or CSS modules utilizing the "Green Arrow" / Dark Green palette.

## Code Layout
- `src/App.tsx` - Main entry point.
- `src/components/InteractiveFunnel.tsx` - Interactive Funnel (Chat + Node Graph), positioned immediately below the Hero section.
- `src/components/Hero.tsx` - Classical Hero section, positioned at the very top of the page.
- `src/components/Navbar.tsx` - Navigation bar.
- `src/components/Services.tsx` - 3D-tilt service cards grid.
- `src/components/Portfolio.tsx` - Portfolio section.
- `src/components/Footer.tsx` - Footer with contact/links.
- `src/components/Cursor.tsx` - Double cursor with spring physics.
- `src/components/Loader.tsx` - WebGL 3D neural network canvas loader.
- `src/styles/` & `src/index.css` - Stylesheets.
- `tests/` or `e2e/` - E2E tests (Playwright).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Componentization & Layout | Refactor `App.tsx` into modular components. Base "Dark Green" palette. | none | DONE |
| 2 | UI/UX Bug Fixes & Layout | Keep `Hero` at the very top of the page, and position `InteractiveFunnel` immediately below it. Fix double greeting in chat, stuck general scroll, and auto-scroll in chat terminal. | M1 | IN_PROGRESS |
| 3 | 3D Loader Integration | Install NPM libraries (three, @react-three/fiber, @react-three/drei, @types/three). Replace 2D SVG loader with a premium WebGL 3D Neural Network loader. | M2 | PLANNED |
| 4 | Optimization & Security | Add lazy loading, verify security attributes (rel="noopener"), clear TypeScript/build warnings, and pass 100% E2E test suite. | M3 | PLANNED |

## Interface Contracts
### App ↔ Components
- Components will accept standard React props.
- `Hero` acts as the first main section (at the very top).
- `InteractiveFunnel` acts as the section immediately below `Hero`.
- `Loader` triggers `onComplete` after animation finishes to transition to main app.
