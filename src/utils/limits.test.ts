import { describe, it, expect } from 'vitest';
import { computeLimit, computeLimitAtInfinity, formatLimitResult } from './limits';

describe('computeLimit', () => {
    it('computes limit of sin(x)/x as x approaches 0', () => {
        const result = computeLimit('sin(x)/x', 'x', 0);
        expect(result.exists).toBe(true);
        expect(result.value).toBeCloseTo(1, 4);
    });

    it('detects when limit does not exist (different left/right)', () => {
        // 1/x has different limits from left (-∞) and right (+∞)
        const result = computeLimit('1/x', 'x', 0);
        // Left limit is large negative, right limit is large positive
        expect(result.leftLimit).toBeLessThan(-1e6);
        expect(result.rightLimit).toBeGreaterThan(1e6);
        expect(result.exists).toBe(false);
    });

    it('computes one-sided limit from left', () => {
        const result = computeLimit('1/x', 'x', 0, 'left');
        // Large negative value approaching -∞
        expect(result.value).toBeLessThan(-1e6);
    });

    it('computes one-sided limit from right', () => {
        const result = computeLimit('1/x', 'x', 0, 'right');
        // Large positive value approaching +∞
        expect(result.value).toBeGreaterThan(1e6);
    });

    it('computes limit of polynomial', () => {
        const result = computeLimit('x^2 + 2*x + 1', 'x', 2);
        // Polynomial limit equals function value at the point
        // Check both sides converge to 9
        if (result.value !== null) {
            expect(result.value).toBeCloseTo(9, 2);
        } else {
            // Both limits should be close to 9
            expect(result.leftLimit).toBeCloseTo(9, 2);
            expect(result.rightLimit).toBeCloseTo(9, 2);
        }
    });

    it('computes limit of (x^2 - 1)/(x - 1) as x approaches 1', () => {
        // This simplifies to x + 1, so limit is 2
        const result = computeLimit('(x^2 - 1)/(x - 1)', 'x', 1);
        expect(result.exists).toBe(true);
        expect(result.value).toBeCloseTo(2, 4);
    });
});

describe('computeLimitAtInfinity', () => {
    it('computes limit of 1/x as x approaches +infinity', () => {
        const result = computeLimitAtInfinity('1/x', 'x', 'positive');
        expect(result).toBeCloseTo(0, 4);
    });

    it('computes limit of x^2 as x approaches +infinity', () => {
        const result = computeLimitAtInfinity('x^2', 'x', 'positive');
        expect(result).toBe(Infinity);
    });

    it('computes limit of e^(-x) as x approaches +infinity', () => {
        const result = computeLimitAtInfinity('exp(-x)', 'x', 'positive');
        expect(result).toBeCloseTo(0, 4);
    });
});

describe('formatLimitResult', () => {
    it('formats finite limit', () => {
        const result = formatLimitResult({
            value: 2.5,
            leftLimit: 2.5,
            rightLimit: 2.5,
            exists: true,
            isInfinite: false,
            approach: 'both',
        });
        expect(result).toContain('2.5');
    });

    it('formats positive infinity', () => {
        const result = formatLimitResult({
            value: Infinity,
            leftLimit: Infinity,
            rightLimit: Infinity,
            exists: false,
            isInfinite: true,
            approach: 'both',
        });
        expect(result).toBe('+∞');
    });

    it('formats negative infinity', () => {
        const result = formatLimitResult({
            value: -Infinity,
            leftLimit: -Infinity,
            rightLimit: -Infinity,
            exists: false,
            isInfinite: true,
            approach: 'both',
        });
        expect(result).toBe('-∞');
    });

    it('formats DNE', () => {
        const result = formatLimitResult({
            value: null,
            leftLimit: -Infinity,
            rightLimit: Infinity,
            exists: false,
            isInfinite: false,
            approach: 'both',
        });
        expect(result.toLowerCase()).toContain('undefined');
    });
});
