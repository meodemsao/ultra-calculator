import { describe, it, expect } from 'vitest';
import { formatExpression } from './formatExpression';

describe('formatExpression', () => {
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

  describe('nth root', () => {
    it('replaces nthRoot( with ⁿ√(', () => {
      expect(formatExpression('nthRoot(32,5)')).toBe('ⁿ√(32,5)');
    });
  });

  describe('root prefix operators are preserved', () => {
    it('preserves √ as-is', () => {
      expect(formatExpression('√25')).toBe('√25');
    });

    it('preserves ∛ as-is', () => {
      expect(formatExpression('∛8')).toBe('∛8');
    });

    it('preserves √ with parentheses', () => {
      expect(formatExpression('√(25+3)')).toBe('√(25+3)');
    });
  });

  describe('factorial postfix operator', () => {
    it('preserves ! as-is', () => {
      expect(formatExpression('5!')).toBe('5!');
    });

    it('converts old factorial(N) to N! for history', () => {
      expect(formatExpression('factorial(5)')).toBe('5!');
    });

    it('converts factorial with expression', () => {
      expect(formatExpression('factorial(10)')).toBe('10!');
    });
  });

  describe('multiple functions', () => {
    it('replaces multiple log instances', () => {
      expect(formatExpression('log10(4)+log10(9)')).toBe('log₁₀(4)+log₁₀(9)');
    });

    it('handles √ with log₁₀ together', () => {
      expect(formatExpression('√log10(100)')).toBe('√log₁₀(100)');
    });

    it('handles all function types together', () => {
      expect(formatExpression('√2+∛3+nthRoot(4,2)+log10(5)+log(6)'))
        .toBe('√2+∛3+ⁿ√(4,2)+log₁₀(5)+ln(6)');
    });
  });

  describe('edge cases', () => {
    it('returns empty string unchanged', () => {
      expect(formatExpression('')).toBe('');
    });

    it('returns expression without functions unchanged', () => {
      expect(formatExpression('2+3*4')).toBe('2+3*4');
    });
  });
});
