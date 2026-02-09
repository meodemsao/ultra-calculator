import { compile } from 'mathjs';

export type LimitApproach = 'left' | 'right' | 'both';

export interface LimitResult {
    value: number | null;
    leftLimit: number | null;
    rightLimit: number | null;
    exists: boolean;
    isInfinite: boolean;
    approach: LimitApproach;
}

/**
 * Compute the limit of an expression as the variable approaches a point.
 * Uses numerical approximation by evaluating at progressively closer points.
 */
export function computeLimit(
    expression: string,
    variable: string,
    approachValue: number,
    approach: LimitApproach = 'both'
): LimitResult {
    const compiled = compile(expression);

    const evaluate = (x: number): number => {
        try {
            const scope: Record<string, number> = { [variable]: x };
            return compiled.evaluate(scope);
        } catch {
            return NaN;
        }
    };

    // Use progressively smaller deltas to approach the limit
    const deltas = [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001];

    const computeOneSidedLimit = (direction: 'left' | 'right'): number | null => {
        const sign = direction === 'left' ? -1 : 1;
        const values: number[] = [];

        for (const delta of deltas) {
            const x = approachValue + sign * delta;
            const y = evaluate(x);
            if (!isFinite(y)) {
                // Check if it's trending to infinity
                if (values.length > 0) {
                    const lastValue = values[values.length - 1];
                    if (Math.abs(lastValue) > 1e10) {
                        return lastValue > 0 ? Infinity : -Infinity;
                    }
                }
                return null;
            }
            values.push(y);
        }

        // Check if values are converging
        if (values.length < 3) return null;

        const lastThree = values.slice(-3);
        const avgDiff =
            Math.abs(lastThree[2] - lastThree[1]) +
            Math.abs(lastThree[1] - lastThree[0]);

        // If values are converging (difference is small)
        if (avgDiff < 1e-5) {
            return values[values.length - 1];
        }

        // Check for divergence to infinity
        if (Math.abs(values[values.length - 1]) > 1e10) {
            return values[values.length - 1] > 0 ? Infinity : -Infinity;
        }

        return values[values.length - 1];
    };

    let leftLimit: number | null = null;
    let rightLimit: number | null = null;

    if (approach === 'left' || approach === 'both') {
        leftLimit = computeOneSidedLimit('left');
    }

    if (approach === 'right' || approach === 'both') {
        rightLimit = computeOneSidedLimit('right');
    }

    // Determine final limit
    let value: number | null = null;
    let exists = false;
    let isInfinite = false;

    if (approach === 'left' && leftLimit !== null) {
        value = leftLimit;
        exists = isFinite(leftLimit);
        isInfinite = !isFinite(leftLimit);
    } else if (approach === 'right' && rightLimit !== null) {
        value = rightLimit;
        exists = isFinite(rightLimit);
        isInfinite = !isFinite(rightLimit);
    } else if (approach === 'both') {
        if (leftLimit !== null && rightLimit !== null) {
            // Check if both limits are equal (or both infinite in same direction)
            const tolerance = 1e-6;
            if (isFinite(leftLimit) && isFinite(rightLimit)) {
                if (Math.abs(leftLimit - rightLimit) < tolerance) {
                    value = (leftLimit + rightLimit) / 2;
                    exists = true;
                } else {
                    exists = false;
                }
            } else if (leftLimit === rightLimit) {
                // Both are +Infinity or both are -Infinity
                value = leftLimit;
                exists = false;
                isInfinite = true;
            } else {
                exists = false;
            }
        } else if (leftLimit !== null) {
            value = leftLimit;
            exists = isFinite(leftLimit);
            isInfinite = !isFinite(leftLimit);
        } else if (rightLimit !== null) {
            value = rightLimit;
            exists = isFinite(rightLimit);
            isInfinite = !isFinite(rightLimit);
        }
    }

    return {
        value,
        leftLimit,
        rightLimit,
        exists,
        isInfinite,
        approach,
    };
}

/**
 * Compute the limit as x approaches infinity
 */
export function computeLimitAtInfinity(
    expression: string,
    variable: string,
    direction: 'positive' | 'negative' = 'positive'
): number | null {
    const compiled = compile(expression);

    const evaluate = (x: number): number => {
        try {
            const scope: Record<string, number> = { [variable]: x };
            return compiled.evaluate(scope);
        } catch {
            return NaN;
        }
    };

    const sign = direction === 'positive' ? 1 : -1;
    const testPoints = [10, 100, 1000, 10000, 100000, 1000000].map(
        (x) => x * sign
    );
    const values: number[] = [];

    for (const x of testPoints) {
        const y = evaluate(x);
        if (!isFinite(y)) {
            if (values.length > 0) {
                const lastValue = values[values.length - 1];
                if (Math.abs(lastValue) > 1e10) {
                    return lastValue > 0 ? Infinity : -Infinity;
                }
            }
            return null;
        }
        values.push(y);
    }

    // Check for convergence
    if (values.length < 3) return null;

    const lastThree = values.slice(-3);
    const avgDiff =
        Math.abs(lastThree[2] - lastThree[1]) +
        Math.abs(lastThree[1] - lastThree[0]);

    if (avgDiff < 1e-5) {
        return values[values.length - 1];
    }

    // Check if trending to zero
    if (Math.abs(values[values.length - 1]) < 1e-10) {
        return 0;
    }

    // Check for divergence
    if (Math.abs(values[values.length - 1]) > 1e10) {
        return values[values.length - 1] > 0 ? Infinity : -Infinity;
    }

    return values[values.length - 1];
}

/**
 * Format limit result for display
 */
export function formatLimitResult(result: LimitResult): string {
    if (result.value === null) {
        return 'undefined';
    }
    if (result.value === Infinity) {
        return '+∞';
    }
    if (result.value === -Infinity) {
        return '-∞';
    }
    if (!result.exists && result.approach === 'both') {
        return 'DNE (limit does not exist)';
    }
    return result.value.toPrecision(10);
}
