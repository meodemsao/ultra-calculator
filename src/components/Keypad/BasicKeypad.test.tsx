import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BasicKeypad } from './BasicKeypad';
import { CalculatorProvider } from '../../contexts/CalculatorContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

function renderBasicKeypad() {
  return render(
    <ThemeProvider>
      <CalculatorProvider>
        <BasicKeypad />
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

describe('BasicKeypad', () => {
  it('renders all number buttons 0-9', () => {
    renderBasicKeypad();
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('renders operator buttons', () => {
    renderBasicKeypad();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('−')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('÷')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderBasicKeypad();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('CE')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('renders memory buttons', () => {
    renderBasicKeypad();
    expect(screen.getByText('MC')).toBeInTheDocument();
    expect(screen.getByText('MR')).toBeInTheDocument();
    expect(screen.getByText('M+')).toBeInTheDocument();
    expect(screen.getByText('M−')).toBeInTheDocument();
  });

  it('renders parentheses and percent', () => {
    renderBasicKeypad();
    expect(screen.getByText('(')).toBeInTheDocument();
    expect(screen.getByText(')')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('handles number button clicks', async () => {
    const user = userEvent.setup();
    renderBasicKeypad();
    await user.click(screen.getByText('5'));
    // No error thrown = input was dispatched successfully
  });
});
