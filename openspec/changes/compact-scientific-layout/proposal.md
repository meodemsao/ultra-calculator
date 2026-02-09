## Why

Scientific mode currently stacks ScientificKeypad (4×6 = 24 buttons) on top of BasicKeypad (20+ buttons with memory/STO rows), totaling ~14 rows of buttons. This doesn't fit on a single iPhone screen — users must scroll to reach the number pad. A real scientific calculator fits all keys on one panel by using more columns per row and Shift layers for secondary functions.

## What Changes

- **BREAKING**: Redesign ScientificKeypad from 4-column to 6-column layout
- Merge scientific functions and basic number keys into a single compact grid that fits one iPhone screen (~8-9 rows max)
- Reduce individual button heights (from h-12/h-14 to h-10/h-11) for compact fit
- Consolidate memory row (MC/MR/M+/M−), parentheses, and STO/RCL into the scientific grid using Shift layers
- Use Shift (2nd) function toggle more aggressively to double the effective button count without extra rows
- Move less-used functions (Ran#, RanInt, nPr, nCr, gcd, lcm, ceil, floor) to 2nd layer
- Keep Basic mode layout unchanged — only Scientific mode changes

## Capabilities

### New Capabilities
- `compact-scientific-keypad`: Redesigned 6-column scientific keypad layout that combines scientific functions and basic number keys into a single screen-fitting grid with Shift/2nd layers

### Modified Capabilities
_(none — no existing spec files to modify)_

## Impact

- **Components**: `ScientificKeypad.tsx` — complete rewrite of grid layout and button arrangement
- **Components**: `BasicKeypad.tsx` — scientific mode will no longer render BasicKeypad separately; its buttons are absorbed into the compact layout
- **Components**: `Calculator.tsx` — change scientific mode rendering from `<ScientificKeypad /> + <BasicKeypad />` to just `<CompactScientificKeypad />`
- **Constants**: `buttons.ts` — reorganize button arrays for 6-column layout
- **Styles**: Button height classes may need new compact variants
- **No logic changes**: Expression evaluation, validation, and preprocessing are unaffected
