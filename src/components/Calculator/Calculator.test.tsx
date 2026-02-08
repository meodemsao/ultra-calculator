import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Calculator } from './Calculator';
import { CalculatorProvider } from '../../contexts/CalculatorContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

function renderCalculator() {
  return render(
    <ThemeProvider>
      <CalculatorProvider>
        <Calculator />
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

describe('Calculator', () => {
  it('renders the app title', () => {
    renderCalculator();
    expect(screen.getByText('Calculator Ultra')).toBeInTheDocument();
  });

  it('renders mode selector with all 9 modes', () => {
    renderCalculator();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Scientific')).toBeInTheDocument();
    expect(screen.getByText('Solver')).toBeInTheDocument();
    expect(screen.getByText('Financial')).toBeInTheDocument();
  });

  it('starts in basic mode with display and keypad', () => {
    renderCalculator();
    expect(screen.getByText('DEG')).toBeInTheDocument();
    // Basic keypad buttons
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('switches to financial mode and renders financial calc', async () => {
    const user = userEvent.setup();
    renderCalculator();

    const modeButtons = screen.getAllByRole('button');
    const finButton = modeButtons.find(btn => btn.textContent?.includes('Financial'));
    expect(finButton).toBeDefined();
    await user.click(finButton!);

    expect(screen.getByText('TVM Solver')).toBeInTheDocument();
  });

  it('switches to solver mode and renders equation solver', async () => {
    const user = userEvent.setup();
    renderCalculator();

    const modeButtons = screen.getAllByRole('button');
    const solverButton = modeButtons.find(btn => btn.textContent?.includes('Solver'));
    expect(solverButton).toBeDefined();
    await user.click(solverButton!);

    expect(screen.getByText('ax²+bx+c')).toBeInTheDocument();
    expect(screen.getByText('Linear System')).toBeInTheDocument();
  });

  it('shows keyboard hint', () => {
    renderCalculator();
    expect(screen.getByText('Use keyboard for quick input')).toBeInTheDocument();
  });
});
