## Approach

Make `√` and `∛` work as prefix operators (like unary minus) rather than function calls. The internal expression stores the Unicode symbol directly. A preprocessing step before mathjs evaluation converts prefix root operators into function-call syntax.

## Design

### 1. Button Value Changes

| Button | Current value | New value |
|--------|--------------|-----------|
| √ | `sqrt(` | `√` |
| ∛ (2nd) | `cbrt(` | `∛` |

`nthRoot(` remains unchanged — it takes 2 arguments.

### 2. Expression Validator Changes

Add `√` and `∛` to recognized input categories:
- Treat them like functions for implicit multiplication: `2√` → `2*√`, `)√` → `)*√`
- Allow them at expression start, after operators, after `(`
- After `√`/`∛`, allow: digits, constants, `(`, functions, other `√`/`∛`

### 3. Evaluation Preprocessing

New function `preprocessRootOperators(expr)` converts prefix root symbols into mathjs function calls by extracting the next **term**:

**Term extraction rules** (starting from position after `√`/`∛`):
1. **Parenthesized group**: `√(25+3)` → `sqrt(25+3)` — find matching `)`
2. **Number**: `√25` → `sqrt(25)` — consume digits and dots
3. **Constant**: `√pi` → `sqrt(pi)` — consume constant name
4. **Function call**: `√sin(30)` → `sqrt(sin(30))` — consume function name + matching parens
5. **Another root**: `√√16` → `sqrt(sqrt(16))` — recursive

### 4. Display Formatting Changes

Remove `sqrt(` → `√(` replacement from `formatExpression()` since expressions already contain `√`. Keep `nthRoot(` → `ⁿ√(` replacement.

### Constraints

- Must not break existing expressions that use `sqrt(` directly (e.g., from history)
- `nthRoot(` is NOT changed — it needs 2 comma-separated arguments
- Parentheses after `√` are optional: `√(25)` and `√25` both work
