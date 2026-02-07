import { useState } from 'react';
import { Button } from './Button';
import { advancedButtons } from '../../constants/buttons';
import { Dialog } from '@headlessui/react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { computeDerivative } from '../../utils/derivatives';
import { computeIntegral } from '../../utils/integrals';
import { MatrixInput } from '../MatrixInput/MatrixInput';
import { X } from 'lucide-react';

type ModalType = 'derivative' | 'integral' | 'matrix' | 'complex' | null;

export function AdvancedKeypad() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const { setExpression, state } = useCalculator();

  // Derivative state
  const [derivativeExpr, setDerivativeExpr] = useState('x^2');
  const [derivativeVar, setDerivativeVar] = useState('x');
  const [derivativeResult, setDerivativeResult] = useState('');

  // Integral state
  const [integralExpr, setIntegralExpr] = useState('x^2');
  const [integralVar, setIntegralVar] = useState('x');
  const [integralLower, setIntegralLower] = useState('0');
  const [integralUpper, setIntegralUpper] = useState('1');
  const [integralResult, setIntegralResult] = useState('');

  // Complex number state
  const [complexReal, setComplexReal] = useState('3');
  const [complexImag, setComplexImag] = useState('4');

  const handleButtonClick = (value: string) => {
    setModalType(value as ModalType);
  };

  const handleDerivative = () => {
    try {
      const result = computeDerivative(derivativeExpr, derivativeVar);
      setDerivativeResult(result);
    } catch (error) {
      setDerivativeResult(error instanceof Error ? error.message : 'Error');
    }
  };

  const handleIntegral = () => {
    try {
      const result = computeIntegral(
        integralExpr,
        integralVar,
        parseFloat(integralLower),
        parseFloat(integralUpper)
      );
      setIntegralResult(result.toFixed(10));
    } catch (error) {
      setIntegralResult(error instanceof Error ? error.message : 'Error');
    }
  };

  const insertComplex = () => {
    const complex = `(${complexReal}+${complexImag}i)`;
    setExpression(state.expression + complex);
    setModalType(null);
  };

  const closeModal = () => setModalType(null);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {advancedButtons.map((btn) => (
          <Button
            key={btn.value}
            label={btn.label}
            variant="function"
            onClick={() => handleButtonClick(btn.value)}
            className="h-12 text-sm"
          />
        ))}
      </div>

      {/* Derivative Modal */}
      <Dialog open={modalType === 'derivative'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Derivative
              </Dialog.Title>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expression f(x)
                </label>
                <input
                  type="text"
                  value={derivativeExpr}
                  onChange={(e) => setDerivativeExpr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., x^2 + 2*x"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Variable
                </label>
                <input
                  type="text"
                  value={derivativeVar}
                  onChange={(e) => setDerivativeVar(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="x"
                />
              </div>
              <button
                onClick={handleDerivative}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Compute Derivative
              </button>
              {derivativeResult && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Result: </span>
                  <span className="font-mono text-gray-900 dark:text-white">{derivativeResult}</span>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Integral Modal */}
      <Dialog open={modalType === 'integral'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Definite Integral (Simpson's Rule)
              </Dialog.Title>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expression f(x)
                </label>
                <input
                  type="text"
                  value={integralExpr}
                  onChange={(e) => setIntegralExpr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., x^2"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Variable
                  </label>
                  <input
                    type="text"
                    value={integralVar}
                    onChange={(e) => setIntegralVar(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lower
                  </label>
                  <input
                    type="text"
                    value={integralLower}
                    onChange={(e) => setIntegralLower(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upper
                  </label>
                  <input
                    type="text"
                    value={integralUpper}
                    onChange={(e) => setIntegralUpper(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleIntegral}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Compute Integral
              </button>
              {integralResult && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Result: </span>
                  <span className="font-mono text-gray-900 dark:text-white">{integralResult}</span>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Matrix Modal */}
      <Dialog open={modalType === 'matrix'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Matrix Operations
              </Dialog.Title>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <MatrixInput onClose={closeModal} />
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Complex Number Modal */}
      <Dialog open={modalType === 'complex'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Complex Number (a + bi)
              </Dialog.Title>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Real part (a)
                  </label>
                  <input
                    type="text"
                    value={complexReal}
                    onChange={(e) => setComplexReal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Imaginary part (b)
                  </label>
                  <input
                    type="text"
                    value={complexImag}
                    onChange={(e) => setComplexImag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <span className="font-mono text-lg text-gray-900 dark:text-white">
                  {complexReal} + {complexImag}i
                </span>
              </div>
              <button
                onClick={insertComplex}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Insert into Expression
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
