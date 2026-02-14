## root-prefix-operator

### Requirements

1. `√` button inserts `√` (not `sqrt(`) into the expression
2. `∛` button (2nd function) inserts `∛` (not `cbrt(`) into the expression
3. `√25` displays as `√25` (no parentheses)
4. `√25` evaluates to `5` (equivalent to `sqrt(25)`)
5. `∛8` evaluates to `2` (equivalent to `cbrt(8)`)
6. `√(25+3)` evaluates correctly — explicit parentheses still work
7. `2√9` inserts implicit multiplication → `2*√9`, displays as `2*√9`, evaluates to `6`
8. `√√16` evaluates to `2` (nested: `sqrt(sqrt(16))`)
9. `√pi` evaluates correctly (`sqrt(pi)`)
10. `√sin(30)` evaluates correctly in DEG mode (`sqrt(sin(30°))`)
11. `√25+3` evaluates to `8` (`sqrt(25)+3`, root applies to next term only)
12. `nthRoot(` button behavior is unchanged (still uses function-call syntax)
13. Existing history entries with `sqrt(` must still evaluate correctly
