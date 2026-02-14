## Why

Physical scientific calculators use `√` as a prefix operator — press `√`, type `25`, get `5`. No parentheses needed. Currently, Calculator Ultra requires users to manually close parentheses after root functions (`√(25)` must have `)`), which is tedious and unlike real calculator behavior.

## What Changes

- `√` and `∛` buttons insert the Unicode symbol directly (not `sqrt(` / `cbrt(`)
- Expression validator treats `√` and `∛` as prefix operators with implicit multiplication rules
- Before evaluation, a preprocessing step converts `√25` → `sqrt(25)`, `∛8` → `cbrt(8)` by detecting the next "term" (number, constant, parenthesized group, or function call)
- Display shows `√25` naturally — no parentheses unless the user explicitly types them
- `nthRoot(` stays unchanged (requires 2 arguments with comma separator)

## Capabilities

### New Capabilities
- `root-prefix-operator`: Treat √ and ∛ as prefix operators that apply to the next term without requiring parentheses

### Modified Capabilities
_None — evaluation semantics are unchanged, only input/display UX changes._

## Impact

- **Button config** (`src/constants/buttons.ts`): Change `sqrt(` → `√`, `cbrt(` → `∛`
- **Expression validator** (`src/utils/expressionValidator.ts`): Recognize `√` and `∛` as valid prefix operators
- **Math operations** (`src/utils/mathOperations.ts`): Preprocess `√`/`∛` → `sqrt(`/`cbrt(` with auto-detection of argument boundaries
- **Format expression** (`src/utils/formatExpression.ts`): Remove `sqrt(` → `√(` replacement (no longer needed)
- **E2E tests** (`e2e/expression-display.spec.ts`): Update expectations
