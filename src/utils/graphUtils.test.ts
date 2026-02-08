import { describe, it, expect } from 'vitest';
import { evaluateFunction, sampleFunction, generateTable, autoFitY } from './graphUtils';

describe('evaluateFunction', () => {
  it('evaluates x^2 at x=3', () => {
    expect(evaluateFunction('x^2', 3)).toBe(9);
  });

  it('evaluates sin(x) at x=0', () => {
    expect(evaluateFunction('sin(x)', 0)).toBe(0);
  });

  it('evaluates 2*x+1 at x=4', () => {
    expect(evaluateFunction('2*x+1', 4)).toBe(9);
  });

  it('returns null for undefined (1/0)', () => {
    expect(evaluateFunction('1/x', 0)).toBe(null);
  });

  it('returns null for invalid expression', () => {
    expect(evaluateFunction('???', 1)).toBe(null);
  });

  it('evaluates sqrt(x) at x=4', () => {
    expect(evaluateFunction('sqrt(x)', 4)).toBe(2);
  });

  it('evaluates log(x) at x=1', () => {
    expect(evaluateFunction('log(x, e)', 1)).toBeCloseTo(0, 10);
  });
});

describe('sampleFunction', () => {
  it('samples x^2 over [-2, 2] with 4 points', () => {
    const points = sampleFunction('x^2', -2, 2, 4);
    expect(points.length).toBe(5); // 0..4 inclusive
    expect(points[0].x).toBe(-2);
    expect(points[0].y).toBe(4);
    expect(points[2].x).toBe(0);
    expect(points[2].y).toBe(0);
    expect(points[4].x).toBe(2);
    expect(points[4].y).toBe(4);
  });

  it('skips points where function is undefined', () => {
    // log(x) is undefined for x <= 0
    const points = sampleFunction('log(x)', -2, 2, 100);
    // should have fewer than 101 points since negative x values produce NaN
    expect(points.length).toBeLessThan(101);
    expect(points.length).toBeGreaterThan(0);
  });
});

describe('generateTable', () => {
  it('generates table for x^2 from -2 to 2 step 1', () => {
    const rows = generateTable('x^2', -2, 2, 1);
    expect(rows.length).toBe(5);
    expect(rows[0]).toEqual({ x: -2, y: 4 });
    expect(rows[1]).toEqual({ x: -1, y: 1 });
    expect(rows[2]).toEqual({ x: 0, y: 0 });
    expect(rows[3]).toEqual({ x: 1, y: 1 });
    expect(rows[4]).toEqual({ x: 2, y: 4 });
  });

  it('returns null y for undefined values', () => {
    const rows = generateTable('1/x', -1, 1, 1);
    const zeroRow = rows.find((r) => r.x === 0);
    expect(zeroRow?.y).toBe(null);
  });
});

describe('autoFitY', () => {
  it('returns reasonable bounds for x^2 over [-5, 5]', () => {
    const { yMin, yMax } = autoFitY(['x^2'], -5, 5);
    expect(yMin).toBeLessThan(0);
    expect(yMax).toBeGreaterThan(25);
  });

  it('returns default bounds for invalid expression', () => {
    const { yMin, yMax } = autoFitY(['???invalid'], -10, 10);
    expect(yMin).toBe(-10);
    expect(yMax).toBe(10);
  });

  it('handles multiple functions', () => {
    const { yMin, yMax } = autoFitY(['x', '-x'], -5, 5);
    expect(yMin).toBeLessThan(-5);
    expect(yMax).toBeGreaterThan(5);
  });
});
