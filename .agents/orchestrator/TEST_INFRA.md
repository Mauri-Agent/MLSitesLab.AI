# E2E Test Infra: MLSitesLab.AI

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross-feature) | Tier 4 (Real-world) |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| 1 | Responsive Layout | ORIGINAL_REQUEST.md | 5      | 5      | ✓      | ✓      |
| 2 | Clickability | ORIGINAL_REQUEST.md | 5      | 5      | ✓      | ✓      |
| 3 | Build Reliability | ORIGINAL_REQUEST.md | 5      | -      | -      | ✓      |
| 4 | Chat Greetings | ORIGINAL_REQUEST.md (Follow-up) | 5 | - | ✓ | ✓ |
| 5 | Scroll Functionality | ORIGINAL_REQUEST.md (Follow-up) | 5 | 5 | ✓ | ✓ |
| 6 | Chat Auto-Scroll | ORIGINAL_REQUEST.md (Follow-up) | 5 | 5 | ✓ | ✓ |
| 7 | 3D Loader | ORIGINAL_REQUEST.md (Follow-up) | 5 | - | ✓ | ✓ |
| 8 | Layout Order | ORIGINAL_REQUEST.md (Follow-up) | 5 | - | ✓ | ✓ |

## Test Architecture
- Test runner: Playwright (`@playwright/test`)
- Test case format: `.spec.ts` files in `e2e/` or `tests/` directory.
- Test invocation: `npx playwright test` (using configs for Mobile (375px) and Desktop (1080px)).

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (where boundaries exist)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
