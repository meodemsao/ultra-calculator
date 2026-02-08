## ADDED Requirements

### Requirement: Ans and PreAns
The calculator SHALL store the last two evaluation results as `Ans` (most recent) and `PreAns` (previous). Users SHALL be able to insert these into expressions.

#### Scenario: Using Ans in expression
- **WHEN** user evaluates `2+3` (result=5) then inputs `Ans*2`
- **THEN** system evaluates to `10`

### Requirement: STO/RCL named variables
The calculator SHALL allow storing values to named variables (A-F) via STO and recalling them via RCL. Variables SHALL persist in CalculatorState.

#### Scenario: Store and recall
- **WHEN** user evaluates `42` then stores to variable A, then inputs `A+8`
- **THEN** system evaluates to `50`

### Requirement: Fraction decimal toggle
The calculator SHALL provide an S⇌D button to toggle the displayed result between fraction and decimal representation.

#### Scenario: Toggle to fraction
- **WHEN** user evaluates `1/3` (shows `0.3333333333`) and presses S⇌D
- **THEN** display shows `1/3`

### Requirement: Clipboard copy and paste
The calculator SHALL allow copying the current result to clipboard and pasting into the expression.

#### Scenario: Copy result
- **WHEN** user clicks copy button after evaluating `2+3`
- **THEN** `5` is copied to the system clipboard
