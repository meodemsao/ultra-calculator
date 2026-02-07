import { useState } from 'react';
import { math } from '../../utils/mathOperations';
import { useCalculator } from '../../contexts/CalculatorContext';

interface MatrixInputProps {
  onClose: () => void;
}

export function MatrixInput({ onClose }: MatrixInputProps) {
  const { setExpression, state } = useCalculator();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [result, setResult] = useState<string>('');
  const [showMatrixB, setShowMatrixB] = useState(false);

  const updateMatrixSize = (newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);

    const resizeMatrix = (matrix: number[][]): number[][] => {
      const newMatrix: number[][] = [];
      for (let i = 0; i < newRows; i++) {
        newMatrix[i] = [];
        for (let j = 0; j < newCols; j++) {
          newMatrix[i][j] = matrix[i]?.[j] ?? 0;
        }
      }
      return newMatrix;
    };

    setMatrixA(resizeMatrix(matrixA));
    setMatrixB(resizeMatrix(matrixB));
  };

  const updateCell = (matrix: 'A' | 'B', row: number, col: number, value: string) => {
    const num = parseFloat(value) || 0;
    if (matrix === 'A') {
      const newMatrix = matrixA.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? num : c))
      );
      setMatrixA(newMatrix);
    } else {
      const newMatrix = matrixB.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? num : c))
      );
      setMatrixB(newMatrix);
    }
  };

  const performOperation = (operation: string) => {
    try {
      const mA = math.matrix(matrixA);
      let resultMatrix;

      switch (operation) {
        case 'det':
          resultMatrix = math.det(mA);
          break;
        case 'inv':
          resultMatrix = math.inv(mA);
          break;
        case 'transpose':
          resultMatrix = math.transpose(mA);
          break;
        case 'add':
          resultMatrix = math.add(mA, math.matrix(matrixB));
          break;
        case 'subtract':
          resultMatrix = math.subtract(mA, math.matrix(matrixB));
          break;
        case 'multiply':
          resultMatrix = math.multiply(mA, math.matrix(matrixB));
          break;
        case 'eigenvalues':
          const eigResult = math.eigs(mA);
          resultMatrix = eigResult.values;
          break;
        default:
          return;
      }

      setResult(math.format(resultMatrix, { precision: 6 }));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Error computing matrix operation');
    }
  };

  const insertResult = () => {
    if (result) {
      setExpression(state.expression + result);
      onClose();
    }
  };

  const renderMatrix = (matrix: number[][], matrixName: 'A' | 'B') => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700 dark:text-gray-300">Matrix {matrixName}</h4>
      <div className="inline-block border-l-2 border-r-2 border-gray-400 dark:border-gray-500 px-2">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-1 my-1">
            {row.map((cell, j) => (
              <input
                key={j}
                type="number"
                value={cell}
                onChange={(e) => updateCell(matrixName, i, j, e.target.value)}
                className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Size controls */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size:</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="5"
            value={rows}
            onChange={(e) => updateMatrixSize(parseInt(e.target.value) || 2, cols)}
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <span className="text-gray-500">×</span>
          <input
            type="number"
            min="1"
            max="5"
            value={cols}
            onChange={(e) => updateMatrixSize(rows, parseInt(e.target.value) || 2)}
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={showMatrixB}
            onChange={(e) => setShowMatrixB(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Two matrices
        </label>
      </div>

      {/* Matrix inputs */}
      <div className={`grid gap-6 ${showMatrixB ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {renderMatrix(matrixA, 'A')}
        {showMatrixB && renderMatrix(matrixB, 'B')}
      </div>

      {/* Operations */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Operations</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => performOperation('det')}
            className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-800/50 text-sm font-medium"
          >
            Determinant
          </button>
          <button
            onClick={() => performOperation('inv')}
            className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-800/50 text-sm font-medium"
          >
            Inverse
          </button>
          <button
            onClick={() => performOperation('transpose')}
            className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-800/50 text-sm font-medium"
          >
            Transpose
          </button>
          <button
            onClick={() => performOperation('eigenvalues')}
            className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-800/50 text-sm font-medium"
          >
            Eigenvalues
          </button>
          {showMatrixB && (
            <>
              <button
                onClick={() => performOperation('add')}
                className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-sm font-medium"
              >
                A + B
              </button>
              <button
                onClick={() => performOperation('subtract')}
                className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-sm font-medium"
              >
                A − B
              </button>
              <button
                onClick={() => performOperation('multiply')}
                className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-sm font-medium"
              >
                A × B
              </button>
            </>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Result</h4>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-gray-900 dark:text-white whitespace-pre-wrap">
            {result}
          </div>
          <button
            onClick={insertResult}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Insert into Expression
          </button>
        </div>
      )}
    </div>
  );
}
