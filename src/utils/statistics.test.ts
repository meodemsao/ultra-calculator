import { describe, it, expect } from 'vitest';
import {
  descriptiveStats,
  linearRegression,
  quadraticRegression,
  exponentialRegression,
  powerRegression,
  logarithmicRegression,
} from './statistics';

describe('descriptiveStats', () => {
  it('computes stats for [1, 2, 3, 4, 5]', () => {
    const result = descriptiveStats([1, 2, 3, 4, 5]);
    expect(result.count).toBe(5);
    expect(result.sum).toBe(15);
    expect(result.mean).toBe(3);
    expect(result.median).toBe(3);
    expect(result.min).toBe(1);
    expect(result.max).toBe(5);
    expect(result.variance).toBe(2);
    expect(result.stdDev).toBeCloseTo(Math.sqrt(2), 6);
  });

  it('computes median for even-length data', () => {
    const result = descriptiveStats([1, 2, 3, 4]);
    expect(result.median).toBe(2.5);
  });

  it('computes mode', () => {
    const result = descriptiveStats([1, 2, 2, 3, 3, 4]);
    expect(result.mode).toContain(2);
    expect(result.mode).toContain(3);
  });

  it('returns empty mode when all values are unique', () => {
    const result = descriptiveStats([1, 2, 3]);
    expect(result.mode).toEqual([]);
  });

  it('computes quartiles', () => {
    const result = descriptiveStats([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result.q1).toBe(2.75);
    expect(result.q3).toBe(6.25);
    expect(result.iqr).toBe(3.5);
  });

  it('throws for empty data', () => {
    expect(() => descriptiveStats([])).toThrow('empty');
  });

  it('handles single value', () => {
    const result = descriptiveStats([42]);
    expect(result.mean).toBe(42);
    expect(result.median).toBe(42);
    expect(result.variance).toBe(0);
    expect(result.stdDev).toBe(0);
  });
});

describe('linearRegression', () => {
  it('fits y = 2x + 1 perfectly', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [3, 5, 7, 9, 11];
    const result = linearRegression(xs, ys);
    expect(result.coefficients[0]).toBeCloseTo(2, 6);
    expect(result.coefficients[1]).toBeCloseTo(1, 6);
    expect(result.rSquared).toBeCloseTo(1, 6);
  });

  it('predicts correctly', () => {
    const xs = [1, 2, 3];
    const ys = [2, 4, 6];
    const result = linearRegression(xs, ys);
    expect(result.predict(10)).toBeCloseTo(20, 6);
  });
});

describe('quadraticRegression', () => {
  it('fits y = x² perfectly', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = xs.map((x) => x * x);
    const result = quadraticRegression(xs, ys);
    expect(result.coefficients[0]).toBeCloseTo(1, 4);
    expect(result.coefficients[1]).toBeCloseTo(0, 4);
    expect(result.coefficients[2]).toBeCloseTo(0, 4);
    expect(result.rSquared).toBeCloseTo(1, 4);
  });
});

describe('exponentialRegression', () => {
  it('fits y = 2*e^(0.5x) approximately', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = xs.map((x) => 2 * Math.exp(0.5 * x));
    const result = exponentialRegression(xs, ys);
    expect(result.coefficients[0]).toBeCloseTo(2, 2);
    expect(result.coefficients[1]).toBeCloseTo(0.5, 2);
    expect(result.rSquared).toBeCloseTo(1, 2);
  });
});

describe('powerRegression', () => {
  it('fits y = 3x² approximately', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = xs.map((x) => 3 * x * x);
    const result = powerRegression(xs, ys);
    expect(result.coefficients[0]).toBeCloseTo(3, 2);
    expect(result.coefficients[1]).toBeCloseTo(2, 2);
    expect(result.rSquared).toBeCloseTo(1, 2);
  });
});

describe('logarithmicRegression', () => {
  it('fits y = 1 + 2*ln(x) approximately', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = xs.map((x) => 1 + 2 * Math.log(x));
    const result = logarithmicRegression(xs, ys);
    expect(result.coefficients[0]).toBeCloseTo(1, 2);
    expect(result.coefficients[1]).toBeCloseTo(2, 2);
    expect(result.rSquared).toBeCloseTo(1, 2);
  });
});
