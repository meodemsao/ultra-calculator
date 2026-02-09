## Tasks

- [x] Create `CompactScientificKeypad.tsx` component with 6-column grid layout (6×8 = 48 button slots)
- [x] Define compact button arrays in `buttons.ts` — primary layer and Shift layer mappings for 6-column layout
- [x] Implement Shift toggle with auto-reset (one-shot) behavior for function buttons
- [x] Integrate memory (MC/MR/M+/M−), STO/RCL, Ans/PreAns, S⇌D into the compact grid
- [x] Update `Calculator.tsx` — scientific mode renders `<CompactScientificKeypad />` instead of `<ScientificKeypad /> + <BasicKeypad />`
- [x] Update `Calculator.tsx` — advanced mode renders `<AdvancedKeypad /> + <CompactScientificKeypad />`
- [x] Apply compact button sizing: h-10 height, gap-1.5, text-xs for functions, text-base for numbers
- [x] Handle empty cell (row 8, col 1) with invisible spacer
- [x] Test on iPhone viewport sizes (375px, 390px, 430px width) — verify no scrolling needed
- [x] Update existing unit tests and e2e tests to match new button layout
