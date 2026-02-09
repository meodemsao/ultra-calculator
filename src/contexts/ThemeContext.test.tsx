import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme, Theme } from './ThemeContext';
import { ReactNode } from 'react';

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
            matches,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
};

describe('ThemeContext', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
    );

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        mockMatchMedia(false); // Default to light mode
    });

    afterEach(() => {
        document.documentElement.className = '';
        document.documentElement.removeAttribute('data-theme');
    });

    describe('ThemeProvider', () => {
        it('initializes with light theme by default', () => {
            const { result } = renderHook(() => useTheme(), { wrapper });
            expect(result.current.theme).toBe('light');
        });

        it('initializes with dark theme when system prefers dark', () => {
            mockMatchMedia(true); // System prefers dark
            const { result } = renderHook(() => useTheme(), { wrapper });
            expect(result.current.theme).toBe('dark');
        });

        it('loads theme from localStorage', () => {
            localStorage.setItem('calculator-theme', 'amoled');
            const { result } = renderHook(() => useTheme(), { wrapper });
            expect(result.current.theme).toBe('amoled');
        });

        it('ignores invalid theme from localStorage', () => {
            localStorage.setItem('calculator-theme', 'invalid-theme');
            mockMatchMedia(false); // Ensure light is default
            const { result } = renderHook(() => useTheme(), { wrapper });
            expect(result.current.theme).toBe('light');
        });
    });

    describe('setTheme', () => {
        it('changes theme', () => {
            const { result } = renderHook(() => useTheme(), { wrapper });

            act(() => {
                result.current.setTheme('dark');
            });

            expect(result.current.theme).toBe('dark');
        });

        it('saves theme to localStorage', () => {
            const { result } = renderHook(() => useTheme(), { wrapper });

            act(() => {
                result.current.setTheme('solarized');
            });

            expect(localStorage.getItem('calculator-theme')).toBe('solarized');
        });

        it('adds theme class to document', () => {
            const { result } = renderHook(() => useTheme(), { wrapper });

            act(() => {
                result.current.setTheme('high-contrast');
            });

            expect(document.documentElement.classList.contains('theme-high-contrast')).toBe(true);
        });

        it('adds dark class for dark-based themes', () => {
            const { result } = renderHook(() => useTheme(), { wrapper });

            act(() => {
                result.current.setTheme('amoled');
            });

            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('removes dark class for light theme', () => {
            const { result } = renderHook(() => useTheme(), { wrapper });

            act(() => {
                result.current.setTheme('dark');
            });
            expect(document.documentElement.classList.contains('dark')).toBe(true);

            act(() => {
                result.current.setTheme('light');
            });
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });

        it('sets data-theme attribute', () => {
            const { result } = renderHook(() => useTheme(), { wrapper });

            act(() => {
                result.current.setTheme('retro');
            });

            expect(document.documentElement.getAttribute('data-theme')).toBe('retro');
        });
    });

    describe('toggleTheme', () => {
        it('cycles through themes in order', () => {
            mockMatchMedia(false); // Start with light
            const { result } = renderHook(() => useTheme(), { wrapper });
            const themes: Theme[] = ['light', 'dark', 'amoled', 'solarized', 'high-contrast', 'retro'];

            expect(result.current.theme).toBe('light');

            themes.forEach((expectedTheme, index) => {
                if (index > 0) {
                    act(() => {
                        result.current.toggleTheme();
                    });
                    expect(result.current.theme).toBe(expectedTheme);
                }
            });

            // Should cycle back to light
            act(() => {
                result.current.toggleTheme();
            });
            expect(result.current.theme).toBe('light');
        });
    });

    describe('useTheme hook', () => {
        it('throws error when used outside ThemeProvider', () => {
            expect(() => {
                renderHook(() => useTheme());
            }).toThrow('useTheme must be used within a ThemeProvider');
        });
    });
});
