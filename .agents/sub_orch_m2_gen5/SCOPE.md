# Scope: Milestone 2: UI/UX Bug Fixes & Layout Hero

## Architecture
- Single Page Application built with React, Vite, TypeScript, and Framer Motion.
- UI elements to refactor/fix: `src/App.tsx`, `src/components/InteractiveFunnel.tsx`, `src/components/CommandTerminal.tsx`, `src/index.css`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Layout Restructuring | Keep `Hero` at the very top of the page, and position `InteractiveFunnel` immediately below it. | M1 | PLANNED |
| 2 | Double Greeting Fix | Resolve StrictMode double-fetch/double-render in `InteractiveFunnel.tsx`. | M1 | PLANNED |
| 3 | Page Scroll Unlocking | Ensure `html` and `body` styles allow natural scrolling. | M1 | PLANNED |
| 4 | Terminal Scroll Fix | Replace window/body scrollIntoView with direct container scrollTop scroll inside `CommandTerminal.tsx`. | M1 | PLANNED |

## Interface Contracts
- `Hero` behaves as the Hero section at the very top of the main container.
- `InteractiveFunnel` behaves as the section immediately below `Hero`.
- Chat auto-scrolling is container-contained, avoiding page-level jumps.
