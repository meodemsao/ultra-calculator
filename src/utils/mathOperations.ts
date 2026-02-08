import { create, all, MathJsStatic } from 'mathjs';
import { AngleMode } from '../types/calculator';

const math = create(all) as MathJsStatic;

// Register cot and acot as custom functions
math.import({
  cot: function (x: number) {
    return 1 / Math.tan(x);
  },
  acot: function (x: number) {
    return Math.atan(1 / x);
  },
  randomInt: function (a: number, b: number) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  },
}, { override: true });

export function evaluateExpression(expression: string, angleMode: AngleMode): string {
  try {
    if (!expression.trim()) {
      return '';
    }

    let processedExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Handle percentage
    processedExpr = processedExpr.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');

    // Handle angle mode for trig functions
    if (angleMode === 'DEG') {
      // Handle inverse trig first - convert result from radians to degrees
      processedExpr = processedExpr
        .replace(/acot\(/g, '(180/pi)*acot(')
        .replace(/asin\(/g, '(180/pi)*asin(')
        .replace(/acos\(/g, '(180/pi)*acos(')
        .replace(/atan\(/g, '(180/pi)*atan(');

      // Convert degrees to radians for forward trig (negative lookbehind to skip inverse trig)
      processedExpr = processedExpr
        .replace(/(?<!a)cot\(/g, 'cot(pi/180*')
        .replace(/(?<!a)sin\(/g, 'sin(pi/180*')
        .replace(/(?<!a)cos\(/g, 'cos(pi/180*')
        .replace(/(?<!a)tan\(/g, 'tan(pi/180*');
    }

    const result = math.evaluate(processedExpr);

    if (typeof result === 'number') {
      if (!isFinite(result)) {
        return result > 0 ? 'Infinity' : '-Infinity';
      }
      // Format to avoid floating point issues
      const formatted = math.format(result, { precision: 14 });
      return formatted;
    }

    if (math.typeOf(result) === 'Complex') {
      return math.format(result, { precision: 14 });
    }

    if (math.typeOf(result) === 'Matrix') {
      return math.format(result, { precision: 6 });
    }

    return String(result);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Invalid expression');
  }
}

export function formatResult(result: string): string {
  const num = parseFloat(result);
  if (isNaN(num)) {
    return result;
  }

  // Use exponential notation for very large or small numbers
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }

  // Round to avoid floating point display issues
  const rounded = Math.round(num * 1e10) / 1e10;
  return String(rounded);
}

export function toFraction(result: string): string {
  const num = parseFloat(result);
  if (isNaN(num) || !isFinite(num)) {
    return result;
  }
  if (Number.isInteger(num)) {
    return result;
  }
  try {
    const fraction = math.fraction(num);
    return math.format(fraction, { fraction: 'ratio' });
  } catch {
    return result;
  }
}

export { math };
