import { useState } from 'react';
import { X } from 'lucide-react';

interface Constant {
  name: string;
  symbol: string;
  value: string;
  unit: string;
}

interface ConstantCategory {
  name: string;
  constants: Constant[];
}

const categories: ConstantCategory[] = [
  {
    name: 'Physics',
    constants: [
      { name: 'Speed of light', symbol: 'c', value: '299792458', unit: 'm/s' },
      { name: 'Gravitational constant', symbol: 'G', value: '6.67430e-11', unit: 'm³/(kg·s²)' },
      { name: 'Planck constant', symbol: 'h', value: '6.62607e-34', unit: 'J·s' },
      { name: 'Boltzmann constant', symbol: 'k', value: '1.38065e-23', unit: 'J/K' },
      { name: 'Elementary charge', symbol: 'e₀', value: '1.60218e-19', unit: 'C' },
      { name: 'Electron mass', symbol: 'mₑ', value: '9.10938e-31', unit: 'kg' },
      { name: 'Proton mass', symbol: 'mₚ', value: '1.67262e-27', unit: 'kg' },
      { name: 'Stefan-Boltzmann', symbol: 'σ', value: '5.67037e-8', unit: 'W/(m²·K⁴)' },
      { name: 'Vacuum permittivity', symbol: 'ε₀', value: '8.85419e-12', unit: 'F/m' },
      { name: 'Vacuum permeability', symbol: 'μ₀', value: '1.25664e-6', unit: 'H/m' },
    ],
  },
  {
    name: 'Chemistry',
    constants: [
      { name: 'Avogadro number', symbol: 'Nₐ', value: '6.02214e23', unit: '1/mol' },
      { name: 'Gas constant', symbol: 'R', value: '8.31446', unit: 'J/(mol·K)' },
      { name: 'Faraday constant', symbol: 'F', value: '96485.3', unit: 'C/mol' },
      { name: 'Atomic mass unit', symbol: 'u', value: '1.66054e-27', unit: 'kg' },
      { name: 'Bohr radius', symbol: 'a₀', value: '5.29177e-11', unit: 'm' },
      { name: 'Rydberg constant', symbol: 'R∞', value: '1.09737e7', unit: '1/m' },
    ],
  },
  {
    name: 'Math',
    constants: [
      { name: 'Pi', symbol: 'π', value: '3.14159265358979', unit: '' },
      { name: 'Euler number', symbol: 'e', value: '2.71828182845905', unit: '' },
      { name: 'Golden ratio', symbol: 'φ', value: '1.61803398874989', unit: '' },
      { name: 'Square root of 2', symbol: '√2', value: '1.41421356237310', unit: '' },
      { name: 'Natural log of 2', symbol: 'ln2', value: '0.69314718055995', unit: '' },
    ],
  },
];

interface ConstantsLibraryProps {
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function ConstantsLibrary({ onSelect, onClose }: ConstantsLibraryProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Constants</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeCategory === i
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Constants list */}
        <div className="overflow-y-auto p-2">
          {categories[activeCategory].constants.map((c) => (
            <button
              key={c.symbol}
              onClick={() => onSelect(c.value)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {c.symbol}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {c.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
                    {c.value}
                  </span>
                  {c.unit && (
                    <span className="ml-1 text-xs text-gray-400">{c.unit}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
