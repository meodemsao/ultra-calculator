## ADDED Requirements

### Requirement: Hyperbolic trig functions
The scientific keypad SHALL provide sinh, cosh, tanh, asinh, acosh, atanh functions accessible via the 2nd function toggle.

#### Scenario: Using sinh via 2nd toggle
- **WHEN** user enables 2nd function and clicks the sin button
- **THEN** system inserts `sinh(` into the expression

### Requirement: Cotangent functions
The scientific keypad SHALL provide cot and cot⁻¹ (acot) functions.

#### Scenario: Computing cotangent
- **WHEN** user inputs `cot(45)` in DEG mode
- **THEN** system evaluates to `1`

### Requirement: Combinatorics
The scientific keypad SHALL provide nPr (permutations) and nCr (combinations) buttons using mathjs `permutations()` and `combinations()`.

#### Scenario: Computing combinations
- **WHEN** user inputs `nCr(5,2)`
- **THEN** system evaluates to `10`

### Requirement: GCD and LCM
The scientific keypad SHALL provide GCD and LCM functions using mathjs `gcd()` and `lcm()`.

#### Scenario: Computing GCD
- **WHEN** user inputs `gcd(12,8)`
- **THEN** system evaluates to `4`

### Requirement: Ceil and Floor
The calculator SHALL support `ceil()` and `floor()` functions.

#### Scenario: Computing ceil
- **WHEN** user inputs `ceil(3.2)`
- **THEN** system evaluates to `4`

### Requirement: Random numbers
The scientific keypad SHALL provide Ran# (random 0-1) and RanInt(a,b) (random integer in range).

#### Scenario: Generating random number
- **WHEN** user clicks Ran# button
- **THEN** system inserts a random decimal between 0 and 1 into the expression

### Requirement: Constants library
The calculator SHALL provide a modal with categorized physics/chemistry/math constants (speed of light, Planck's constant, Avogadro's number, gravitational constant, etc.).

#### Scenario: Inserting a constant
- **WHEN** user opens constants library and selects speed of light
- **THEN** system inserts `299792458` into the expression
