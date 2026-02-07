import { useCalculator } from '../../contexts/CalculatorContext';
import { Clock, Trash2 } from 'lucide-react';

export function History() {
  const { state, restoreFromHistory, clearHistory } = useCalculator();
  const { history } = state;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-8">
        <Clock size={32} className="mb-2 opacity-50" />
        <p className="text-sm">No history yet</p>
        <p className="text-xs opacity-75">Your calculations will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">History</h3>
        <button
          onClick={clearHistory}
          className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Clear history"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => restoreFromHistory(entry)}
            className="w-full text-left p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
              {entry.expression}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white truncate font-mono">
              = {entry.result}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
