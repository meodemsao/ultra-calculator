const BINARY_OPERATORS = ['+', '-', '*', '/', '^', '%'];
const STRICT_BINARY_OPERATORS = ['*', '/', '^', '%']; // no unary form
const FUNCTIONS = [
  'sin(', 'cos(', 'tan(', 'cot(',
  'asin(', 'acos(', 'atan(', 'acot(',
  'sinh(', 'cosh(', 'tanh(',
  'asinh(', 'acosh(', 'atanh(',
  'log(', 'log10(',
  'abs(',
  'exp(', 'nthRoot(',
  'permutations(', 'combinations(',
  'gcd(', 'lcm(',
  'ceil(', 'floor(',
  'randomInt(',
];
const CONSTANTS = ['pi', 'e'];
const ROOT_PREFIXES = ['√', '∛'];
const POSTFIX_OPERATORS = ['!'];

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function isOperator(ch: string): boolean {
  return BINARY_OPERATORS.includes(ch);
}

function isStrictBinaryOperator(ch: string): boolean {
  return STRICT_BINARY_OPERATORS.includes(ch);
}

function endsWithConstant(expr: string): boolean {
  return CONSTANTS.some(c => expr.endsWith(c));
}

function countChar(str: string, ch: string): number {
  let count = 0;
  for (const c of str) {
    if (c === ch) count++;
  }
  return count;
}

function getCurrentNumberToken(expr: string): string {
  const match = expr.match(/[\d.]+$/);
  return match ? match[0] : '';
}

export function sanitizeInput(currentExpr: string, newInput: string): string | null {
  const expr = currentExpr;
  const lastChar = expr.length > 0 ? expr[expr.length - 1] : '';

  // Determine what category the new input falls into
  const isNewDigit = newInput.length === 1 && isDigit(newInput);
  const isNewOperator = newInput.length === 1 && isOperator(newInput);
  const isNewOpenParen = newInput === '(';
  const isNewCloseParen = newInput === ')';
  const isNewDecimal = newInput === '.';
  const isNewFunction = FUNCTIONS.includes(newInput);
  const isNewConstant = CONSTANTS.includes(newInput);
  const isNewMod = newInput === ' mod ';
  const isNewRootPrefix = ROOT_PREFIXES.includes(newInput);
  const isNewPostfix = POSTFIX_OPERATORS.includes(newInput);

  // Rule 12: Postfix operators (!) — allowed after digits, ), and constants
  if (isNewPostfix) {
    if (expr === '') return null;
    if (isDigit(lastChar) || lastChar === ')' || endsWithConstant(expr) || lastChar === '!') {
      return newInput;
    }
    return null;
  }

  // Rule 5: Prevent strict binary operator at start (*, /, ^, %)
  if (expr === '' && newInput.length === 1 && isStrictBinaryOperator(newInput)) {
    return null;
  }
  // Also block mod at start
  if (expr === '' && isNewMod) {
    return null;
  }

  // Rule 8: Prevent multiple decimal points in the same number
  if (isNewDecimal) {
    const currentNumber = getCurrentNumberToken(expr);
    if (currentNumber.includes('.')) {
      return null;
    }
  }

  // Rule 6: Balance parentheses - block ) if no matching (
  if (isNewCloseParen) {
    const openCount = countChar(expr, '(');
    const closeCount = countChar(expr, ')');
    if (closeCount >= openCount) {
      return null;
    }
  }

  // Rule 9: Prevent empty parentheses - block ) right after (
  if (isNewCloseParen && lastChar === '(') {
    return null;
  }

  // Rule 7: Prevent operator before ) — block ) after operator
  if (isNewCloseParen && lastChar !== '' && isOperator(lastChar)) {
    return null;
  }

  // Rule 3: Prevent consecutive binary operators (replace last)
  // Rule 4: Allow unary minus after operator
  if (isNewOperator && lastChar !== '' && isOperator(lastChar)) {
    // Allow '-' after a strict binary operator (unary minus) — Rule 4
    if (newInput === '-' && isStrictBinaryOperator(lastChar)) {
      return newInput;
    }
    // If last two chars are operator + '-', and new is also operator,
    // replace both with new operator (unless new is also '-')
    if (expr.length >= 2 && expr[expr.length - 1] === '-' && isStrictBinaryOperator(expr[expr.length - 2])) {
      // e.g. "3*-" + "*" → replace both "* -" with "*"
      // This is handled by returning null and letting the caller know to replace
      // Actually, we need to signal replacement of 2 chars
      // For simplicity: return null to block, or we can use a different approach
      // Let's return a special signal - prefix with backspaces? No, let's just block it.
      // The user should backspace first. Block the input.
      return null;
    }
    // Otherwise replace: e.g. "3+" + "*" → replace "+" with "*"
    // Return special marker to indicate replacement
    return '\b' + newInput;
  }

  // Rule 5 continued: Prevent strict binary operator after open paren
  if (isNewOperator && isStrictBinaryOperator(newInput) && lastChar === '(') {
    return null;
  }

  // Rule 1: Implicit multiplication before (
  if (isNewOpenParen) {
    if (lastChar !== '' && (isDigit(lastChar) || lastChar === ')' || lastChar === '!' || endsWithConstant(expr))) {
      return '*' + newInput;
    }
  }

  // Rule 2: Implicit multiplication after ) and postfix operators (!)
  if (lastChar === ')' || lastChar === '!') {
    if (isNewDigit || isNewConstant) {
      return '*' + newInput;
    }
    if (isNewFunction || isNewRootPrefix) {
      return '*' + newInput;
    }
    // ) followed by ( is handled by Rule 1 above
  }

  // Rule 10: Implicit multiplication before functions and root prefixes
  if (isNewFunction || isNewRootPrefix) {
    if (lastChar !== '' && (isDigit(lastChar) || lastChar === '!' || endsWithConstant(expr))) {
      return '*' + newInput;
    }
  }

  // Rule 11: Implicit multiplication before constants
  if (isNewConstant) {
    if (lastChar !== '' && (isDigit(lastChar) || lastChar === ')' || lastChar === '!')) {
      return '*' + newInput;
    }
    // Constant after constant: e.g. "pi" + "e" → "pi*e"
    if (endsWithConstant(expr)) {
      return '*' + newInput;
    }
  }

  // Default: allow the input as-is
  return newInput;
}
