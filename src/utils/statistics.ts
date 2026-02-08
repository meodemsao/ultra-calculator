export interface DescriptiveStats {
  mean: number;
  median: number;
  mode: number[];
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  count: number;
  sum: number;
}

export interface RegressionResult {
  type: string;
  equation: string;
  coefficients: number[];
  rSquared: number;
  predict: (x: number) => number;
}

export function descriptiveStats(data: number[]): DescriptiveStats {
  if (data.length === 0) throw new Error('Data set is empty');

  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const variance = sorted.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  const median = n % 2 === 1
    ? sorted[Math.floor(n / 2)]
    : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);

  // Mode: values with highest frequency
  const freq = new Map<number, number>();
  for (const v of sorted) freq.set(v, (freq.get(v) || 0) + 1);
  const maxFreq = Math.max(...freq.values());
  const mode = maxFreq > 1
    ? [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v)
    : [];

  return {
    mean: round(mean),
    median: round(median),
    mode,
    stdDev: round(stdDev),
    variance: round(variance),
    min: sorted[0],
    max: sorted[n - 1],
    q1: round(q1),
    q3: round(q3),
    iqr: round(q3 - q1),
    count: n,
    sum: round(sum),
  };
}

function percentile(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

export function linearRegression(xs: number[], ys: number[]): RegressionResult {
  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predict = (x: number) => slope * x + intercept;
  const rSquared = computeRSquared(ys, xs.map(predict));

  return {
    type: 'linear',
    equation: `y = ${formatCoeff(slope)}x + ${formatCoeff(intercept)}`,
    coefficients: [round(slope), round(intercept)],
    rSquared: round(rSquared),
    predict,
  };
}

export function quadraticRegression(xs: number[], ys: number[]): RegressionResult {
  // Solve normal equations for y = ax² + bx + c
  const n = xs.length;
  const sums = {
    x: 0, x2: 0, x3: 0, x4: 0,
    y: 0, xy: 0, x2y: 0,
  };

  for (let i = 0; i < n; i++) {
    const x = xs[i], y = ys[i];
    const x2 = x * x;
    sums.x += x;
    sums.x2 += x2;
    sums.x3 += x2 * x;
    sums.x4 += x2 * x2;
    sums.y += y;
    sums.xy += x * y;
    sums.x2y += x2 * y;
  }

  // Normal equations as 3x3 system
  const matrix = [
    [sums.x4, sums.x3, sums.x2],
    [sums.x3, sums.x2, sums.x],
    [sums.x2, sums.x, n],
  ];
  const constants = [sums.x2y, sums.xy, sums.y];

  const coeffs = solveSystem(matrix, constants);
  const [a, b, c] = coeffs;

  const predict = (x: number) => a * x * x + b * x + c;
  const rSquared = computeRSquared(ys, xs.map(predict));

  return {
    type: 'quadratic',
    equation: `y = ${formatCoeff(a)}x² + ${formatCoeff(b)}x + ${formatCoeff(c)}`,
    coefficients: [round(a), round(b), round(c)],
    rSquared: round(rSquared),
    predict,
  };
}

export function exponentialRegression(xs: number[], ys: number[]): RegressionResult {
  // y = ae^(bx) → ln(y) = ln(a) + bx
  const validIndices = ys.map((y, i) => y > 0 ? i : -1).filter(i => i >= 0);
  if (validIndices.length < 2) throw new Error('Need at least 2 positive y values for exponential regression');

  const lnYs = validIndices.map(i => Math.log(ys[i]));
  const filteredXs = validIndices.map(i => xs[i]);

  const linReg = linearRegression(filteredXs, lnYs);
  const b = linReg.coefficients[0];
  const a = Math.exp(linReg.coefficients[1]);

  const predict = (x: number) => a * Math.exp(b * x);
  const rSquared = computeRSquared(ys, xs.map(predict));

  return {
    type: 'exponential',
    equation: `y = ${formatCoeff(a)}e^(${formatCoeff(b)}x)`,
    coefficients: [round(a), round(b)],
    rSquared: round(rSquared),
    predict,
  };
}

export function powerRegression(xs: number[], ys: number[]): RegressionResult {
  // y = ax^b → ln(y) = ln(a) + b·ln(x)
  const validIndices = xs.map((x, i) => x > 0 && ys[i] > 0 ? i : -1).filter(i => i >= 0);
  if (validIndices.length < 2) throw new Error('Need at least 2 positive x,y pairs for power regression');

  const lnXs = validIndices.map(i => Math.log(xs[i]));
  const lnYs = validIndices.map(i => Math.log(ys[i]));

  const linReg = linearRegression(lnXs, lnYs);
  const b = linReg.coefficients[0];
  const a = Math.exp(linReg.coefficients[1]);

  const predict = (x: number) => a * Math.pow(x, b);
  const rSquared = computeRSquared(
    validIndices.map(i => ys[i]),
    validIndices.map(i => predict(xs[i]))
  );

  return {
    type: 'power',
    equation: `y = ${formatCoeff(a)}x^${formatCoeff(b)}`,
    coefficients: [round(a), round(b)],
    rSquared: round(rSquared),
    predict,
  };
}

export function logarithmicRegression(xs: number[], ys: number[]): RegressionResult {
  // y = a + b·ln(x)
  const validIndices = xs.map((x, i) => x > 0 ? i : -1).filter(i => i >= 0);
  if (validIndices.length < 2) throw new Error('Need at least 2 positive x values for logarithmic regression');

  const lnXs = validIndices.map(i => Math.log(xs[i]));
  const filteredYs = validIndices.map(i => ys[i]);

  const linReg = linearRegression(lnXs, filteredYs);
  const b = linReg.coefficients[0];
  const a = linReg.coefficients[1];

  const predict = (x: number) => a + b * Math.log(x);
  const rSquared = computeRSquared(
    validIndices.map(i => ys[i]),
    validIndices.map(i => predict(xs[i]))
  );

  return {
    type: 'logarithmic',
    equation: `y = ${formatCoeff(a)} + ${formatCoeff(b)}ln(x)`,
    coefficients: [round(a), round(b)],
    rSquared: round(rSquared),
    predict,
  };
}

function computeRSquared(actual: number[], predicted: number[]): number {
  const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
  const ssTot = actual.reduce((acc, y) => acc + (y - mean) ** 2, 0);
  const ssRes = actual.reduce((acc, y, i) => acc + (y - predicted[i]) ** 2, 0);
  if (ssTot === 0) return 1;
  return 1 - ssRes / ssTot;
}

function solveSystem(matrix: number[][], constants: number[]): number[] {
  const n = matrix.length;
  const aug = matrix.map((row, i) => [...row, constants[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  const solution = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    solution[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) solution[i] -= aug[i][j] * solution[j];
    solution[i] /= aug[i][i];
  }
  return solution;
}

function round(n: number): number {
  return Math.round(n * 1e10) / 1e10;
}

function formatCoeff(n: number): string {
  const r = Math.round(n * 10000) / 10000;
  return String(r);
}
