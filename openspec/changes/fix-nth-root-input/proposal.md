## Why

The nth root (ⁿ√) currently uses function-call syntax `nthRoot(value, n)`, which is unintuitive for calculator users. On Casio scientific calculators, users type the index first, then press ⁿ√, then the radicand (e.g., `3 ⁿ√ 27` for cube root of 27). This is the natural mathematical notation and matches user expectations from physical calculators.

## What Changes

- Change ⁿ√ from inserting `nthRoot(` (function call) to inserting `ⁿ√` (infix operator)
- User flow becomes: type index → press ⁿ√ → type radicand (e.g., `3ⁿ√27`)
- Add preprocessing to convert `Aⁿ√B` to `nthRoot(B, A)` before mathjs evaluation
- Update display formatting to show `ⁿ√` naturally instead of `ⁿ√(value,n)`
- Update input sanitization to handle `ⁿ√` as an infix operator (implicit multiplication rules, operator validation)

## Capabilities

### New Capabilities

_None — this modifies existing nth root behavior._

### Modified Capabilities

_None — no existing specs to modify. This is an input/evaluation behavior change._

## Impact

- **Code**:
  - `src/components/Keypad/CompactScientificKeypad.tsx` — change `secondValue` from `'nthRoot('` to `'ⁿ√'`
  - `src/utils/mathOperations.ts` — add preprocessing to convert `Aⁿ√B` pattern to `nthRoot(B,A)`
  - `src/utils/expressionValidator.ts` — handle `ⁿ√` as an infix operator for input sanitization
  - `src/utils/formatExpression.ts` — update display formatting (remove `nthRoot(` → `ⁿ√(` mapping)
  - `e2e/expression-display.spec.ts` — update nth root tests
- **Dependencies**: None
- **Breaking**: Input syntax changes but no external API is affected
