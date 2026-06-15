# Scope: E2E Testing Track

## Architecture
- Playwright for opaque-box E2E testing.
- Target resolutions: Mobile (375px) and Desktop (1080px).
- Tests stored in `e2e/` directory.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1_Setup_Tier1 | Playwright installation, playwright.config.ts setup, and Tier 1 (Feature Coverage) test cases for Responsive Layout, Clickability, and Build Reliability | none | IN_PROGRESS |
| 2 | M2_Tiers2_3_4 | Tier 2 (Boundary), Tier 3 (Cross-Feature), and Tier 4 (Real-World) test cases | M1_Setup_Tier1 | PLANNED |
| 3 | M3_TestReady | Generate TEST_READY.md and verify the final coverage summary | M2_Tiers2_3_4 | PLANNED |

## Interface Contracts
### `npm install -D @playwright/test`
- Setup environment
### `npx playwright test`
- Command to run the E2E test suite.
