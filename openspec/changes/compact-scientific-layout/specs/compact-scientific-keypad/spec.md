## ADDED Requirements

### Requirement: 6-column compact grid layout
The CompactScientificKeypad SHALL render all buttons in a 6-column grid layout. The grid SHALL contain no more than 9 rows total. All buttons SHALL have a uniform height of h-10 (40px) with gap-1.5 (6px) spacing.

#### Scenario: Grid renders 6 columns
- **WHEN** Scientific mode is active
- **THEN** the keypad grid displays 6 buttons per row

#### Scenario: Total keypad height fits iPhone screen
- **WHEN** Scientific mode is active on a 375px-wide viewport
- **THEN** the total keypad height (including gaps) SHALL be at most 420px

### Requirement: Single unified keypad in scientific mode
Scientific mode SHALL render a single CompactScientificKeypad component that includes both scientific functions and basic number keys. The system SHALL NOT render a separate BasicKeypad component in scientific mode.

#### Scenario: Scientific mode renders one keypad
- **WHEN** user selects Scientific mode
- **THEN** only CompactScientificKeypad renders (not ScientificKeypad + BasicKeypad)

#### Scenario: Basic mode is unaffected
- **WHEN** user selects Basic mode
- **THEN** BasicKeypad renders as before with no changes

### Requirement: Primary layer button arrangement
The primary layer SHALL arrange buttons as follows:
- Row 1: Shift, Mode (DEG/RAD toggle), Const, ⌫, C, CE
- Row 2: sin, cos, tan, log, ln, (
- Row 3: x², xʸ, √, n!, π, )
- Row 4: MC, MR, M+, M−, %, ÷
- Row 5: STO, 7, 8, 9, Ans, ×
- Row 6: RCL, 4, 5, 6, S⇌D, −
- Row 7: |x|, 1, 2, 3, exp, +
- Row 8: [empty], ±, 0, ., mod, =

#### Scenario: Number pad position
- **WHEN** CompactScientificKeypad renders in primary layer
- **THEN** digits 0-9 appear in rows 5-8, columns 2-4 in standard calculator layout (7-8-9 / 4-5-6 / 1-2-3 / ±-0-.)

#### Scenario: Operators on right edge
- **WHEN** CompactScientificKeypad renders in primary layer
- **THEN** arithmetic operators (÷, ×, −, +, =) appear in column 6

### Requirement: Shift (2nd) layer button arrangement
When Shift is active, buttons with secondary functions SHALL display their alternate labels and emit alternate values. The Shift layer SHALL provide:
- Row 2: sin⁻¹, cos⁻¹, tan⁻¹, 10ˣ, eˣ, (
- Row 3: x³, ⁿ√, ∛, mod, e, )
- Row 4: cot, cot⁻¹, sinh, cosh, tanh, ÷
- Row 5: nPr, 7, 8, 9, PreAns, ×
- Row 6: nCr, 4, 5, 6, gcd, −
- Row 7: 1/x, 1, 2, 3, lcm, +
- Row 8: [empty], ⌈x⌉, ⌊x⌋, Ran#, RanInt, =

Number keys (0-9) and basic operators (÷, ×, −, +, =) SHALL NOT change when Shift is active.

#### Scenario: Shift shows alternate functions
- **WHEN** user presses Shift button
- **THEN** buttons with secondLabel/secondValue display their alternate labels

#### Scenario: Shift does not affect number keys
- **WHEN** Shift is active
- **THEN** number keys 0-9 and operators ÷, ×, −, +, = remain unchanged

### Requirement: Shift auto-reset behavior
After pressing a function button (not a number, operator, or Shift itself) while Shift is active, the system SHALL automatically deactivate Shift mode (one-shot behavior).

#### Scenario: Shift resets after function press
- **WHEN** Shift is active and user presses a scientific function button (e.g., sin⁻¹)
- **THEN** the function is inserted and Shift deactivates

#### Scenario: Shift does not reset on number press
- **WHEN** Shift is active and user presses a number key
- **THEN** Shift remains active

### Requirement: Button text sizing
Scientific function labels SHALL use `text-xs` (12px) font size. Number keys SHALL use `text-base` (16px) font size. Operator keys SHALL use `text-base` (16px) font size.

#### Scenario: Function labels are smaller
- **WHEN** CompactScientificKeypad renders
- **THEN** function buttons (sin, cos, log, etc.) use text-xs class

#### Scenario: Number labels are standard size
- **WHEN** CompactScientificKeypad renders
- **THEN** number buttons (0-9) use text-base class

### Requirement: Advanced mode integration
When Advanced mode is active, the system SHALL render AdvancedKeypad above CompactScientificKeypad (replacing the previous AdvancedKeypad + ScientificKeypad + BasicKeypad stack).

#### Scenario: Advanced mode uses compact layout
- **WHEN** user selects Advanced mode
- **THEN** AdvancedKeypad renders above CompactScientificKeypad
