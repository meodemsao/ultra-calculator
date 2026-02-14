## Approach

Add a pure display-formatting function that transforms the internal expression string into human-readable mathematical notation. This function is applied only at render time in the Display component — the internal expression remains unchanged for evaluation.

## Design

### Formatting Function

Create a `formatExpression(expr: string): string` utility that applies these replacements:

| Internal | Display |
|----------|---------|
| `sqrt(` | `√(` |
| `cbrt(` | `∛(` |
| `nthRoot(` | `ⁿ√(` |
| `log10(` | `log₁₀(` |
| `log(` | `ln(` |

**Order matters**: `log10(` must be replaced before `log(` to avoid partial matching.

### Integration Point

In `Display.tsx`, wrap the expression through `formatExpression()` before rendering. Apply to both the expression line and any other place the raw expression text appears in the display.

### Constraints

- Pure string replacement — no JSX/HTML rendering needed (Unicode characters are sufficient)
- No changes to expression evaluation, input handling, or button definitions
- The function must handle edge cases: expressions containing multiple instances, nested functions, etc.

## Alternatives Considered

1. **Rich JSX rendering with superscripts/subscripts** — Rejected as over-engineered for this change. Unicode subscript digits (₀₁₂₃₄₅₆₇₈₉) and root symbols are sufficient.
2. **MathJax/KaTeX rendering** — Rejected due to bundle size and complexity. Not warranted for simple symbol replacement.
