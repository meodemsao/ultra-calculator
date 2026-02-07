import { createContext, useContext, ReactNode, useReducer, useCallback, useEffect } from 'react';
import { CalculatorState, CalculatorAction, HistoryEntry } from '../types/calculator';
import { evaluateExpression, formatResult } from '../utils/mathOperations';

interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
  input: (value: string) => void;
  clear: () => void;
  clearEntry: () => void;
  backspace: () => void;
  evaluate: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
  toggleAngleMode: () => void;
  toggleSecondFunction: () => void;
  restoreFromHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  setExpression: (expr: string) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const HISTORY_KEY = 'calculator-history';
const MAX_HISTORY = 100;

function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

const initialState: CalculatorState = {
  expression: '',
  result: '',
  history: loadHistory(),
  memory: 0,
  angleMode: 'DEG',
  isSecondFunction: false,
  error: null,
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'INPUT': {
      const newExpression = state.expression + action.payload;
      return {
        ...state,
        expression: newExpression,
        error: null,
      };
    }

    case 'CLEAR':
      return {
        ...state,
        expression: '',
        result: '',
        error: null,
      };

    case 'CLEAR_ENTRY': {
      // Remove last number or operator
      const expr = state.expression;
      const match = expr.match(/[\d.]+$|[+\-*/^%()]$/);
      if (match) {
        return {
          ...state,
          expression: expr.slice(0, -match[0].length),
          error: null,
        };
      }
      return state;
    }

    case 'BACKSPACE':
      return {
        ...state,
        expression: state.expression.slice(0, -1),
        error: null,
      };

    case 'EVALUATE': {
      if (!state.expression.trim()) {
        return state;
      }
      try {
        const result = evaluateExpression(state.expression, state.angleMode);
        const formattedResult = formatResult(result);
        const historyEntry: HistoryEntry = {
          id: Date.now().toString(),
          expression: state.expression,
          result: formattedResult,
          timestamp: Date.now(),
        };
        const newHistory = [historyEntry, ...state.history].slice(0, MAX_HISTORY);
        saveHistory(newHistory);
        return {
          ...state,
          result: formattedResult,
          history: newHistory,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Error',
          result: '',
        };
      }
    }

    case 'MEMORY_ADD': {
      const current = parseFloat(state.result) || 0;
      return {
        ...state,
        memory: state.memory + current,
      };
    }

    case 'MEMORY_SUBTRACT': {
      const current = parseFloat(state.result) || 0;
      return {
        ...state,
        memory: state.memory - current,
      };
    }

    case 'MEMORY_RECALL':
      return {
        ...state,
        expression: state.expression + state.memory.toString(),
      };

    case 'MEMORY_CLEAR':
      return {
        ...state,
        memory: 0,
      };

    case 'TOGGLE_ANGLE_MODE':
      return {
        ...state,
        angleMode: state.angleMode === 'DEG' ? 'RAD' : 'DEG',
      };

    case 'TOGGLE_SECOND_FUNCTION':
      return {
        ...state,
        isSecondFunction: !state.isSecondFunction,
      };

    case 'SET_EXPRESSION':
      return {
        ...state,
        expression: action.payload,
        error: null,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'RESTORE_FROM_HISTORY':
      return {
        ...state,
        expression: action.payload.expression,
        result: action.payload.result,
        error: null,
      };

    case 'CLEAR_HISTORY': {
      localStorage.removeItem(HISTORY_KEY);
      return {
        ...state,
        history: [],
      };
    }

    default:
      return state;
  }
}

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Live evaluation as user types
  useEffect(() => {
    if (state.expression && !state.error) {
      try {
        const result = evaluateExpression(state.expression, state.angleMode);
        const formattedResult = formatResult(result);
        if (formattedResult !== state.result) {
          // We can't dispatch here to avoid loops, so we handle this differently
        }
      } catch {
        // Ignore evaluation errors during typing
      }
    }
  }, [state.expression, state.angleMode]);

  const input = useCallback((value: string) => {
    dispatch({ type: 'INPUT', payload: value });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const clearEntry = useCallback(() => {
    dispatch({ type: 'CLEAR_ENTRY' });
  }, []);

  const backspace = useCallback(() => {
    dispatch({ type: 'BACKSPACE' });
  }, []);

  const evaluate = useCallback(() => {
    dispatch({ type: 'EVALUATE' });
  }, []);

  const memoryAdd = useCallback(() => {
    dispatch({ type: 'MEMORY_ADD' });
  }, []);

  const memorySubtract = useCallback(() => {
    dispatch({ type: 'MEMORY_SUBTRACT' });
  }, []);

  const memoryRecall = useCallback(() => {
    dispatch({ type: 'MEMORY_RECALL' });
  }, []);

  const memoryClear = useCallback(() => {
    dispatch({ type: 'MEMORY_CLEAR' });
  }, []);

  const toggleAngleMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_ANGLE_MODE' });
  }, []);

  const toggleSecondFunction = useCallback(() => {
    dispatch({ type: 'TOGGLE_SECOND_FUNCTION' });
  }, []);

  const restoreFromHistory = useCallback((entry: HistoryEntry) => {
    dispatch({ type: 'RESTORE_FROM_HISTORY', payload: entry });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const setExpression = useCallback((expr: string) => {
    dispatch({ type: 'SET_EXPRESSION', payload: expr });
  }, []);

  return (
    <CalculatorContext.Provider
      value={{
        state,
        dispatch,
        input,
        clear,
        clearEntry,
        backspace,
        evaluate,
        memoryAdd,
        memorySubtract,
        memoryRecall,
        memoryClear,
        toggleAngleMode,
        toggleSecondFunction,
        restoreFromHistory,
        clearHistory,
        setExpression,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
