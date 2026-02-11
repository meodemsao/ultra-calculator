/**
 * Replace `fnName(...)` with `open...close`, correctly matching nested parentheses.
 */
function replaceFunctionWithBrackets(
  expr: string,
  fnName: string,
  openBracket: string,
  closeBracket: string
): string {
  let result = '';
  let i = 0;
  while (i < expr.length) {
    if (expr.startsWith(fnName + '(', i)) {
      // Found fnName( — find the matching )
      const contentStart = i + fnName.length + 1; // after the (
      let depth = 1;
      let j = contentStart;
      while (j < expr.length && depth > 0) {
        if (expr[j] === '(') depth++;
        if (expr[j] === ')') depth--;
        j++;
      }
      if (depth > 0) {
        // No matching ) found (user still typing) — show open bracket + content so far
        const content = expr.slice(contentStart, j);
        result += openBracket + content;
        i = j;
      } else {
        // j is now after the matching )
        const content = expr.slice(contentStart, j - 1);
        result += openBracket + content + closeBracket;
        i = j;
      }
    } else {
      result += expr[i];
      i++;
    }
  }
  return result;
}

/**
 * Formats an internal expression string for display by replacing
 * function names with mathematical Unicode symbols.
 *
 * Note: √ and ∛ are already stored as Unicode symbols in the expression
 * (they are prefix operators, not function calls).
 * Note: ! is already stored as postfix operator in the expression.
 * The factorial( replacement handles old history entries.
 *
 * Order matters: longer names must be replaced before shorter ones
 * to avoid partial matching (e.g., log10 before log, acot before cot).
 */
export function formatExpression(expr: string): string {
  let result = expr
    // Logarithms (log10 before log)
    .replace(/log10\(/g, 'log₁₀(')
    .replace(/log\(/g, 'ln(')
    // Legacy history entries
    .replace(/nthRoot\(/g, 'ⁿ√(')
    .replace(/factorial\(([^)]+)\)/g, '$1!')
    // Inverse hyperbolic (before inverse trig to avoid asinh matching asin)
    .replace(/asinh\(/g, 'sinh⁻¹(')
    .replace(/acosh\(/g, 'cosh⁻¹(')
    .replace(/atanh\(/g, 'tanh⁻¹(')
    // Inverse trig
    .replace(/acot\(/g, 'cot⁻¹(')
    .replace(/asin\(/g, 'sin⁻¹(')
    .replace(/acos\(/g, 'cos⁻¹(')
    .replace(/atan\(/g, 'tan⁻¹(')
    // Combinatorics
    .replace(/permutations\(/g, 'P(')
    .replace(/combinations\(/g, 'C(')
    // Constants (word boundary to avoid matching pi inside other words)
    .replace(/\bpi\b/g, 'π')
    // Power superscripts (only when followed by non-digit or end of string)
    .replace(/\^2(?!\d)/g, '²')
    .replace(/\^3(?!\d)/g, '³');

  // Bracket-style replacements (need paren matching)
  result = replaceFunctionWithBrackets(result, 'abs', '|', '|');
  result = replaceFunctionWithBrackets(result, 'ceil', '⌈', '⌉');
  result = replaceFunctionWithBrackets(result, 'floor', '⌊', '⌋');

  return result;
}
