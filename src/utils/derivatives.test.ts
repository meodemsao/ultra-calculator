import { describe, it, expect } from 'vitest';
import { computeDerivative, computePartialDerivative } from './derivatives';

describe('computeDerivative', () => {
  it('computes derivative of x^2', () => {
    const result = computeDerivative('x^2');
    expect(result).toBe('2 * x');
  });

  it('computes derivative of x^3', () => {
    const result = computeDerivative('x^3');
    expect(result).toBe('3 * x ^ 2');
  });

  it('computes derivative of a constant', () => {
    const result = computeDerivative('5');
    expect(result).toBe('0');
  });

  it('computes derivative of x', () => {
    const result = computeDerivative('x');
    expect(result).toBe('1');
  });

  it('computes derivative of sin(x)', () => {
    const result = computeDerivative('sin(x)');
    expect(result).toBe('cos(x)');
  });

  it('computes derivative of cos(x)', () => {
    const result = computeDerivative('cos(x)');
    expect(result).toBe('-sin(x)');
  });

  it('computes derivative of 3*x^2 + 2*x + 1', () => {
    const result = computeDerivative('3*x^2 + 2*x + 1');
    expect(result).toBe('6 * x + 2');
  });

  it('computes derivative with respect to a different variable', () => {
    const result = computeDerivative('y^2', 'y');
    expect(result).toBe('2 * y');
  });

  it('throws on invalid expression', () => {
    expect(() => computeDerivative('invalid((')).toThrow();
  });
});

describe('computePartialDerivative', () => {
  it('computes partial derivative with respect to x', () => {
    const result = computePartialDerivative('x^2 + y', 'x');
    expect(result).toBe('2 * x');
  });

  it('computes partial derivative with respect to y', () => {
    const result = computePartialDerivative('x + y^2', 'y');
    expect(result).toBe('2 * y');
  });
});
