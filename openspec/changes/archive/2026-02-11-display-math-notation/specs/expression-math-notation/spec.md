## ADDED Requirements

### Requirement: Constants display as math symbols
The system SHALL display the constant `pi` as `π` in the expression display.

#### Scenario: pi displays as π
- **WHEN** the expression contains `pi` (e.g., `2*pi`)
- **THEN** the display SHALL show `2*π`

#### Scenario: pi inside function not affected
- **WHEN** the expression contains `asin(pi)`
- **THEN** the display SHALL show `sin⁻¹(π)` (pi converted, asin converted, no false match)

### Requirement: Inverse trig functions display with superscript notation
The system SHALL display inverse trigonometric functions using `⁻¹` superscript notation.

#### Scenario: asin displays as sin⁻¹
- **WHEN** the expression contains `asin(`
- **THEN** the display SHALL show `sin⁻¹(`

#### Scenario: acos displays as cos⁻¹
- **WHEN** the expression contains `acos(`
- **THEN** the display SHALL show `cos⁻¹(`

#### Scenario: atan displays as tan⁻¹
- **WHEN** the expression contains `atan(`
- **THEN** the display SHALL show `tan⁻¹(`

#### Scenario: acot displays as cot⁻¹
- **WHEN** the expression contains `acot(`
- **THEN** the display SHALL show `cot⁻¹(`

#### Scenario: Forward trig not affected
- **WHEN** the expression contains `sin(` (without `a` prefix)
- **THEN** the display SHALL show `sin(` unchanged

### Requirement: Inverse hyperbolic functions display with superscript notation
The system SHALL display inverse hyperbolic functions using `⁻¹` superscript notation.

#### Scenario: asinh displays as sinh⁻¹
- **WHEN** the expression contains `asinh(`
- **THEN** the display SHALL show `sinh⁻¹(`

#### Scenario: acosh displays as cosh⁻¹
- **WHEN** the expression contains `acosh(`
- **THEN** the display SHALL show `cosh⁻¹(`

#### Scenario: atanh displays as tanh⁻¹
- **WHEN** the expression contains `atanh(`
- **THEN** the display SHALL show `tanh⁻¹(`

### Requirement: Combinatorics functions display with short notation
The system SHALL display combinatorics functions using compact notation.

#### Scenario: permutations displays as P
- **WHEN** the expression contains `permutations(`
- **THEN** the display SHALL show `P(`

#### Scenario: combinations displays as C
- **WHEN** the expression contains `combinations(`
- **THEN** the display SHALL show `C(`

### Requirement: Power exponents display as superscript characters
The system SHALL display `^2` and `^3` as Unicode superscript characters `²` and `³` when they represent complete exponents.

#### Scenario: ^2 displays as ²
- **WHEN** the expression contains `^2` followed by end-of-string or a non-digit character
- **THEN** the display SHALL show `²` instead of `^2`

#### Scenario: ^3 displays as ³
- **WHEN** the expression contains `^3` followed by end-of-string or a non-digit character
- **THEN** the display SHALL show `³` instead of `^3`

#### Scenario: ^23 not converted
- **WHEN** the expression contains `^23` (exponent twenty-three)
- **THEN** the display SHALL show `^23` unchanged (SHALL NOT become `²3`)

### Requirement: Absolute value displays with vertical bar notation
The system SHALL display `abs(...)` as `|...|` using vertical bar characters.

#### Scenario: Simple abs
- **WHEN** the expression contains `abs(5)`
- **THEN** the display SHALL show `|5|`

#### Scenario: Nested abs with parentheses
- **WHEN** the expression contains `abs(3*(2+1))`
- **THEN** the display SHALL show `|3*(2+1)|` (matching the correct closing paren)

#### Scenario: abs in larger expression
- **WHEN** the expression contains `abs(x)+1`
- **THEN** the display SHALL show `|x|+1`

### Requirement: Ceiling function displays with bracket notation
The system SHALL display `ceil(...)` as `⌈...⌉` using ceiling bracket characters.

#### Scenario: Simple ceil
- **WHEN** the expression contains `ceil(3.5)`
- **THEN** the display SHALL show `⌈3.5⌉`

#### Scenario: Nested ceil
- **WHEN** the expression contains `ceil(2+1.5)`
- **THEN** the display SHALL show `⌈2+1.5⌉`

### Requirement: Floor function displays with bracket notation
The system SHALL display `floor(...)` as `⌊...⌋` using floor bracket characters.

#### Scenario: Simple floor
- **WHEN** the expression contains `floor(3.7)`
- **THEN** the display SHALL show `⌊3.7⌋`

#### Scenario: Nested floor
- **WHEN** the expression contains `floor(2+1.5)`
- **THEN** the display SHALL show `⌊2+1.5⌋`

### Requirement: All conversions are display-only
All formatting conversions SHALL only affect the displayed expression text. The internal expression used for evaluation SHALL remain unchanged.

#### Scenario: Evaluation unaffected
- **WHEN** the expression `abs(asin(pi))` is evaluated
- **THEN** the display SHALL show `|sin⁻¹(π)|` but evaluation SHALL use `abs(asin(pi))` internally
