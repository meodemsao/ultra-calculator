import { useCalculator } from '../../contexts/CalculatorContext';
import { Button } from './Button';
import { basicButtons, memoryButtons, parenthesesButtons } from '../../constants/buttons';

export function BasicKeypad() {
  const { input, clear, clearEntry, backspace, evaluate, memoryAdd, memorySubtract, memoryRecall, memoryClear } = useCalculator();

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
      default:
        input(value);
    }
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

      {/* Parentheses and extra operators */}
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
        <div className="h-12" /> {/* Empty space */}
      </div>

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
