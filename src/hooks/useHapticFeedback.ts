import { useCallback } from 'react';

/**
 * Hook for haptic feedback on button press (mobile).
 * Uses the Vibration API when available.
 */
export function useHapticFeedback() {
    const vibrate = useCallback((pattern: number | number[] = 10) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }, []);

    const lightTap = useCallback(() => vibrate(10), [vibrate]);
    const mediumTap = useCallback(() => vibrate(20), [vibrate]);
    const heavyTap = useCallback(() => vibrate([30, 10, 30]), [vibrate]);
    const success = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
    const error = useCallback(() => vibrate([50, 30, 50, 30, 50]), [vibrate]);

    return {
        vibrate,
        lightTap,
        mediumTap,
        heavyTap,
        success,
        error,
    };
}

/**
 * Check if the device supports vibration
 */
export function supportsHapticFeedback(): boolean {
    return 'vibrate' in navigator;
}
