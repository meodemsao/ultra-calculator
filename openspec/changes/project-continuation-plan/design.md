## Context

Calculator Ultra is a React 18 + TypeScript + Vite 5 app with Tailwind CSS and mathjs. It currently has 4 working modes (basic, scientific, advanced, units) with 157 tests. Phase 1 (code quality foundation) has been completed — the mode system now supports 9 modes with "Coming soon" placeholders, ESLint is configured, mathjs is code-split, dead code removed, and component tests established.

The remaining 10 changes (Changes 2-11) all depend on Change 1 (done) but are independent of each other.

## Goals / Non-Goals

**Goals:**
- Implement all 9 phases from the CLAUDE.md roadmap across 10 remaining changes
- Each change is independently deployable and testable
- Maintain backward compatibility — existing calculator functionality never breaks
- Keep bundle size manageable via code-splitting for new dependencies

**Non-Goals:**
- Backend/server functionality — this remains a client-only app
- User accounts or cloud sync
- Native mobile app (PWA only)
- Replacing mathjs with a custom math engine

## Decisions

### 1. Change ordering: scientific enhancements first, new modes next, polish last
**Rationale**: Scientific enhancements (Changes 2-3) improve the existing product for current users with minimal risk. New modes (Changes 4-8) are isolated features. Advanced math (Change 9) extends existing advanced mode. UX/PWA (Changes 10-11) are polish that benefit from all features being present.

**Alternatives considered**: Implementing graphing early for visual appeal — rejected because it requires a charting library dependency decision and is a larger scope.

### 2. State management stays with useReducer + Context
**Rationale**: The current pattern works well. Adding Redux or Zustand would be over-engineering given the app's scope. New modes that need isolated state (solver, graph, stats) can use local component state, with shared state (history, theme) remaining in context.

### 3. New modes use component-level state, not CalculatorContext
**Rationale**: Modes like solver, graph, stats, programming, and financial have distinct state needs (coefficient inputs, plot data, data sets, base modes, TVM variables). Putting all of this in the global reducer would bloat it. Only shared concerns (history, theme, angle mode) stay in context.

### 4. Charting library deferred to Change 5
**Rationale**: The graphing mode is the only consumer. Decision between recharts, lightweight-charts, or canvas will be made when implementing that change based on bundle size and feature needs.

## Risks / Trade-offs

- **Bundle size growth** → Mitigation: Continue using Vite manualChunks for large dependencies. Each new mode's dependencies should be in separate chunks.
- **mathjs version compatibility** → Mitigation: Pin to mathjs 12.x. Test all math operations after any update.
- **Mode selector overflow** → Mitigation: Already handled with horizontal scrolling in Phase 1. May need dropdown on very narrow screens.
- **Test maintenance burden** → Mitigation: Focus on utility tests (high value) and smoke component tests (low maintenance). Avoid snapshot tests.
