import { CalculatorMode } from '../../types/calculator';
import { Calculator, FlaskConical, Sigma, ArrowRightLeft } from 'lucide-react';

interface ModeSelectorProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
}

const modes: { id: CalculatorMode; label: string; icon: typeof Calculator }[] = [
  { id: 'basic', label: 'Basic', icon: Calculator },
  { id: 'scientific', label: 'Scientific', icon: FlaskConical },
  { id: 'advanced', label: 'Advanced', icon: Sigma },
  { id: 'units', label: 'Units', icon: ArrowRightLeft },
];

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex bg-gray-200 dark:bg-gray-800 rounded-xl p-1 mb-4">
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onModeChange(id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === id
              ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
