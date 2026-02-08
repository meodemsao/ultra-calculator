import { describe, it, expect } from 'vitest';
import { evaluateExpression, formatResult, toFraction } from './mathOperations';

describe('evaluateExpression', () => {
  describe('basic arithmetic', () => {
    it('evaluates addition', () => {
      expect(evaluateExpression('2+3', 'DEG')).toBe('5');
    });

    it('evaluates subtraction', () => {
      expect(evaluateExpression('10-4', 'DEG')).toBe('6');
    });

    it('evaluates multiplication', () => {
      expect(evaluateExpression('3*7', 'DEG')).toBe('21');
    });

    it('evaluates division', () => {
      expect(evaluateExpression('20/4', 'DEG')).toBe('5');
    });

    it('evaluates complex expressions', () => {
      expect(evaluateExpression('2+3*4', 'DEG')).toBe('14');
    });

    it('evaluates expressions with parentheses', () => {
      expect(evaluateExpression('(2+3)*4', 'DEG')).toBe('20');
    });

    it('evaluates negative numbers', () => {
      expect(evaluateExpression('-5+3', 'DEG')).toBe('-2');
    });

    it('evaluates decimal numbers', () => {
      expect(evaluateExpression('1.5+2.5', 'DEG')).toBe('4');
    });
  });

  describe('unicode operators', () => {
    it('handles × (multiplication)', () => {
      expect(evaluateExpression('3×4', 'DEG')).toBe('12');
    });

    it('handles ÷ (division)', () => {
      expect(evaluateExpression('12÷3', 'DEG')).toBe('4');
    });

    it('handles − (subtraction)', () => {
      expect(evaluateExpression('10−3', 'DEG')).toBe('7');
    });
  });

  describe('percentage', () => {
    it('evaluates percentage', () => {
      expect(evaluateExpression('50%', 'DEG')).toBe('0.5');
    });

    it('evaluates percentage in expression', () => {
      expect(evaluateExpression('200*50%', 'DEG')).toBe('100');
    });
  });

  describe('trigonometric functions in DEG mode', () => {
    it('evaluates sin(90) = 1', () => {
      const result = parseFloat(evaluateExpression('sin(90)', 'DEG'));
      expect(result).toBeCloseTo(1, 10);
    });

    it('evaluates cos(0) = 1', () => {
      const result = parseFloat(evaluateExpression('cos(0)', 'DEG'));
      expect(result).toBeCloseTo(1, 10);
    });

    it('evaluates tan(45) ≈ 1', () => {
      const result = parseFloat(evaluateExpression('tan(45)', 'DEG'));
      expect(result).toBeCloseTo(1, 10);
    });
  });

  describe('trigonometric functions in RAD mode', () => {
    it('evaluates sin(pi/2) = 1', () => {
      const result = parseFloat(evaluateExpression('sin(pi/2)', 'RAD'));
      expect(result).toBeCloseTo(1, 10);
    });

    it('evaluates cos(0) = 1', () => {
      const result = parseFloat(evaluateExpression('cos(0)', 'RAD'));
      expect(result).toBeCloseTo(1, 10);
    });

    it('evaluates tan(pi/4) ≈ 1', () => {
      const result = parseFloat(evaluateExpression('tan(pi/4)', 'RAD'));
      expect(result).toBeCloseTo(1, 10);
    });
  });

  describe('inverse trig in DEG mode', () => {
    it('evaluates asin(1) = 90', () => {
      const result = parseFloat(evaluateExpression('asin(1)', 'DEG'));
      expect(result).toBeCloseTo(90, 6);
    });

    it('evaluates acos(1) = 0', () => {
      const result = parseFloat(evaluateExpression('acos(1)', 'DEG'));
      expect(result).toBeCloseTo(0, 6);
    });

    it('evaluates atan(1) = 45', () => {
      const result = parseFloat(evaluateExpression('atan(1)', 'DEG'));
      expect(result).toBeCloseTo(45, 6);
    });
  });

  describe('inverse trig in RAD mode', () => {
    it('evaluates asin(1) = pi/2', () => {
      const result = parseFloat(evaluateExpression('asin(1)', 'RAD'));
      expect(result).toBeCloseTo(Math.PI / 2, 10);
    });

    it('evaluates acos(1) = 0', () => {
      const result = parseFloat(evaluateExpression('acos(1)', 'RAD'));
      expect(result).toBeCloseTo(0, 10);
    });

    it('evaluates atan(1) = pi/4', () => {
      const result = parseFloat(evaluateExpression('atan(1)', 'RAD'));
      expect(result).toBeCloseTo(Math.PI / 4, 10);
    });
  });

  describe('power and roots', () => {
    it('evaluates power', () => {
      expect(evaluateExpression('2^10', 'DEG')).toBe('1024');
    });

    it('evaluates square root', () => {
      expect(evaluateExpression('sqrt(144)', 'DEG')).toBe('12');
    });
  });

  describe('infinity', () => {
    it('returns Infinity for division by zero (positive)', () => {
      expect(evaluateExpression('1/0', 'DEG')).toBe('Infinity');
    });

    it('returns -Infinity for negative division by zero', () => {
      expect(evaluateExpression('-1/0', 'DEG')).toBe('-Infinity');
    });
  });

  describe('empty and whitespace', () => {
    it('returns empty string for empty input', () => {
      expect(evaluateExpression('', 'DEG')).toBe('');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(evaluateExpression('   ', 'DEG')).toBe('');
    });
  });

  describe('cotangent functions', () => {
    it('evaluates cot(45) = 1 in DEG mode', () => {
      const result = parseFloat(evaluateExpression('cot(45)', 'DEG'));
      expect(result).toBeCloseTo(1, 10);
    });

    it('evaluates cot(pi/4) ≈ 1 in RAD mode', () => {
      const result = parseFloat(evaluateExpression('cot(pi/4)', 'RAD'));
      expect(result).toBeCloseTo(1, 10);
    });

    it('evaluates acot(1) = 45 in DEG mode', () => {
      const result = parseFloat(evaluateExpression('acot(1)', 'DEG'));
      expect(result).toBeCloseTo(45, 6);
    });

    it('evaluates acot(1) = pi/4 in RAD mode', () => {
      const result = parseFloat(evaluateExpression('acot(1)', 'RAD'));
      expect(result).toBeCloseTo(Math.PI / 4, 10);
    });
  });

  describe('hyperbolic functions', () => {
    it('evaluates sinh(0) = 0', () => {
      const result = parseFloat(evaluateExpression('sinh(0)', 'RAD'));
      expect(result).toBeCloseTo(0, 10);
    });

    it('evaluates cosh(0) = 1', () => {
      const result = parseFloat(evaluateExpression('cosh(0)', 'RAD'));
      expect(result).toBeCloseTo(1, 10);
    });

    it('evaluates tanh(0) = 0', () => {
      const result = parseFloat(evaluateExpression('tanh(0)', 'RAD'));
      expect(result).toBeCloseTo(0, 10);
    });

    it('evaluates sinh(1) correctly', () => {
      const result = parseFloat(evaluateExpression('sinh(1)', 'RAD'));
      expect(result).toBeCloseTo(Math.sinh(1), 10);
    });

    it('evaluates cosh(1) correctly', () => {
      const result = parseFloat(evaluateExpression('cosh(1)', 'RAD'));
      expect(result).toBeCloseTo(Math.cosh(1), 10);
    });

    it('evaluates tanh(1) correctly', () => {
      const result = parseFloat(evaluateExpression('tanh(1)', 'RAD'));
      expect(result).toBeCloseTo(Math.tanh(1), 10);
    });

    it('evaluates asinh(0) = 0', () => {
      const result = parseFloat(evaluateExpression('asinh(0)', 'RAD'));
      expect(result).toBeCloseTo(0, 10);
    });

    it('evaluates acosh(1) = 0', () => {
      const result = parseFloat(evaluateExpression('acosh(1)', 'RAD'));
      expect(result).toBeCloseTo(0, 10);
    });

    it('evaluates atanh(0) = 0', () => {
      const result = parseFloat(evaluateExpression('atanh(0)', 'RAD'));
      expect(result).toBeCloseTo(0, 10);
    });

    it('hyperbolic functions are not affected by DEG mode', () => {
      const degResult = parseFloat(evaluateExpression('sinh(1)', 'DEG'));
      const radResult = parseFloat(evaluateExpression('sinh(1)', 'RAD'));
      expect(degResult).toBeCloseTo(radResult, 10);
    });
  });

  describe('combinatorics', () => {
    it('evaluates permutations(5,2) = 20', () => {
      expect(evaluateExpression('permutations(5,2)', 'DEG')).toBe('20');
    });

    it('evaluates combinations(5,2) = 10', () => {
      expect(evaluateExpression('combinations(5,2)', 'DEG')).toBe('10');
    });

    it('evaluates combinations(10,3) = 120', () => {
      expect(evaluateExpression('combinations(10,3)', 'DEG')).toBe('120');
    });

    it('evaluates permutations(4,4) = 24', () => {
      expect(evaluateExpression('permutations(4,4)', 'DEG')).toBe('24');
    });
  });

  describe('GCD and LCM', () => {
    it('evaluates gcd(12,8) = 4', () => {
      expect(evaluateExpression('gcd(12,8)', 'DEG')).toBe('4');
    });

    it('evaluates lcm(4,6) = 12', () => {
      expect(evaluateExpression('lcm(4,6)', 'DEG')).toBe('12');
    });

    it('evaluates gcd(100,75) = 25', () => {
      expect(evaluateExpression('gcd(100,75)', 'DEG')).toBe('25');
    });

    it('evaluates lcm(3,5) = 15', () => {
      expect(evaluateExpression('lcm(3,5)', 'DEG')).toBe('15');
    });
  });

  describe('ceil and floor', () => {
    it('evaluates ceil(3.2) = 4', () => {
      expect(evaluateExpression('ceil(3.2)', 'DEG')).toBe('4');
    });

    it('evaluates floor(3.8) = 3', () => {
      expect(evaluateExpression('floor(3.8)', 'DEG')).toBe('3');
    });

    it('evaluates ceil(-2.3) = -2', () => {
      expect(evaluateExpression('ceil(-2.3)', 'DEG')).toBe('-2');
    });

    it('evaluates floor(-2.3) = -3', () => {
      expect(evaluateExpression('floor(-2.3)', 'DEG')).toBe('-3');
    });

    it('evaluates ceil(5) = 5', () => {
      expect(evaluateExpression('ceil(5)', 'DEG')).toBe('5');
    });

    it('evaluates floor(5) = 5', () => {
      expect(evaluateExpression('floor(5)', 'DEG')).toBe('5');
    });
  });

  describe('randomInt', () => {
    it('evaluates randomInt to an integer within range', () => {
      const result = parseInt(evaluateExpression('randomInt(1,10)', 'DEG'));
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('evaluates randomInt(5,5) = 5', () => {
      expect(evaluateExpression('randomInt(5,5)', 'DEG')).toBe('5');
    });
  });

  describe('error handling', () => {
    it('throws on invalid expression', () => {
      expect(() => evaluateExpression('2+*3', 'DEG')).toThrow();
    });

    it('throws on incomplete expression', () => {
      expect(() => evaluateExpression('2+', 'DEG')).toThrow();
    });
  });
});

describe('formatResult', () => {
  it('returns numbers as-is for normal range', () => {
    expect(formatResult('42')).toBe('42');
  });

  it('returns non-numeric strings as-is', () => {
    expect(formatResult('abc')).toBe('abc');
  });

  it('uses exponential notation for very large numbers', () => {
    expect(formatResult('1e12')).toBe('1.000000e+12');
  });

  it('uses exponential notation for very small numbers', () => {
    expect(formatResult('1e-7')).toBe('1.000000e-7');
  });

  it('does not use exponential for zero', () => {
    expect(formatResult('0')).toBe('0');
  });

  it('rounds to avoid floating point issues', () => {
    expect(formatResult('0.1000000000001')).toBe('0.1');
  });
});

describe('toFraction', () => {
  it('converts 0.5 to 1/2', () => {
    expect(toFraction('0.5')).toBe('1/2');
  });

  it('converts 0.25 to 1/4', () => {
    expect(toFraction('0.25')).toBe('1/4');
  });

  it('converts 0.333... to 1/3', () => {
    expect(toFraction('0.3333333333')).toBe('1/3');
  });

  it('returns integers as-is', () => {
    expect(toFraction('5')).toBe('5');
  });

  it('converts 1.5 to 3/2', () => {
    expect(toFraction('1.5')).toBe('3/2');
  });

  it('returns non-numeric strings as-is', () => {
    expect(toFraction('abc')).toBe('abc');
  });

  it('handles negative fractions', () => {
    expect(toFraction('-0.5')).toBe('-1/2');
  });
});
