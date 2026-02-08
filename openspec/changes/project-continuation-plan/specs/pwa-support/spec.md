## ADDED Requirements

### Requirement: Service worker and manifest
The app SHALL include a service worker and web app manifest for PWA installability.

#### Scenario: Install as PWA
- **WHEN** user visits the app in a supported browser
- **THEN** browser shows an "Install" prompt and app can be installed to home screen

### Requirement: Offline capability
The app SHALL work fully offline after initial load via service worker caching.

#### Scenario: Use offline
- **WHEN** user loses internet connection after initial load
- **THEN** all calculator functionality continues to work

### Requirement: Haptic feedback
The app SHALL provide vibration feedback on button press on supported mobile devices.

#### Scenario: Button press vibration
- **WHEN** user taps a calculator button on a mobile device
- **THEN** device provides brief haptic feedback

### Requirement: Swipe gestures
The app SHALL support swipe gestures to switch between modes on mobile.

#### Scenario: Swipe to switch mode
- **WHEN** user swipes left on the calculator
- **THEN** app switches to the next mode
