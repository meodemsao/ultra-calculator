import { UnitCategory } from '../types/calculator';

export const unitCategories: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: 'Centimeters', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { name: 'Millimeters', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  {
    name: 'Weight',
    units: [
      { name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Grams', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: 'Milligrams', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { name: 'Pounds', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { name: 'Metric Tons', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    name: 'Temperature',
    units: [
      { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
      { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    name: 'Volume',
    units: [
      { name: 'Liters', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Milliliters', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: 'Cubic Meters', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: 'Gallons (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { name: 'Quarts', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { name: 'Pints', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      { name: 'Cups', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { name: 'Fluid Ounces', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
  },
  {
    name: 'Area',
    units: [
      { name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Square Kilometers', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { name: 'Hectares', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { name: 'Square Feet', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { name: 'Square Yards', symbol: 'yd²', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
      { name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { name: 'Square Miles', symbol: 'mi²', toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
    ],
  },
  {
    name: 'Speed',
    units: [
      { name: 'Meters/Second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Kilometers/Hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { name: 'Miles/Hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { name: 'Knots', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      { name: 'Feet/Second', symbol: 'ft/s', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    ],
  },
  {
    name: 'Time',
    units: [
      { name: 'Seconds', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Milliseconds', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: 'Minutes', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { name: 'Hours', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { name: 'Days', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { name: 'Weeks', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    ],
  },
  {
    name: 'Data Storage',
    units: [
      { name: 'Bytes', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      { name: 'Kilobytes', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { name: 'Megabytes', symbol: 'MB', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      { name: 'Gigabytes', symbol: 'GB', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      { name: 'Terabytes', symbol: 'TB', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
      { name: 'Bits', symbol: 'bit', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    ],
  },
];
