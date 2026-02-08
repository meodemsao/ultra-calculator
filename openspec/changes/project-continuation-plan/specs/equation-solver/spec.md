## ADDED Requirements

### Requirement: Quadratic equation solver
The solver mode SHALL solve ax²+bx+c=0 given coefficients a, b, c. It SHALL display real or complex roots, discriminant, and vertex.

#### Scenario: Two real roots
- **WHEN** user inputs a=1, b=-5, c=6
- **THEN** system displays roots x=2 and x=3, discriminant=1, vertex=(2.5, -0.25)

### Requirement: Cubic equation solver
The solver mode SHALL solve ax³+bx²+cx+d=0 given coefficients.

#### Scenario: Cubic with one real root
- **WHEN** user inputs a=1, b=0, c=0, d=-8
- **THEN** system displays root x=2

### Requirement: System of linear equations
The solver mode SHALL solve 2×2 and 3×3 linear systems using coefficient matrix input.

#### Scenario: 2x2 system
- **WHEN** user inputs the system 2x+y=5, x-y=1
- **THEN** system displays x=2, y=1

### Requirement: Solver mode UI
The solver mode SHALL have a dedicated tab with sub-tabs for Quadratic, Cubic, and Linear System, with coefficient input fields and formatted result display.

#### Scenario: Mode navigation
- **WHEN** user selects Solver mode from mode selector
- **THEN** system displays the solver UI with sub-tab navigation
