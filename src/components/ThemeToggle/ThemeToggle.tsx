import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Palette, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { ThemeSelector } from '../ThemeSelector/ThemeSelector';

export function ThemeToggle() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl transition-colors"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)',
        }}
        aria-label={`Current theme: ${theme}. Click to open theme selector.`}
      >
        <Palette size={20} />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="flex justify-between items-center px-4 pt-4">
              <Dialog.Title
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Appearance
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Close theme selector"
              >
                <X size={20} />
              </button>
            </div>
            <ThemeSelector />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
