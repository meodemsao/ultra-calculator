## ADDED Requirements

### Requirement: Function plotting
The graph mode SHALL plot y=f(x) on an interactive canvas with pan and zoom.

#### Scenario: Plot a function
- **WHEN** user enters `x^2` and clicks Plot
- **THEN** system displays a parabola on the canvas

### Requirement: Multiple function plotting
The graph mode SHALL support plotting multiple functions simultaneously with different colors.

#### Scenario: Two functions
- **WHEN** user plots `x^2` and `2*x+1`
- **THEN** both functions are displayed with distinct colors

### Requirement: Trace mode
The graph mode SHALL allow moving a cursor along the graph, displaying (x, y) coordinates.

#### Scenario: Trace along curve
- **WHEN** user enables trace mode and moves cursor along `sin(x)`
- **THEN** display shows the (x, y) coordinates at the cursor position

### Requirement: Table of values
The graph mode SHALL generate an x/y table for a function over a specified range.

#### Scenario: Generate table
- **WHEN** user requests a table for `x^2` from x=-3 to x=3 with step 1
- **THEN** system displays a table with 7 rows showing x and corresponding y values
