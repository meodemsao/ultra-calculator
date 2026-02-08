import { useState } from 'react';
import { solveTVM, compoundInterest, generateAmortization } from '../../utils/financialCalc';
import type { TVMResult, AmortizationRow } from '../../utils/financialCalc';

type FinTab = 'tvm' | 'compound' | 'amortization';

export function FinancialCalc() {
  const [tab, setTab] = useState<FinTab>('tvm');

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        {([
          ['tvm', 'TVM Solver'],
          ['compound', 'Compound'],
          ['amortization', 'Amort.'],
        ] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t as FinTab)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
              tab === t
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'tvm' && <TVMSolver />}
      {tab === 'compound' && <CompoundCalc />}
      {tab === 'amortization' && <AmortCalc />}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm text-right border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        step="any"
      />
      {suffix && <span className="text-xs text-gray-400 w-4">{suffix}</span>}
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

type TVMField = 'n' | 'rate' | 'pv' | 'pmt' | 'fv';

function TVMSolver() {
  const [n, setN] = useState('');
  const [rate, setRate] = useState('');
  const [pv, setPV] = useState('');
  const [pmt, setPMT] = useState('');
  const [fv, setFV] = useState('');
  const [result, setResult] = useState<TVMResult | null>(null);
  const [error, setError] = useState('');

  const solve = (solveFor: TVMField) => {
    try {
      setError('');
      const inputs = {
        n: solveFor !== 'n' ? Number(n) : undefined,
        rate: solveFor !== 'rate' ? Number(rate) / 100 : undefined,
        pv: solveFor !== 'pv' ? Number(pv) : undefined,
        pmt: solveFor !== 'pmt' ? Number(pmt) : undefined,
        fv: solveFor !== 'fv' ? Number(fv) : undefined,
      };
      const res = solveTVM(inputs, solveFor);
      setResult(res);
      // Update the solved field
      switch (solveFor) {
        case 'n': setN(String(res.n)); break;
        case 'rate': setRate(String((res.rate * 100).toFixed(4))); break;
        case 'pv': setPV(String(res.pv)); break;
        case 'pmt': setPMT(String(res.pmt)); break;
        case 'fv': setFV(String(res.fv)); break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setResult(null);
    }
  };

  const fields: { key: TVMField; label: string; value: string; set: (v: string) => void; suffix?: string }[] = [
    { key: 'n', label: 'N', value: n, set: setN },
    { key: 'rate', label: 'I%', value: rate, set: setRate, suffix: '%' },
    { key: 'pv', label: 'PV', value: pv, set: setPV },
    { key: 'pmt', label: 'PMT', value: pmt, set: setPMT },
    { key: 'fv', label: 'FV', value: fv, set: setFV },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-gray-400 text-center">
        Enter 4 values, click the button to solve for the 5th
      </p>
      {fields.map((f) => (
        <div key={f.key} className="flex items-center gap-1.5">
          <button
            onClick={() => solve(f.key)}
            className="px-2 py-1.5 rounded-lg text-[10px] font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 flex-shrink-0"
          >
            Solve
          </button>
          <FieldInput label={f.label} value={f.value} onChange={f.set} suffix={f.suffix} />
        </div>
      ))}
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
          <p className="text-xs text-gray-500 text-center">
            Solved for <span className="font-semibold">{result.solvedFor}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function CompoundCalc() {
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('5');
  const [compounds, setCompounds] = useState('12');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<number | null>(null);

  const compute = () => {
    const amount = compoundInterest(
      Number(principal),
      Number(rate) / 100,
      Number(compounds),
      Number(years)
    );
    setResult(amount);
  };

  return (
    <div className="space-y-3">
      <FieldInput label="P" value={principal} onChange={setPrincipal} />
      <FieldInput label="Rate" value={rate} onChange={setRate} suffix="%" />
      <FieldInput label="n/yr" value={compounds} onChange={setCompounds} />
      <FieldInput label="Years" value={years} onChange={setYears} />
      <button
        onClick={compute}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        Calculate
      </button>
      {result !== null && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-0.5">
          <ResultRow label="Future Value" value={`$${result.toFixed(2)}`} />
          <ResultRow label="Interest Earned" value={`$${(result - Number(principal)).toFixed(2)}`} />
        </div>
      )}
    </div>
  );
}

function AmortCalc() {
  const [principal, setPrincipal] = useState('200000');
  const [rate, setRate] = useState('6');
  const [payments, setPayments] = useState('360');
  const [rows, setRows] = useState<AmortizationRow[] | null>(null);

  const compute = () => {
    const result = generateAmortization(
      Number(principal),
      Number(rate) / 100,
      Number(payments)
    );
    setRows(result);
  };

  return (
    <div className="space-y-3">
      <FieldInput label="Loan" value={principal} onChange={setPrincipal} />
      <FieldInput label="Rate" value={rate} onChange={setRate} suffix="%" />
      <FieldInput label="# Pmt" value={payments} onChange={setPayments} />
      <button
        onClick={compute}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        Generate Schedule
      </button>
      {rows && rows.length > 0 && (
        <div className="space-y-2">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-0.5">
            <ResultRow label="Monthly Payment" value={`$${rows[0].payment.toFixed(2)}`} />
            <ResultRow
              label="Total Paid"
              value={`$${(rows[0].payment * rows.length).toFixed(2)}`}
            />
            <ResultRow
              label="Total Interest"
              value={`$${rows.reduce((sum, r) => sum + r.interest, 0).toFixed(2)}`}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600 text-gray-500">
                  <th className="py-1 text-left">#</th>
                  <th className="py-1 text-right">Payment</th>
                  <th className="py-1 text-right">Principal</th>
                  <th className="py-1 text-right">Interest</th>
                  <th className="py-1 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 60).map((row) => (
                  <tr
                    key={row.period}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <td className="py-0.5 text-gray-500">{row.period}</td>
                    <td className="py-0.5 text-right text-gray-700 dark:text-gray-300">
                      {row.payment.toFixed(2)}
                    </td>
                    <td className="py-0.5 text-right text-gray-700 dark:text-gray-300">
                      {row.principal.toFixed(2)}
                    </td>
                    <td className="py-0.5 text-right text-gray-700 dark:text-gray-300">
                      {row.interest.toFixed(2)}
                    </td>
                    <td className="py-0.5 text-right text-gray-900 dark:text-white font-semibold">
                      {row.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {rows.length > 60 && (
                  <tr>
                    <td colSpan={5} className="py-1 text-center text-gray-400">
                      ... {rows.length - 60} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
