import { useCalculator } from '../../contexts/CalculatorContext';
import { evaluateExpression, formatResult, toFraction } from '../../utils/mathOperations';
import { formatExpression } from '../../utils/formatExpression';
import { AlertCircle, Copy, ClipboardPaste } from 'lucide-react';
import { useMemo, useState } from 'react';

export function Display() {
  const { state, dispatch } = useCalculator();
  const { expression, result, error, memory, angleMode, displayAsFraction, lastAnswer, variables } = state;
  const [copied, setCopied] = useState(false);

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
  const shownResult = displayAsFraction && displayResult ? toFraction(displayResult) : displayResult;

  const handleCopy = async () => {
    if (!displayResult) return;
    try {
      await navigator.clipboard.writeText(displayResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard not available */ }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.trim();
      if (cleaned && /^[\d.+\-*/^()epi\s]+$/i.test(cleaned)) {
        dispatch({ type: 'SET_EXPRESSION', payload: state.expression + cleaned });
      }
    } catch { /* clipboard not available */ }
  };

  const hasStoredVars = Object.keys(variables).length > 0;

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
          {lastAnswer && (
            <span className="px-2 py-0.5 bg-indigo-200 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-md font-medium">
              Ans
            </span>
          )}
          {hasStoredVars && (
            <span className="px-2 py-0.5 bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-md font-medium">
              VAR
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={handlePaste}
            className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Paste"
          >
            <ClipboardPaste size={14} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Copy result"
          >
            {copied ? (
              <span className="text-green-500 text-xs font-medium">OK</span>
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Expression */}
      <div className="text-right text-gray-600 dark:text-gray-400 text-lg min-h-[1.75rem] break-all font-mono">
        {expression ? formatExpression(expression) : '\u00A0'}
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
            {shownResult || '0'}
          </span>
        )}
      </div>
    </div>
  );
}
