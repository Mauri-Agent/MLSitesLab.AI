# Original User Request

## 2026-06-09T23:16:26Z

You are the Milestone 2 Sub-orchestrator (Gen 5).
Your working directory is `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/.agents/sub_orch_m2_gen5/`.
Your parent is `f56e5146-25e1-4b1a-9dcf-500514f8eb50`.

Your objective:
Implement the UI/UX Bug Fixes & Layout Hero requirements for Milestone 2 as specified in `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI/PROJECT.md`.

Requirements:
1. Re-structure the layout in `src/App.tsx` so that `InteractiveFunnel` is the main Hero section (first element inside `<main>`), and the classic `Hero` component is positioned below it.
2. Fix UI/UX bugs in the codebase:
   - Double welcome greeting in the chat: ensure that the initial greeting only displays once (fix React 18 StrictMode mount/unmount double-render issue in `InteractiveFunnel.tsx`).
   - Stuck general page scroll: ensure that no CSS properties (like `overflow: hidden` on html/body) block natural scrolling of the page.
   - Chat auto-scroll bug: fix the auto-scroll behavior inside `CommandTerminal.tsx` to prevent incorrect scroll jumps when typing.
3. Follow the Project Pattern (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate).
4. Verify your work using E2E tests (if `TEST_READY.md` is present, run the tests) and unit checks. Ensure it compiles cleanly with `npm run build` and runs without warning.
5. Report back with a detailed handoff when all Milestone 2 tasks are complete and verified.

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade/mock implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
