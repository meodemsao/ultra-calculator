import { derivative, parse, simplify, compile } from 'mathjs';

export interface TaylorSeriesResult {
    terms: string[];
    polynomial: string;
    center: number;
    order: number;
}

/**
 * Compute the nth derivative of an expression evaluated at a point.
 */
function nthDerivativeAt(
    expression: string,
    variable: string,
    n: number,
    point: number
): number {
    let currentExpr = parse(expression);

    for (let i = 0; i < n; i++) {
        currentExpr = derivative(currentExpr, variable);
    }

    // Simplify and evaluate at the point
    const simplified = simplify(currentExpr);
    const compiled = compile(simplified.toString());
    const scope: Record<string, number> = { [variable]: point };

    try {
        return compiled.evaluate(scope);
    } catch {
        return NaN;
    }
}

/**
 * Compute factorial of n
 */
function factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Format a number for display in polynomial, handling small values and fractions
 */
function formatCoefficient(value: number, isFirst: boolean): string {
    // Handle very small numbers as 0
    if (Math.abs(value) < 1e-10) {
        return '';
    }

    // Round to reasonable precision
    const rounded = Math.round(value * 1e8) / 1e8;

    if (isFirst) {
        return String(rounded);
    }

    if (rounded >= 0) {
        return ` + ${rounded}`;
    } else {
        return ` - ${Math.abs(rounded)}`;
    }
}

/**
 * Format a term in the Taylor series
 */
function formatTerm(
    coefficient: number,
    variable: string,
    power: number,
    center: number,
    isFirst: boolean
): string {
    if (Math.abs(coefficient) < 1e-10) {
        return '';
    }

    const coeffStr = formatCoefficient(coefficient, isFirst);
    if (!coeffStr) return '';

    if (power === 0) {
        return coeffStr;
    }

    let varPart: string;
    if (center === 0) {
        varPart = power === 1 ? variable : `${variable}^${power}`;
    } else {
        const centerStr = center < 0 ? `(${variable} + ${Math.abs(center)})` : `(${variable} - ${center})`;
        varPart = power === 1 ? centerStr : `${centerStr}^${power}`;
    }

    // Handle coefficient of 1 or -1
    const absCoeff = Math.abs(coefficient);
    if (Math.abs(absCoeff - 1) < 1e-10) {
        if (isFirst) {
            return coefficient < 0 ? `-${varPart}` : varPart;
        } else {
            return coefficient < 0 ? ` - ${varPart}` : ` + ${varPart}`;
        }
    }

    return `${coeffStr} * ${varPart}`;
}

/**
 * Compute Taylor series expansion of a function around a point.
 * @param expression - The function to expand
 * @param variable - The variable name
 * @param center - The point to expand around (0 for Maclaurin series)
 * @param order - The number of terms to compute
 */
export function computeTaylorSeries(
    expression: string,
    variable: string = 'x',
    center: number = 0,
    order: number = 5
): TaylorSeriesResult {
    const terms: string[] = [];
    let polynomial = '';
    let isFirst = true;

    for (let n = 0; n <= order; n++) {
        const derivativeValue = nthDerivativeAt(expression, variable, n, center);

        if (!isFinite(derivativeValue)) {
            continue;
        }

        const coefficient = derivativeValue / factorial(n);

        if (Math.abs(coefficient) < 1e-10) {
            continue;
        }

        // Create term for display
        let termStr: string;
        if (n === 0) {
            termStr = String(Math.round(coefficient * 1e8) / 1e8);
        } else if (n === 1) {
            const centerPart = center === 0 ? variable : `(${variable} - ${center})`;
            termStr = `${Math.round(coefficient * 1e8) / 1e8} * ${centerPart}`;
        } else {
            const centerPart = center === 0 ? `${variable}^${n}` : `(${variable} - ${center})^${n}`;
            termStr = `${Math.round(coefficient * 1e8) / 1e8} * ${centerPart}`;
        }

        terms.push(termStr);

        // Add to polynomial string
        const formatted = formatTerm(coefficient, variable, n, center, isFirst);
        if (formatted) {
            polynomial += formatted;
            isFirst = false;
        }
    }

    if (!polynomial) {
        polynomial = '0';
    }

    return {
        terms,
        polynomial,
        center,
        order,
    };
}

/**
 * Compute Maclaurin series (Taylor series centered at 0)
 */
export function computeMaclaurinSeries(
    expression: string,
    variable: string = 'x',
    order: number = 5
): TaylorSeriesResult {
    return computeTaylorSeries(expression, variable, 0, order);
}

/**
 * Get common Maclaurin series for reference
 */
export function getCommonMaclaurinSeries(): { name: string; series: string }[] {
    return [
        { name: 'e^x', series: '1 + x + x²/2! + x³/3! + x⁴/4! + ...' },
        { name: 'sin(x)', series: 'x - x³/3! + x⁵/5! - x⁷/7! + ...' },
        { name: 'cos(x)', series: '1 - x²/2! + x⁴/4! - x⁶/6! + ...' },
        { name: 'ln(1+x)', series: 'x - x²/2 + x³/3 - x⁴/4 + ...' },
        { name: '1/(1-x)', series: '1 + x + x² + x³ + x⁴ + ...' },
        { name: 'tan(x)', series: 'x + x³/3 + 2x⁵/15 + 17x⁷/315 + ...' },
    ];
}
