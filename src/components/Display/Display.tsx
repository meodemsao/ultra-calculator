import { useCalculator } from '../../contexts/CalculatorContext';
import { evaluateExpression, formatResult } from '../../utils/mathOperations';
import { AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

export function Display() {
  const { state } = useCalculator();
  const { expression, result, error, memory, angleMode } = state;

  // Live preview of result as user types
  const liveResult = useMemo(() => {
    if (!expression.trim()) return '';
    try {
      const res = evaluateExpression(expression, angleMode);
      return formatResult(res);
    } catch {
      return '';
    }
  }, [expression, angleMode]);

  const displayResult = result || liveResult;

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 mb-4 shadow-inner">
      {/* Status bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md font-medium">
            {angleMode}
          </span>
          {memory !== 0 && (
            <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-md font-medium">
              M
            </span>
          )}
        </div>
      </div>

      {/* Expression */}
      <div className="text-right text-gray-600 dark:text-gray-400 text-lg min-h-[1.75rem] break-all font-mono">
        {expression || '\u00A0'}
      </div>

      {/* Result */}
      <div className="text-right min-h-[2.5rem]">
        {error ? (
          <div className="flex items-center justify-end gap-2 text-red-500">
            <AlertCircle size={18} />
            <span className="text-lg">{error}</span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-gray-900 dark:text-white break-all font-mono">
            {displayResult || '0'}
          </span>
        )}
      </div>
    </div>
  );
}
