import { unitCategories } from '../constants/units';

export function convertUnit(
  value: number,
  fromUnitSymbol: string,
  toUnitSymbol: string,
  categoryName: string
): number {
  const category = unitCategories.find((c) => c.name === categoryName);
  if (!category) {
    throw new Error(`Category "${categoryName}" not found`);
  }

  const fromUnit = category.units.find((u) => u.symbol === fromUnitSymbol);
  const toUnit = category.units.find((u) => u.symbol === toUnitSymbol);

  if (!fromUnit || !toUnit) {
    throw new Error('Invalid unit selected');
  }

  // Convert to base unit, then to target unit
  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
}

export function formatConvertedValue(value: number): string {
  if (Math.abs(value) >= 1e9 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(6);
  }

  // Round to avoid floating point issues
  const rounded = Math.round(value * 1e10) / 1e10;

  // Format with appropriate decimal places
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString();
  }

  return rounded.toLocaleString(undefined, { maximumFractionDigits: 10 });
}
