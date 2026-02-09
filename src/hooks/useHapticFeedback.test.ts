import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHapticFeedback, supportsHapticFeedback } from './useHapticFeedback';

describe('useHapticFeedback', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('when vibration is supported', () => {
        beforeEach(() => {
            Object.defineProperty(navigator, 'vibrate', {
                value: vi.fn(() => true),
                writable: true,
                configurable: true,
            });
        });

        it('vibrate calls navigator.vibrate with pattern', () => {
            const { result } = renderHook(() => useHapticFeedback());

            result.current.vibrate(50);
            expect(navigator.vibrate).toHaveBeenCalledWith(50);
        });

        it('lightTap triggers short vibration', () => {
            const { result } = renderHook(() => useHapticFeedback());

            result.current.lightTap();
            expect(navigator.vibrate).toHaveBeenCalledWith(10);
        });

        it('mediumTap triggers medium vibration', () => {
            const { result } = renderHook(() => useHapticFeedback());

            result.current.mediumTap();
            expect(navigator.vibrate).toHaveBeenCalledWith(20);
        });

        it('heavyTap triggers pattern vibration', () => {
            const { result } = renderHook(() => useHapticFeedback());

            result.current.heavyTap();
            expect(navigator.vibrate).toHaveBeenCalledWith([30, 10, 30]);
        });

        it('success triggers success pattern', () => {
            const { result } = renderHook(() => useHapticFeedback());

            result.current.success();
            expect(navigator.vibrate).toHaveBeenCalledWith([10, 50, 10]);
        });

        it('error triggers error pattern', () => {
            const { result } = renderHook(() => useHapticFeedback());

            result.current.error();
            expect(navigator.vibrate).toHaveBeenCalledWith([50, 30, 50, 30, 50]);
        });
    });

    describe('when vibration is not supported', () => {
        beforeEach(() => {
            // Remove vibrate property
            const nav = navigator as { vibrate?: typeof navigator.vibrate };
            delete nav.vibrate;
        });

        it('vibrate does not throw when vibration not supported', () => {
            const { result } = renderHook(() => useHapticFeedback());

            expect(() => result.current.vibrate(50)).not.toThrow();
        });
    });
});

describe('supportsHapticFeedback', () => {
    it('returns true when vibrate is available', () => {
        Object.defineProperty(navigator, 'vibrate', {
            value: vi.fn(),
            writable: true,
            configurable: true,
        });

        expect(supportsHapticFeedback()).toBe(true);
    });

    it('returns false when vibrate is not available', () => {
        const nav = navigator as { vibrate?: typeof navigator.vibrate };
        delete nav.vibrate;

        expect(supportsHapticFeedback()).toBe(false);
    });
});
