import { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  scrollable?: boolean;
  children: ReactNode;
}

export function ModalShell({ isOpen, onClose, title, scrollable, children }: ModalShellProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`w-full max-w-md bg-surface-pri rounded-2xl p-6 shadow-xl ${
            scrollable ? 'max-h-[80vh] overflow-y-auto' : ''
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-content-pri">
              {title}
            </Dialog.Title>
            <button onClick={onClose} className="text-content-muted hover:text-content-sec">
              <X size={20} />
            </button>
          </div>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
