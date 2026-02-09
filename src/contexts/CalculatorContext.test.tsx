import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CalculatorProvider, useCalculator } from './CalculatorContext';
import { ReactNode } from 'react';

describe('CalculatorContext', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <CalculatorProvider>{children}</CalculatorProvider>
    );

    beforeEach(() => {
        localStorage.clear();
    });

    describe('CalculatorProvider', () => {
        it('initializes with default state', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            expect(result.current.state.expression).toBe('');
            expect(result.current.state.result).toBe('');
            expect(result.current.state.memory).toBe(0);
            expect(result.current.state.angleMode).toBe('DEG');
            expect(result.current.state.isSecondFunction).toBe(false);
            expect(result.current.state.error).toBe(null);
        });
    });

    describe('input', () => {
        it('adds input to expression', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.input('2');
            });

            expect(result.current.state.expression).toBe('2');
        });

        it('concatenates multiple inputs', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.input('2');
                result.current.input('+');
                result.current.input('3');
            });

            expect(result.current.state.expression).toBe('2+3');
        });
    });

    describe('clear', () => {
        it('clears expression and result', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.input('2+2');
                result.current.clear();
            });

            expect(result.current.state.expression).toBe('');
            expect(result.current.state.result).toBe('');
            expect(result.current.state.error).toBe(null);
        });
    });

    describe('backspace', () => {
        it('removes last character', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.input('123');
                result.current.backspace();
            });

            expect(result.current.state.expression).toBe('12');
        });

        it('does nothing on empty expression', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.backspace();
            });

            expect(result.current.state.expression).toBe('');
        });
    });

    describe('evaluate', () => {
        it('evaluates simple expression', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.setExpression('2+2');
                result.current.evaluate();
            });

            // Should have a result (actual value depends on mathOperations)
            expect(result.current.state.result).toBeTruthy();
        });

        it('adds to history on evaluation', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });
            const initialHistoryLength = result.current.state.history.length;

            act(() => {
                result.current.setExpression('2+2');
                result.current.evaluate();
            });

            expect(result.current.state.history.length).toBeGreaterThan(initialHistoryLength);
        });
    });

    describe('angle mode', () => {
        it('toggles between DEG and RAD', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            expect(result.current.state.angleMode).toBe('DEG');

            act(() => {
                result.current.toggleAngleMode();
            });

            expect(result.current.state.angleMode).toBe('RAD');

            act(() => {
                result.current.toggleAngleMode();
            });

            expect(result.current.state.angleMode).toBe('DEG');
        });
    });

    describe('second function', () => {
        it('toggles second function mode', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            expect(result.current.state.isSecondFunction).toBe(false);

            act(() => {
                result.current.toggleSecondFunction();
            });

            expect(result.current.state.isSecondFunction).toBe(true);

            act(() => {
                result.current.toggleSecondFunction();
            });

            expect(result.current.state.isSecondFunction).toBe(false);
        });
    });

    describe('history management', () => {
        it('clearHistory removes all history', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.setExpression('2+2');
                result.current.evaluate();
                result.current.clearHistory();
            });

            expect(result.current.state.history).toHaveLength(0);
        });

        it('restoreFromHistory sets expression and result', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });
            const entry = {
                id: '1',
                expression: '2+2',
                result: '4',
                timestamp: Date.now()
            };

            act(() => {
                result.current.restoreFromHistory(entry);
            });

            expect(result.current.state.expression).toBe('2+2');
            expect(result.current.state.result).toBe('4');
        });
    });

    describe('fraction display', () => {
        it('toggles fraction display mode', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            expect(result.current.state.displayAsFraction).toBe(false);

            act(() => {
                result.current.toggleFractionDisplay();
            });

            expect(result.current.state.displayAsFraction).toBe(true);
        });
    });

    describe('setExpression', () => {
        it('sets expression directly', () => {
            const { result } = renderHook(() => useCalculator(), { wrapper });

            act(() => {
                result.current.setExpression('5*5');
            });

            expect(result.current.state.expression).toBe('5*5');
        });
    });

    describe('useCalculator hook', () => {
        it('throws error when used outside CalculatorProvider', () => {
            expect(() => {
                renderHook(() => useCalculator());
            }).toThrow('useCalculator must be used within a CalculatorProvider');
        });
    });
});
