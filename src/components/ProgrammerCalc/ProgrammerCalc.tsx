import { useState } from 'react';
import {
  parseInput,
  toBase,
  formatBinary,
  mask,
  bitwiseAnd,
  bitwiseOr,
  bitwiseXor,
  bitwiseNot,
  leftShift,
  rightShift,
} from '../../utils/bitwiseOps';
import type { WordSize, NumberBase } from '../../utils/bitwiseOps';

const WORD_SIZES: WordSize[] = [8, 16, 32, 64];
const BASES: NumberBase[] = ['DEC', 'HEX', 'OCT', 'BIN'];

export function ProgrammerCalc() {
  const [input, setInput] = useState('0');
  const [wordSize, setWordSize] = useState<WordSize>(32);
  const [base, setBase] = useState<NumberBase>('DEC');
  const [error, setError] = useState('');

  let value = 0n;
  try {
    value = mask(parseInput(input), wordSize);
  } catch {
    // keep 0n
  }

  const handleInput = (char: string) => {
    setError('');
    if (char === 'C') {
      setInput('0');
      return;
    }
    if (char === 'BS') {
      setInput((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
      return;
    }
    setInput((prev) => (prev === '0' ? char : prev + char));
  };

  const handleOp = (op: string) => {
    setError('');
    try {
      const v = mask(parseInput(input), wordSize);
      let result: bigint;
      switch (op) {
        case 'NOT': result = bitwiseNot(v, wordSize); break;
        case '<<': result = leftShift(v, 1n, wordSize); break;
        case '>>': result = rightShift(v, 1n, wordSize); break;
        case 'NEG': result = mask(-v, wordSize); break;
        default: return;
      }
      setInput(toBase(result, base, wordSize));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleBinaryOp = (op: string) => {
    // For binary ops, use a simple prompt-style: enter "A op B" in the input
    // We'll parse "value1 OP value2" format
    setError('');
    try {
      const parts = input.split(/\s+(AND|OR|XOR)\s+/i);
      if (parts.length === 3) {
        const a = mask(parseInput(parts[0]), wordSize);
        const b = mask(parseInput(parts[2]), wordSize);
        const opName = parts[1].toUpperCase();
        let result: bigint;
        switch (opName) {
          case 'AND': result = bitwiseAnd(a, b, wordSize); break;
          case 'OR': result = bitwiseOr(a, b, wordSize); break;
          case 'XOR': result = bitwiseXor(a, b, wordSize); break;
          default: return;
        }
        setInput(toBase(result, base, wordSize));
      } else {
        // Append the operator
        setInput((prev) => prev + ` ${op} `);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleBaseChange = (newBase: NumberBase) => {
    try {
      const v = mask(parseInput(input), wordSize);
      setBase(newBase);
      setInput(toBase(v, newBase, wordSize));
    } catch {
      setBase(newBase);
      setInput('0');
    }
  };

  const hexChars = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isHexEnabled = base === 'HEX';

  return (
    <div className="space-y-3">
      {/* Word size toggle */}
      <div className="flex gap-1 justify-center">
        {WORD_SIZES.map((ws) => (
          <button
            key={ws}
            onClick={() => setWordSize(ws)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              wordSize === ws
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            {ws}-bit
          </button>
        ))}
      </div>

      {/* Base display */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-1.5">
        {BASES.map((b) => (
          <div
            key={b}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleBaseChange(b)}
          >
            <span
              className={`text-[10px] font-mono w-6 ${
                base === b
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-gray-400'
              }`}
            >
              {b}
            </span>
            <span
              className={`font-mono text-xs flex-1 ${
                base === b
                  ? 'text-gray-900 dark:text-white font-semibold'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {b === 'BIN'
                ? formatBinary(value, wordSize)
                : toBase(value, b, wordSize)}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => { setInput(e.target.value); setError(''); }}
        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm text-right border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-1.5">
        {/* Row 1: hex chars + ops */}
        {hexChars.slice(0, 3).map((c) => (
          <button
            key={c}
            onClick={() => handleInput(c)}
            disabled={!isHexEnabled}
            className="py-2 rounded-lg text-xs font-mono font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => handleBinaryOp('AND')}
          className="py-2 rounded-lg text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200"
        >
          AND
        </button>

        {hexChars.slice(3).map((c) => (
          <button
            key={c}
            onClick={() => handleInput(c)}
            disabled={!isHexEnabled}
            className="py-2 rounded-lg text-xs font-mono font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => handleBinaryOp('OR')}
          className="py-2 rounded-lg text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200"
        >
          OR
        </button>

        {/* Number rows */}
        {['7', '8', '9'].map((c) => (
          <button
            key={c}
            onClick={() => handleInput(c)}
            disabled={base === 'BIN' && c > '1'}
            className="py-2 rounded-lg text-sm font-mono font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => handleBinaryOp('XOR')}
          className="py-2 rounded-lg text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200"
        >
          XOR
        </button>

        {['4', '5', '6'].map((c) => (
          <button
            key={c}
            onClick={() => handleInput(c)}
            disabled={base === 'BIN' && c > '1'}
            className="py-2 rounded-lg text-sm font-mono font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => handleOp('NOT')}
          className="py-2 rounded-lg text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200"
        >
          NOT
        </button>

        {['1', '2', '3'].map((c) => (
          <button
            key={c}
            onClick={() => handleInput(c)}
            disabled={base === 'BIN' && c > '1'}
            className="py-2 rounded-lg text-sm font-mono font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => handleOp('<<')}
          className="py-2 rounded-lg text-xs font-mono font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200"
        >
          {'<<'}
        </button>

        <button
          onClick={() => handleInput('0')}
          className="py-2 rounded-lg text-sm font-mono font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          0
        </button>
        <button
          onClick={() => handleInput('C')}
          className="py-2 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200"
        >
          CLR
        </button>
        <button
          onClick={() => handleInput('BS')}
          className="py-2 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
        >
          DEL
        </button>
        <button
          onClick={() => handleOp('>>')}
          className="py-2 rounded-lg text-xs font-mono font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200"
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
}
