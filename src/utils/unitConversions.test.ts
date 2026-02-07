import { describe, it, expect } from 'vitest';
import { convertUnit, formatConvertedValue } from './unitConversions';

describe('convertUnit', () => {
  describe('Length', () => {
    it('converts meters to kilometers', () => {
      expect(convertUnit(1000, 'm', 'km', 'Length')).toBe(1);
    });

    it('converts kilometers to meters', () => {
      expect(convertUnit(1, 'km', 'm', 'Length')).toBe(1000);
    });

    it('converts meters to centimeters', () => {
      expect(convertUnit(1, 'm', 'cm', 'Length')).toBe(100);
    });

    it('converts miles to kilometers', () => {
      expect(convertUnit(1, 'mi', 'km', 'Length')).toBeCloseTo(1.609344, 5);
    });

    it('converts feet to meters', () => {
      expect(convertUnit(1, 'ft', 'm', 'Length')).toBeCloseTo(0.3048, 5);
    });

    it('converts inches to centimeters', () => {
      expect(convertUnit(1, 'in', 'cm', 'Length')).toBeCloseTo(2.54, 5);
    });
  });

  describe('Weight', () => {
    it('converts kilograms to grams', () => {
      expect(convertUnit(1, 'kg', 'g', 'Weight')).toBe(1000);
    });

    it('converts pounds to kilograms', () => {
      expect(convertUnit(1, 'lb', 'kg', 'Weight')).toBeCloseTo(0.453592, 5);
    });

    it('converts ounces to grams', () => {
      expect(convertUnit(1, 'oz', 'g', 'Weight')).toBeCloseTo(28.3495, 3);
    });
  });

  describe('Temperature', () => {
    it('converts Celsius to Fahrenheit', () => {
      expect(convertUnit(100, '°C', '°F', 'Temperature')).toBeCloseTo(212, 5);
    });

    it('converts Fahrenheit to Celsius', () => {
      expect(convertUnit(32, '°F', '°C', 'Temperature')).toBeCloseTo(0, 5);
    });

    it('converts Celsius to Kelvin', () => {
      expect(convertUnit(0, '°C', 'K', 'Temperature')).toBeCloseTo(273.15, 5);
    });

    it('converts Kelvin to Celsius', () => {
      expect(convertUnit(273.15, 'K', '°C', 'Temperature')).toBeCloseTo(0, 5);
    });
  });

  describe('Data Storage', () => {
    it('converts KB to bytes', () => {
      expect(convertUnit(1, 'KB', 'B', 'Data Storage')).toBe(1024);
    });

    it('converts MB to KB', () => {
      expect(convertUnit(1, 'MB', 'KB', 'Data Storage')).toBe(1024);
    });

    it('converts GB to MB', () => {
      expect(convertUnit(1, 'GB', 'MB', 'Data Storage')).toBe(1024);
    });

    it('converts bytes to bits', () => {
      expect(convertUnit(1, 'B', 'bit', 'Data Storage')).toBe(8);
    });
  });

  describe('Time', () => {
    it('converts minutes to seconds', () => {
      expect(convertUnit(1, 'min', 's', 'Time')).toBe(60);
    });

    it('converts hours to minutes', () => {
      expect(convertUnit(1, 'h', 'min', 'Time')).toBe(60);
    });

    it('converts days to hours', () => {
      expect(convertUnit(1, 'd', 'h', 'Time')).toBe(24);
    });

    it('converts weeks to days', () => {
      expect(convertUnit(1, 'wk', 'd', 'Time')).toBe(7);
    });
  });

  describe('error handling', () => {
    it('throws for invalid category', () => {
      expect(() => convertUnit(1, 'm', 'km', 'InvalidCategory')).toThrow(
        'Category "InvalidCategory" not found'
      );
    });

    it('throws for invalid unit', () => {
      expect(() => convertUnit(1, 'invalid', 'km', 'Length')).toThrow(
        'Invalid unit selected'
      );
    });
  });
});

describe('formatConvertedValue', () => {
  it('formats integers with locale string', () => {
    expect(formatConvertedValue(1000)).toBeTruthy();
  });

  it('formats decimals', () => {
    const result = formatConvertedValue(3.14159);
    expect(result).toBeTruthy();
  });

  it('uses exponential for very large numbers', () => {
    expect(formatConvertedValue(1e10)).toContain('e+');
  });

  it('uses exponential for very small numbers', () => {
    expect(formatConvertedValue(1e-7)).toContain('e-');
  });

  it('does not use exponential for zero', () => {
    expect(formatConvertedValue(0)).not.toContain('e');
  });
});
