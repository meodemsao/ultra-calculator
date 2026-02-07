import { useState, useMemo } from 'react';
import { unitCategories } from '../../constants/units';
import { convertUnit, formatConvertedValue } from '../../utils/unitConversions';
import { ArrowRightLeft } from 'lucide-react';

export function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState(unitCategories[0].name);
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(unitCategories[0].units[0].symbol);
  const [toUnit, setToUnit] = useState(unitCategories[0].units[1].symbol);

  const category = useMemo(
    () => unitCategories.find((c) => c.name === selectedCategory) || unitCategories[0],
    [selectedCategory]
  );

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    try {
      const converted = convertUnit(value, fromUnit, toUnit, selectedCategory);
      return formatConvertedValue(converted);
    } catch {
      return 'Error';
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const newCategory = unitCategories.find((c) => c.name === categoryName);
    if (newCategory && newCategory.units.length >= 2) {
      setFromUnit(newCategory.units[0].symbol);
      setToUnit(newCategory.units[1].symbol);
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {unitCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.name
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Input value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Value
        </label>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-4 py-3 text-xl border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          placeholder="Enter value"
        />
      </div>

      {/* From/To units */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {category.units.map((unit) => (
              <option key={unit.symbol} value={unit.symbol}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swapUnits}
          className="mt-6 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowRightLeft size={20} />
        </button>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {category.units.map((unit) => (
              <option key={unit.symbol} value={unit.symbol}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
          {result || '0'} <span className="text-lg font-normal text-gray-600 dark:text-gray-400">{toUnit}</span>
        </div>
      </div>
    </div>
  );
}
