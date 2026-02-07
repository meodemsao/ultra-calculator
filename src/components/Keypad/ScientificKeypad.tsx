import { useCalculator } from '../../contexts/CalculatorContext';
import { Button } from './Button';
import { scientificButtons } from '../../constants/buttons';

export function ScientificKeypad() {
  const { input, toggleAngleMode, toggleSecondFunction, state } = useCalculator();
  const { isSecondFunction, angleMode } = state;

  const handleButtonClick = (btn: typeof scientificButtons[0]) => {
    if (isSecondFunction && btn.secondValue) {
      input(btn.secondValue);
    } else {
      input(btn.value);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode toggles */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          label={angleMode}
          variant="function"
          onClick={toggleAngleMode}
          className="h-10"
        />
        <Button
          label="2nd"
          variant="function"
          onClick={toggleSecondFunction}
          active={isSecondFunction}
          className="h-10"
        />
      </div>

      {/* Scientific buttons */}
      <div className="grid grid-cols-4 gap-2">
        {scientificButtons.map((btn) => (
          <Button
            key={btn.value}
            label={isSecondFunction && btn.secondLabel ? btn.secondLabel : btn.label}
            variant="function"
            onClick={() => handleButtonClick(btn)}
            className="h-12 text-sm"
          />
        ))}
      </div>
    </div>
  );
}
