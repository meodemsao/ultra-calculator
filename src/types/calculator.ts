export type CalculatorMode = 'basic' | 'scientific' | 'advanced' | 'units';

export type AngleMode = 'DEG' | 'RAD';

export interface CalculatorState {
  expression: string;
  result: string;
  history: HistoryEntry[];
  memory: number;
  angleMode: AngleMode;
  isSecondFunction: boolean;
  error: string | null;
}

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalculatorAction =
  | { type: 'INPUT'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ENTRY' }
  | { type: 'BACKSPACE' }
  | { type: 'EVALUATE' }
  | { type: 'MEMORY_ADD' }
  | { type: 'MEMORY_SUBTRACT' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'TOGGLE_ANGLE_MODE' }
  | { type: 'TOGGLE_SECOND_FUNCTION' }
  | { type: 'SET_EXPRESSION'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESTORE_FROM_HISTORY'; payload: HistoryEntry }
  | { type: 'CLEAR_HISTORY' };

export interface ButtonConfig {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'function' | 'action' | 'equal' | 'memory';
  secondLabel?: string;
  secondValue?: string;
  span?: number;
}

export interface UnitCategory {
  name: string;
  units: Unit[];
}

export interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface MatrixData {
  rows: number;
  cols: number;
  values: number[][];
}

export interface ComplexNumber {
  re: number;
  im: number;
}
