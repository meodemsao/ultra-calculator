import { useState } from 'react';
import {
  descriptiveStats,
  linearRegression,
  quadraticRegression,
  exponentialRegression,
  powerRegression,
  logarithmicRegression,
} from '../../utils/statistics';
import type { DescriptiveStats, RegressionResult } from '../../utils/statistics';

type StatsTab = 'descriptive' | 'regression';

export function Statistics() {
  const [tab, setTab] = useState<StatsTab>('descriptive');

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        {(['descriptive', 'regression'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t === 'descriptive' ? 'Descriptive' : 'Regression'}
          </button>
        ))}
      </div>

      {tab === 'descriptive' && <DescriptivePanel />}
      {tab === 'regression' && <RegressionPanel />}
    </div>
  );
}

function DataInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        rows={2}
      />
    </div>
  );
}

function parseData(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !isNaN(n));
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function DescriptivePanel() {
  const [dataInput, setDataInput] = useState('');
  const [result, setResult] = useState<DescriptiveStats | null>(null);
  const [error, setError] = useState('');

  const compute = () => {
    try {
      setError('');
      const data = parseData(dataInput);
      if (data.length === 0) {
        setError('Enter at least one number');
        return;
      }
      setResult(descriptiveStats(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setResult(null);
    }
  };

  return (
    <div className="space-y-3">
      <DataInput
        label="Data (comma or space separated)"
        value={dataInput}
        onChange={setDataInput}
        placeholder="1, 2, 3, 4, 5"
      />
      <button
        onClick={compute}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        Calculate
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-0.5">
          <StatRow label="Count" value={String(result.count)} />
          <StatRow label="Sum" value={String(result.sum)} />
          <StatRow label="Mean" value={String(result.mean)} />
          <StatRow label="Median" value={String(result.median)} />
          <StatRow label="Mode" value={result.mode.length > 0 ? result.mode.join(', ') : 'none'} />
          <StatRow label="Std Dev (σ)" value={String(result.stdDev)} />
          <StatRow label="Variance" value={String(result.variance)} />
          <StatRow label="Min" value={String(result.min)} />
          <StatRow label="Max" value={String(result.max)} />
          <StatRow label="Q1" value={String(result.q1)} />
          <StatRow label="Q3" value={String(result.q3)} />
          <StatRow label="IQR" value={String(result.iqr)} />
        </div>
      )}
    </div>
  );
}

type RegressionType = 'linear' | 'quadratic' | 'exponential' | 'power' | 'logarithmic';

function RegressionPanel() {
  const [xInput, setXInput] = useState('');
  const [yInput, setYInput] = useState('');
  const [regType, setRegType] = useState<RegressionType>('linear');
  const [result, setResult] = useState<RegressionResult | null>(null);
  const [error, setError] = useState('');

  const compute = () => {
    try {
      setError('');
      const xs = parseData(xInput);
      const ys = parseData(yInput);
      if (xs.length < 2 || ys.length < 2) {
        setError('Enter at least 2 data points');
        return;
      }
      if (xs.length !== ys.length) {
        setError('X and Y must have the same number of values');
        return;
      }

      const fns: Record<RegressionType, (xs: number[], ys: number[]) => RegressionResult> = {
        linear: linearRegression,
        quadratic: quadraticRegression,
        exponential: exponentialRegression,
        power: powerRegression,
        logarithmic: logarithmicRegression,
      };

      setResult(fns[regType](xs, ys));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setResult(null);
    }
  };

  return (
    <div className="space-y-3">
      <DataInput label="X values" value={xInput} onChange={setXInput} placeholder="1, 2, 3, 4, 5" />
      <DataInput label="Y values" value={yInput} onChange={setYInput} placeholder="2, 4, 5, 4, 5" />

      <div className="flex gap-1 flex-wrap">
        {(['linear', 'quadratic', 'exponential', 'power', 'logarithmic'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setRegType(t)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              regType === t
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <button
        onClick={compute}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        Calculate
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-0.5">
          <StatRow label="Type" value={result.type} />
          <StatRow label="Equation" value={result.equation} />
          <StatRow label="R²" value={String(result.rSquared)} />
          <StatRow
            label="Coefficients"
            value={result.coefficients.map(String).join(', ')}
          />
        </div>
      )}
    </div>
  );
}
