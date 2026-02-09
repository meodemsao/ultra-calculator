import { describe, it, expect } from 'vitest';
import { keyboardShortcuts } from './useKeyboard';

describe('useKeyboard', () => {
    describe('keyboardShortcuts', () => {
        it('contains basic number shortcuts', () => {
            const shortcut = keyboardShortcuts.find(s => s.key === '0-9');
            expect(shortcut).toBeDefined();
            expect(shortcut?.description).toBe('Enter digits');
        });

        it('contains operator shortcuts', () => {
            const shortcut = keyboardShortcuts.find(s => s.key.includes('+'));
            expect(shortcut).toBeDefined();
            expect(shortcut?.description).toBe('Basic operators');
        });

        it('contains parentheses shortcuts', () => {
            const shortcut = keyboardShortcuts.find(s => s.key === '( )');
            expect(shortcut).toBeDefined();
            expect(shortcut?.description).toBe('Parentheses');
        });

        it('contains enter/equals shortcut', () => {
            const shortcut = keyboardShortcuts.find(s => s.key.includes('Enter'));
            expect(shortcut).toBeDefined();
            expect(shortcut?.description).toBe('Calculate');
        });

        it('contains backspace shortcut', () => {
            const shortcut = keyboardShortcuts.find(s => s.key === 'Backspace');
            expect(shortcut).toBeDefined();
            expect(shortcut?.description).toBe('Delete');
        });

        it('contains clear shortcut', () => {
            const shortcut = keyboardShortcuts.find(s => s.key.includes('Esc'));
            expect(shortcut).toBeDefined();
            expect(shortcut?.description).toBe('Clear');
        });

        it('contains scientific function shortcuts', () => {
            const sinShortcut = keyboardShortcuts.find(s => s.description.includes('sin'));
            expect(sinShortcut).toBeDefined();

            const logShortcut = keyboardShortcuts.find(s => s.description.includes('log'));
            expect(logShortcut).toBeDefined();
        });

        it('contains constant shortcuts', () => {
            const shortcut = keyboardShortcuts.find(s => s.description.includes('π'));
            expect(shortcut).toBeDefined();
        });

        it('contains memory shortcuts', () => {
            const shortcut = keyboardShortcuts.find(s => s.key.includes('Ctrl+M'));
            expect(shortcut).toBeDefined();
        });

        it('contains angle mode toggle shortcut', () => {
            const shortcut = keyboardShortcuts.find(s => s.key === 'Ctrl+D');
            expect(shortcut).toBeDefined();
            expect(shortcut?.description).toBe('DEG/RAD');
        });

        it('has the expected number of shortcuts', () => {
            expect(keyboardShortcuts.length).toBeGreaterThanOrEqual(10);
        });

        it('all shortcuts have key and description', () => {
            keyboardShortcuts.forEach(shortcut => {
                expect(shortcut.key).toBeDefined();
                expect(shortcut.key.length).toBeGreaterThan(0);
                expect(shortcut.description).toBeDefined();
                expect(shortcut.description.length).toBeGreaterThan(0);
            });
        });
    });
});
