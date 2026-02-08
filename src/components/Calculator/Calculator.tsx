import { useState } from 'react';
import { CalculatorMode } from '../../types/calculator';
import { Display } from '../Display/Display';
import { BasicKeypad } from '../Keypad/BasicKeypad';
import { ScientificKeypad } from '../Keypad/ScientificKeypad';
import { AdvancedKeypad } from '../Keypad/AdvancedKeypad';
import { UnitConverter } from '../UnitConverter/UnitConverter';
import { History } from '../History/History';
import { ModeSelector } from '../ModeSelector/ModeSelector';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { useKeyboard } from '../../hooks/useKeyboard';
import { Menu, Variable, LineChart, BarChart3, Binary, DollarSign } from 'lucide-react';

const comingSoonModes: Record<string, { icon: typeof Variable; label: string }> = {
  solver: { icon: Variable, label: 'Equation Solver' },
  graph: { icon: LineChart, label: 'Graphing' },
  stats: { icon: BarChart3, label: 'Statistics' },
  programming: { icon: Binary, label: 'Programmer' },
  financial: { icon: DollarSign, label: 'Financial' },
};

function ComingSoon({ mode }: { mode: string }) {
  const config = comingSoonModes[mode];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
      <Icon size={48} strokeWidth={1.5} />
      <p className="mt-4 text-lg font-medium">{config.label}</p>
      <p className="mt-1 text-sm">Coming soon</p>
    </div>
  );
}

export function Calculator() {
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [showHistory, setShowHistory] = useState(false);

  useKeyboard();

  const showDisplay = !['units', 'solver', 'graph', 'stats', 'programming', 'financial'].includes(mode);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-4">
        {/* Main Calculator */}
        <div className="flex-1 max-w-md mx-auto lg:mx-0">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-5 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Calculator Ultra
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="lg:hidden p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Menu size={20} />
                </button>
                <ThemeToggle />
              </div>
            </div>

            {/* Mode Selector */}
            <ModeSelector mode={mode} onModeChange={setMode} />

            {/* Display (not shown for non-calculator modes) */}
            {showDisplay && <Display />}

            {/* Keypads */}
            <div className="space-y-3">
              {mode === 'basic' && <BasicKeypad />}

              {mode === 'scientific' && (
                <>
                  <ScientificKeypad />
                  <BasicKeypad />
                </>
              )}

              {mode === 'advanced' && (
                <>
                  <AdvancedKeypad />
                  <ScientificKeypad />
                  <BasicKeypad />
                </>
              )}

              {mode === 'units' && <UnitConverter />}

              {mode in comingSoonModes && <ComingSoon mode={mode} />}
            </div>

            {/* Keyboard hint */}
            <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
              Use keyboard for quick input
            </div>
          </div>
        </div>

        {/* History Sidebar (Desktop) */}
        <div className="hidden lg:block w-80">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-5 h-[600px]">
            <History />
          </div>
        </div>

        {/* History Mobile Drawer */}
        {showHistory && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowHistory(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 p-5 shadow-xl">
              <History />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
