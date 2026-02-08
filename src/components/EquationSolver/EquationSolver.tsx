import { useState } from 'react';
import { solveQuadratic, solveCubic, solveLinearSystem } from '../../utils/equationSolver';
import type { QuadraticResult, CubicResult, LinearSystemResult } from '../../utils/equationSolver';

type SolverTab = 'quadratic' | 'cubic' | 'linear';

export function EquationSolver() {
  const [tab, setTab] = useState<SolverTab>('quadratic');

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        {(['quadratic', 'cubic', 'linear'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t === 'quadratic' ? 'ax²+bx+c' : t === 'cubic' ? 'ax³+bx²+cx+d' : 'Linear System'}
          </button>
        ))}
      </div>

      {tab === 'quadratic' && <QuadraticSolver />}
      {tab === 'cubic' && <CubicSolver />}
      {tab === 'linear' && <LinearSystemSolver />}
    </div>
  );
}

function CoeffInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center font-mono text-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        step="any"
      />
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function QuadraticSolver() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('0');
  const [c, setC] = useState('0');
  const [result, setResult] = useState<QuadraticResult | null>(null);
  const [error, setError] = useState('');

  const solve = () => {
    try {
      setError('');
      const res = solveQuadratic(Number(a), Number(b), Number(c));
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        ax² + bx + c = 0
      </p>
      <div className="grid grid-cols-3 gap-3">
        <CoeffInput label="a" value={a} onChange={setA} />
        <CoeffInput label="b" value={b} onChange={setB} />
        <CoeffInput label="c" value={c} onChange={setC} />
      </div>
      <button
        onClick={solve}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        Solve
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-1">
          <ResultRow label="x₁" value={result.roots[0]} />
          <ResultRow label="x₂" value={result.roots[1]} />
          <ResultRow label="Discriminant" value={String(result.discriminant)} />
          <ResultRow label="Vertex" value={`(${result.vertex.x}, ${result.vertex.y})`} />
        </div>
      )}
    </div>
  );
}

function CubicSolver() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('0');
  const [c, setC] = useState('0');
  const [d, setD] = useState('0');
  const [result, setResult] = useState<CubicResult | null>(null);
  const [error, setError] = useState('');

  const solve = () => {
    try {
      setError('');
      const res = solveCubic(Number(a), Number(b), Number(c), Number(d));
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        ax³ + bx² + cx + d = 0
      </p>
      <div className="grid grid-cols-4 gap-2">
        <CoeffInput label="a" value={a} onChange={setA} />
        <CoeffInput label="b" value={b} onChange={setB} />
        <CoeffInput label="c" value={c} onChange={setC} />
        <CoeffInput label="d" value={d} onChange={setD} />
      </div>
      <button
        onClick={solve}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        Solve
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-1">
          {result.roots.map((root, i) => (
            <ResultRow key={i} label={`x${subscript(i + 1)}`} value={root} />
          ))}
        </div>
      )}
    </div>
  );
}

function LinearSystemSolver() {
  const [size, setSize] = useState<2 | 3>(2);
  const [matrix, setMatrix] = useState<string[][]>([
    ['0', '0', '0'],
    ['0', '0', '0'],
    ['0', '0', '0'],
  ]);
  const [constants, setConstants] = useState<string[]>(['0', '0', '0']);
  const [result, setResult] = useState<LinearSystemResult | null>(null);
  const [error, setError] = useState('');

  const varNames = ['x', 'y', 'z'];

  const updateMatrix = (row: number, col: number, val: string) => {
    const newMatrix = matrix.map((r) => [...r]);
    newMatrix[row][col] = val;
    setMatrix(newMatrix);
  };

  const updateConstant = (row: number, val: string) => {
    const newConstants = [...constants];
    newConstants[row] = val;
    setConstants(newConstants);
  };

  const solve = () => {
    try {
      setError('');
      const numMatrix = matrix
        .slice(0, size)
        .map((row) => row.slice(0, size).map(Number));
      const numConstants = constants.slice(0, size).map(Number);
      const res = solveLinearSystem(numMatrix, numConstants);
      if (!res.solvable) {
        setError('System has no unique solution');
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Size toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { setSize(2); setResult(null); }}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            size === 2
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          2×2
        </button>
        <button
          onClick={() => { setSize(3); setResult(null); }}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            size === 3
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          3×3
        </button>
      </div>

      {/* Coefficient matrix */}
      <div className="space-y-2">
        {Array.from({ length: size }).map((_, row) => (
          <div key={row} className="flex items-center gap-1">
            {Array.from({ length: size }).map((_, col) => (
              <div key={col} className="flex items-center gap-1">
                <input
                  type="number"
                  value={matrix[row][col]}
                  onChange={(e) => updateMatrix(row, col, e.target.value)}
                  className="w-14 px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center font-mono text-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  step="any"
                />
                <span className="text-xs text-gray-400 font-mono">{varNames[col]}</span>
                {col < size - 1 && <span className="text-gray-400">+</span>}
              </div>
            ))}
            <span className="text-gray-400 mx-1">=</span>
            <input
              type="number"
              value={constants[row]}
              onChange={(e) => updateConstant(row, e.target.value)}
              className="w-14 px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center font-mono text-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              step="any"
            />
          </div>
        ))}
      </div>

      <button
        onClick={solve}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        Solve
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {result && result.solvable && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-1">
          {result.solution.slice(0, size).map((val, i) => (
            <ResultRow key={i} label={varNames[i]} value={String(val)} />
          ))}
        </div>
      )}
    </div>
  );
}

function subscript(n: number): string {
  const subs = ['₀', '₁', '₂', '₃'];
  return subs[n] || String(n);
}
