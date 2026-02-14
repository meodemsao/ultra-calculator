## Tasks

- [x] Change button values in `constants/buttons.ts`: `sqrt(` → `√`, `cbrt(` → `∛`
- [x] Update expression validator to treat `√` and `∛` as prefix operators (implicit multiplication, allowed positions)
- [x] Create `preprocessRootOperators()` function in `mathOperations.ts` that converts `√`/`∛` + term → `sqrt(...)`/`cbrt(...)` before evaluation
- [x] Integrate `preprocessRootOperators()` into `evaluateExpression()` and `liveResult` preview
- [x] Update `formatExpression.ts`: remove `sqrt(` → `√(` and `cbrt(` → `∛(` replacements (no longer needed)
- [x] Update unit tests for expressionValidator, mathOperations, and formatExpression
- [x] Update e2e Playwright tests to match new behavior
