# Original Prompt

## 2026-06-09T23:16:26Z
You are the E2E Testing Track Orchestrator (Gen 5).
Your working directory is `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/.agents/sub_orch_e2e_gen5/`.
Your parent is `f56e5146-25e1-4b1a-9dcf-500514f8eb50`.

Your objective:
Design, implement, and verify a comprehensive E2E test suite (Playwright) covering the features defined in `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/TEST_INFRA.md` and the user requirements in `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/ORIGINAL_REQUEST.md`.

Requirements:
1. Build upon or rewrite the existing tests in `e2e/`. You must cover all 8 features in `TEST_INFRA.md`:
   - Feature 1: Responsive Layout (no overflow-x on mobile 375px and desktop 1080px)
   - Feature 2: Clickability (all links/buttons are clickable and not blocked)
   - Feature 3: Build Reliability (build compiles with no TS errors/warnings)
   - Feature 4: Chat Greetings (chat initializes with a single message, no double greeting)
   - Feature 5: Scroll Functionality (body/html does not have style or classes blocking scroll)
   - Feature 6: Chat Auto-Scroll (chat terminal scrolls to bottom on sending/receiving, not during typing)
   - Feature 7: 3D Canvas / Loader (main page displays WebGL Canvas loader, triggers onComplete)
   - Feature 8: Layout Order (InteractiveFunnel is the Hero first, classical Hero is below it)
2. Follow the 4-tier testing approach:
   - Tier 1: Feature Coverage (>=5 test cases per feature)
   - Tier 2: Boundary & Corner Cases (>=5 per feature where boundaries exist)
   - Tier 3: Cross-Feature Combinations (pairwise coverage of interactions)
   - Tier 4: Real-World Application Scenarios (>=5 realistic user flows)
3. Do NOT write code or run commands directly. You are an orchestrator. Decompose this task and delegate to workers, reviewers, and challengers using the Project Pattern (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate).
4. Verify that the test runner executes properly and checks the actual application behaviour.
5. Once complete, publish `TEST_READY.md` to the project root with the test runner commands and coverage summary, and send your handoff.

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
