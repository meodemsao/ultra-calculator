import { describe, it, expect, beforeEach } from 'vitest';
import {
    loadUserFunctions,
    saveUserFunctions,
    addUserFunction,
    removeUserFunction,
    getUserFunction,
    clearUserFunctions,
    parseVariables,
    formatUserFunction,
} from './userFunctions';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('userFunctions', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    describe('loadUserFunctions', () => {
        it('returns empty array when no functions saved', () => {
            expect(loadUserFunctions()).toEqual([]);
        });

        it('loads saved functions', () => {
            const funcs = [{ name: 'f', expression: 'x^2', variables: ['x'], createdAt: Date.now() }];
            localStorageMock.setItem('calculator-user-functions', JSON.stringify(funcs));
            expect(loadUserFunctions()).toEqual(funcs);
        });
    });

    describe('saveUserFunctions', () => {
        it('saves functions to localStorage', () => {
            const funcs = [{ name: 'f', expression: 'x^2', variables: ['x'], createdAt: Date.now() }];
            saveUserFunctions(funcs);
            const stored = JSON.parse(localStorageMock.getItem('calculator-user-functions')!);
            expect(stored).toEqual(funcs);
        });
    });

    describe('addUserFunction', () => {
        it('adds a new function', () => {
            const result = addUserFunction('myFunc', 'x^2', ['x']);
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('myFunc');
            expect(result[0].expression).toBe('x^2');
        });

        it('updates existing function with same name', () => {
            addUserFunction('myFunc', 'x^2', ['x']);
            const result = addUserFunction('myFunc', 'x^3', ['x']);
            expect(result.length).toBe(1);
            expect(result[0].expression).toBe('x^3');
        });

        it('throws for invalid function name', () => {
            expect(() => addUserFunction('123func', 'x', ['x'])).toThrow();
            expect(() => addUserFunction('my-func', 'x', ['x'])).toThrow();
        });

        it('throws for reserved names', () => {
            expect(() => addUserFunction('sin', 'x', ['x'])).toThrow();
            expect(() => addUserFunction('cos', 'x', ['x'])).toThrow();
            expect(() => addUserFunction('pi', '', [])).toThrow();
        });
    });

    describe('removeUserFunction', () => {
        it('removes a function', () => {
            addUserFunction('f1', 'x', ['x']);
            addUserFunction('f2', 'y', ['y']);
            const result = removeUserFunction('f1');
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('f2');
        });

        it('handles removing non-existent function', () => {
            addUserFunction('f1', 'x', ['x']);
            const result = removeUserFunction('nonexistent');
            expect(result.length).toBe(1);
        });
    });

    describe('getUserFunction', () => {
        it('returns function by name', () => {
            addUserFunction('myFunc', 'x^2', ['x']);
            const result = getUserFunction('myFunc');
            expect(result?.name).toBe('myFunc');
        });

        it('returns undefined for non-existent function', () => {
            expect(getUserFunction('nonexistent')).toBeUndefined();
        });
    });

    describe('clearUserFunctions', () => {
        it('clears all functions', () => {
            addUserFunction('f1', 'x', ['x']);
            addUserFunction('f2', 'y', ['y']);
            clearUserFunctions();
            expect(loadUserFunctions()).toEqual([]);
        });
    });

    describe('parseVariables', () => {
        it('parses function with single variable', () => {
            const result = parseVariables('f(x)');
            expect(result).toEqual({ name: 'f', variables: ['x'] });
        });

        it('parses function with multiple variables', () => {
            const result = parseVariables('add(a, b)');
            expect(result).toEqual({ name: 'add', variables: ['a', 'b'] });
        });

        it('parses function with no variables', () => {
            const result = parseVariables('constant()');
            expect(result).toEqual({ name: 'constant', variables: [] });
        });

        it('returns null for invalid format', () => {
            expect(parseVariables('invalid')).toBeNull();
            expect(parseVariables('123(x)')).toBeNull();
        });
    });

    describe('formatUserFunction', () => {
        it('formats function with variables', () => {
            const func = { name: 'f', expression: 'x^2', variables: ['x'], createdAt: Date.now() };
            expect(formatUserFunction(func)).toBe('f(x) = x^2');
        });

        it('formats function with multiple variables', () => {
            const func = { name: 'add', expression: 'a + b', variables: ['a', 'b'], createdAt: Date.now() };
            expect(formatUserFunction(func)).toBe('add(a, b) = a + b');
        });

        it('formats constant (no variables)', () => {
            const func = { name: 'pi2', expression: '6.28', variables: [], createdAt: Date.now() };
            expect(formatUserFunction(func)).toBe('pi2 = 6.28');
        });
    });
});
