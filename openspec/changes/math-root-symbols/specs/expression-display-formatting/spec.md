## expression-display-formatting

### Requirements

1. The display must show `√(` instead of `sqrt(` in the expression
2. The display must show `∛(` instead of `cbrt(` in the expression
3. The display must show `ⁿ√(` instead of `nthRoot(` in the expression
4. The display must show `log₁₀(` instead of `log10(` in the expression
5. The display must show `ln(` instead of `log(` in the expression (natural log)
6. Replacements must not affect the internal expression used for evaluation
7. Multiple function instances in a single expression must all be replaced
8. Nested functions must be handled correctly (e.g., `sqrt(log10(100))`)
9. `log10` must be matched before `log` to prevent partial replacement
