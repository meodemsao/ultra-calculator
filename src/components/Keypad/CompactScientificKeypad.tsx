import { useState } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { Button } from './Button';
import { ConstantsLibrary } from '../ConstantsLibrary/ConstantsLibrary';

const VARIABLE_NAMES = ['A', 'B', 'C', 'D', 'E', 'F'];

// Each row is an array of 5 button configs (Casio-style 5-column layout)
// { label, value, type, secondLabel?, secondValue?, action? }
type CompactBtn = {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'function' | 'action' | 'equal' | 'memory';
  secondLabel?: string;
  secondValue?: string;
  action?: string;
  textClass?: string;
};

const compactRows: CompactBtn[][] = [
  // Row 1: Shift, DEG/RAD, Const, Backspace, C
  [
    { label: '2nd', value: '', type: 'function', action: 'shift' },
    { label: 'DEG', value: '', type: 'function', action: 'angle-mode' },
    { label: 'Const', value: '', type: 'function', action: 'constants' },
    { label: '⌫', value: 'backspace', type: 'action', action: 'backspace' },
    { label: 'C', value: 'clear', type: 'action', action: 'clear' },
  ],
  // Row 2: sin, cos, tan, log, ln
  [
    { label: 'sin', value: 'sin(', type: 'function', secondLabel: 'sin⁻¹', secondValue: 'asin(' },
    { label: 'cos', value: 'cos(', type: 'function', secondLabel: 'cos⁻¹', secondValue: 'acos(' },
    { label: 'tan', value: 'tan(', type: 'function', secondLabel: 'tan⁻¹', secondValue: 'atan(' },
    { label: 'log', value: 'log10(', type: 'function', secondLabel: '10ˣ', secondValue: '10^' },
    { label: 'ln', value: 'log(', type: 'function', secondLabel: 'eˣ', secondValue: 'e^' },
  ],
  // Row 3: x², xʸ, √, n!, π
  [
    { label: 'x²', value: '^2', type: 'function', secondLabel: 'x³', secondValue: '^3' },
    { label: 'xʸ', value: '^', type: 'function', secondLabel: 'ⁿ√', secondValue: 'nthRoot(' },
    { label: '√', value: '√', type: 'function', secondLabel: '∛', secondValue: '∛' },
    { label: 'n!', value: '!', type: 'function', secondLabel: 'mod', secondValue: ' mod ' },
    { label: 'π', value: 'pi', type: 'function', secondLabel: 'e', secondValue: 'e' },
  ],
  // Row 4: |x|, exp, (, ), CE
  [
    { label: '|x|', value: 'abs(', type: 'function', secondLabel: '1/x', secondValue: '1/(' },
    { label: 'exp', value: 'exp(', type: 'function', secondLabel: 'lcm', secondValue: 'lcm(' },
    { label: '(', value: '(', type: 'operator', secondLabel: '%', secondValue: '%' },
    { label: ')', value: ')', type: 'operator', secondLabel: 'tanh', secondValue: 'tanh(' },
    { label: 'CE', value: 'clear-entry', type: 'action', action: 'clear-entry', secondLabel: 'RanInt', secondValue: 'randomInt(' },
  ],
  // Row 5: STO, RCL, S⇌D, M+, M−
  [
    { label: 'STO', value: '', type: 'memory', action: 'sto', secondLabel: 'nPr', secondValue: 'permutations(' },
    { label: 'RCL', value: '', type: 'memory', action: 'rcl', secondLabel: 'nCr', secondValue: 'combinations(' },
    { label: 'S⇌D', value: '', type: 'function', action: 'fraction-toggle', secondLabel: 'gcd', secondValue: 'gcd(' },
    { label: 'M+', value: 'memory-add', type: 'memory', action: 'memory-add', secondLabel: 'sinh', secondValue: 'sinh(' },
    { label: 'M−', value: 'memory-subtract', type: 'memory', action: 'memory-subtract', secondLabel: 'cosh', secondValue: 'cosh(' },
  ],
  // Row 6: 7, 8, 9, MC, MR
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: 'MC', value: 'memory-clear', type: 'memory', action: 'memory-clear', secondLabel: 'cot', secondValue: 'cot(' },
    { label: 'MR', value: 'memory-recall', type: 'memory', action: 'memory-recall', secondLabel: 'cot⁻¹', secondValue: 'acot(' },
  ],
  // Row 7: 4, 5, 6, ×, ÷
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
    { label: '÷', value: '/', type: 'operator' },
  ],
  // Row 8: 1, 2, 3, +, −
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
    { label: '−', value: '-', type: 'operator' },
  ],
  // Row 9: 0, ., ±, Ans, =
  [
    { label: '0', value: '0', type: 'number', secondLabel: '⌊x⌋', secondValue: 'floor(' },
    { label: '.', value: '.', type: 'number', secondLabel: 'Ran#', secondValue: 'random()' },
    { label: '±', value: 'negate', type: 'number', action: 'negate', secondLabel: '⌈x⌉', secondValue: 'ceil(' },
    { label: 'Ans', value: '', type: 'function', action: 'ans', secondLabel: 'PreAns', secondValue: '' },
    { label: '=', value: '=', type: 'equal', action: 'evaluate' },
  ],
];

// Buttons that should NOT trigger shift auto-reset
const NO_RESET_TYPES = new Set(['number', 'operator', 'equal']);
const NO_RESET_ACTIONS = new Set(['shift', 'angle-mode', 'constants', 'spacer', 'clear', 'clear-entry', 'backspace', 'negate', 'sto', 'rcl', 'fraction-toggle']);

export function CompactScientificKeypad() {
  const {
    input, clear, clearEntry, backspace, evaluate,
    memoryAdd, memorySubtract, memoryRecall, memoryClear,
    toggleAngleMode, toggleSecondFunction,
    storeVariable, recallVariable,
    dispatch, state
  } = useCalculator();
  const { isSecondFunction, angleMode } = state;
  const [showConstants, setShowConstants] = useState(false);
  const [showStoRcl, setShowStoRcl] = useState<'sto' | 'rcl' | null>(null);

  const handleClick = (btn: CompactBtn) => {
    const isShifted = isSecondFunction && btn.secondLabel;
    const value = isShifted && btn.secondValue !== undefined ? btn.secondValue : btn.value;
    const action = btn.action;

    // Handle special actions
    if (action === 'shift') { toggleSecondFunction(); return; }
    if (action === 'angle-mode') { toggleAngleMode(); return; }
    if (action === 'constants') { setShowConstants(true); return; }
    if (action === 'clear') { clear(); return; }
    if (action === 'clear-entry' && !isShifted) { clearEntry(); return; }
    if (action === 'backspace') { backspace(); return; }
    if (action === 'evaluate') { evaluate(); return; }
    if (action === 'negate' && !isShifted) { input('(-'); autoResetShift(btn); return; }
    if (action === 'memory-clear' && !isShifted) { memoryClear(); return; }
    if (action === 'memory-recall' && !isShifted) { memoryRecall(); return; }
    if (action === 'memory-add' && !isShifted) { memoryAdd(); return; }
    if (action === 'memory-subtract' && !isShifted) { memorySubtract(); return; }
    if (action === 'sto' && !isShifted) { setShowStoRcl('sto'); return; }
    if (action === 'rcl' && !isShifted) { setShowStoRcl('rcl'); return; }
    if (action === 'ans' && !isShifted) {
      dispatch({ type: 'SET_EXPRESSION', payload: state.expression + 'Ans' });
      return;
    }
    if (action === 'ans' && isShifted) {
      dispatch({ type: 'SET_EXPRESSION', payload: state.expression + 'PreAns' });
      autoResetShift(btn);
      return;
    }
    if (action === 'fraction-toggle' && !isShifted) {
      dispatch({ type: 'TOGGLE_FRACTION_DISPLAY' });
      return;
    }

    // Handle random() — produces a value directly
    if (value === 'random()') {
      const rand = Math.random();
      dispatch({ type: 'SET_EXPRESSION', payload: state.expression + rand.toString() });
      autoResetShift(btn);
      return;
    }

    // Default: insert value
    input(value);
    autoResetShift(btn);
  };

  const autoResetShift = (btn: CompactBtn) => {
    if (!isSecondFunction) return;
    // Don't reset for numbers, operators, equal without 2nd functions
    if (NO_RESET_TYPES.has(btn.type) && !btn.secondLabel) return;
    // Don't reset for certain actions unless they have a 2nd function being used
    if (btn.action && NO_RESET_ACTIONS.has(btn.action) && !btn.secondLabel) return;
    toggleSecondFunction();
  };

  const handleVariableSelect = (name: string) => {
    if (showStoRcl === 'sto') {
      storeVariable(name);
    } else {
      recallVariable(name);
    }
    setShowStoRcl(null);
  };

  const getLabel = (btn: CompactBtn): string => {
    if (btn.action === 'angle-mode') return angleMode;
    if (btn.action === 'shift') return '2nd';
    if (isSecondFunction && btn.secondLabel) return btn.secondLabel;
    return btn.label;
  };

  const getVariant = (btn: CompactBtn): 'number' | 'operator' | 'function' | 'action' | 'equal' | 'memory' => {
    if (isSecondFunction && btn.secondLabel) {
      // When shifted, memory/operator/action buttons showing functions should look like function buttons
      if (btn.type === 'memory' || btn.type === 'operator' || btn.type === 'action') return 'function';
    }
    return btn.type;
  };

  const getTextClass = (btn: CompactBtn): string => {
    if (btn.type === 'number') return 'text-base';
    if (btn.type === 'equal') return 'text-base';
    if (btn.type === 'operator') return 'text-base';
    return 'text-xs';
  };

  return (
    <div className="space-y-1.5">
      {/* Compact 5-column grid (Casio-style) */}
      <div className="grid grid-cols-5 gap-1.5">
        {compactRows.flat().map((btn, idx) => (
          <Button
            key={`${btn.label}-${idx}`}
            label={getLabel(btn)}
            variant={getVariant(btn)}
            onClick={() => handleClick(btn)}
            active={btn.action === 'shift' && isSecondFunction}
            className={`h-10 ${getTextClass(btn)}`}
          />
        ))}
      </div>

      {/* Variable selection dialog */}
      {showStoRcl && (
        <div className="grid grid-cols-3 gap-1">
          {VARIABLE_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => handleVariableSelect(name)}
              className="h-9 rounded-lg text-sm font-mono font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
            >
              {name}
              {state.variables[name] !== undefined && (
                <span className="block text-[10px] opacity-60 truncate">{state.variables[name]}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Constants Library Modal */}
      {showConstants && (
        <ConstantsLibrary
          onSelect={(value) => {
            input(value);
            setShowConstants(false);
          }}
          onClose={() => setShowConstants(false)}
        />
      )}
    </div>
  );
}
