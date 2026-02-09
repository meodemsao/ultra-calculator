import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'amoled' | 'solarized' | 'high-contrast' | 'retro';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_ORDER: Theme[] = ['light', 'dark', 'amoled', 'solarized', 'high-contrast', 'retro'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('calculator-theme') as Theme;
    if (stored && THEME_ORDER.includes(stored)) {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    THEME_ORDER.forEach(t => {
      root.classList.remove(t);
      root.classList.remove(`theme-${t}`);
    });
    root.classList.remove('dark');

    // Add current theme class
    root.classList.add(`theme-${theme}`);

    // Add 'dark' class for dark-based themes (for Tailwind dark: variants)
    if (['dark', 'amoled', 'solarized', 'high-contrast', 'retro'].includes(theme)) {
      root.classList.add('dark');
    }

    // Set data attribute for CSS
    root.setAttribute('data-theme', theme);

    localStorage.setItem('calculator-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    setThemeState(THEME_ORDER[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
