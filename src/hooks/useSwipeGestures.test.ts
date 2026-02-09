import { describe, it, expect } from 'vitest';
import { getNextMode, CALCULATOR_MODES } from './useSwipeGestures';

describe('useSwipeGestures', () => {
    describe('CALCULATOR_MODES', () => {
        it('contains all expected modes', () => {
            expect(CALCULATOR_MODES).toContain('basic');
            expect(CALCULATOR_MODES).toContain('scientific');
            expect(CALCULATOR_MODES).toContain('advanced');
            expect(CALCULATOR_MODES).toContain('units');
            expect(CALCULATOR_MODES).toContain('solver');
            expect(CALCULATOR_MODES).toContain('graph');
            expect(CALCULATOR_MODES).toContain('stats');
            expect(CALCULATOR_MODES).toContain('programming');
            expect(CALCULATOR_MODES).toContain('financial');
        });

        it('has correct number of modes', () => {
            expect(CALCULATOR_MODES.length).toBe(9);
        });
    });

    describe('getNextMode', () => {
        it('returns next mode when swiping left from basic', () => {
            expect(getNextMode('basic', 'left')).toBe('scientific');
        });

        it('returns previous mode when swiping right from scientific', () => {
            expect(getNextMode('scientific', 'right')).toBe('basic');
        });

        it('wraps around to first mode when swiping left from last mode', () => {
            expect(getNextMode('financial', 'left')).toBe('basic');
        });

        it('wraps around to last mode when swiping right from first mode', () => {
            expect(getNextMode('basic', 'right')).toBe('financial');
        });

        it('returns next mode correctly in middle of list', () => {
            expect(getNextMode('solver', 'left')).toBe('graph');
            expect(getNextMode('graph', 'right')).toBe('solver');
        });

        it('returns same mode for unknown mode', () => {
            expect(getNextMode('unknown', 'left')).toBe('unknown');
            expect(getNextMode('nonexistent', 'right')).toBe('nonexistent');
        });

        it('handles all modes correctly for left swipe', () => {
            const modeSequence = [
                'basic', 'scientific', 'advanced', 'units', 'solver',
                'graph', 'stats', 'programming', 'financial', 'basic'
            ];
            for (let i = 0; i < modeSequence.length - 1; i++) {
                expect(getNextMode(modeSequence[i], 'left')).toBe(modeSequence[i + 1]);
            }
        });

        it('handles all modes correctly for right swipe', () => {
            const modeSequence = [
                'financial', 'programming', 'stats', 'graph', 'solver',
                'units', 'advanced', 'scientific', 'basic', 'financial'
            ];
            for (let i = 0; i < modeSequence.length - 1; i++) {
                expect(getNextMode(modeSequence[i], 'right')).toBe(modeSequence[i + 1]);
            }
        });
    });
});
