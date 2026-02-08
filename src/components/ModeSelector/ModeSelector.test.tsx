import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModeSelector } from './ModeSelector';

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe('ModeSelector', () => {
  it('renders all 9 mode buttons', () => {
    render(<ModeSelector mode="basic" onModeChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(9);
  });

  it('renders mode labels', () => {
    render(<ModeSelector mode="basic" onModeChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    const labels = buttons.map(btn => btn.textContent);
    expect(labels).toContain('Basic');
    expect(labels).toContain('Scientific');
    expect(labels).toContain('Advanced');
    expect(labels).toContain('Units');
    expect(labels).toContain('Solver');
    expect(labels).toContain('Graph');
    expect(labels).toContain('Stats');
    expect(labels).toContain('Programmer');
    expect(labels).toContain('Financial');
  });

  it('calls onModeChange when a mode button is clicked', () => {
    const onModeChange = vi.fn();
    render(<ModeSelector mode="basic" onModeChange={onModeChange} />);

    const buttons = screen.getAllByRole('button');
    // Scientific is the second button (index 1)
    fireEvent.click(buttons[1]);
    expect(onModeChange).toHaveBeenCalledWith('scientific');
  });

  it('calls onModeChange for new modes', () => {
    const onModeChange = vi.fn();
    render(<ModeSelector mode="basic" onModeChange={onModeChange} />);

    const buttons = screen.getAllByRole('button');
    // Solver is at index 4
    fireEvent.click(buttons[4]);
    expect(onModeChange).toHaveBeenCalledWith('solver');

    // Programmer is at index 7
    fireEvent.click(buttons[7]);
    expect(onModeChange).toHaveBeenCalledWith('programming');
  });
});
