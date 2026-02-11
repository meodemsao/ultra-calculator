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

  describe('inverse trig', () => {
    it('replaces asin( with sin⁻¹(', () => {
      expect(formatExpression('asin(0.5)')).toBe('sin⁻¹(0.5)');
    });

    it('replaces acos( with cos⁻¹(', () => {
      expect(formatExpression('acos(0.5)')).toBe('cos⁻¹(0.5)');
    });

    it('replaces atan( with tan⁻¹(', () => {
      expect(formatExpression('atan(1)')).toBe('tan⁻¹(1)');
    });

    it('replaces acot( with cot⁻¹(', () => {
      expect(formatExpression('acot(1)')).toBe('cot⁻¹(1)');
    });

    it('does not affect forward trig functions', () => {
      expect(formatExpression('sin(1)+cos(2)+tan(3)')).toBe('sin(1)+cos(2)+tan(3)');
    });
  });

  describe('inverse hyperbolic', () => {
    it('replaces asinh( with sinh⁻¹(', () => {
      expect(formatExpression('asinh(1)')).toBe('sinh⁻¹(1)');
    });

    it('replaces acosh( with cosh⁻¹(', () => {
      expect(formatExpression('acosh(2)')).toBe('cosh⁻¹(2)');
    });

    it('replaces atanh( with tanh⁻¹(', () => {
      expect(formatExpression('atanh(0.5)')).toBe('tanh⁻¹(0.5)');
    });

    it('does not affect forward hyperbolic functions', () => {
      expect(formatExpression('sinh(1)+cosh(2)+tanh(3)')).toBe('sinh(1)+cosh(2)+tanh(3)');
    });
  });

  describe('combinatorics', () => {
    it('replaces permutations( with P(', () => {
      expect(formatExpression('permutations(5,3)')).toBe('P(5,3)');
    });

    it('replaces combinations( with C(', () => {
      expect(formatExpression('combinations(5,3)')).toBe('C(5,3)');
    });
  });

  describe('constants', () => {
    it('replaces pi with π', () => {
      expect(formatExpression('2*pi')).toBe('2*π');
    });

    it('replaces standalone pi', () => {
      expect(formatExpression('pi')).toBe('π');
    });

    it('does not replace pi inside function names', () => {
      // asin already becomes sin⁻¹, but 'pi' inside 'asin' should not match
      expect(formatExpression('sin(pi)')).toBe('sin(π)');
    });
  });

  describe('power superscripts', () => {
    it('replaces ^2 with ²', () => {
      expect(formatExpression('5^2')).toBe('5²');
    });

    it('replaces ^3 with ³', () => {
      expect(formatExpression('5^3')).toBe('5³');
    });

    it('does not replace ^2 when followed by digit', () => {
      expect(formatExpression('5^23')).toBe('5^23');
    });

    it('does not replace ^3 when followed by digit', () => {
      expect(formatExpression('5^32')).toBe('5^32');
    });

    it('replaces ^2 before operator', () => {
      expect(formatExpression('5^2+3')).toBe('5²+3');
    });

    it('replaces ^3 at end of expression', () => {
      expect(formatExpression('x^3')).toBe('x³');
    });
  });

  describe('absolute value brackets', () => {
    it('replaces abs(x) with |x|', () => {
      expect(formatExpression('abs(5)')).toBe('|5|');
    });

    it('handles nested parentheses in abs', () => {
      expect(formatExpression('abs(3*(2+1))')).toBe('|3*(2+1)|');
    });

    it('handles abs in larger expression', () => {
      expect(formatExpression('abs(5)+1')).toBe('|5|+1');
    });

    it('shows | with content when no closing paren (still typing)', () => {
      expect(formatExpression('abs(5')).toBe('|5');
    });

    it('shows | when just opened (still typing)', () => {
      expect(formatExpression('abs(')).toBe('|');
    });
  });

  describe('ceiling brackets', () => {
    it('replaces ceil(x) with ⌈x⌉', () => {
      expect(formatExpression('ceil(3.5)')).toBe('⌈3.5⌉');
    });

    it('handles nested expression in ceil', () => {
      expect(formatExpression('ceil(2+1.5)')).toBe('⌈2+1.5⌉');
    });
  });

  describe('floor brackets', () => {
    it('replaces floor(x) with ⌊x⌋', () => {
      expect(formatExpression('floor(3.7)')).toBe('⌊3.7⌋');
    });

    it('handles nested expression in floor', () => {
      expect(formatExpression('floor(2+1.5)')).toBe('⌊2+1.5⌋');
    });
  });

  describe('edge cases', () => {
    it('returns empty string unchanged', () => {
      expect(formatExpression('')).toBe('');
    });

    it('returns expression without functions unchanged', () => {
      expect(formatExpression('2+3*4')).toBe('2+3*4');
    });

    it('handles combined new and old formatting', () => {
      expect(formatExpression('abs(asin(pi))')).toBe('|sin⁻¹(π)|');
    });
  });
});
