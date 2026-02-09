## Context

Scientific mode currently renders two separate keypads stacked vertically:

1. **ScientificKeypad** — 3-col mode toggle row + 4×6 grid (24 scientific buttons)
2. **BasicKeypad** — memory row + parentheses row + STO/RCL row + 4×5 main grid (20 buttons)

Total vertical extent: ~14 rows of buttons at heights h-10 to h-14 (40-56px). On an iPhone SE/13 Mini (~667px viewport height), this causes significant scrolling. Even on iPhone 14 Pro Max (~932px), the layout barely fits after accounting for header, mode selector, display, and safe areas.

Physical scientific calculators (Casio fx-991, TI-30XS) solve this by using 5-6 columns and Shift/Alpha layers to pack 60+ functions into a single non-scrolling panel.

## Goals / Non-Goals

**Goals:**
- Scientific mode fits on one iPhone screen without scrolling (target: ≤ 600px total keypad height)
- 6-column grid layout for denser button packing
- Single unified keypad component (no separate BasicKeypad in scientific mode)
- Shift/2nd toggle provides secondary functions for most buttons
- All existing scientific functions remain accessible
- Basic mode remains completely unchanged

**Non-Goals:**
- Changing the expression evaluation pipeline
- Adding new mathematical functions
- Changing the Advanced mode layout
- Supporting landscape-specific layout in this change
- Adding a third Shift layer (Alpha)

## Decisions

### 1. Grid: 6 columns × 9 rows

**Why 6 over 5?** User explicitly requested 6 columns. This allows fitting all buttons in ~9 rows: 1 mode toggle row + 2 scientific function rows + 1 utility row + 5 number/operator rows. At h-10 (40px) per row with gap-1.5 (6px), total height ≈ 9 × 40 + 8 × 6 = 408px — well under the 600px target.

**Alternatives considered:**
- 5 columns: More spacious buttons but requires 11+ rows
- 4 columns with more Shift layers: Current approach, doesn't solve the scrolling issue

### 2. Button layout (6 × 9 grid)

```
Row 1: [Shift] [Mode]  [DEG]   [Const] [⌫]    [C]
Row 2: [sin]   [cos]   [tan]   [log]   [ln]   [(]
Row 3: [x²]    [xʸ]   [√]     [n!]    [π]    [)]
Row 4: [MC]    [MR]    [M+]    [M−]    [%]    [÷]
Row 5: [STO]   [7]     [8]     [9]     [Ans]  [×]
Row 6: [RCL]   [4]     [5]     [6]     [S⇌D]  [−]
Row 7: [|x|]   [1]     [2]     [3]     [exp]  [+]
Row 8:         [±]     [0]     [.]     [CE]   [=]
```

**Shift (2nd) layer:**
```
Row 2: [sin⁻¹] [cos⁻¹] [tan⁻¹] [10ˣ]  [eˣ]   [(]
Row 3: [x³]    [ⁿ√]    [∛]     [mod]  [e]    [)]
Row 4: [cot]   [cot⁻¹] [sinh]  [cosh] [tanh] [÷]
Row 5: [nPr]   [7]     [8]     [9]    [PreAns][×]
Row 6: [nCr]   [4]     [5]     [6]    [gcd]  [−]
Row 7: [1/x]   [1]     [2]     [3]    [lcm]  [+]
Row 8:         [⌈x⌉]   [⌊x⌋]  [Ran#] [RanInt][=]
```

**Rationale:** Number pad stays in familiar 3×4 position (rows 5-8, cols 2-4). Operators on right edge. Scientific functions on top rows and left column. Memory and storage integrated into the grid. Less-used functions (hyperbolic, combinatorics, gcd/lcm, ceil/floor, random) moved to Shift layer.

### 3. New component: `CompactScientificKeypad.tsx`

Create a new component rather than modifying ScientificKeypad. This avoids breaking the existing component and allows the old layout to be removed cleanly.

**Calculator.tsx change:**
```tsx
// Before:
{mode === 'scientific' && (
  <>
    <ScientificKeypad />
    <BasicKeypad />
  </>
)}

// After:
{mode === 'scientific' && <CompactScientificKeypad />}
```

### 4. Button sizing for compact layout

- Height: `h-10` (40px) for all buttons — uniform for visual consistency
- Text: `text-xs` (12px) for function labels, `text-base` (16px) for numbers
- Gap: `gap-1.5` (6px) between buttons — tighter than current gap-2
- Row 8 left column: empty cell using invisible placeholder

### 5. Shift toggle behavior

Reuse the existing `isSecondFunction` state from CalculatorContext. The Shift button toggles this state. When active:
- Shift button gets active styling (indigo background)
- All buttons with `secondLabel`/`secondValue` show their alternate function
- Shift auto-resets after a function button is pressed (one-shot mode), similar to current 2nd behavior

## Risks / Trade-offs

- **Small buttons on small screens** → 6 columns with gap-1.5 on a 375px-wide iPhone SE gives ~57px per button. This is tight but usable. Physical calculators have similar or smaller key sizes.
- **Learning curve for Shift layer** → Users must discover secondary functions. Mitigate by keeping the most common functions (sin, cos, tan, log, ln, √, x², π) on the primary layer.
- **Row 8 has empty cell** → The bottom-left cell is empty. This is a visual trade-off for keeping the number pad aligned. Use an invisible spacer div.
- **Advanced mode still stacks** → Advanced mode currently renders AdvancedKeypad + ScientificKeypad + BasicKeypad. After this change, it will render AdvancedKeypad + CompactScientificKeypad. The advanced buttons (8 buttons, 4×2 grid) will sit above the compact layout. This is acceptable since advanced mode users expect more density.
