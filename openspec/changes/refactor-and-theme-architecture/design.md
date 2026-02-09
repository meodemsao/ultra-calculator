## Context

Calculator Ultra has completed Changes 1-9 (code quality, scientific enhancements, Ans/STO/RCL, equation solver, graphing, statistics, programming, financial, advanced math). The remaining work is Change 10 (UX Polish) and Change 11 (PWA). This refactoring change (Phase A1+A2) prepares the architecture for those final changes.

Current state: 9 modes, 14 component directories, 15 utility files, 757-line AdvancedKeypad with 8 inline modals, binary dark/light theme with 250 `dark:` Tailwind class usages across 16 files.

## Goals / Non-Goals

**Goals:**
- Decompose AdvancedKeypad into testable, accessible modal components with clean callback interfaces
- Establish a CSS custom property theme system that supports N themes without per-component changes
- Replace all `dark:` Tailwind variants with semantic token classes
- Preserve all existing functionality — zero behavior changes

**Non-Goals:**
- Adding new themes beyond the 6 defined (light, dark, amoled, solarized, high-contrast, retro)
- Adding the theme selector UI (that's Change 10 — this change only provides the ThemeContext API and CSS tokens)
- Refactoring other components (EquationSolver, Statistics, etc.) — only touch them for dark: → token migration
- Adding accessibility features (ARIA labels, focus management) — that's Change 10. ModalShell provides the hook point.

## Decisions

### 1. Modal interface: Callback-based, parent mediates all context access
**Rationale**: Modals fall into two categories — "compute and display" (derivative, integral, vectors, limits, taylor) and "insert into expression" (complex, matrix, user functions). Compute modals need no context access at all. Insert modals receive an `onInsert` callback from the parent. This makes modals testable without mocking CalculatorContext, and gives the parent control over the open → compute → insert → close → focus-return cycle needed for accessibility later.

**Alternatives considered**: Each modal calls `useCalculator()` directly (current pattern) — rejected because it couples every modal to context and makes the parent unable to manage focus flow.

**Interface**:
```typescript
interface ComputeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (value: string) => void;
}
```

### 2. ModalShell extracts Dialog boilerplate (~10 lines per modal × 8 modals)
**Rationale**: The Dialog chrome (overlay, panel, title bar, close button) is identical across all 8 modals. Extracting it means accessibility improvements (ARIA) happen in one place. Each modal provides only title, optional `scrollable` flag, and children.

**Interface**:
```typescript
interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  scrollable?: boolean;
  children: ReactNode;
}
```

### 3. CSS custom properties with Tailwind mapping (not data-* variants or multiple dark: configs)
**Rationale**: CSS variables let any number of themes be defined in pure CSS without touching Tailwind config per theme. The Tailwind config maps variables to semantic class names once. Adding a new theme is adding a CSS block, not touching any component.

**Alternatives considered**:
- Tailwind `data-*` variants — requires plugin config per theme prefix, verbose class names
- Multiple Tailwind dark modes — only supports one alternative theme
- CSS-in-JS — against project's Tailwind-first approach

### 4. 20 tokens with function distinct from accent
**Rationale**: The app visually distinguishes function buttons (sin, cos — violet) from operator buttons (+, -, * — indigo). Merging them would reduce visual hierarchy on the keypad. 20 tokens is the minimum to capture all semantic color roles without per-component tokens.

**Token set**:
| Category | Tokens | Count |
|----------|--------|-------|
| Surface | primary, secondary, tertiary, inset | 4 |
| Text | primary, secondary, muted | 3 |
| Border | default, subtle | 2 |
| Accent | base, hover, subtle, on | 4 |
| Function | subtle, on | 2 |
| Semantic | danger, danger-subtle, warning, warning-subtle, success, success-subtle | 6 |
| **Total** | | **21** |

### 5. Flatten gradients to solid tokens
**Rationale**: The equal button gradient (`from-indigo-500 to-purple-600`) and display gradient (`from-gray-100 to-gray-200`) don't translate cleanly across all 6 themes (AMOLED and high-contrast look odd with gradients). Solid fills are simpler and themes can optionally reintroduce gradients via CSS overrides.

### 6. ThemeContext uses `data-theme` attribute on `<html>`, not class toggling
**Rationale**: `data-theme` is more semantic than class manipulation and avoids conflicts with Tailwind's built-in `dark` class. CSS selectors `[data-theme="dark"]` are clear and specific.

## Risks / Trade-offs

- **Large diff across 16 files for token migration** — Mitigated by mechanical find-and-replace patterns. Each file's changes are cosmetic (class name swaps), not logic changes.
- **Visual regression risk** — Mitigated by testing each theme in the browser after migration. Light and dark themes should look identical to current appearance.
- **Tailwind purge/JIT may not detect CSS variable-based classes** — Mitigated by ensuring semantic class names (e.g., `bg-surface-pri`) are statically present in source, not dynamically constructed.
- **ModalShell abstraction could become a leaky abstraction** — Mitigated by keeping it minimal (title, scrollable, children). No generic "modal type" config.
