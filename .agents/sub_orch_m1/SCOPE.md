# Scope: Milestone 1 - Componentization & Layout

## Architecture
- Refactor `src/App.tsx` into modular React components under `src/components/`.
- Suggested components: Navbar, Hero, Services, Portfolio (based on the current App.tsx).
- Move styles to `src/styles/` or `src/index.css`.
- Implement base "Dark Green" / "Green Arrow" palette.
- Ensure semantic HTML.
- **Strict Constraint**: No complex animations yet. That is for Milestone 2.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Componentization & Layout | Refactor `App.tsx` into small modular components. Base Dark Green palette. Semantic HTML. | none | DONE |

## Interface Contracts
### App ↔ Components
- Standard React props.
- No heavy state management.
