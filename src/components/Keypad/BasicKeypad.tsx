import { useState } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { Button } from './Button';
import { basicButtons, memoryButtons, parenthesesButtons } from '../../constants/buttons';

const VARIABLE_NAMES = ['A', 'B', 'C', 'D', 'E', 'F'];

export function BasicKeypad() {
  const { input, clear, clearEntry, backspace, evaluate, memoryAdd, memorySubtract, memoryRecall, memoryClear, storeVariable, recallVariable, dispatch, state } = useCalculator();
  const [showStoRcl, setShowStoRcl] = useState<'sto' | 'rcl' | null>(null);

  const handleButtonClick = (value: string) => {
    switch (value) {
      case 'clear':
        clear();
        break;
      case 'clear-entry':
        clearEntry();
        break;
      case 'backspace':
        backspace();
        break;
      case '=':
        evaluate();
        break;
      case 'negate':
        input('(-');
        break;
      case 'memory-add':
        memoryAdd();
        break;
      case 'memory-subtract':
        memorySubtract();
        break;
      case 'memory-recall':
        memoryRecall();
        break;
      case 'memory-clear':
        memoryClear();
        break;
      case 'ans':
        dispatch({ type: 'SET_EXPRESSION', payload: state.expression + 'Ans' });
        break;
      case 'pre-ans':
        dispatch({ type: 'SET_EXPRESSION', payload: state.expression + 'PreAns' });
        break;
      default:
        input(value);
    }
  };

  const handleVariableSelect = (name: string) => {
    if (showStoRcl === 'sto') {
      storeVariable(name);
    } else {
      recallVariable(name);
    }
    setShowStoRcl(null);
  };

  return (
    <div className="space-y-3">
      {/* Memory buttons */}
      <div className="grid grid-cols-4 gap-2">
        {memoryButtons.map((btn) => (
          <Button
            key={btn.value}
            label={btn.label}
            variant="memory"
            onClick={() => handleButtonClick(btn.value)}
            className="h-10"
          />
        ))}
      </div>

      {/* Parentheses, Ans, STO/RCL */}
      <div className="grid grid-cols-4 gap-2">
        {parenthesesButtons.map((btn) => (
          <Button
            key={btn.value}
            label={btn.label}
            variant="operator"
            onClick={() => handleButtonClick(btn.value)}
            className="h-12"
          />
        ))}
        <Button
          label="Ans"
          variant="function"
          onClick={() => handleButtonClick('ans')}
          className="h-12 text-sm"
        />
      </div>

      {/* STO/RCL row */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          label="STO"
          variant="memory"
          onClick={() => setShowStoRcl('sto')}
          className="h-10"
        />
        <Button
          label="RCL"
          variant="memory"
          onClick={() => setShowStoRcl('rcl')}
          className="h-10"
        />
        <Button
          label="PreAns"
          variant="function"
          onClick={() => handleButtonClick('pre-ans')}
          className="h-10 text-xs"
        />
        <Button
          label="S⇌D"
          variant="function"
          onClick={() => dispatch({ type: 'TOGGLE_FRACTION_DISPLAY' })}
          className="h-10 text-sm"
        />
      </div>

      {/* Variable selection dialog */}
      {showStoRcl && (
        <div className="grid grid-cols-6 gap-1">
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

      {/* Main keypad */}
      <div className="grid grid-cols-4 gap-2">
        {basicButtons.map((btn) => (
          <Button
            key={btn.value}
            label={btn.label}
            variant={btn.type}
            onClick={() => handleButtonClick(btn.value)}
            className="h-14"
          />
        ))}
      </div>
    </div>
  );
}
