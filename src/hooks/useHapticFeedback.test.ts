import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHapticFeedback, supportsHapticFeedback, isIOS } from './useHapticFeedback';

describe('useHapticFeedback', () => {
    const originalNavigator = global.navigator;
    const originalAudioContext = global.AudioContext;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            writable: true,
        });
        global.AudioContext = originalAudioContext;
    });

    describe('when vibration is supported', () => {
        beforeEach(() => {
            Object.defineProperty(global, 'navigator', {
                value: {
                    ...originalNavigator,
                    vibrate: vi.fn(() => true),
                    userAgent: 'Android',
                },
                writable: true,
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
            Object.defineProperty(global, 'navigator', {
                value: {
                    ...originalNavigator,
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
                },
                writable: true,
            });
            // Mock AudioContext
            global.AudioContext = vi.fn().mockImplementation(() => ({
                createOscillator: vi.fn(() => ({
                    connect: vi.fn(),
                    frequency: { value: 0 },
                    type: 'sine',
                    start: vi.fn(),
                    stop: vi.fn(),
                })),
                createGain: vi.fn(() => ({
                    connect: vi.fn(),
                    gain: {
                        setValueAtTime: vi.fn(),
                        exponentialRampToValueAtTime: vi.fn(),
                    },
                })),
                destination: {},
                currentTime: 0,
            })) as unknown as typeof AudioContext;
        });

        it('vibrate does not throw when vibration not supported', () => {
            const { result } = renderHook(() => useHapticFeedback());
            expect(() => result.current.vibrate(10)).not.toThrow();
        });

        it('lightTap does not throw when vibration not supported', () => {
            const { result } = renderHook(() => useHapticFeedback());
            expect(() => result.current.lightTap()).not.toThrow();
        });
    });
});

describe('supportsHapticFeedback', () => {
    it('returns true when vibrate is available', () => {
        Object.defineProperty(global, 'navigator', {
            value: { vibrate: vi.fn() },
            writable: true,
        });
        expect(supportsHapticFeedback()).toBe(true);
    });

    it('returns false when vibrate is not available', () => {
        Object.defineProperty(global, 'navigator', {
            value: {},
            writable: true,
        });
        expect(supportsHapticFeedback()).toBe(false);
    });
});

describe('isIOS', () => {
    it('returns true for iPhone user agent', () => {
        Object.defineProperty(global, 'navigator', {
            value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)' },
            writable: true,
        });
        expect(isIOS()).toBe(true);
    });

    it('returns true for iPad user agent', () => {
        Object.defineProperty(global, 'navigator', {
            value: { userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)' },
            writable: true,
        });
        expect(isIOS()).toBe(true);
    });

    it('returns false for Android user agent', () => {
        Object.defineProperty(global, 'navigator', {
            value: { userAgent: 'Mozilla/5.0 (Linux; Android 11)' },
            writable: true,
        });
        expect(isIOS()).toBe(false);
    });
});
