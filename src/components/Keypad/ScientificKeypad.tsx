import { useState } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { Button } from './Button';
import { scientificButtons } from '../../constants/buttons';
import { ConstantsLibrary } from '../ConstantsLibrary/ConstantsLibrary';

export function ScientificKeypad() {
  const { input, toggleAngleMode, toggleSecondFunction, state, dispatch } = useCalculator();
  const { isSecondFunction, angleMode } = state;
  const [showConstants, setShowConstants] = useState(false);

  const handleButtonClick = (btn: typeof scientificButtons[0]) => {
    const value = isSecondFunction && btn.secondValue ? btn.secondValue : btn.value;

    // random() produces a value directly, insert it as a result
    if (value === 'random()') {
      const rand = Math.random();
      dispatch({ type: 'SET_EXPRESSION', payload: state.expression + rand.toString() });
      return;
    }

    input(value);
  };

  return (
    <div className="space-y-3">
      {/* Mode toggles */}
      <div className="grid grid-cols-3 gap-2">
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
        <Button
          label="Const"
          variant="function"
          onClick={() => setShowConstants(true)}
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
