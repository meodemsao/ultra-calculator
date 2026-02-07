import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'function' | 'action' | 'equal' | 'memory';
  className?: string;
  active?: boolean;
}

export function Button({ label, onClick, variant = 'number', className, active }: ButtonProps) {
  const baseStyles = 'btn-press font-medium rounded-xl text-lg flex items-center justify-center transition-all duration-150 select-none';

  const variantStyles = {
    number: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm',
    operator: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 shadow-sm',
    function: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800/50 shadow-sm',
    action: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 shadow-sm',
    equal: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md',
    memory: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/30 text-sm shadow-sm',
  };

  const activeStyles = active ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(clsx(baseStyles, variantStyles[variant], activeStyles, className))}
    >
      {label}
    </button>
  );
}
