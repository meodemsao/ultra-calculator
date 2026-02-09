import { useCallback, useRef, useEffect } from 'react';

/**
 * Hook for haptic feedback on button press (mobile).
 * Uses the Vibration API when available.
 * Falls back to audio click for iOS and other unsupported devices.
 */
export function useHapticFeedback() {
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize AudioContext on first user interaction
    useEffect(() => {
        const initAudio = () => {
            if (!audioContextRef.current && typeof AudioContext !== 'undefined') {
                audioContextRef.current = new AudioContext();
            }
        };

        // Initialize on first touch/click
        document.addEventListener('touchstart', initAudio, { once: true });
        document.addEventListener('click', initAudio, { once: true });

        return () => {
            document.removeEventListener('touchstart', initAudio);
            document.removeEventListener('click', initAudio);
        };
    }, []);

    // Play a short click sound as fallback for iOS
    const playClickSound = useCallback((frequency = 1000, duration = 10) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;

        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            // Very short, quiet click
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration / 1000);
        } catch {
            // Ignore audio errors
        }
    }, []);

    const vibrate = useCallback((pattern: number | number[] = 10) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        } else {
            // Fallback: play a subtle click sound for iOS
            const duration = Array.isArray(pattern) ? pattern[0] : pattern;
            playClickSound(1200, duration);
        }
    }, [playClickSound]);

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

/**
 * Check if the device is iOS
 */
export function isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
