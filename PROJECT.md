# Project: MLSitesLab.AI Optimization & Fixes

## Architecture
- Single Page Application built with Vite, React, and TypeScript.
- Using `framer-motion` for complex animations and micro-interactions.
- Using `three` and `@react-three/fiber` for premium 3D animations (3D neural network loader).
- Components split into modular files in `src/components/`.
- Styling: standard CSS or CSS modules utilizing the "Green Arrow" / Dark Green palette.

## Code Layout
- `src/App.tsx` - Main entry point.
- `src/components/Hero.tsx` - Classical Hero section (positioned above the funnel).
- `src/components/InteractiveFunnel.tsx` - Interactive Funnel (Chat + Node Graph), positioned immediately below `Hero.tsx`.
- `src/components/Navbar.tsx` - Navigation bar.
- `src/components/Services.tsx` - 3D-tilt service cards grid.
- `src/components/Portfolio.tsx` - Portfolio section.
- `src/components/Footer.tsx` - Footer with contact/links.
- `src/components/Cursor.tsx` - Double cursor with spring physics.
- `src/components/Loader.tsx` - WebGL 3D neural network canvas loader.
- `src/styles/` & `src/index.css` - Stylesheets.
- `e2e/` - E2E tests (Playwright).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Componentization & Layout | Refactor `App.tsx` into modular components. Base "Dark Green" palette. | none | DONE |
| 2 | Bug Fixes, 3D Loader & layout re-centering | Move `InteractiveFunnel` below Hero. Fix double greeting in chat, scroll, auto-scroll. Add 3D Neural Network loader. | M1 | DONE |
| 3 | Scroll & Chat Autofocus | Optimize viewport scroll. Premium capsule scrollbar custom styles. Autofocus terminal chat input. | M2 | IN_PROGRESS |
| 4 | AI Node Tracing | AI tags in systemPrompt. Frontend activation of nodes & stripping of tags. | M3 | IN_PROGRESS |
| 5 | E2E Test Suite Fixing | Update Playwright test suite to pass 100%. Fix text search, typing lifecycle, greeting text, scroll btn force click. | M4 | IN_PROGRESS |
| 6 | Deployment & Audit | EasyPanel deployment and Forensic integrity audit. | M5 | PLANNED |

## Interface Contracts
### App ↔ Components
- Components will accept standard React props.
- `Hero` acts as the first main section (above the funnel).
- `InteractiveFunnel` is positioned directly below `Hero`.
- `Loader` triggers `onComplete` after animation finishes to transition to main app.
