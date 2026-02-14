## 1. Simple regex replacements

- [x] 1.1 Add inverse trig display replacements: `acot(` → `cot⁻¹(`, `asin(` → `sin⁻¹(`, `acos(` → `cos⁻¹(`, `atan(` → `tan⁻¹(` (order: longer names first, inverse before forward)
- [x] 1.2 Add inverse hyperbolic display replacements: `asinh(` → `sinh⁻¹(`, `acosh(` → `cosh⁻¹(`, `atanh(` → `tanh⁻¹(`
- [x] 1.3 Add combinatorics display replacements: `permutations(` → `P(`, `combinations(` → `C(`
- [x] 1.4 Add constant display replacement: `pi` → `π` using word boundary regex `\bpi\b`
- [x] 1.5 Add power superscript replacements: `^2` → `²` and `^3` → `³` (only when followed by non-digit or end of string)

## 2. Bracket-style replacements

- [x] 2.1 Add `replaceFunctionWithBrackets(expr, fnName, openBracket, closeBracket)` helper that finds `fnName(`, walks to matching `)`, and wraps content with bracket characters
- [x] 2.2 Apply bracket replacement for `abs(` → `|...|`
- [x] 2.3 Apply bracket replacement for `ceil(` → `⌈...⌉`
- [x] 2.4 Apply bracket replacement for `floor(` → `⌊...⌋`

## 3. Testing

- [x] 3.1 Add unit tests for all new `formatExpression` replacements (simple regex cases)
- [x] 3.2 Add unit tests for `replaceFunctionWithBrackets` helper (nested parens, edge cases)
- [x] 3.3 Add e2e tests verifying math notation display for representative functions
- [x] 3.4 Verify build passes and all existing tests still pass
