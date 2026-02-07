import { describe, it, expect } from 'vitest';
import { computeIntegral, computeIntegralTrapezoidal } from './integrals';

describe('computeIntegral (Simpson)', () => {
  it('integrates x from 0 to 1 (= 0.5)', () => {
    const result = computeIntegral('x', 'x', 0, 1);
    expect(result).toBeCloseTo(0.5, 6);
  });

  it('integrates x^2 from 0 to 1 (= 1/3)', () => {
    const result = computeIntegral('x^2', 'x', 0, 1);
    expect(result).toBeCloseTo(1 / 3, 6);
  });

  it('integrates x^3 from 0 to 2 (= 4)', () => {
    const result = computeIntegral('x^3', 'x', 0, 2);
    expect(result).toBeCloseTo(4, 6);
  });

  it('integrates constant 5 from 0 to 3 (= 15)', () => {
    const result = computeIntegral('5', 'x', 0, 3);
    expect(result).toBeCloseTo(15, 6);
  });

  it('integrates sin(x) from 0 to pi (= 2)', () => {
    const result = computeIntegral('sin(x)', 'x', 0, Math.PI);
    expect(result).toBeCloseTo(2, 4);
  });

  it('handles different variable name', () => {
    const result = computeIntegral('t^2', 't', 0, 1);
    expect(result).toBeCloseTo(1 / 3, 6);
  });

  it('throws on invalid expression', () => {
    expect(() => computeIntegral('invalid((', 'x', 0, 1)).toThrow();
  });
});

describe('computeIntegralTrapezoidal', () => {
  it('integrates x from 0 to 1 (= 0.5)', () => {
    const result = computeIntegralTrapezoidal('x', 'x', 0, 1);
    expect(result).toBeCloseTo(0.5, 6);
  });

  it('integrates x^2 from 0 to 1 (≈ 1/3)', () => {
    const result = computeIntegralTrapezoidal('x^2', 'x', 0, 1);
    expect(result).toBeCloseTo(1 / 3, 4);
  });

  it('integrates constant 10 from 0 to 5 (= 50)', () => {
    const result = computeIntegralTrapezoidal('10', 'x', 0, 5);
    expect(result).toBeCloseTo(50, 6);
  });

  it('throws on invalid expression', () => {
    expect(() => computeIntegralTrapezoidal('invalid((', 'x', 0, 1)).toThrow();
  });
});
