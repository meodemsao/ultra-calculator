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

const KNOWN_FUNCTIONS = [
  'sin', 'cos', 'tan', 'cot',
  'asin', 'acos', 'atan', 'acot',
  'sinh', 'cosh', 'tanh',
  'asinh', 'acosh', 'atanh',
  'log', 'log10',
  'sqrt', 'cbrt',
  'abs', 'factorial',
  'exp', 'nthRoot',
  'permutations', 'combinations',
  'gcd', 'lcm',
  'ceil', 'floor',
  'randomInt',
];

/**
 * Extract the next "term" starting at position `i` in the expression.
 * Returns the end index (exclusive) of the term.
 *
 * A term is one of:
 * 1. A parenthesized group: (...) — find matching close paren
 * 2. A root prefix (√ or ∛) — recursively extract its term
 * 3. A function call: name(...) — consume name + matching parens
 * 4. A constant: pi or e
 * 5. A number: digits and dots
 */
function extractTermEnd(expr: string, i: number): number {
  if (i >= expr.length) return i;

  const ch = expr[i];

  // 1. Parenthesized group
  if (ch === '(') {
    let depth = 1;
    let j = i + 1;
    while (j < expr.length && depth > 0) {
      if (expr[j] === '(') depth++;
      if (expr[j] === ')') depth--;
      j++;
    }
    return j;
  }

  // 2. Another root prefix (recursive)
  if (ch === '√' || ch === '∛') {
    return extractTermEnd(expr, i + 1);
  }

  // 3. Function call: name followed by (
  for (const fn of KNOWN_FUNCTIONS) {
    if (expr.startsWith(fn + '(', i)) {
      // Skip the function name, then extract the parenthesized group
      return extractTermEnd(expr, i + fn.length);
    }
  }

  // 4. Constant: pi or e (check pi first to avoid matching just 'e' in a number)
  if (expr.startsWith('pi', i)) {
    return i + 2;
  }
  if (ch === 'e' && (i + 1 >= expr.length || !/[a-z]/i.test(expr[i + 1]))) {
    return i + 1;
  }

  // 5. Number: digits and dots
  if ((ch >= '0' && ch <= '9') || ch === '.') {
    let j = i;
    while (j < expr.length && ((expr[j] >= '0' && expr[j] <= '9') || expr[j] === '.')) {
      j++;
    }
    return j;
  }

  // Fallback: single character
  return i + 1;
}

/**
 * Convert √ and ∛ prefix operators into sqrt(...) and cbrt(...) function calls.
 */
export function preprocessRootOperators(expr: string): string {
  let result = '';
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === '√' || ch === '∛') {
      const fnName = ch === '√' ? 'sqrt' : 'cbrt';
      const termEnd = extractTermEnd(expr, i + 1);
      const term = expr.slice(i + 1, termEnd);
      // Recursively preprocess the term in case it contains more root symbols
      const processedTerm = preprocessRootOperators(term);
      // If term already starts with '(', don't double-wrap
      if (processedTerm.startsWith('(')) {
        result += fnName + processedTerm;
      } else {
        result += fnName + '(' + processedTerm + ')';
      }
      i = termEnd;
    } else {
      result += ch;
      i++;
    }
  }
  return result;
}

/**
 * Extract the preceding "term" ending at position `i` (exclusive) in the expression.
 * Returns the start index (inclusive) of the term.
 * Does NOT follow chained `!` — only extracts the base term.
 *
 * A term (looking backward) is one of:
 * 1. A parenthesized group: (...) — find matching open paren, including preceding function name
 * 2. A constant: pi or e
 * 3. A number: digits and dots
 */
function extractTermStart(expr: string, i: number): number {
  if (i <= 0) return 0;

  // Look at the character just before position i
  const ch = expr[i - 1];

  // 1. Parenthesized group ending with )
  if (ch === ')') {
    let depth = 1;
    let j = i - 2;
    while (j >= 0 && depth > 0) {
      if (expr[j] === ')') depth++;
      if (expr[j] === '(') depth--;
      j--;
    }
    // j is now one before the matching '(', so start of parens is j+1
    let parenStart = j + 1;

    // Check if the parenthesized group is preceded by a function name
    for (const fn of KNOWN_FUNCTIONS) {
      if (parenStart >= fn.length && expr.slice(parenStart - fn.length, parenStart) === fn) {
        parenStart -= fn.length;
        break;
      }
    }

    return parenStart;
  }

  // 2. Constant: pi or e (check pi first)
  if (i >= 2 && expr.slice(i - 2, i) === 'pi') {
    return i - 2;
  }
  if (ch === 'e' && (i - 2 < 0 || !/[a-z]/i.test(expr[i - 2]))) {
    return i - 1;
  }

  // 3. Number: digits and dots
  if ((ch >= '0' && ch <= '9') || ch === '.') {
    let j = i - 1;
    while (j > 0 && ((expr[j - 1] >= '0' && expr[j - 1] <= '9') || expr[j - 1] === '.')) {
      j--;
    }
    return j;
  }

  // Fallback: single character
  return i - 1;
}

/**
 * Convert postfix ! operator into factorial(...) function calls.
 * E.g. "5!" → "factorial(5)", "(3+2)!" → "factorial((3+2))", "5!!" → "factorial(factorial(5))"
 *
 * Processes left-to-right: finds each !, wraps its preceding term, then continues.
 */
export function preprocessFactorialOperator(expr: string): string {
  let output = expr;
  let i = 0;
  while (i < output.length) {
    if (output[i] === '!') {
      const termStart = extractTermStart(output, i);
      const term = output.slice(termStart, i);
      const before = output.slice(0, termStart);
      const after = output.slice(i + 1);
      const replacement = 'factorial(' + term + ')';
      output = before + replacement + after;
      // Position after the replacement (end of 'factorial(term)')
      i = before.length + replacement.length;
    } else {
      i++;
    }
  }
  return output;
}

export function evaluateExpression(expression: string, angleMode: AngleMode): string {
  try {
    if (!expression.trim()) {
      return '';
    }

    let processedExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Convert √/∛ prefix operators to sqrt()/cbrt() function calls
    processedExpr = preprocessRootOperators(processedExpr);

    // Convert postfix ! to factorial() function calls
    processedExpr = preprocessFactorialOperator(processedExpr);

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
