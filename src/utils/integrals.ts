import { compile } from 'mathjs';

/**
 * Numerical integration using Simpson's Rule
 */
export function computeIntegral(
  expression: string,
  variable: string,
  lowerBound: number,
  upperBound: number,
  intervals: number = 1000
): number {
  try {
    const compiled = compile(expression);

    // Ensure even number of intervals for Simpson's rule
    const n = intervals % 2 === 0 ? intervals : intervals + 1;
    const h = (upperBound - lowerBound) / n;

    const f = (x: number): number => {
      const scope: Record<string, number> = { [variable]: x };
      return compiled.evaluate(scope);
    };

    let sum = f(lowerBound) + f(upperBound);

    for (let i = 1; i < n; i++) {
      const x = lowerBound + i * h;
      const coefficient = i % 2 === 0 ? 2 : 4;
      sum += coefficient * f(x);
    }

    return (h / 3) * sum;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Integration error: ${error.message}`);
    }
    throw new Error('Could not compute integral');
  }
}

/**
 * Trapezoidal rule for simpler integration
 */
export function computeIntegralTrapezoidal(
  expression: string,
  variable: string,
  lowerBound: number,
  upperBound: number,
  intervals: number = 1000
): number {
  try {
    const compiled = compile(expression);
    const h = (upperBound - lowerBound) / intervals;

    const f = (x: number): number => {
      const scope: Record<string, number> = { [variable]: x };
      return compiled.evaluate(scope);
    };

    let sum = (f(lowerBound) + f(upperBound)) / 2;

    for (let i = 1; i < intervals; i++) {
      sum += f(lowerBound + i * h);
    }

    return h * sum;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Integration error: ${error.message}`);
    }
    throw new Error('Could not compute integral');
  }
}
