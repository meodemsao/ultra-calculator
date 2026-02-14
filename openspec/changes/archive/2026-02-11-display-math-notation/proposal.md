## Why

The calculator displays some functions as raw programmatic text (e.g., `asin(`, `abs(`, `permutations(`, `pi`) instead of standard math notation (e.g., `sin⁻¹(`, `|`, `P(`, `π`). This makes the expression display inconsistent — some functions like `log₁₀` and `√` already use math symbols while others don't. Converting remaining functions to math notation improves readability and matches what users expect from a scientific calculator.

## What Changes

**Display-only replacements in `formatExpression.ts`** (internal expression storage stays the same):

- **Constants**: `pi` → `π` (the constant `e` already displays fine as-is)
- **Inverse trig**: `asin(` → `sin⁻¹(`, `acos(` → `cos⁻¹(`, `atan(` → `tan⁻¹(`, `acot(` → `cot⁻¹(`
- **Inverse hyperbolic**: `asinh(` → `sinh⁻¹(`, `acosh(` → `cosh⁻¹(`, `atanh(` → `tanh⁻¹(`
- **Combinatorics**: `permutations(` → `P(`, `combinations(` → `C(`
- **Power superscripts**: `^2` → `²`, `^3` → `³` (when at end of expression or before an operator)
- **Absolute value**: `abs(x)` → `|x|` (replace `abs(` and its matching `)` with vertical bars)
- **Ceiling/Floor**: `ceil(x)` → `⌈x⌉`, `floor(x)` → `⌊x⌋` (replace function and matching parens with bracket symbols)

## Capabilities

### New Capabilities
- `expression-math-notation`: Display formatting rules that convert internal function-call syntax to standard mathematical notation in the expression display. Covers constants, inverse functions, combinatorics, power superscripts, absolute value brackets, and ceiling/floor brackets.

### Modified Capabilities
_(none — this is display-only formatting; no changes to evaluation, validation, or input handling)_

## Impact

- **`src/utils/formatExpression.ts`**: Add new replacement rules. Simple replacements (constants, inverse functions, combinatorics, superscripts) are straightforward regex. Bracket-style replacements (abs, ceil, floor) require parenthesis-matching logic to find the correct closing `)`.
- **`e2e/expression-display.spec.ts`**: Add/update tests to verify math notation display for each converted function.
- **Backward compatibility**: Old history entries containing these function names will also display with math notation (same approach as existing `factorial(` → `!` replacement).
- **No changes** to: expression evaluation (`mathOperations.ts`), input validation (`expressionValidator.ts`), button configs (`buttons.ts`), or calculator state.
