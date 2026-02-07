import { derivative, parse, simplify } from 'mathjs';

export function computeDerivative(expression: string, variable: string = 'x'): string {
  try {
    const expr = parse(expression);
    const derivativeResult = derivative(expr, variable);
    const simplified = simplify(derivativeResult);
    return simplified.toString();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Derivative error: ${error.message}`);
    }
    throw new Error('Could not compute derivative');
  }
}

export function computePartialDerivative(
  expression: string,
  variable: string
): string {
  return computeDerivative(expression, variable);
}
