## ADDED Requirements

### Requirement: TVM Solver
The financial mode SHALL solve for any one of N (periods), I% (interest rate), PV (present value), PMT (payment), FV (future value) given the other four.

#### Scenario: Solve for PMT
- **WHEN** user inputs N=360, I%=6, PV=200000, FV=0 and solves for PMT
- **THEN** system displays monthly payment amount

### Requirement: Amortization schedule
The financial mode SHALL generate a payment breakdown table showing principal, interest, and remaining balance per period.

#### Scenario: Generate schedule
- **WHEN** user has a solved TVM and requests amortization
- **THEN** system displays a table with per-period breakdown

### Requirement: Compound interest calculator
The financial mode SHALL calculate compound interest with different compounding frequencies (daily, monthly, quarterly, annually).

#### Scenario: Monthly compounding
- **WHEN** user inputs principal=1000, rate=5%, time=10 years, compounding=monthly
- **THEN** system displays final amount with compound interest
