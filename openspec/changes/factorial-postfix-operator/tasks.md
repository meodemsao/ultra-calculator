## Tasks

- [x] Change button value in `constants/buttons.ts`: `factorial(` → `!`
- [x] Update expression validator to treat `!` as postfix operator (allowed after digits, `)`, constants, `!`)
- [x] Add implicit multiplication rules for `!` (before `(`, digits, constants, functions, root prefixes)
- [x] Create `preprocessFactorialOperator()` function in `mathOperations.ts` that converts `N!` → `factorial(N)` before evaluation
- [x] Integrate `preprocessFactorialOperator()` into `evaluateExpression()`
- [x] Update `formatExpression.ts`: add `factorial(N)` → `N!` replacement for old history entries
- [x] Update unit tests for expressionValidator, mathOperations, and formatExpression
- [x] Update e2e Playwright tests to match new behavior
