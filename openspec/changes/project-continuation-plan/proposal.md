## Why

Calculator Ultra is a working scientific calculator app but only covers basic functionality. The 9-phase roadmap in CLAUDE.md outlines a comprehensive expansion to match full-featured scientific calculators (equation solving, graphing, statistics, programming, financial, and UX polish). Without a structured execution plan, the phases risk being implemented ad-hoc with missed dependencies and inconsistent architecture.

## What Changes

- **Phase 1 (DONE)**: Remove dead code, add ESLint, code-split mathjs, extend mode system to 9 modes, add component tests
- **Phase 2**: Add hyperbolic functions, cot/cot⁻¹, combinatorics (nPr/nCr), GCD/LCM, ceil/floor, random numbers, constants library to scientific mode
- **Phase 3**: Add Ans/PreAns, STO/RCL variables, fraction↔decimal toggle, copy/paste result
- **Phase 4**: New equation solver mode (quadratic, cubic, polynomial, linear systems)
- **Phase 5**: New graphing mode (function plotting, trace, table of values)
- **Phase 6**: New statistics mode (descriptive stats, regression, distributions)
- **Phase 7**: New programming mode (HEX/BIN/OCT/DEC, bitwise ops, word size)
- **Phase 8**: New financial mode (TVM solver, amortization, compound interest)
- **Phase 9**: Extend advanced mode (symbolic integration, limits, Taylor series, vectors, user-defined functions)
- **Phase 10**: UX polish (multiple themes, unlimited history, export, accessibility, landscape layout)
- **Phase 11**: PWA support (service worker, manifest, offline, haptic feedback, swipe gestures)

## Capabilities

### New Capabilities
- `scientific-enhancements`: Hyperbolic trig, cot, combinatorics, GCD/LCM, ceil/floor, random numbers, constants library
- `ans-sto-rcl`: Last answer recall, named variable storage, fraction↔decimal toggle, clipboard
- `equation-solver`: Quadratic/cubic/polynomial solvers, linear system solver UI
- `graphing`: Function plotting, multi-function, trace mode, value tables
- `statistics`: Data input, descriptive stats, regression analysis
- `programming-calc`: Base conversion display, bitwise ops, word size toggle
- `financial-calc`: TVM solver, amortization, compound interest
- `advanced-math`: Symbolic integration, limits, Taylor series, vectors, user-defined functions
- `ux-polish`: Multiple themes, unlimited history, export, accessibility
- `pwa-support`: Service worker, manifest, offline capability, mobile UX

### Modified Capabilities
_(none — all changes add new capabilities to the existing platform)_

## Impact

- **Types**: `CalculatorMode` extended (done), `CalculatorState` will grow with new fields (variables, lastAnswer, etc.)
- **Components**: 5 new mode components (EquationSolver, GraphPlotter, Statistics, ProgrammerCalc, FinancialCalc), 1 new ConstantsLibrary modal
- **Utils**: New utility files for equation solving, statistics, bitwise ops, financial calcs, limits, vectors
- **Dependencies**: Charting library for graphing mode (TBD), possibly vite-plugin-pwa
- **Bundle**: mathjs already code-split; new dependencies will need similar treatment
- **Tests**: Each new feature needs unit tests; component tests established in Phase 1
