## Why

The scientific calculator mode is visibly shorter than the basic mode (~408px vs ~488px), causing the display area and overall calculator card to shift height when switching between modes. This creates a jarring visual experience. Both modes should occupy the same vertical space for a consistent, polished feel.

## What Changes

- Adjust button heights in the CompactScientificKeypad to increase total keypad height to match the BasicKeypad (~488px)
- Increase gap and section spacing in the scientific keypad to align with basic keypad proportions
- Number pad rows (7-9: digits, operators, and bottom row) should use taller buttons (`h-12` or `h-14`) similar to the basic keypad, while function rows (1-6) remain compact

## Capabilities

### New Capabilities

_None — this is a layout adjustment, not a new feature._

### Modified Capabilities

_None — no spec-level behavior changes, only visual sizing._

## Impact

- **Code**: `src/components/Keypad/CompactScientificKeypad.tsx` — button height classes and grid gap values
- **Visual**: Scientific mode will be taller, matching basic mode height. No functional behavior changes.
- **Dependencies**: None
