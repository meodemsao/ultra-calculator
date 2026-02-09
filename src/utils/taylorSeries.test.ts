import { describe, it, expect } from 'vitest';
import { computeTaylorSeries, computeMaclaurinSeries } from './taylorSeries';

describe('computeTaylorSeries', () => {
    it('computes Maclaurin series for e^x', () => {
        const result = computeTaylorSeries('exp(x)', 'x', 0, 4);
        // e^x = 1 + x + x²/2 + x³/6 + x⁴/24 + ...
        expect(result.terms.length).toBeGreaterThan(0);
        expect(result.polynomial).toContain('1');
        expect(result.center).toBe(0);
        expect(result.order).toBe(4);
    });

    it('computes Maclaurin series for sin(x)', () => {
        const result = computeTaylorSeries('sin(x)', 'x', 0, 5);
        // sin(x) = x - x³/6 + x⁵/120 - ...
        expect(result.terms.length).toBeGreaterThan(0);
        expect(result.polynomial).toContain('x');
    });

    it('computes Maclaurin series for cos(x)', () => {
        const result = computeTaylorSeries('cos(x)', 'x', 0, 4);
        // cos(x) = 1 - x²/2 + x⁴/24 - ...
        expect(result.terms.length).toBeGreaterThan(0);
    });

    it('computes Taylor series around non-zero center', () => {
        const result = computeTaylorSeries('x^2', 'x', 1, 2);
        // (x-1)² + 2(x-1) + 1 = x²
        expect(result.center).toBe(1);
        expect(result.polynomial).toBeTruthy();
    });

    it('handles polynomial correctly', () => {
        const result = computeTaylorSeries('x^3', 'x', 0, 5);
        // x³ centered at 0 should just give x³ (coefficient 1 at order 3)
        expect(result.polynomial).toContain('x');
    });
});

describe('computeMaclaurinSeries', () => {
    it('is equivalent to Taylor at center 0', () => {
        const maclaurin = computeMaclaurinSeries('exp(x)', 'x', 3);
        const taylor = computeTaylorSeries('exp(x)', 'x', 0, 3);
        expect(maclaurin.polynomial).toBe(taylor.polynomial);
        expect(maclaurin.center).toBe(0);
    });

    it('computes series for 1/(1-x)', () => {
        const result = computeMaclaurinSeries('1/(1-x)', 'x', 4);
        // 1 + x + x² + x³ + x⁴ + ...
        expect(result.terms.length).toBeGreaterThan(0);
    });
});
