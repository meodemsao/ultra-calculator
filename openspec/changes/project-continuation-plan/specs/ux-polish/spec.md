## ADDED Requirements

### Requirement: Multiple themes
The app SHALL support 4-6 color themes beyond dark/light (AMOLED black, solarized, high contrast, retro). Theme selection SHALL persist to localStorage.

#### Scenario: Switch to AMOLED theme
- **WHEN** user selects AMOLED black theme
- **THEN** app displays with pure black background and theme persists across reloads

### Requirement: Unlimited history
The app SHALL remove the 100-entry history cap and add search/filter functionality in the history sidebar.

#### Scenario: Search history
- **WHEN** user types "sin" in history search
- **THEN** history filters to show only entries containing "sin"

### Requirement: Export history
The app SHALL allow exporting calculation history as CSV or JSON.

#### Scenario: Export as CSV
- **WHEN** user clicks Export CSV
- **THEN** browser downloads a CSV file with expression, result, and timestamp columns

### Requirement: Accessibility
The app SHALL have full ARIA labels, focus management, screen reader support, and keyboard navigation for all modes.

#### Scenario: Keyboard navigation
- **WHEN** user navigates the calculator using only keyboard (Tab, Enter, Arrow keys)
- **THEN** all buttons and inputs are reachable and operable

### Requirement: Landscape layout
The app SHALL provide an optimized two-panel layout in landscape orientation.

#### Scenario: Landscape display
- **WHEN** device is in landscape orientation
- **THEN** app shows calculator and history side-by-side with optimized sizing
