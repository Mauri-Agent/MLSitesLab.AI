# Changes Made — Milestone 2

Below is a summary of the layout restructuring and bug fixes implemented:

## 1. Hero Layout Restructuring

- **File**: `src/App.tsx`
  - Swapped the order of `<Hero />` and `<InteractiveFunnel />` inside the `<main>` tag. The `<InteractiveFunnel />` now renders first.
- **File**: `src/styles/App.css`
  - Removed `padding-top: var(--nav-h)` from the `.hero` class definition to adjust to the new position.
- **File**: `src/styles/InteractiveFunnel.css`
  - Added top padding offset and bottom padding to the `.interactive-funnel` container (`padding-top: calc(var(--section-py) + var(--nav-h)); padding-bottom: var(--section-py);`) to prevent overlap with the fixed `Navbar`.

## 2. Double Welcome Greeting Fix

- **File**: `src/components/InteractiveFunnel.tsx`
  - Implemented the `AbortController` pattern inside the mounting `useEffect` and `fetchAIResponse()` method.
  - Passes the `AbortSignal` to the openai api request fetch options.
  - Catches the `AbortError` and returns early, avoiding state updates when the component unmounts and remounts due to React 18 StrictMode double-mount simulation in development.

## 3. Stuck General Page Scroll Adjustments

- **File**: `src/index.css`
  - Removed `overflow-x: hidden` from `html`.
  - Updated `body` to use `overflow-x: clip` instead of `overflow-x: hidden` to enable native vertical scrollbars on Webkit browsers and prevent scroll conflicts while keeping horizontal overflow clipped.

## 4. Chat Auto-Scroll Layout Jumping Fix

- **File**: `src/components/CommandTerminal.tsx`
  - Replaced the placeholder `div` and `endOfMessagesRef` with a direct ref `terminalBodyRef` on the scrollable `.terminal-body` container.
  - Updated the auto-scroll `useEffect` to scroll `.terminal-body` internally using `terminalBodyRef.current.scrollTo({ top: terminalBodyRef.current.scrollHeight, behavior: 'smooth' })`. This prevents page-level layout jumping during chat updates.

## 5. E2E Test Lint Compliance

- **Files**: `e2e/build.spec.ts`, `e2e/chat.spec.ts`, `e2e/loader.spec.ts`
  - Fixed linting errors (explicit `any` types) so that `npm run lint` completes with code 0 and passes all CI/CD style checks.
