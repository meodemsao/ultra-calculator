import { useEffect } from 'react';
import { useCalculator } from '../contexts/CalculatorContext';

export function useKeyboard() {
  const {
    input,
    clear,
    backspace,
    evaluate,
    toggleAngleMode,
    memoryRecall,
    memoryAdd,
    memoryClear,
  } = useCalculator();

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

      // Handle Ctrl/Cmd shortcuts first
      if (e.ctrlKey || e.metaKey) {
        switch (key.toLowerCase()) {
          case 'r':
            e.preventDefault();
            memoryRecall();
            return;
          case 'm':
            e.preventDefault();
            memoryAdd();
            return;
          case 'd':
            e.preventDefault();
            toggleAngleMode();
            return;
          case 'l':
            e.preventDefault();
            memoryClear();
            return;
        }
        return;
      }

      // Operators and basic keys
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
        // Scientific function shortcuts
        case 's':
          e.preventDefault();
          input('sin(');
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          input('cos(');
          break;
        case 't':
          e.preventDefault();
          input('tan(');
          break;
        case 'l':
          e.preventDefault();
          input('log(');
          break;
        case 'n':
          e.preventDefault();
          input('ln(');
          break;
        case 'r':
          e.preventDefault();
          input('sqrt(');
          break;
        case 'p':
          e.preventDefault();
          input('pi');
          break;
        case 'e':
          e.preventDefault();
          input('e');
          break;
        case '!':
          e.preventDefault();
          input('!');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, clear, backspace, evaluate, toggleAngleMode, memoryRecall, memoryAdd, memoryClear]);
}

/**
 * Keyboard shortcut reference for help display
 */
export const keyboardShortcuts = [
  { key: '0-9', description: 'Enter digits' },
  { key: '+ - * / ^', description: 'Basic operators' },
  { key: '( )', description: 'Parentheses' },
  { key: 'Enter / =', description: 'Calculate' },
  { key: 'Backspace', description: 'Delete' },
  { key: 'Esc / Del', description: 'Clear' },
  { key: 's/c/t', description: 'sin/cos/tan' },
  { key: 'l/n/r', description: 'log/ln/sqrt' },
  { key: 'p/e', description: 'π / e' },
  { key: 'Ctrl+D', description: 'DEG/RAD' },
  { key: 'Ctrl+M/R/L', description: 'M+/MR/MC' },
];
