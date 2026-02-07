import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './expressionValidator';

describe('sanitizeInput', () => {
  // Rule 1: Implicit multiplication before (
  describe('Rule 1: Implicit multiplication before (', () => {
    it('inserts * between digit and (', () => {
      expect(sanitizeInput('7', '(')).toBe('*(');
    });

    it('inserts * between ) and (', () => {
      expect(sanitizeInput('(3+2)', '(')).toBe('*(');
    });

    it('inserts * between constant and (', () => {
      expect(sanitizeInput('pi', '(')).toBe('*(');
    });

    it('does not insert * after operator and (', () => {
      expect(sanitizeInput('3+', '(')).toBe('(');
    });

    it('does not insert * at start', () => {
      expect(sanitizeInput('', '(')).toBe('(');
    });
  });

  // Rule 2: Implicit multiplication after )
  describe('Rule 2: Implicit multiplication after )', () => {
    it('inserts * between ) and digit', () => {
      expect(sanitizeInput('(3+2)', '7')).toBe('*7');
    });

    it('inserts * between ) and constant', () => {
      expect(sanitizeInput('(3+2)', 'pi')).toBe('*pi');
    });

    it('inserts * between ) and function', () => {
      expect(sanitizeInput('(3+2)', 'sin(')).toBe('*sin(');
    });
  });

  // Rule 3: Prevent consecutive binary operators (replace)
  describe('Rule 3: Prevent consecutive binary operators', () => {
    it('replaces + with *', () => {
      expect(sanitizeInput('3+', '*')).toBe('\b*');
    });

    it('replaces * with /', () => {
      expect(sanitizeInput('3*', '/')).toBe('\b/');
    });

    it('replaces + with +', () => {
      expect(sanitizeInput('3+', '+')).toBe('\b+');
    });
  });

  // Rule 4: Allow unary minus after operator
  describe('Rule 4: Allow unary minus after operator', () => {
    it('allows - after *', () => {
      expect(sanitizeInput('3*', '-')).toBe('-');
    });

    it('allows - after /', () => {
      expect(sanitizeInput('3/', '-')).toBe('-');
    });

    it('allows - after ^', () => {
      expect(sanitizeInput('3^', '-')).toBe('-');
    });

    it('blocks operator after operator-minus combo', () => {
      expect(sanitizeInput('3*-', '*')).toBe(null);
    });
  });

  // Rule 5: Prevent binary operator at start
  describe('Rule 5: Prevent binary operator at start', () => {
    it('blocks * at start', () => {
      expect(sanitizeInput('', '*')).toBe(null);
    });

    it('blocks / at start', () => {
      expect(sanitizeInput('', '/')).toBe(null);
    });

    it('blocks ^ at start', () => {
      expect(sanitizeInput('', '^')).toBe(null);
    });

    it('blocks % at start', () => {
      expect(sanitizeInput('', '%')).toBe(null);
    });

    it('allows - at start (unary minus)', () => {
      expect(sanitizeInput('', '-')).toBe('-');
    });

    it('allows + at start (unary plus)', () => {
      expect(sanitizeInput('', '+')).toBe('+');
    });

    it('blocks strict binary operator after (', () => {
      expect(sanitizeInput('(', '*')).toBe(null);
    });

    it('blocks mod at start', () => {
      expect(sanitizeInput('', ' mod ')).toBe(null);
    });
  });

  // Rule 6: Balance parentheses
  describe('Rule 6: Balance parentheses on )', () => {
    it('blocks ) with no matching (', () => {
      expect(sanitizeInput('3+2', ')')).toBe(null);
    });

    it('allows ) when there is a matching (', () => {
      expect(sanitizeInput('(3+2', ')')).toBe(')');
    });

    it('blocks extra )', () => {
      expect(sanitizeInput('(3+2)', ')')).toBe(null);
    });

    it('allows second ) when two ( exist', () => {
      expect(sanitizeInput('((3+2)', ')')).toBe(')');
    });
  });

  // Rule 7: Prevent operator before )
  describe('Rule 7: Prevent operator before )', () => {
    it('blocks ) after +', () => {
      expect(sanitizeInput('(3+', ')')).toBe(null);
    });

    it('blocks ) after -', () => {
      expect(sanitizeInput('(3-', ')')).toBe(null);
    });

    it('blocks ) after *', () => {
      expect(sanitizeInput('(3*', ')')).toBe(null);
    });
  });

  // Rule 8: Prevent multiple decimal points
  describe('Rule 8: Prevent multiple decimal points', () => {
    it('blocks second . in same number', () => {
      expect(sanitizeInput('3.5', '.')).toBe(null);
    });

    it('allows . in a new number after operator', () => {
      expect(sanitizeInput('3.5+', '.')).toBe('.');
    });

    it('allows first . in a number', () => {
      expect(sanitizeInput('3', '.')).toBe('.');
    });

    it('allows . at start', () => {
      expect(sanitizeInput('', '.')).toBe('.');
    });
  });

  // Rule 9: Prevent empty parentheses
  describe('Rule 9: Prevent empty parentheses', () => {
    it('blocks ) right after (', () => {
      expect(sanitizeInput('(', ')')).toBe(null);
    });
  });

  // Rule 10: Implicit multiplication before functions
  describe('Rule 10: Implicit multiplication before functions', () => {
    it('inserts * between digit and sin(', () => {
      expect(sanitizeInput('5', 'sin(')).toBe('*sin(');
    });

    it('inserts * between constant and sqrt(', () => {
      expect(sanitizeInput('pi', 'sqrt(')).toBe('*sqrt(');
    });

    it('does not insert * after operator', () => {
      expect(sanitizeInput('3+', 'sin(')).toBe('sin(');
    });

    it('does not insert * at start', () => {
      expect(sanitizeInput('', 'sin(')).toBe('sin(');
    });
  });

  // Rule 11: Implicit multiplication before constants
  describe('Rule 11: Implicit multiplication before constants', () => {
    it('inserts * between digit and pi', () => {
      expect(sanitizeInput('5', 'pi')).toBe('*pi');
    });

    it('inserts * between ) and e', () => {
      expect(sanitizeInput('(3+2)', 'e')).toBe('*e');
    });

    it('inserts * between pi and e', () => {
      expect(sanitizeInput('pi', 'e')).toBe('*e');
    });

    it('does not insert * after operator', () => {
      expect(sanitizeInput('3+', 'pi')).toBe('pi');
    });

    it('does not insert * at start', () => {
      expect(sanitizeInput('', 'pi')).toBe('pi');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('allows normal digit input', () => {
      expect(sanitizeInput('3', '5')).toBe('5');
    });

    it('allows operator after digit', () => {
      expect(sanitizeInput('3', '+')).toBe('+');
    });

    it('allows operator after )', () => {
      expect(sanitizeInput('(3+2)', '+')).toBe('+');
    });

    it('allows digit after operator', () => {
      expect(sanitizeInput('3+', '5')).toBe('5');
    });

    it('allows digit after (', () => {
      expect(sanitizeInput('(', '5')).toBe('5');
    });

    it('allows function after (', () => {
      expect(sanitizeInput('(', 'sin(')).toBe('sin(');
    });
  });
});
