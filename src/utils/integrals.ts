import { compile, parse, simplify } from 'mathjs';

/**
 * Symbolic integration for common functions.
 * Returns the antiderivative as a string expression.
 * Returns null if symbolic integration is not supported.
 */
export function computeSymbolicIntegral(
  expression: string,
  variable: string = 'x'
): string | null {
  try {
    const expr = parse(expression);
    const simplified = simplify(expr);
    const str = simplified.toString();

    // Pattern matching for common integrals
    // Power rule: x^n → x^(n+1)/(n+1)  (n ≠ -1)
    const powerMatch = str.match(new RegExp(`^${variable}\\s*\\^\\s*([\\d.-]+)$`));
    if (powerMatch) {
      const n = parseFloat(powerMatch[1]);
      if (n === -1) {
        return `ln(|${variable}|) + C`;
      }
      const newPower = n + 1;
      return `(${variable}^${newPower})/${newPower} + C`;
    }

    // Just variable: x → x^2/2
    if (str === variable) {
      return `(${variable}^2)/2 + C`;
    }

    // Constant: a → a*x
    const constMatch = str.match(/^[\d.-]+$/);
    if (constMatch) {
      return `${str} * ${variable} + C`;
    }

    // Trigonometric functions
    if (str === `sin(${variable})`) {
      return `-cos(${variable}) + C`;
    }
    if (str === `cos(${variable})`) {
      return `sin(${variable}) + C`;
    }
    if (str === `tan(${variable})`) {
      return `-ln(|cos(${variable})|) + C`;
    }
    if (str === `sec(${variable})^2`) {
      return `tan(${variable}) + C`;
    }
    if (str === `csc(${variable})^2`) {
      return `-cot(${variable}) + C`;
    }

    // Exponential: e^x → e^x
    if (str === `exp(${variable})` || str === `e^${variable}`) {
      return `exp(${variable}) + C`;
    }

    // Natural log: 1/x → ln|x|
    if (str === `1 / ${variable}` || str === `${variable}^-1`) {
      return `ln(|${variable}|) + C`;
    }

    // Hyperbolic functions
    if (str === `sinh(${variable})`) {
      return `cosh(${variable}) + C`;
    }
    if (str === `cosh(${variable})`) {
      return `sinh(${variable}) + C`;
    }

    // 1/sqrt(1-x^2) → asin(x)
    if (str === `1 / sqrt(1 - ${variable}^2)`) {
      return `asin(${variable}) + C`;
    }

    // 1/(1+x^2) → atan(x)
    if (str === `1 / (1 + ${variable}^2)`) {
      return `atan(${variable}) + C`;
    }

    // For more complex expressions, return null (no symbolic form available)
    return null;
  } catch {
    return null;
  }
}


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
