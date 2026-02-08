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

## Development Plan

### Phase 1: Code Quality & Performance
- [ ] Remove dead `useEffect` in `CalculatorContext.tsx` (lines 211-223)
- [ ] Code-split mathjs via dynamic import to reduce initial bundle size
- [ ] Add component tests with React Testing Library
- [ ] Set up ESLint config (currently no `.eslintrc`)

### Phase 2: Feature Enhancements
- [ ] Graph/plot mode - visualize functions using a canvas/SVG library
- [ ] Equation solver (linear, quadratic, systems)
- [ ] Programmer mode (hex, binary, octal conversions, bitwise ops)
- [ ] Expression history navigation with arrow keys
- [ ] Copy result to clipboard button
- [ ] Export history as CSV/JSON

### Phase 3: UX Improvements
- [ ] Haptic feedback on mobile
- [ ] Button press animations (improve existing `btn-press`)
- [ ] Swipe gestures for mode switching on mobile
- [ ] Landscape layout optimization
- [ ] PWA support (service worker, manifest, offline capability)
- [ ] Accessibility audit (ARIA labels, focus management, screen reader support)

### Phase 4: Advanced Math
- [ ] Symbolic integration (display antiderivative, not just numerical result)
- [ ] Limits computation
- [ ] Taylor/Maclaurin series expansion
- [ ] Statistics mode (mean, median, std dev, regression)
- [ ] Probability (combinations, permutations, distributions)
