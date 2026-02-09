import { ButtonConfig } from '../types/calculator';

export const basicButtons: ButtonConfig[] = [
  { label: 'C', value: 'clear', type: 'action' },
  { label: 'CE', value: 'clear-entry', type: 'action' },
  { label: '⌫', value: 'backspace', type: 'action' },
  { label: '÷', value: '/', type: 'operator' },

  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator' },

  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '−', value: '-', type: 'operator' },

  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },

  { label: '±', value: 'negate', type: 'action' },
  { label: '0', value: '0', type: 'number' },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'equal' },
];

export const memoryButtons: ButtonConfig[] = [
  { label: 'MC', value: 'memory-clear', type: 'memory' },
  { label: 'MR', value: 'memory-recall', type: 'memory' },
  { label: 'M+', value: 'memory-add', type: 'memory' },
  { label: 'M−', value: 'memory-subtract', type: 'memory' },
];

export const parenthesesButtons: ButtonConfig[] = [
  { label: '(', value: '(', type: 'operator' },
  { label: ')', value: ')', type: 'operator' },
  { label: '%', value: '%', type: 'operator' },
];

export const scientificButtons: ButtonConfig[] = [
  { label: 'sin', value: 'sin(', type: 'function', secondLabel: 'sin⁻¹', secondValue: 'asin(' },
  { label: 'cos', value: 'cos(', type: 'function', secondLabel: 'cos⁻¹', secondValue: 'acos(' },
  { label: 'tan', value: 'tan(', type: 'function', secondLabel: 'tan⁻¹', secondValue: 'atan(' },
  { label: 'cot', value: 'cot(', type: 'function', secondLabel: 'cot⁻¹', secondValue: 'acot(' },

  { label: 'sinh', value: 'sinh(', type: 'function', secondLabel: 'sinh⁻¹', secondValue: 'asinh(' },
  { label: 'cosh', value: 'cosh(', type: 'function', secondLabel: 'cosh⁻¹', secondValue: 'acosh(' },
  { label: 'tanh', value: 'tanh(', type: 'function', secondLabel: 'tanh⁻¹', secondValue: 'atanh(' },
  { label: 'log', value: 'log10(', type: 'function', secondLabel: '10ˣ', secondValue: '10^' },

  { label: 'ln', value: 'log(', type: 'function', secondLabel: 'eˣ', secondValue: 'e^' },
  { label: '√', value: '√', type: 'function', secondLabel: '∛', secondValue: '∛' },
  { label: 'x²', value: '^2', type: 'function', secondLabel: 'x³', secondValue: '^3' },
  { label: 'xʸ', value: '^', type: 'function' },

  { label: '|x|', value: 'abs(', type: 'function' },
  { label: 'n!', value: 'factorial(', type: 'function' },
  { label: 'π', value: 'pi', type: 'function' },
  { label: 'e', value: 'e', type: 'function' },

  { label: '1/x', value: '1/(', type: 'function' },
  { label: 'ⁿ√', value: 'nthRoot(', type: 'function' },
  { label: 'exp', value: 'exp(', type: 'function' },
  { label: 'mod', value: ' mod ', type: 'operator' },

  { label: 'nPr', value: 'permutations(', type: 'function', secondLabel: 'nCr', secondValue: 'combinations(' },
  { label: 'gcd', value: 'gcd(', type: 'function', secondLabel: 'lcm', secondValue: 'lcm(' },
  { label: '⌈x⌉', value: 'ceil(', type: 'function', secondLabel: '⌊x⌋', secondValue: 'floor(' },
  { label: 'Ran#', value: 'random()', type: 'function', secondLabel: 'RanInt', secondValue: 'randomInt(' },
];

export const advancedButtons: ButtonConfig[] = [
  { label: 'd/dx', value: 'derivative', type: 'action' },
  { label: '∫', value: 'integral', type: 'action' },
  { label: 'Matrix', value: 'matrix', type: 'action' },
  { label: 'a+bi', value: 'complex', type: 'action' },
  { label: 'Vectors', value: 'vectors', type: 'action' },
  { label: 'lim', value: 'limits', type: 'action' },
  { label: 'Taylor', value: 'taylor', type: 'action' },
  { label: 'f(x)', value: 'userfunc', type: 'action' },
];
