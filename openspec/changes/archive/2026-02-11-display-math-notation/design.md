## Context

The calculator stores expressions internally using programmatic function names (`asin(`, `abs(`, `pi`, etc.) and evaluates them via mathjs. A display formatting layer (`formatExpression.ts`) converts some of these to math notation before rendering. Currently only 4 conversions exist: `log10(` → `log₁₀(`, `log(` → `ln(`, `nthRoot(` → `ⁿ√(`, `factorial(N)` → `N!`. Many other functions still display as raw text.

## Goals / Non-Goals

**Goals:**
- Convert all remaining scientific functions to standard math notation in the display
- Keep all changes in the display formatting layer only — no changes to evaluation or input
- Handle nested parentheses correctly for bracket-style replacements (abs, ceil, floor)

**Non-Goals:**
- Changing how expressions are stored internally
- Changing input validation or evaluation logic
- Rich text rendering (subscripts, superscripts as actual smaller text) — we use Unicode characters only
- Converting `exp(` — it's already standard notation

## Decisions

### 1. Simple regex replacements for non-bracket functions

**Decision**: Use `.replace()` chains in `formatExpression()` for inverse trig/hyperbolic, combinatorics, constants, and power superscripts.

**Rationale**: These are 1:1 text substitutions that don't require parenthesis matching. Same approach as existing `log10(` → `log₁₀(` replacement.

**Ordering constraints**:
- `acot(` before `cot(` — but since we don't modify `cot(`, no conflict
- `asinh(` before `sinh(`, `acosh(` before `cosh(`, `atanh(` before `tanh(` — but since we don't modify forward hyperbolic, no conflict
- `asin(` before `sin(` — same, no conflict since we don't modify `sin(`
- `pi` replacement must use word boundary or specific context to avoid matching `asin` → `aπn` — use regex `\bpi\b`

### 2. Parenthesis-matching helper for bracket-style replacements

**Decision**: Add a `replaceFunctionWithBrackets(expr, fnName, openBracket, closeBracket)` helper that finds each occurrence of `fnName(`, walks forward to find the matching `)`, and replaces `fnName(...)` with `openBracket...closeBracket`.

**Rationale**: Simple regex can't handle nested parens like `abs(3*(2+1))`. A matching algorithm is needed. The codebase already has `extractTermEnd` with paren-matching logic in `mathOperations.ts`, so this pattern is established.

**Alternatives considered**:
- Regex with non-greedy match `abs\((.+?)\)` — fails on nested parens
- Recursive regex — not supported in JS
- Reusing `extractTermEnd` from mathOperations — it's designed for different purpose (forward term extraction), simpler to write a focused helper

### 3. Power superscripts limited to `^2` and `^3`

**Decision**: Only convert `^2` and `^3` to `²` and `³`. Higher powers stay as `^n`.

**Rationale**: Unicode only has superscript digits for 0-9, but `^2` and `^3` are the most common and have dedicated buttons in the UI. Handling arbitrary `^n` would require a more complex approach. `^2` and `^3` replacements need context awareness: only replace when followed by end-of-string, operator, or another function — not when part of `^23` (which means "to the power of 23").

## Risks / Trade-offs

- **`pi` in function names**: `asin(pi)` contains `pi` — using `\bpi\b` word boundary prevents false matches since `pi` in `asin` isn't at a word boundary. ✓ Safe.
- **`^2`/`^3` ambiguity**: `^23` should NOT become `²3`. Mitigation: only replace `^2` or `^3` when followed by a non-digit (operator, paren, end of string).
- **Bracket replacement display-only confusion**: Users see `|x|` in display but the internal expression is `abs(x)`. If they mentally try to type `|x|` it won't work. This is acceptable — same situation exists with `log₁₀` vs `log10(`.
- **Performance**: Adding ~15 more replacements to `formatExpression` is negligible — it runs on short strings (<100 chars typically).
