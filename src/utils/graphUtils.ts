import { create, all, MathJsStatic } from 'mathjs';

const math = create(all) as MathJsStatic;

math.import({
  cot: function (x: number) { return 1 / Math.tan(x); },
  acot: function (x: number) { return Math.atan(1 / x); },
}, { override: true });

export interface ViewWindow {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface PlotPoint {
  x: number;
  y: number;
}

export interface TableRow {
  x: number;
  y: number | null;
}

export function evaluateFunction(expr: string, x: number): number | null {
  try {
    const result = math.evaluate(expr, { x });
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null;
  } catch {
    return null;
  }
}

export function sampleFunction(
  expr: string,
  xMin: number,
  xMax: number,
  numPoints: number
): PlotPoint[] {
  const points: PlotPoint[] = [];
  const step = (xMax - xMin) / numPoints;
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    const y = evaluateFunction(expr, x);
    if (y !== null) {
      points.push({ x, y });
    }
  }
  return points;
}

export function generateTable(
  expr: string,
  xMin: number,
  xMax: number,
  step: number
): TableRow[] {
  const rows: TableRow[] = [];
  for (let x = xMin; x <= xMax + step * 0.001; x += step) {
    const roundedX = Math.round(x * 1e10) / 1e10;
    rows.push({ x: roundedX, y: evaluateFunction(expr, roundedX) });
  }
  return rows;
}

export function autoFitY(
  expressions: string[],
  xMin: number,
  xMax: number
): { yMin: number; yMax: number } {
  let min = Infinity;
  let max = -Infinity;
  const numSamples = 200;

  for (const expr of expressions) {
    const points = sampleFunction(expr, xMin, xMax, numSamples);
    for (const p of points) {
      if (p.y < min) min = p.y;
      if (p.y > max) max = p.y;
    }
  }

  if (!isFinite(min) || !isFinite(max) || min === max) {
    return { yMin: -10, yMax: 10 };
  }

  const padding = (max - min) * 0.1 || 1;
  return { yMin: min - padding, yMax: max + padding };
}
