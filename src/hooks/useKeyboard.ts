import { useEffect } from 'react';
import { useCalculator } from '../contexts/CalculatorContext';

export function useKeyboard() {
  const { input, clear, backspace, evaluate } = useCalculator();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;

      // Numbers
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        input(key);
        return;
      }

      // Operators
      switch (key) {
        case '+':
          e.preventDefault();
          input('+');
          break;
        case '-':
          e.preventDefault();
          input('-');
          break;
        case '*':
          e.preventDefault();
          input('*');
          break;
        case '/':
          e.preventDefault();
          input('/');
          break;
        case '%':
          e.preventDefault();
          input('%');
          break;
        case '^':
          e.preventDefault();
          input('^');
          break;
        case '(':
          e.preventDefault();
          input('(');
          break;
        case ')':
          e.preventDefault();
          input(')');
          break;
        case '.':
        case ',':
          e.preventDefault();
          input('.');
          break;
        case 'Enter':
        case '=':
          e.preventDefault();
          evaluate();
          break;
        case 'Backspace':
          e.preventDefault();
          backspace();
          break;
        case 'Escape':
        case 'Delete':
          e.preventDefault();
          clear();
          break;
        case 'c':
        case 'C':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            clear();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, clear, backspace, evaluate]);
}
