## Phase A1: AdvancedKeypad Decomposition

- [ ] A1.1 Create ModalShell component at `src/components/ModalShell/ModalShell.tsx`
  - Wraps Headless UI Dialog with overlay, panel, title bar, close button
  - Props: `isOpen`, `onClose`, `title`, `scrollable?`, `children`
  - Uses theme tokens for styling (bg-surface-pri, text-content-pri, etc.)
  - ~25 lines

- [ ] A1.2 Extract DerivativeModal to `src/components/Keypad/modals/DerivativeModal.tsx`
  - ComputeModalProps: `{ isOpen, onClose }`
  - Owns derivativeExpr, derivativeVar, derivativeResult state
  - Uses ModalShell for chrome

- [ ] A1.3 Extract IntegralModal to `src/components/Keypad/modals/IntegralModal.tsx`
  - ComputeModalProps: `{ isOpen, onClose }`
  - Owns integralExpr, integralVar, integralLower, integralUpper, integralResult, symbolicIntegral state
  - Uses ModalShell for chrome

- [ ] A1.4 Extract ComplexModal to `src/components/Keypad/modals/ComplexModal.tsx`
  - InsertModalProps: `{ isOpen, onClose, onInsert }`
  - Owns complexReal, complexImag state
  - Calls `onInsert("(3+4i)")` to insert into expression

- [ ] A1.5 Extract VectorsModal to `src/components/Keypad/modals/VectorsModal.tsx`
  - ComputeModalProps: `{ isOpen, onClose }`
  - Owns vectorA, vectorB, vectorResult state
  - All vector operation handlers move here

- [ ] A1.6 Extract LimitsModal to `src/components/Keypad/modals/LimitsModal.tsx`
  - ComputeModalProps: `{ isOpen, onClose }`
  - Owns limitExpr, limitVar, limitApproach, limitDirection, limitResult state

- [ ] A1.7 Extract TaylorModal to `src/components/Keypad/modals/TaylorModal.tsx`
  - ComputeModalProps: `{ isOpen, onClose }`
  - Owns taylorExpr, taylorVar, taylorCenter, taylorOrder, taylorResult state

- [ ] A1.8 Extract UserFuncModal to `src/components/Keypad/modals/UserFuncModal.tsx`
  - InsertModalProps: `{ isOpen, onClose, onInsert }`
  - Owns userFunctions, userFuncDef, userFuncExpr, userFuncError state
  - useEffect to load user functions on mount
  - CRUD operations + insert function call via onInsert

- [ ] A1.9 Refactor MatrixInput to accept InsertModalProps
  - Change from `{ onClose }` + internal `useCalculator()` to `{ isOpen, onClose, onInsert }`
  - Remove direct context dependency, use onInsert callback instead
  - Wrap content with ModalShell

- [ ] A1.10 Slim down AdvancedKeypad.tsx to thin shell
  - Keep: button grid rendering, modalType state, handleButtonClick
  - Add: `handleInsert` callback that calls `setExpression(state.expression + value)` and closes modal
  - Render all 8 modals with appropriate props (ComputeModalProps or InsertModalProps)
  - Target: ~80 lines

## Phase A2: Theme Token System

- [ ] A2.1 Define 21 CSS custom property tokens in `src/index.css`
  - `:root` block with light theme defaults
  - `[data-theme="dark"]` block
  - `[data-theme="amoled"]` block
  - `[data-theme="solarized"]` block
  - `[data-theme="high-contrast"]` block
  - `[data-theme="retro"]` block
  - Tokens: surface-primary/secondary/tertiary/inset, text-primary/secondary/muted, border-default/subtle, accent/accent-hover/accent-subtle/accent-on, function-subtle/function-on, danger/danger-subtle, warning/warning-subtle, success/success-subtle

- [ ] A2.2 Update `tailwind.config.js` to map CSS variables to semantic classes
  - Remove `darkMode: 'class'` (no longer needed)
  - Replace `calc` color block with semantic token mappings using `rgb(var(--token) / <alpha-value>)` pattern
  - Semantic classes: `bg-surface-pri`, `bg-surface-sec`, `bg-surface-ter`, `bg-surface-inset`, `text-content-pri`, `text-content-sec`, `text-content-muted`, `border-edge`, `border-edge-subtle`, `bg-accent`, `bg-accent-hv`, `bg-accent-subtle`, `text-accent`, `bg-fn-subtle`, `text-fn`, `text-danger`, `bg-danger-subtle`, `text-warning`, `bg-warning-subtle`, `text-success`, `bg-success-subtle`

- [ ] A2.3 Rework ThemeContext.tsx
  - Change Theme type from `'light' | 'dark'` to `'light' | 'dark' | 'amoled' | 'solarized' | 'high-contrast' | 'retro'`
  - Replace `toggleTheme()` with `setTheme(theme: Theme)`
  - Keep `toggleTheme()` as convenience (cycles through themes) for backward compat with ThemeToggle
  - Apply `data-theme` attribute on `document.documentElement` instead of toggling `dark` class
  - Persist to localStorage as before

- [ ] A2.4 Update ThemeToggle.tsx to work with new ThemeContext
  - For now, keep as a simple toggle that cycles through themes (full theme selector UI is Change 10)
  - Update to use `setTheme` or cycle behavior

- [ ] A2.5 Migrate Button.tsx — replace 6 variant dark: classes with token classes
  - number: `bg-surface-pri text-content-pri hover:bg-surface-ter`
  - operator: `bg-accent-subtle text-accent hover:bg-accent-subtle/80`
  - function: `bg-fn-subtle text-fn hover:bg-fn-subtle/80`
  - action: `bg-danger-subtle text-danger hover:bg-danger-subtle/80`
  - equal: `bg-accent text-white hover:bg-accent-hv` (flattened from gradient)
  - memory: `bg-warning-subtle text-warning hover:bg-warning-subtle/80`
  - active ring: `ring-accent ring-offset-surface-pri`

- [ ] A2.6 Migrate Display.tsx — replace 10 dark: usages with token classes
  - Display background: `bg-surface-sec` (flattened from gradient)
  - Status bar text: `text-content-muted`
  - Angle mode chip: `bg-surface-ter text-content-sec`
  - Memory chip: `bg-warning-subtle text-warning`
  - Ans chip: `bg-accent-subtle text-accent`
  - VAR chip: `bg-success-subtle text-success`
  - Expression text: `text-content-sec`
  - Result text: `text-content-pri`
  - Hover states: `hover:bg-surface-ter`

- [ ] A2.7 Migrate Calculator.tsx — replace 7 dark: usages with token classes

- [ ] A2.8 Migrate remaining 12 component files — replace dark: usages with token classes
  - FinancialCalc.tsx (18 occurrences)
  - ProgrammerCalc.tsx (21 occurrences)
  - EquationSolver.tsx (19 occurrences)
  - MatrixInput.tsx (18 occurrences)
  - GraphPlotter.tsx (17 occurrences)
  - Statistics.tsx (12 occurrences)
  - UnitConverter.tsx (12 occurrences)
  - ConstantsLibrary.tsx (11 occurrences)
  - History.tsx (7 occurrences)
  - ModeSelector.tsx (3 occurrences)
  - BasicKeypad.tsx (1 occurrence)
  - AdvancedKeypad.tsx (remaining dark: usages after modal extraction)

- [ ] A2.9 Remove the 1 dark: occurrence in index.css (scrollbar-thumb)

## Phase A3: Verification

- [ ] A3.1 Run existing test suite — all 139+ tests must pass unchanged
- [ ] A3.2 Verify light theme renders identically to current light appearance
- [ ] A3.3 Verify dark theme renders identically to current dark appearance
- [ ] A3.4 Verify all 6 themes apply correctly (no unstyled/white-flash elements)
- [ ] A3.5 Verify all 8 advanced modals open, compute, and close correctly after extraction
- [ ] A3.6 Verify insert modals (complex, matrix, user functions) still insert into expression
