import { describe, it, expect } from 'vitest';
import { formatExpression } from './formatExpression';

describe('formatExpression', () => {
  describe('square root', () => {
    it('replaces sqrt( with √(', () => {
      expect(formatExpression('sqrt(25)')).toBe('√(25)');
    });

    it('handles sqrt in longer expression', () => {
      expect(formatExpression('2*sqrt(9)+1')).toBe('2*√(9)+1');
    });
  });

  describe('cube root', () => {
    it('replaces cbrt( with ∛(', () => {
      expect(formatExpression('cbrt(8)')).toBe('∛(8)');
    });
  });

  describe('nth root', () => {
    it('replaces nthRoot( with ⁿ√(', () => {
      expect(formatExpression('nthRoot(32,5)')).toBe('ⁿ√(32,5)');
    });
  });

  describe('log base 10', () => {
    it('replaces log10( with log₁₀(', () => {
      expect(formatExpression('log10(100)')).toBe('log₁₀(100)');
    });
  });

  describe('natural log', () => {
    it('replaces log( with ln(', () => {
      expect(formatExpression('log(e)')).toBe('ln(e)');
    });

    it('does not affect log10', () => {
      expect(formatExpression('log10(50)')).toBe('log₁₀(50)');
    });
  });

  describe('multiple functions', () => {
    it('replaces multiple instances of same function', () => {
      expect(formatExpression('sqrt(4)+sqrt(9)')).toBe('√(4)+√(9)');
    });

    it('replaces different functions in one expression', () => {
      expect(formatExpression('sqrt(log10(100))')).toBe('√(log₁₀(100))');
    });

    it('handles all function types together', () => {
      expect(formatExpression('sqrt(2)+cbrt(3)+nthRoot(4,2)+log10(5)+log(6)'))
        .toBe('√(2)+∛(3)+ⁿ√(4,2)+log₁₀(5)+ln(6)');
    });
  });

  describe('edge cases', () => {
    it('returns empty string unchanged', () => {
      expect(formatExpression('')).toBe('');
    });

    it('returns expression without functions unchanged', () => {
      expect(formatExpression('2+3*4')).toBe('2+3*4');
    });

    it('handles incomplete function (no closing paren)', () => {
      expect(formatExpression('sqrt(')).toBe('√(');
    });
  });
});
