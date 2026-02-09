/**
 * Formats an internal expression string for display by replacing
 * function names with mathematical Unicode symbols.
 *
 * Order matters: log10 must be replaced before log to avoid partial matching.
 */
export function formatExpression(expr: string): string {
  return expr
    .replace(/log10\(/g, 'log₁₀(')
    .replace(/log\(/g, 'ln(')
    .replace(/nthRoot\(/g, 'ⁿ√(')
    .replace(/cbrt\(/g, '∛(')
    .replace(/sqrt\(/g, '√(');
}
