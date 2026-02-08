import { describe, it, expect } from 'vitest';
import { solveQuadratic, solveCubic, solveLinearSystem } from './equationSolver';

describe('solveQuadratic', () => {
  it('solves x²-5x+6=0 with two real roots', () => {
    const result = solveQuadratic(1, -5, 6);
    expect(result.roots).toContain('3');
    expect(result.roots).toContain('2');
    expect(result.discriminant).toBe(1);
    expect(result.vertex.x).toBe(2.5);
    expect(result.vertex.y).toBe(-0.25);
  });

  it('solves x²-4=0', () => {
    const result = solveQuadratic(1, 0, -4);
    expect(result.roots).toContain('2');
    expect(result.roots).toContain('-2');
    expect(result.discriminant).toBe(16);
  });

  it('solves x²-2x+1=0 with repeated root', () => {
    const result = solveQuadratic(1, -2, 1);
    expect(result.roots[0]).toBe('1');
    expect(result.roots[1]).toBe('1');
    expect(result.discriminant).toBe(0);
  });

  it('solves x²+1=0 with complex roots', () => {
    const result = solveQuadratic(1, 0, 1);
    expect(result.discriminant).toBe(-4);
    expect(result.roots[0]).toContain('i');
    expect(result.roots[1]).toContain('i');
  });

  it('throws when a=0', () => {
    expect(() => solveQuadratic(0, 1, 1)).toThrow('Coefficient a cannot be zero');
  });

  it('solves 2x²+3x-2=0', () => {
    const result = solveQuadratic(2, 3, -2);
    expect(result.roots).toContain('0.5');
    expect(result.roots).toContain('-2');
  });
});

describe('solveCubic', () => {
  it('solves x³-8=0', () => {
    const result = solveCubic(1, 0, 0, -8);
    expect(result.roots[0]).toBe('2');
  });

  it('solves x³-6x²+11x-6=0 (roots 1,2,3)', () => {
    const result = solveCubic(1, -6, 11, -6);
    const numericRoots = result.roots.map(Number).sort((a, b) => a - b);
    expect(numericRoots[0]).toBeCloseTo(1, 6);
    expect(numericRoots[1]).toBeCloseTo(2, 6);
    expect(numericRoots[2]).toBeCloseTo(3, 6);
  });

  it('throws when a=0', () => {
    expect(() => solveCubic(0, 1, 1, 1)).toThrow('Coefficient a cannot be zero');
  });

  it('solves x³=0 (triple root at 0)', () => {
    const result = solveCubic(1, 0, 0, 0);
    expect(result.roots.length).toBeGreaterThanOrEqual(1);
    expect(Number(result.roots[0])).toBeCloseTo(0, 6);
  });

  it('returns complex roots for one-real-root case', () => {
    const result = solveCubic(1, 0, 1, 0); // x³+x=0 => x(x²+1)=0
    // Has root x=0 and complex roots
    const hasZero = result.roots.some(r => Math.abs(Number(r)) < 1e-6);
    expect(hasZero).toBe(true);
  });
});

describe('solveLinearSystem', () => {
  it('solves 2x+y=5, x-y=1 => x=2, y=1', () => {
    const result = solveLinearSystem([[2, 1], [1, -1]], [5, 1]);
    expect(result.solvable).toBe(true);
    expect(result.solution[0]).toBe(2);
    expect(result.solution[1]).toBe(1);
  });

  it('solves 3x3 system', () => {
    // x+y+z=6, 2y+5z=−4, 2x+5y−z=27
    const result = solveLinearSystem(
      [[1, 1, 1], [0, 2, 5], [2, 5, -1]],
      [6, -4, 27]
    );
    expect(result.solvable).toBe(true);
    expect(result.solution[0]).toBe(5);
    expect(result.solution[1]).toBe(3);
    expect(result.solution[2]).toBe(-2);
  });

  it('detects singular system', () => {
    const result = solveLinearSystem([[1, 2], [2, 4]], [3, 6]);
    expect(result.solvable).toBe(false);
  });

  it('solves identity system', () => {
    const result = solveLinearSystem([[1, 0], [0, 1]], [7, 3]);
    expect(result.solvable).toBe(true);
    expect(result.solution[0]).toBe(7);
    expect(result.solution[1]).toBe(3);
  });
});
