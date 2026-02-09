import { useState, useEffect } from 'react';
import { Button } from './Button';
import { advancedButtons } from '../../constants/buttons';
import { Dialog } from '@headlessui/react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { computeDerivative } from '../../utils/derivatives';
import { computeIntegral, computeSymbolicIntegral } from '../../utils/integrals';
import { MatrixInput } from '../MatrixInput/MatrixInput';
import { X, Trash2 } from 'lucide-react';
import { dotProduct, crossProduct, magnitude, angleBetween, parseVector, formatVector, Vector3D } from '../../utils/vectors';
import { computeLimit, formatLimitResult, LimitApproach } from '../../utils/limits';
import { computeTaylorSeries } from '../../utils/taylorSeries';
import { loadUserFunctions, addUserFunction, removeUserFunction, parseVariables, formatUserFunction, UserFunction } from '../../utils/userFunctions';

type ModalType = 'derivative' | 'integral' | 'matrix' | 'complex' | 'vectors' | 'limits' | 'taylor' | 'userfunc' | null;

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
  const [symbolicIntegral, setSymbolicIntegral] = useState<string | null>(null);

  // Complex number state
  const [complexReal, setComplexReal] = useState('3');
  const [complexImag, setComplexImag] = useState('4');

  // Vectors state
  const [vectorA, setVectorA] = useState('1, 2, 3');
  const [vectorB, setVectorB] = useState('4, 5, 6');
  const [vectorResult, setVectorResult] = useState('');

  // Limits state
  const [limitExpr, setLimitExpr] = useState('sin(x)/x');
  const [limitVar, setLimitVar] = useState('x');
  const [limitApproach, setLimitApproach] = useState('0');
  const [limitDirection, setLimitDirection] = useState<LimitApproach>('both');
  const [limitResult, setLimitResult] = useState('');

  // Taylor series state
  const [taylorExpr, setTaylorExpr] = useState('sin(x)');
  const [taylorVar, setTaylorVar] = useState('x');
  const [taylorCenter, setTaylorCenter] = useState('0');
  const [taylorOrder, setTaylorOrder] = useState('5');
  const [taylorResult, setTaylorResult] = useState('');

  // User functions state
  const [userFunctions, setUserFunctions] = useState<UserFunction[]>([]);
  const [userFuncDef, setUserFuncDef] = useState('myFunc(x)');
  const [userFuncExpr, setUserFuncExpr] = useState('x^2 + 1');
  const [userFuncError, setUserFuncError] = useState('');

  // Load user functions on mount
  useEffect(() => {
    setUserFunctions(loadUserFunctions());
  }, []);

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
      // Compute symbolic integral
      const symbolic = computeSymbolicIntegral(integralExpr, integralVar);
      setSymbolicIntegral(symbolic);

      // Compute numerical integral
      const result = computeIntegral(
        integralExpr,
        integralVar,
        parseFloat(integralLower),
        parseFloat(integralUpper)
      );
      setIntegralResult(result.toFixed(10));
    } catch (error) {
      setIntegralResult(error instanceof Error ? error.message : 'Error');
      setSymbolicIntegral(null);
    }
  };

  const insertComplex = () => {
    const complex = `(${complexReal}+${complexImag}i)`;
    setExpression(state.expression + complex);
    setModalType(null);
  };

  const handleVectorOperation = (operation: string) => {
    try {
      const a = parseVector(vectorA);
      const b = parseVector(vectorB);
      let result: string;

      switch (operation) {
        case 'dot':
          result = `Dot product: ${dotProduct(a, b)}`;
          break;
        case 'cross':
          if (a.length !== 3 || b.length !== 3) {
            throw new Error('Cross product requires 3D vectors');
          }
          result = `Cross product: ${formatVector(crossProduct(a as Vector3D, b as Vector3D))}`;
          break;
        case 'magnitudeA':
          result = `|A| = ${magnitude(a).toFixed(6)}`;
          break;
        case 'magnitudeB':
          result = `|B| = ${magnitude(b).toFixed(6)}`;
          break;
        case 'angle':
          const rad = angleBetween(a, b);
          const deg = (rad * 180) / Math.PI;
          result = `Angle: ${rad.toFixed(6)} rad (${deg.toFixed(2)}°)`;
          break;
        default:
          result = 'Unknown operation';
      }
      setVectorResult(result);
    } catch (error) {
      setVectorResult(error instanceof Error ? error.message : 'Error');
    }
  };

  const handleLimit = () => {
    try {
      const result = computeLimit(
        limitExpr,
        limitVar,
        parseFloat(limitApproach),
        limitDirection
      );
      setLimitResult(formatLimitResult(result));
    } catch (error) {
      setLimitResult(error instanceof Error ? error.message : 'Error');
    }
  };

  const handleTaylorSeries = () => {
    try {
      const result = computeTaylorSeries(
        taylorExpr,
        taylorVar,
        parseFloat(taylorCenter),
        parseInt(taylorOrder)
      );
      setTaylorResult(result.polynomial);
    } catch (error) {
      setTaylorResult(error instanceof Error ? error.message : 'Error');
    }
  };

  const handleAddUserFunction = () => {
    try {
      setUserFuncError('');
      const parsed = parseVariables(userFuncDef);
      if (!parsed) {
        throw new Error('Invalid format. Use format: name(x) or name(x, y)');
      }
      const updated = addUserFunction(parsed.name, userFuncExpr, parsed.variables);
      setUserFunctions(updated);
      setUserFuncDef('myFunc(x)');
      setUserFuncExpr('x^2 + 1');
    } catch (error) {
      setUserFuncError(error instanceof Error ? error.message : 'Error');
    }
  };

  const handleDeleteUserFunction = (name: string) => {
    const updated = removeUserFunction(name);
    setUserFunctions(updated);
  };

  const handleInsertUserFunction = (func: UserFunction) => {
    const funcCall = func.variables.length > 0
      ? `${func.name}()`
      : func.name;
    setExpression(state.expression + funcCall);
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
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-2">
                  {symbolicIntegral && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Antiderivative: </span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{symbolicIntegral}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Definite Integral: </span>
                    <span className="font-mono text-gray-900 dark:text-white">{integralResult}</span>
                  </div>
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
            <MatrixInput
              onClose={closeModal}
              onInsert={(value) => {
                setExpression(state.expression + value);
                closeModal();
              }}
            />
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

      {/* Vectors Modal */}
      <Dialog open={modalType === 'vectors'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Vector Operations
              </Dialog.Title>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vector A (comma separated)
                </label>
                <input
                  type="text"
                  value={vectorA}
                  onChange={(e) => setVectorA(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="1, 2, 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vector B (comma separated)
                </label>
                <input
                  type="text"
                  value={vectorB}
                  onChange={(e) => setVectorB(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="4, 5, 6"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleVectorOperation('dot')}
                  className="py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  A · B
                </button>
                <button
                  onClick={() => handleVectorOperation('cross')}
                  className="py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  A × B
                </button>
                <button
                  onClick={() => handleVectorOperation('angle')}
                  className="py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Angle
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleVectorOperation('magnitudeA')}
                  className="py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  |A|
                </button>
                <button
                  onClick={() => handleVectorOperation('magnitudeB')}
                  className="py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  |B|
                </button>
              </div>
              {vectorResult && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="font-mono text-gray-900 dark:text-white">{vectorResult}</span>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Limits Modal */}
      <Dialog open={modalType === 'limits'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Limit Computation
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
                  value={limitExpr}
                  onChange={(e) => setLimitExpr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="sin(x)/x"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Variable
                  </label>
                  <input
                    type="text"
                    value={limitVar}
                    onChange={(e) => setLimitVar(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Approaches
                  </label>
                  <input
                    type="text"
                    value={limitApproach}
                    onChange={(e) => setLimitApproach(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Direction
                </label>
                <select
                  value={limitDirection}
                  onChange={(e) => setLimitDirection(e.target.value as LimitApproach)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="both">Both sides</option>
                  <option value="left">From left (x⁻)</option>
                  <option value="right">From right (x⁺)</option>
                </select>
              </div>
              <button
                onClick={handleLimit}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Compute Limit
              </button>
              {limitResult && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">lim = </span>
                  <span className="font-mono text-gray-900 dark:text-white">{limitResult}</span>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Taylor Series Modal */}
      <Dialog open={modalType === 'taylor'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Taylor Series Expansion
              </Dialog.Title>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Function f(x)
                </label>
                <input
                  type="text"
                  value={taylorExpr}
                  onChange={(e) => setTaylorExpr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="sin(x)"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Variable
                  </label>
                  <input
                    type="text"
                    value={taylorVar}
                    onChange={(e) => setTaylorVar(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Center
                  </label>
                  <input
                    type="text"
                    value={taylorCenter}
                    onChange={(e) => setTaylorCenter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={taylorOrder}
                    onChange={(e) => setTaylorOrder(e.target.value)}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Center = 0 for Maclaurin series
              </p>
              <button
                onClick={handleTaylorSeries}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Expand Series
              </button>
              {taylorResult && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-x-auto">
                  <span className="font-mono text-sm text-gray-900 dark:text-white whitespace-nowrap">{taylorResult}</span>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* User Functions Modal */}
      <Dialog open={modalType === 'userfunc'} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                User-Defined Functions
              </Dialog.Title>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Function Definition
                </label>
                <input
                  type="text"
                  value={userFuncDef}
                  onChange={(e) => setUserFuncDef(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  placeholder="myFunc(x)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expression
                </label>
                <input
                  type="text"
                  value={userFuncExpr}
                  onChange={(e) => setUserFuncExpr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  placeholder="x^2 + 1"
                />
              </div>
              {userFuncError && (
                <p className="text-red-500 text-sm">{userFuncError}</p>
              )}
              <button
                onClick={handleAddUserFunction}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Save Function
              </button>

              {userFunctions.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Saved Functions
                  </h3>
                  <div className="space-y-2">
                    {userFunctions.map(func => (
                      <div
                        key={func.name}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <button
                          onClick={() => handleInsertUserFunction(func)}
                          className="flex-1 text-left font-mono text-sm text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          {formatUserFunction(func)}
                        </button>
                        <button
                          onClick={() => handleDeleteUserFunction(func.name)}
                          className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          title="Delete function"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
