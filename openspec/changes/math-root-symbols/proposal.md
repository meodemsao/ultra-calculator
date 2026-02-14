## Why

The calculator buttons already show mathematical symbols (√, ∛, ⁿ√) but the expression display renders plain text function names (`sqrt(25)`, `cbrt(8)`, `log10(100)`). This creates a disconnect between what users click and what they see. Replacing text-based function names with proper mathematical notation (√25, ∛8, log₁₀100) makes the display more intuitive and visually consistent with physical scientific calculators.

## What Changes

- Replace `sqrt(...)` with `√(...)` in the expression display
- Replace `cbrt(...)` with `∛(...)` in the expression display
- Replace `nthRoot(...)` with `ⁿ√(...)` in the expression display
- Replace `log10(...)` with `log₁₀(...)` in the expression display
- Replace `log(...)` (natural log) with `ln(...)` in the expression display
- The underlying expression string used for evaluation remains unchanged — only the visual rendering changes

## Capabilities

### New Capabilities
- `expression-display-formatting`: Render mathematical expressions with proper Unicode symbols for root and logarithm functions, transforming internal function names to human-readable mathematical notation in the display

### Modified Capabilities
_None — this is display-only; evaluation logic is unchanged._

## Impact

- **Display component** (`src/components/Display/Display.tsx`): Expression rendering needs a formatting layer
- **No changes** to expression evaluation, input handling, or button configuration
- **No new dependencies** — uses Unicode characters already available
