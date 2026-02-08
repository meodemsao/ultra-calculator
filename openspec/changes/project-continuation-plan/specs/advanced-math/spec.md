## ADDED Requirements

### Requirement: Symbolic integration
The advanced mode SHALL display the antiderivative expression (not just numerical result) when computing integrals.

#### Scenario: Symbolic antiderivative
- **WHEN** user inputs integral of `x^2`
- **THEN** system displays `x^3/3 + C` alongside the numerical result

### Requirement: Limit computation
The advanced mode SHALL compute lim(x→a) f(x), including limits approaching ±∞.

#### Scenario: Limit at a point
- **WHEN** user inputs lim(x→0) sin(x)/x
- **THEN** system evaluates to `1`

### Requirement: Taylor series expansion
The advanced mode SHALL expand f(x) around a point to nth order.

#### Scenario: Taylor expansion of sin(x)
- **WHEN** user inputs Taylor expansion of sin(x) around 0 to order 5
- **THEN** system displays `x - x^3/6 + x^5/120`

### Requirement: Vector operations
The advanced mode SHALL support dot product, cross product, magnitude, and angle between vectors.

#### Scenario: Dot product
- **WHEN** user inputs vectors [1,2,3] and [4,5,6]
- **THEN** system computes dot product = 32

### Requirement: User-defined functions
The advanced mode SHALL allow defining f(x)=..., saving to localStorage, and using in expressions.

#### Scenario: Define and use function
- **WHEN** user defines f(x) = x^2 + 1 and then evaluates f(3)
- **THEN** system evaluates to 10
