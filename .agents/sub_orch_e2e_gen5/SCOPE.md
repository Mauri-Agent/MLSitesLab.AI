# Scope: E2E Testing Track (Gen 5)

## Architecture
- Playwright (`@playwright/test`) for opaque-box E2E testing.
- Target resolutions: Desktop (1080px wide) and Mobile (375px wide).
- E2E tests are stored in the `e2e/` directory.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1_Tier1_FeatureCoverage | Implement Tier 1 tests (>=5 cases per feature) for all 8 features: Responsive Layout, Clickability, Build Reliability, Chat Greetings, Scroll Functionality, Chat Auto-Scroll, 3D Loader, and Layout Order. | none | PLANNED |
| 2 | M2_Tier2_Boundaries | Implement Tier 2 tests (>=5 cases per feature for features with boundaries: Responsive Layout, Clickability, Scroll Functionality, Chat Auto-Scroll) | M1_Tier1_FeatureCoverage | PLANNED |
| 3 | M3_Tiers3_4_Integrations | Implement Tier 3 (Cross-Feature Combinations, >=8 cases) and Tier 4 (Real-World Application Scenarios, >=5 cases) | M2_Tier2_Boundaries | PLANNED |
| 4 | M4_Verification_Ready | Run full E2E test suite on both Desktop and Mobile, resolve any failures, and publish `TEST_READY.md` | M3_Tiers3_4_Integrations | PLANNED |

## Interface Contracts
- Playwright configurations defined in `playwright-e2e.config.ts`.
- Tests run using `npx playwright test --config=playwright-e2e.config.ts`.
- All features verified dynamically against the actual running application.
