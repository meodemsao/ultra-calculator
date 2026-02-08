## ADDED Requirements

### Requirement: Data input
The stats mode SHALL allow entering single-variable and two-variable data sets.

#### Scenario: Enter data set
- **WHEN** user enters values 2, 4, 6, 8, 10
- **THEN** system stores the data set for analysis

### Requirement: Descriptive statistics
The stats mode SHALL compute mean, median, mode, standard deviation (σ and s), variance, min, max, quartiles, and IQR.

#### Scenario: Compute mean
- **WHEN** user has data set [2, 4, 6, 8, 10] and requests descriptive stats
- **THEN** system displays mean=6, median=6, std dev=2.83, etc.

### Requirement: Regression analysis
The stats mode SHALL perform linear, quadratic, exponential, power, and logarithmic regression, displaying the equation and r² value.

#### Scenario: Linear regression
- **WHEN** user has data points (1,2), (2,4), (3,6) and selects linear regression
- **THEN** system displays y=2x with r²=1.0
