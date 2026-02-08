export interface QuadraticResult {
  roots: [string, string];
  discriminant: number;
  vertex: { x: number; y: number };
}

export interface CubicResult {
  roots: string[];
}

export interface LinearSystemResult {
  solution: number[];
  solvable: boolean;
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) {
    throw new Error('Coefficient a cannot be zero for a quadratic equation');
  }

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  let roots: [string, string];

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-b + sqrtD) / (2 * a);
    const r2 = (-b - sqrtD) / (2 * a);
    roots = [formatNumber(r1), formatNumber(r2)];
  } else if (discriminant === 0) {
    const r = -b / (2 * a);
    roots = [formatNumber(r), formatNumber(r)];
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * a);
    roots = [
      `${formatNumber(realPart)} + ${formatNumber(imagPart)}i`,
      `${formatNumber(realPart)} - ${formatNumber(imagPart)}i`,
    ];
  }

  return {
    roots,
    discriminant,
    vertex: { x: round(vertexX), y: round(vertexY) },
  };
}

export function solveCubic(a: number, b: number, c: number, d: number): CubicResult {
  if (a === 0) {
    throw new Error('Coefficient a cannot be zero for a cubic equation');
  }

  // Normalize: x³ + px² + qx + r = 0
  const p = b / a;
  const q = c / a;
  const r = d / a;

  // Depressed cubic: t³ + pt + q = 0 via substitution x = t - p/3
  const p1 = q - (p * p) / 3;
  const q1 = r - (p * q) / 3 + (2 * p * p * p) / 27;

  const disc = (q1 * q1) / 4 + (p1 * p1 * p1) / 27;

  const roots: string[] = [];

  if (Math.abs(disc) < 1e-10) {
    // All real roots, at least two equal
    if (Math.abs(p1) < 1e-10) {
      roots.push(formatNumber(-p / 3));
    } else {
      const u = Math.cbrt(-q1 / 2);
      roots.push(formatNumber(2 * u - p / 3));
      roots.push(formatNumber(-u - p / 3));
    }
  } else if (disc > 0) {
    // One real root, two complex conjugate
    const sqrtDisc = Math.sqrt(disc);
    const u = Math.cbrt(-q1 / 2 + sqrtDisc);
    const v = Math.cbrt(-q1 / 2 - sqrtDisc);
    const realRoot = u + v - p / 3;
    roots.push(formatNumber(realRoot));

    const realPart = -(u + v) / 2 - p / 3;
    const imagPart = (Math.sqrt(3) / 2) * (u - v);
    roots.push(`${formatNumber(realPart)} + ${formatNumber(Math.abs(imagPart))}i`);
    roots.push(`${formatNumber(realPart)} - ${formatNumber(Math.abs(imagPart))}i`);
  } else {
    // Three distinct real roots (casus irreducibilis)
    const m = 2 * Math.sqrt(-p1 / 3);
    const theta = Math.acos((3 * q1) / (p1 * m)) / 3;
    roots.push(formatNumber(m * Math.cos(theta) - p / 3));
    roots.push(formatNumber(m * Math.cos(theta - (2 * Math.PI) / 3) - p / 3));
    roots.push(formatNumber(m * Math.cos(theta - (4 * Math.PI) / 3) - p / 3));
  }

  return { roots };
}

export function solveLinearSystem(matrix: number[][], constants: number[]): LinearSystemResult {
  const n = matrix.length;
  // Augmented matrix
  const aug = matrix.map((row, i) => [...row, constants[i]]);

  // Gaussian elimination with partial pivoting
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
        maxRow = row;
      }
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (Math.abs(aug[col][col]) < 1e-12) {
      return { solution: [], solvable: false };
    }

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  // Back substitution
  const solution = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    solution[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      solution[i] -= aug[i][j] * solution[j];
    }
    solution[i] /= aug[i][i];
    solution[i] = round(solution[i]);
  }

  return { solution, solvable: true };
}

function round(n: number): number {
  return Math.round(n * 1e10) / 1e10;
}

function formatNumber(n: number): string {
  const rounded = round(n);
  return String(rounded);
}
