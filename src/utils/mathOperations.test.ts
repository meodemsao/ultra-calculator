import { describe, it, expect } from 'vitest';
import { evaluateExpression, formatResult } from './mathOperations';

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
