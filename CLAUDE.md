# Calculator Ultra

Scientific calculator web application with multiple calculation modes, unit conversion, and advanced math operations.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS 3 + clsx + tailwind-merge
- **Math Engine**: mathjs 12
- **UI Components**: Headless UI (dialogs), Lucide React (icons)
- **Font**: JetBrains Mono (imported in index.css)
- **Testing**: Vitest 4

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Type-check (tsc -b) then build (vite build)
npm run preview    # Preview production build
npm run test       # Run all tests once (vitest run)
npm run test:watch # Run tests in watch mode
npm run lint       # ESLint
```

## Project Structure

```
src/
├── App.tsx                          # Root: ThemeProvider > CalculatorProvider > Calculator
├── main.tsx                         # Entry point
├── index.css                        # Tailwind directives, JetBrains Mono, custom utilities
├── types/calculator.ts              # All TypeScript types/interfaces
├── constants/
│   ├── buttons.ts                   # Button configs for basic, memory, scientific, advanced keypads
│   └── units.ts                     # Unit categories (8) with conversion functions
├── contexts/
│   ├── ThemeContext.tsx              # Dark/light theme with localStorage persistence
│   └── CalculatorContext.tsx         # Calculator state via useReducer, history persistence
├── hooks/
│   └── useKeyboard.ts               # Global keyboard shortcuts
├── utils/
│   ├── mathOperations.ts            # Expression evaluation with mathjs, angle mode handling
│   ├── expressionValidator.ts       # Input sanitization (implicit multiplication, operator rules)
│   ├── derivatives.ts               # Symbolic derivative via mathjs
│   ├── integrals.ts                 # Numerical integration (Simpson's Rule, Trapezoidal)
│   └── unitConversions.ts           # Unit conversion via base-unit pattern
└── components/
    ├── Calculator/Calculator.tsx     # Main layout: mode tabs, display, keypads, history sidebar
    ├── Display/Display.tsx           # Expression + live result preview + error display
    ├── Keypad/
    │   ├── Button.tsx                # Reusable button with 6 style variants
    │   ├── BasicKeypad.tsx           # Numbers, operators, memory, parentheses
    │   ├── ScientificKeypad.tsx      # Trig, log, sqrt, powers, constants, 2nd function toggle
    │   └── AdvancedKeypad.tsx        # Derivative/integral/matrix/complex modals
    ├── MatrixInput/MatrixInput.tsx   # Matrix operations (det, inv, transpose, eigenvalues, A+B, A*B)
    ├── UnitConverter/UnitConverter.tsx # Category-based unit conversion with swap
    ├── History/History.tsx           # Calculation history list with restore
    ├── ModeSelector/ModeSelector.tsx # Basic | Scientific | Advanced | Units tabs
    └── ThemeToggle/ThemeToggle.tsx   # Sun/Moon icon toggle
```

## Architecture

### State Management

`CalculatorContext` uses `useReducer` with actions:
- `INPUT` - Append to expression (runs through `sanitizeInput` first)
- `EVALUATE` - Evaluate via mathjs, add to history
- `CLEAR`, `CLEAR_ENTRY`, `BACKSPACE` - Expression editing
- `MEMORY_ADD/SUBTRACT/RECALL/CLEAR` - Memory register operations
- `TOGGLE_ANGLE_MODE` - DEG/RAD switch
- `TOGGLE_SECOND_FUNCTION` - Swap scientific button labels (sin/asin, etc.)
- `SET_EXPRESSION`, `SET_ERROR`, `RESTORE_FROM_HISTORY`, `CLEAR_HISTORY`

### Expression Validation (expressionValidator.ts)

`sanitizeInput()` enforces rules before characters are added:
- Prevents consecutive operators (replaces via `\b` prefix signal)
- Allows unary minus after `*`, `/`, `^`, `%`
- Blocks strict binary operators at expression start or after `(`
- Prevents unbalanced/empty parentheses
- Adds implicit multiplication: `2(` -> `2*(`, `)3` -> `)*3`, `2sin(` -> `2*sin(`
- Prevents multiple decimals in same number

### Angle Mode Handling (mathOperations.ts)

In DEG mode, trig calls are rewritten before evaluation:
- `sin(x)` -> `sin(pi/180*x)` (forward trig: degrees to radians)
- `asin(x)` -> `(180/pi)*asin(x)` (inverse trig: radians to degrees)

### Persistence

- History: localStorage key `calculator-history`, max 100 entries
- Theme: localStorage key `calculator-theme`

## Testing

139 tests across 5 test files (all passing):

| File | Tests | Coverage |
|------|-------|----------|
| `expressionValidator.test.ts` | 50 | Input sanitization rules |
| `mathOperations.test.ts` | 39 | Expression evaluation, formatting |
| `unitConversions.test.ts` | 28 | Unit conversions across categories |
| `derivatives.test.ts` | 11 | Symbolic differentiation |
| `integrals.test.ts` | 11 | Numerical integration accuracy |

No component tests exist yet.

## Known Issues

- **Bundle size warning**: Production JS chunk is ~890KB (mathjs is large). Consider code-splitting or dynamic imports.
- **Dead code in CalculatorContext**: `useEffect` at lines 211-223 attempts live evaluation but the result is never used (the `Display` component handles live preview independently via `useMemo`).

## Feature Status

### Implemented
- [x] Basic arithmetic (+, -, *, /, =, %, parentheses)
- [x] Scientific functions: sin, cos, tan, asin, acos, atan, log, ln, sqrt, cbrt, nthRoot, exp, mod, factorial, abs
- [x] Constants: π, e
- [x] DEG/RAD angle mode toggle
- [x] 2nd function toggle (sin↔asin, cos↔acos, etc.)
- [x] Memory register: M+, M-, MR, MC
- [x] Power operations: x², x³, xʸ, 1/x
- [x] Symbolic derivative (via mathjs)
- [x] Numerical integral (Simpson's Rule, Trapezoidal)
- [x] Matrix operations: determinant, inverse, transpose, eigenvalues, A+B, A-B, A×B
- [x] Complex number input (a+bi)
- [x] Unit converter (8 categories: Length, Weight, Temperature, Volume, Area, Speed, Time, Data Storage)
- [x] Calculation history (localStorage, max 100 entries, restore from history)
- [x] Dark/Light theme with localStorage persistence
- [x] Keyboard shortcuts (numbers, operators, Enter, Backspace, Escape)
- [x] Expression input validation and sanitization (implicit multiplication, operator rules)
- [x] Live result preview while typing

### Not Yet Implemented
- [ ] Equation solver (quadratic, cubic, polynomial)
- [ ] System of equations solver (2×2, 3×3, n×n linear systems)
- [ ] Symbolic integration (antiderivative display)
- [ ] Graphing / function plotting
- [ ] Statistical plotting (histograms, scatter plots)
- [ ] Programming mode (HEX, BIN, OCT, DEC, bitwise ops)
- [ ] Statistics mode (data input, mean, median, mode, std dev, variance)
- [ ] Regression analysis (linear, polynomial, exponential)
- [ ] Hypothesis testing (t-test, z-test, chi-square)
- [ ] Probability distributions (normal, binomial, Poisson)
- [ ] TVM Solver (Time Value of Money: PV, FV, PMT, rate, periods)
- [ ] High precision mode (arbitrary precision via BigNumber)
- [ ] User-defined functions (define, store, recall custom f(x))
- [ ] Hyperbolic functions (sinh, cosh, tanh, asinh, acosh, atanh)
- [ ] Combinatorics: nPr (permutations), nCr (combinations)
- [ ] GCD, LCM functions
- [ ] Vector operations (dot product, cross product, magnitude)
- [ ] Constants library (physics/chemistry: c, G, h, Nₐ, k, etc.)
- [ ] Fraction ↔ Decimal toggle (S⇌D)
- [ ] ENG notation display
- [ ] Polar ↔ Rectangular conversion (Pol/Rec)
- [ ] Ceil, Floor functions
- [ ] Random numbers (Ran#, RanInt)
- [ ] Ans / PreAns (use last answer / previous answer in expressions)
- [ ] STO/RCL (store/recall named variables, beyond single memory)
- [ ] Degrees/Minutes/Seconds (DMS) input and conversion
- [ ] Copy/Paste result to clipboard
- [ ] Limit computation
- [ ] Multiple themes (beyond dark/light)
- [ ] Unlimited history (remove 100-entry cap)
- [ ] Cot, Cot⁻¹ (cotangent, inverse cotangent)

## Development Plan

### Phase 1: Code Quality & Foundation
- [ ] Remove dead `useEffect` in `CalculatorContext.tsx` (lines 211-223)
- [ ] Code-split mathjs via dynamic import to reduce initial bundle (~890KB)
- [ ] Add component tests with React Testing Library
- [ ] Set up ESLint config (currently no `.eslintrc`)
- [ ] Refactor mode system to support new modes (Solver, Graph, Stats, Programming)

### Phase 2: Core Scientific Enhancements
Expand the scientific calculator to match full-featured scientific calculators.

- [ ] **Hyperbolic functions** — Add sinh, cosh, tanh, asinh, acosh, atanh to ScientificKeypad (via SHIFT/2nd)
- [ ] **Cot / Cot⁻¹** — Add cotangent and inverse cotangent
- [ ] **Combinatorics** — nPr, nCr buttons; implement via mathjs `permutations()`, `combinations()`
- [ ] **GCD / LCM** — Add buttons; implement via mathjs `gcd()`, `lcm()`
- [ ] **Ceil / Floor** — Add ceil(), floor() to available functions
- [ ] **Random numbers** — Ran# (random 0-1), RanInt(a,b) (random integer in range)
- [ ] **Ans / PreAns** — Store last result as `Ans`, previous as `PreAns`, usable in expressions
- [ ] **STO / RCL** — Store values to named variables (A-F), recall in expressions
- [ ] **Fraction ↔ Decimal toggle** — S⇌D: convert result between fraction and decimal display
- [ ] **ENG notation** — Display results in engineering notation (exponents in multiples of 3)
- [ ] **DMS input** — Degrees°Minutes'Seconds" input and conversion
- [ ] **Polar ↔ Rectangular** — Pol(x,y)→(r,θ) and Rec(r,θ)→(x,y) conversions
- [ ] **Constants library** — Modal with categorized physics/chemistry/math constants (speed of light, Planck's constant, Avogadro's number, gravitational constant, etc.)
- [ ] **Copy / Paste** — Copy result to clipboard, paste into expression
- [ ] **High precision mode** — Toggle arbitrary precision via mathjs BigNumber config

### Phase 3: Equation Solver Mode
New calculator mode for solving equations.

- [ ] **Quadratic solver** — Input a, b, c for ax²+bx+c=0, display real/complex roots, discriminant, vertex
- [ ] **Cubic solver** — Input coefficients for ax³+bx²+cx+d=0
- [ ] **Polynomial solver** — General nth-degree polynomial root finding
- [ ] **System of linear equations** — 2×2, 3×3, up to n×n solver with coefficient matrix input
- [ ] **Equation solver UI** — Dedicated tab/mode with coefficient input fields and formatted result display

### Phase 4: Graphing & Plotting Mode
New calculator mode for visualizing functions and data.

- [ ] **Function plotter** — Plot y=f(x) on interactive canvas (pan, zoom, trace)
- [ ] **Multiple functions** — Plot multiple f(x) simultaneously with different colors
- [ ] **Trace mode** — Move cursor along graph, display (x, y) coordinates
- [ ] **Table of values** — Generate x/y table for a function over a range
- [ ] **Statistical plotting** — Histogram, scatter plot, box plot from data sets
- [ ] **Graph library** — Evaluate: recharts, d3, or canvas-based custom renderer

### Phase 5: Statistics & Probability Mode
New calculator mode for statistical analysis.

- [ ] **Data input** — Enter data sets (single-variable and two-variable)
- [ ] **Descriptive statistics** — Mean, median, mode, std dev (σ and s), variance, min, max, quartiles, IQR
- [ ] **Regression analysis** — Linear (ax+b), quadratic (ax²+bx+c), exponential (ae^bx), power (ax^b), logarithmic (a+b·ln(x)); display equation + r²
- [ ] **Hypothesis testing** — z-test, t-test (1-sample, 2-sample), chi-square test; display test statistic, p-value, confidence interval
- [ ] **Probability distributions** — Normal (PDF, CDF, inverse), Binomial (P(X=k), cumulative), Poisson; input parameters and compute probabilities
- [ ] **Combinatorics in stats** — nPr, nCr integrated into stats workflows

### Phase 6: Programming Mode
New calculator mode for programmer/developer use.

- [ ] **Number base display** — Show result simultaneously in DEC, HEX, OCT, BIN
- [ ] **Base input** — Type numbers in any base (0x prefix for hex, 0b for binary, 0o for octal)
- [ ] **Bitwise operations** — AND, OR, XOR, NOT, left shift (<<), right shift (>>)
- [ ] **Word size toggle** — 8-bit, 16-bit, 32-bit, 64-bit; show overflow behavior
- [ ] **ASCII/Unicode lookup** — Character ↔ code point conversion

### Phase 7: Financial (TVM Solver)
New calculator mode for financial calculations.

- [ ] **TVM Solver** — Solve for any one of: N (periods), I% (interest rate), PV (present value), PMT (payment), FV (future value)
- [ ] **Amortization schedule** — Generate payment breakdown table
- [ ] **Compound interest** — Calculate with different compounding frequencies
- [ ] **Currency converter** — Live exchange rates (optional, requires API)

### Phase 8: Advanced Math
Extend the advanced mathematics capabilities.

- [ ] **Symbolic integration** — Display antiderivative expression, not just numerical result
- [ ] **Limit computation** — Compute lim(x→a) f(x), including ±∞
- [ ] **Taylor / Maclaurin series** — Expand f(x) around a point to nth order
- [ ] **Vector operations** — Dot product, cross product, magnitude, unit vector, angle between vectors
- [ ] **User-defined functions** — Define f(x)=..., save to localStorage, use in expressions

### Phase 9: UX & Polish
- [ ] **Multiple themes** — Add 4-6 color themes beyond dark/light (e.g., AMOLED black, solarized, high contrast, retro)
- [ ] **Unlimited history** — Remove 100-entry cap, add search/filter in history
- [ ] **Export history** — Export as CSV/JSON
- [ ] **PWA support** — Service worker, manifest, offline capability, installable
- [ ] **Haptic feedback** — Vibration on button press (mobile)
- [ ] **Swipe gestures** — Swipe to switch modes on mobile
- [ ] **Landscape layout** — Optimized two-panel layout in landscape orientation
- [ ] **Accessibility** — Full ARIA labels, focus management, screen reader support, keyboard navigation for all modes
- [ ] **SHIFT / ALPHA modifier keys** — Secondary and tertiary function layers on all buttons (like physical scientific calculators)
