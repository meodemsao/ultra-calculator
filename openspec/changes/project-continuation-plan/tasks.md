## 1. Code Quality & Foundation (Change 1)

- [x] 1.1 Remove dead useEffect in CalculatorContext.tsx (lines 211-223)
- [x] 1.2 Code-split mathjs via Vite manualChunks (separate 651KB chunk)
- [x] 1.3 Add ESLint flat config with typescript-eslint, react-hooks, react-refresh
- [x] 1.4 Extend CalculatorMode to 9 modes (solver, graph, stats, programming, financial)
- [x] 1.5 Update ModeSelector with scrollable tabs and icons for all modes
- [x] 1.6 Add "Coming soon" placeholders for unimplemented modes
- [x] 1.7 Add component tests for Display, BasicKeypad, ModeSelector, Calculator (18 tests)
- [x] 1.8 Set up vitest jsdom environment with testing-library setup
- [x] 1.9 Fix no-case-declarations lint error in MatrixInput.tsx

## 2. Scientific Enhancements (Change 2)

- [ ] 2.1 Add hyperbolic functions (sinh, cosh, tanh, asinh, acosh, atanh) via 2nd toggle in ScientificKeypad
- [ ] 2.2 Add cot and cot⁻¹ (acot) functions
- [ ] 2.3 Add nPr (permutations) and nCr (combinations) buttons using mathjs
- [ ] 2.4 Add GCD and LCM functions using mathjs
- [ ] 2.5 Add ceil() and floor() functions
- [ ] 2.6 Add Ran# (random 0-1) and RanInt(a,b) buttons
- [ ] 2.7 Create ConstantsLibrary modal with categorized physics/chemistry constants
- [ ] 2.8 Update button configs in buttons.ts for all new functions
- [ ] 2.9 Add tests for all new math functions

## 3. Ans / STO / RCL (Change 3)

- [ ] 3.1 Add lastAnswer and prevAnswer to CalculatorState
- [ ] 3.2 Add variables (A-F) map to CalculatorState
- [ ] 3.3 Add STORE_VARIABLE and RECALL_VARIABLE reducer actions
- [ ] 3.4 Add Ans/PreAns buttons and wire up to reducer
- [ ] 3.5 Add STO/RCL UI (variable selection dialog)
- [ ] 3.6 Implement fraction ↔ decimal toggle (S⇌D) in Display
- [ ] 3.7 Add copy result to clipboard button in Display
- [ ] 3.8 Add paste into expression support
- [ ] 3.9 Add tests for Ans, STO/RCL, fraction toggle, clipboard

## 4. Equation Solver Mode (Change 4)

- [ ] 4.1 Create equationSolver.ts utility (quadratic, cubic solvers)
- [ ] 4.2 Create linear system solver utility (2×2, 3×3)
- [ ] 4.3 Create EquationSolver component with sub-tabs (Quadratic, Cubic, Linear System)
- [ ] 4.4 Implement quadratic solver UI (coefficients, roots, discriminant, vertex display)
- [ ] 4.5 Implement cubic solver UI
- [ ] 4.6 Implement linear system UI with coefficient matrix input
- [ ] 4.7 Replace "Coming soon" placeholder with EquationSolver in Calculator.tsx
- [ ] 4.8 Add tests for equation solver utilities

## 5. Graphing Mode (Change 5)

- [ ] 5.1 Evaluate and select charting library (recharts vs canvas-based)
- [ ] 5.2 Create GraphPlotter component with function input
- [ ] 5.3 Implement single function plotting with zoom/pan
- [ ] 5.4 Implement multiple function plotting with color differentiation
- [ ] 5.5 Implement trace mode (cursor along graph with coordinate display)
- [ ] 5.6 Implement table of values generation
- [ ] 5.7 Replace "Coming soon" placeholder with GraphPlotter in Calculator.tsx
- [ ] 5.8 Add tests for graphing utilities

## 6. Statistics Mode (Change 6)

- [ ] 6.1 Create statistics.ts utility (descriptive stats, regression)
- [ ] 6.2 Create Statistics component with data input UI
- [ ] 6.3 Implement descriptive statistics (mean, median, mode, std dev, variance, quartiles)
- [ ] 6.4 Implement regression analysis (linear, quadratic, exponential, power, logarithmic)
- [ ] 6.5 Replace "Coming soon" placeholder with Statistics in Calculator.tsx
- [ ] 6.6 Add tests for statistics utilities

## 7. Programming Mode (Change 7)

- [ ] 7.1 Create bitwiseOps.ts utility (AND, OR, XOR, NOT, shifts, base conversion)
- [ ] 7.2 Create ProgrammerCalc component with base display (DEC/HEX/OCT/BIN)
- [ ] 7.3 Implement base input with prefixes (0x, 0b, 0o)
- [ ] 7.4 Implement bitwise operation buttons
- [ ] 7.5 Implement word size toggle (8/16/32/64-bit) with overflow
- [ ] 7.6 Replace "Coming soon" placeholder with ProgrammerCalc in Calculator.tsx
- [ ] 7.7 Add tests for bitwise operations and base conversion

## 8. Financial Mode (Change 8)

- [ ] 8.1 Create financialCalc.ts utility (TVM solver, compound interest)
- [ ] 8.2 Create FinancialCalc component with TVM input fields
- [ ] 8.3 Implement TVM solver (solve for N, I%, PV, PMT, FV)
- [ ] 8.4 Implement amortization schedule table
- [ ] 8.5 Implement compound interest calculator
- [ ] 8.6 Replace "Coming soon" placeholder with FinancialCalc in Calculator.tsx
- [ ] 8.7 Add tests for financial calculations

## 9. Advanced Math Extensions (Change 9)

- [ ] 9.1 Implement symbolic integration display in AdvancedKeypad
- [ ] 9.2 Create limits.ts utility for limit computation
- [ ] 9.3 Implement Taylor/Maclaurin series expansion
- [ ] 9.4 Create vectors.ts utility (dot product, cross product, magnitude)
- [ ] 9.5 Add vector operations UI in AdvancedKeypad
- [ ] 9.6 Implement user-defined functions (define, save to localStorage, recall)
- [ ] 9.7 Add tests for limits, Taylor series, vectors, user functions

## 10. UX Polish (Change 10)

- [ ] 10.1 Extend ThemeContext with 4-6 themes (AMOLED black, solarized, high contrast, retro)
- [ ] 10.2 Create theme selector UI
- [ ] 10.3 Remove 100-entry history cap, implement unlimited history
- [ ] 10.4 Add search/filter in history sidebar
- [ ] 10.5 Add export history as CSV/JSON
- [ ] 10.6 Add full ARIA labels and focus management across all components
- [ ] 10.7 Implement landscape layout optimization
- [ ] 10.8 Add keyboard navigation for all modes

## 11. PWA Support (Change 11)

- [ ] 11.1 Add web app manifest (public/manifest.json)
- [ ] 11.2 Implement service worker for offline caching
- [ ] 11.3 Configure vite-plugin-pwa or equivalent
- [ ] 11.4 Add haptic feedback on button press (mobile)
- [ ] 11.5 Implement swipe gestures for mode switching (mobile)
- [ ] 11.6 Test PWA installability and offline functionality
