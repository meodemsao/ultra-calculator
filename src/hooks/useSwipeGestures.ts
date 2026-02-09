import { useEffect, useRef, useCallback } from 'react';

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
}

interface SwipeOptions {
    threshold?: number; // minimum distance for swipe
    velocity?: number; // minimum velocity for swipe
}

/**
 * Hook for detecting swipe gestures on mobile devices.
 * Useful for mode switching in the calculator.
 */
export function useSwipeGestures(
    handlers: SwipeHandlers,
    options: SwipeOptions = {}
) {
    const { threshold = 50, velocity = 0.3 } = options;

    const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
    const elementRef = useRef<HTMLElement | null>(null);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        const touch = e.touches[0];
        touchStart.current = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
        };
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!touchStart.current) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.current.x;
        const deltaY = touch.clientY - touchStart.current.y;
        const deltaTime = Date.now() - touchStart.current.time;

        const velocityX = Math.abs(deltaX) / deltaTime;
        const velocityY = Math.abs(deltaY) / deltaTime;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Determine if swipe was primarily horizontal or vertical
        if (absX > absY && absX > threshold && velocityX > velocity) {
            // Horizontal swipe
            if (deltaX > 0) {
                handlers.onSwipeRight?.();
            } else {
                handlers.onSwipeLeft?.();
            }
        } else if (absY > absX && absY > threshold && velocityY > velocity) {
            // Vertical swipe
            if (deltaY > 0) {
                handlers.onSwipeDown?.();
            } else {
                handlers.onSwipeUp?.();
            }
        }

        touchStart.current = null;
    }, [handlers, threshold, velocity]);

    const setRef = useCallback((element: HTMLElement | null) => {
        // Remove listeners from old element
        if (elementRef.current) {
            elementRef.current.removeEventListener('touchstart', handleTouchStart);
            elementRef.current.removeEventListener('touchend', handleTouchEnd);
        }

        // Add listeners to new element
        if (element) {
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
            element.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        elementRef.current = element;
    }, [handleTouchStart, handleTouchEnd]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (elementRef.current) {
                elementRef.current.removeEventListener('touchstart', handleTouchStart);
                elementRef.current.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [handleTouchStart, handleTouchEnd]);

    return { ref: setRef };
}

/**
 * Mode navigation helper for swipe gestures
 */
export const CALCULATOR_MODES = [
    'basic',
    'scientific',
    'advanced',
    'units',
    'solver',
    'graph',
    'stats',
    'programming',
    'financial',
] as const;

export function getNextMode(currentMode: string, direction: 'left' | 'right'): string {
    const currentIndex = CALCULATOR_MODES.indexOf(currentMode as typeof CALCULATOR_MODES[number]);
    if (currentIndex === -1) return currentMode;

    if (direction === 'left') {
        // Swipe left = next mode
        const nextIndex = (currentIndex + 1) % CALCULATOR_MODES.length;
        return CALCULATOR_MODES[nextIndex];
    } else {
        // Swipe right = previous mode
        const prevIndex = (currentIndex - 1 + CALCULATOR_MODES.length) % CALCULATOR_MODES.length;
        return CALCULATOR_MODES[prevIndex];
    }
}
