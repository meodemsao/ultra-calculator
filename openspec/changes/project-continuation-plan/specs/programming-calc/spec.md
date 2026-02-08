## ADDED Requirements

### Requirement: Number base display
The programming mode SHALL display the current result simultaneously in DEC, HEX, OCT, and BIN.

#### Scenario: Display in all bases
- **WHEN** user enters 255
- **THEN** display shows DEC: 255, HEX: FF, OCT: 377, BIN: 11111111

### Requirement: Base input
The programming mode SHALL accept numbers in any base using prefixes: 0x (hex), 0b (binary), 0o (octal).

#### Scenario: Hex input
- **WHEN** user inputs `0xFF`
- **THEN** system interprets as decimal 255

### Requirement: Bitwise operations
The programming mode SHALL support AND, OR, XOR, NOT, left shift (<<), and right shift (>>).

#### Scenario: Bitwise AND
- **WHEN** user inputs `0b1100 AND 0b1010`
- **THEN** system evaluates to `0b1000` (decimal 8)

### Requirement: Word size toggle
The programming mode SHALL support 8-bit, 16-bit, 32-bit, and 64-bit word sizes with overflow behavior.

#### Scenario: 8-bit overflow
- **WHEN** word size is 8-bit and user inputs 256
- **THEN** system displays 0 (overflow)
