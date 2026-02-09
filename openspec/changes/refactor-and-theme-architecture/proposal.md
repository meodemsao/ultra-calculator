## Why

AdvancedKeypad.tsx has grown to 757 lines with 8 inline modals and ~25 useState calls — a maintenance and accessibility bottleneck. The theme system is a binary dark/light toggle using Tailwind's `dark:` variant (250 occurrences across 16 files), which cannot scale to the 6 themes planned in Change 10 (UX Polish). Refactoring both before implementing polish features prevents rework and establishes the architecture that Changes 10 and 11 build on.

## What Changes

- **AdvancedKeypad decomposition**: Extract 7 modal components into `Keypad/modals/` directory. Create a `ModalShell` wrapper component to DRY up Headless UI Dialog boilerplate. AdvancedKeypad becomes a thin shell (~80 lines) that renders buttons and routes to modals via callback-based props (ComputeModalProps / InsertModalProps). No modal touches useCalculator() directly.
- **Theme token system**: Define 20 CSS custom property tokens in `index.css` (4 surface, 3 text, 2 border, 4 accent, 2 function, 6 semantic). Map them to Tailwind via `tailwind.config` extended colors. Replace all 250 `dark:` class usages across 16 files with semantic token classes.
- **6 themes**: light, dark, amoled, solarized, high-contrast, retro — each defined as a `[data-theme="..."]` block in CSS.
- **ThemeContext rework**: Change from `toggleTheme()` to `setTheme(name)`, apply `data-theme` attribute on `<html>` instead of toggling `dark` class.
- **Flatten gradients**: Equal button gradient → solid `bg-accent`. Display gradient → solid `bg-surface-secondary`.

## Capabilities

### Modified Capabilities
- `theme-system`: Reworked from binary dark/light to 6-theme CSS custom property architecture
- `advanced-keypad`: Decomposed from monolithic 757-line component to thin shell + 7 extracted modals + ModalShell wrapper

### New Capabilities
_(none — this is a refactoring change that restructures existing functionality)_

## Impact

- **Components**: AdvancedKeypad.tsx refactored (757 → ~80 lines), 7 new modal files created, 1 new ModalShell component, ThemeToggle replaced with ThemeSelector
- **Styles**: index.css gains ~120 lines of CSS custom property definitions (6 themes × 20 tokens). All 16 TSX files with `dark:` variants updated.
- **Tailwind config**: Extended colors section maps CSS variables to semantic class names
- **Types**: Theme type changes from `'light' | 'dark'` to union of 6 theme names
- **Tests**: Existing tests should pass unchanged (behavior preserved). New tests for ModalShell and theme switching.
- **No new dependencies**
