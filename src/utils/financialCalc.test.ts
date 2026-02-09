import { describe, it, expect } from 'vitest';
import {
    solveTVM,
    compoundInterest,
    generateAmortization,
} from './financialCalc';

describe('solveTVM', () => {
    describe('solve for N (number of periods)', () => {
        it('solves for N with non-zero rate', () => {
            // PV = -1000 (invest), PMT = 0, FV = 1500 (receive), rate = 5%
            // N = log(1500/1000) / log(1.05) ≈ 8.31
            const result = solveTVM(
                { rate: 0.05, pv: -1000, pmt: 0, fv: 1500 },
                'n'
            );
            expect(result.solvedFor).toBe('N');
            expect(result.n).toBeCloseTo(8.31, 1);
        });

        it('solves for N with zero rate', () => {
            // PV = -1000, PMT = 100 (receive), FV = 0, rate = 0 => N = 10
            const result = solveTVM({ rate: 0, pv: -1000, pmt: 100, fv: 0 }, 'n');
            expect(result.n).toBe(10);
        });

        it('throws when inputs are missing', () => {
            expect(() => solveTVM({ pv: 1000 }, 'n')).toThrow('Missing inputs');
        });
    });

    describe('solve for rate (I%)', () => {
        it('solves for rate using Newton method', () => {
            // N = 10, PV = -1000 (invest), PMT = 0, FV = 1500 (receive)
            // Rate that grows 1000 to 1500 in 10 periods => ~4.14%
            const result = solveTVM(
                { n: 10, pv: -1000, pmt: 0, fv: 1500 },
                'rate'
            );
            expect(result.solvedFor).toBe('I%');
            expect(result.rate).toBeCloseTo(0.0414, 2);
        });

        it('throws when inputs are missing', () => {
            expect(() => solveTVM({ n: 12 }, 'rate')).toThrow('Missing inputs');
        });
    });

    describe('solve for PV (present value)', () => {
        it('solves for PV with non-zero rate', () => {
            // N = 10, rate = 5%, PMT = -100, FV = 0 => PV ≈ 772.17
            const result = solveTVM(
                { n: 10, rate: 0.05, pmt: -100, fv: 0 },
                'pv'
            );
            expect(result.solvedFor).toBe('PV');
            expect(result.pv).toBeCloseTo(772.17, 1);
        });

        it('solves for PV with zero rate', () => {
            // N = 10, rate = 0, PMT = -100, FV = 0 => PV = 1000
            const result = solveTVM({ n: 10, rate: 0, pmt: -100, fv: 0 }, 'pv');
            expect(result.pv).toBe(1000);
        });

        it('throws when inputs are missing', () => {
            expect(() => solveTVM({ n: 10, rate: 0.05 }, 'pv')).toThrow(
                'Missing inputs'
            );
        });
    });

    describe('solve for PMT (payment)', () => {
        it('solves for PMT with non-zero rate', () => {
            // N = 10, rate = 5%, PV = -1000, FV = 0 => PMT ≈ 129.50
            const result = solveTVM(
                { n: 10, rate: 0.05, pv: -1000, fv: 0 },
                'pmt'
            );
            expect(result.solvedFor).toBe('PMT');
            expect(result.pmt).toBeCloseTo(129.5, 1);
        });

        it('solves for PMT with zero rate', () => {
            // N = 10, rate = 0, PV = -1000, FV = 0 => PMT = 100
            const result = solveTVM({ n: 10, rate: 0, pv: -1000, fv: 0 }, 'pmt');
            expect(result.pmt).toBe(100);
        });

        it('throws when inputs are missing', () => {
            expect(() => solveTVM({ n: 10 }, 'pmt')).toThrow('Missing inputs');
        });
    });

    describe('solve for FV (future value)', () => {
        it('solves for FV with non-zero rate', () => {
            // N = 10, rate = 5%, PV = -1000, PMT = 0 => FV ≈ 1628.89
            const result = solveTVM(
                { n: 10, rate: 0.05, pv: -1000, pmt: 0 },
                'fv'
            );
            expect(result.solvedFor).toBe('FV');
            expect(result.fv).toBeCloseTo(1628.89, 1);
        });

        it('solves for FV with zero rate', () => {
            // N = 10, rate = 0, PV = -1000, PMT = -100 => FV = 2000
            const result = solveTVM({ n: 10, rate: 0, pv: -1000, pmt: -100 }, 'fv');
            expect(result.fv).toBe(2000);
        });

        it('throws when inputs are missing', () => {
            expect(() => solveTVM({ n: 10, rate: 0.05 }, 'fv')).toThrow(
                'Missing inputs'
            );
        });
    });

    it('throws for invalid solveFor parameter', () => {
        expect(() =>
            solveTVM({ n: 10, rate: 0.05, pv: 1000, pmt: 100, fv: 0 }, 'invalid' as never)
        ).toThrow('Invalid solveFor parameter');
    });
});

describe('compoundInterest', () => {
    it('calculates compound interest correctly', () => {
        // $1000 at 5% annual, compounded monthly for 10 years
        const result = compoundInterest(1000, 0.05, 12, 10);
        expect(result).toBeCloseTo(1647.01, 1);
    });

    it('handles annual compounding', () => {
        // $1000 at 5% annual, compounded annually for 1 year
        const result = compoundInterest(1000, 0.05, 1, 1);
        expect(result).toBe(1050);
    });

    it('handles quarterly compounding', () => {
        // $1000 at 8% annual, compounded quarterly for 2 years
        const result = compoundInterest(1000, 0.08, 4, 2);
        expect(result).toBeCloseTo(1171.66, 1);
    });

    it('handles zero interest rate', () => {
        const result = compoundInterest(1000, 0, 12, 10);
        expect(result).toBe(1000);
    });
});

describe('generateAmortization', () => {
    it('generates correct number of rows', () => {
        const rows = generateAmortization(200000, 0.06, 360);
        expect(rows.length).toBe(360);
    });

    it('calculates correct monthly payment', () => {
        // $200,000 loan at 6% for 30 years (360 months)
        const rows = generateAmortization(200000, 0.06, 360);
        expect(rows[0].payment).toBeCloseTo(1199.1, 1);
    });

    it('starts with correct balance', () => {
        const rows = generateAmortization(100000, 0.05, 12);
        // First payment reduces principal
        expect(rows[0].balance).toBeLessThan(100000);
    });

    it('ends with zero balance', () => {
        const rows = generateAmortization(100000, 0.05, 60);
        expect(rows[rows.length - 1].balance).toBe(0);
    });

    it('principal paid increases over time', () => {
        const rows = generateAmortization(100000, 0.06, 60);
        expect(rows[59].principal).toBeGreaterThan(rows[0].principal);
    });

    it('interest paid decreases over time', () => {
        const rows = generateAmortization(100000, 0.06, 60);
        expect(rows[59].interest).toBeLessThan(rows[0].interest);
    });

    it('handles zero interest rate', () => {
        const rows = generateAmortization(12000, 0, 12);
        expect(rows[0].payment).toBe(1000);
        expect(rows[0].interest).toBe(0);
        expect(rows[0].principal).toBe(1000);
    });

    it('all payments equal (fixed-rate amortization)', () => {
        const rows = generateAmortization(100000, 0.06, 60);
        const firstPayment = rows[0].payment;
        rows.forEach((row) => {
            expect(row.payment).toBeCloseTo(firstPayment, 2);
        });
    });
});
