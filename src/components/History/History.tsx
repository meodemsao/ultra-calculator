import { useState, useMemo } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { Clock, Trash2, Search, Download, X } from 'lucide-react';

export function History() {
  const { state, restoreFromHistory, clearHistory } = useCalculator();
  const { history } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Filter history based on search query (Task 10.4)
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) {
      return history;
    }
    const query = searchQuery.toLowerCase();
    return history.filter(entry =>
      entry.expression.toLowerCase().includes(query) ||
      entry.result.toLowerCase().includes(query)
    );
  }, [history, searchQuery]);

  // Export history as JSON (Task 10.5)
  const exportAsJSON = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export history as CSV (Task 10.5)
  const exportAsCSV = () => {
    const header = 'Expression,Result,Timestamp\n';
    const rows = history.map(entry =>
      `"${entry.expression.replace(/"/g, '""')}","${entry.result}","${new Date(entry.timestamp).toISOString()}"`
    ).join('\n');
    const data = header + rows;
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          History
          {searchQuery && ` (${filteredHistory.length}/${history.length})`}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Search history"
            aria-label="Toggle search"
          >
            <Search size={16} />
          </button>
          <div className="relative group">
            <button
              className="p-1.5 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Export history"
              aria-label="Export history"
            >
              <Download size={16} />
            </button>
            {/* Export dropdown */}
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={exportAsJSON}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                Export as JSON
              </button>
              <button
                onClick={exportAsCSV}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              >
                Export as CSV
              </button>
            </div>
          </div>
          <button
            onClick={clearHistory}
            className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Clear history"
            aria-label="Clear all history"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Search input (Task 10.4) */}
      {showSearch && (
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expressions or results..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
            aria-label="Search history"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* History list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
            No results match "{searchQuery}"
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <button
              key={entry.id}
              onClick={() => restoreFromHistory(entry)}
              className="w-full text-left p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
              aria-label={`Restore calculation: ${entry.expression} equals ${entry.result}`}
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
          ))
        )}
      </div>
    </div>
  );
}
