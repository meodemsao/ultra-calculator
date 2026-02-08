import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Display } from './Display';
import { CalculatorProvider } from '../../contexts/CalculatorContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

function renderDisplay() {
  return render(
    <ThemeProvider>
      <CalculatorProvider>
        <Display />
      </CalculatorProvider>
    </ThemeProvider>
  );
}

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe('Display', () => {
  it('renders with default "0" result', () => {
    renderDisplay();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays DEG angle mode by default', () => {
    renderDisplay();
    expect(screen.getByText('DEG')).toBeInTheDocument();
  });

  it('does not show memory indicator when memory is 0', () => {
    renderDisplay();
    expect(screen.queryByText('M')).not.toBeInTheDocument();
  });
});
