import { useState, useRef, useCallback, useEffect } from 'react';
import { sampleFunction, generateTable, autoFitY } from '../../utils/graphUtils';
import type { ViewWindow, TableRow } from '../../utils/graphUtils';
import { Plus, Trash2, MousePointer2, Table } from 'lucide-react';

const PLOT_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

interface FunctionEntry {
  id: number;
  expr: string;
  color: string;
}

export function GraphPlotter() {
  const [functions, setFunctions] = useState<FunctionEntry[]>([
    { id: 1, expr: '', color: PLOT_COLORS[0] },
  ]);
  const [view, setView] = useState<ViewWindow>({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const [traceMode, setTraceMode] = useState(false);
  const [tracePos, setTracePos] = useState<{ x: number; y: number; fnIdx: number } | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState<{ expr: string; rows: TableRow[] } | null>(null);
  const [nextId, setNextId] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; view: ViewWindow } | null>(null);

  const activeFunctions = functions.filter((f) => f.expr.trim() !== '');

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    const isDark = document.documentElement.classList.contains('dark');

    // Background
    ctx.fillStyle = isDark ? '#1f2937' : '#f9fafb';
    ctx.fillRect(0, 0, w, h);

    const toCanvasX = (x: number) => ((x - view.xMin) / (view.xMax - view.xMin)) * w;
    const toCanvasY = (y: number) => h - ((y - view.yMin) / (view.yMax - view.yMin)) * h;
    const fromCanvasX = (cx: number) => view.xMin + (cx / w) * (view.xMax - view.xMin);
    const fromCanvasY = (cy: number) => view.yMax - (cy / h) * (view.yMax - view.yMin);

    // Grid
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    const axisColor = isDark ? '#9ca3af' : '#6b7280';
    const textColor = isDark ? '#9ca3af' : '#6b7280';

    function niceStep(range: number): number {
      const rough = range / 8;
      const exp = Math.floor(Math.log10(rough));
      const frac = rough / Math.pow(10, exp);
      let nice: number;
      if (frac <= 1.5) nice = 1;
      else if (frac <= 3.5) nice = 2;
      else if (frac <= 7.5) nice = 5;
      else nice = 10;
      return nice * Math.pow(10, exp);
    }

    const xStep = niceStep(view.xMax - view.xMin);
    const yStep = niceStep(view.yMax - view.yMin);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.font = '10px monospace';
    ctx.fillStyle = textColor;

    // Vertical grid lines
    const xStart = Math.ceil(view.xMin / xStep) * xStep;
    for (let x = xStart; x <= view.xMax; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();
      if (Math.abs(x) > xStep * 0.01) {
        ctx.fillText(formatAxis(x), cx + 2, h - 4);
      }
    }

    // Horizontal grid lines
    const yStart = Math.ceil(view.yMin / yStep) * yStep;
    for (let y = yStart; y <= view.yMax; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      if (Math.abs(y) > yStep * 0.01) {
        ctx.fillText(formatAxis(y), 4, cy - 4);
      }
    }

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    const originX = toCanvasX(0);
    const originY = toCanvasY(0);

    if (originX >= 0 && originX <= w) {
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, h);
      ctx.stroke();
    }
    if (originY >= 0 && originY <= h) {
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(w, originY);
      ctx.stroke();
    }

    // Plot functions
    const numPoints = Math.max(w * 2, 500);
    for (const fn of activeFunctions) {
      const points = sampleFunction(fn.expr, view.xMin, view.xMax, numPoints);
      if (points.length === 0) continue;

      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let drawing = false;

      for (const pt of points) {
        const cx = toCanvasX(pt.x);
        const cy = toCanvasY(pt.y);
        // Skip points that are way outside canvas (discontinuities)
        if (cy < -h * 2 || cy > h * 3) {
          drawing = false;
          continue;
        }
        if (!drawing) {
          ctx.moveTo(cx, cy);
          drawing = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();
    }

    // Trace cursor
    if (traceMode && tracePos) {
      const cx = toCanvasX(tracePos.x);
      const cy = toCanvasY(tracePos.y);
      const color = activeFunctions[tracePos.fnIdx]?.color || PLOT_COLORS[0];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isDark ? '#fff' : '#000';
      ctx.font = '11px monospace';
      const label = `(${tracePos.x.toFixed(3)}, ${tracePos.y.toFixed(3)})`;
      const textX = cx + 10 > w - 120 ? cx - 130 : cx + 10;
      const textY = cy - 10 < 15 ? cy + 20 : cy - 10;
      ctx.fillText(label, textX, textY);
    }

    // Store fromCanvas functions for event handlers
    (canvas as any)._fromCanvasX = fromCanvasX;
    (canvas as any)._fromCanvasY = fromCanvasY;
  }, [view, activeFunctions, traceMode, tracePos]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => drawGraph());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawGraph]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.1 : 0.9;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;

      const xRange = view.xMax - view.xMin;
      const yRange = view.yMax - view.yMin;
      const newXRange = xRange * factor;
      const newYRange = yRange * factor;
      const cx = view.xMin + mx * xRange;
      const cy = view.yMax - my * yRange;

      setView({
        xMin: cx - mx * newXRange,
        xMax: cx + (1 - mx) * newXRange,
        yMin: cy - (1 - my) * newYRange,
        yMax: cy + my * newYRange,
      });
    },
    [view]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (traceMode) return;
      dragRef.current = { startX: e.clientX, startY: e.clientY, view: { ...view } };
    },
    [view, traceMode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      if (traceMode && activeFunctions.length > 0) {
        const fromCanvasX = (canvas as any)._fromCanvasX;
        if (!fromCanvasX) return;
        const mx = e.clientX - rect.left;
        const x = fromCanvasX(mx);

        let closest: { x: number; y: number; fnIdx: number; dist: number } | null = null;
        activeFunctions.forEach((fn, idx) => {
          const points = sampleFunction(fn.expr, x - 0.001, x + 0.001, 2);
          if (points.length > 0) {
            const y = points[0].y;
            const dist = Math.abs(y);
            if (!closest || dist < closest.dist) {
              closest = { x: points[0].x, y, fnIdx: idx, dist };
            }
          }
        });
        if (closest) setTracePos(closest);
        return;
      }

      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const v = dragRef.current.view;
      const xRange = v.xMax - v.xMin;
      const yRange = v.yMax - v.yMin;
      const xShift = -(dx / rect.width) * xRange;
      const yShift = (dy / rect.height) * yRange;

      setView({
        xMin: v.xMin + xShift,
        xMax: v.xMax + xShift,
        yMin: v.yMin + yShift,
        yMax: v.yMax + yShift,
      });
    },
    [traceMode, activeFunctions]
  );

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const addFunction = () => {
    setFunctions([...functions, { id: nextId, expr: '', color: PLOT_COLORS[(nextId - 1) % PLOT_COLORS.length] }]);
    setNextId(nextId + 1);
  };

  const removeFunction = (id: number) => {
    if (functions.length <= 1) return;
    setFunctions(functions.filter((f) => f.id !== id));
  };

  const updateExpr = (id: number, expr: string) => {
    setFunctions(functions.map((f) => (f.id === id ? { ...f, expr } : f)));
  };

  const handleAutoFit = () => {
    if (activeFunctions.length === 0) return;
    const exprs = activeFunctions.map((f) => f.expr);
    const { yMin, yMax } = autoFitY(exprs, view.xMin, view.xMax);
    setView({ ...view, yMin, yMax });
  };

  const handleShowTable = () => {
    if (activeFunctions.length === 0) return;
    const fn = activeFunctions[0];
    const step = (view.xMax - view.xMin) / 20;
    const rows = generateTable(fn.expr, view.xMin, view.xMax, step);
    setTableData({ expr: fn.expr, rows });
    setShowTable(true);
  };

  return (
    <div className="space-y-3">
      {/* Function inputs */}
      <div className="space-y-2">
        {functions.map((fn) => (
          <div key={fn.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: fn.color }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">y=</span>
            <input
              type="text"
              value={fn.expr}
              onChange={(e) => updateExpr(fn.id, e.target.value)}
              placeholder="x^2"
              className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {functions.length > 1 && (
              <button
                onClick={() => removeFunction(fn.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={addFunction}
          disabled={functions.length >= 5}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40"
        >
          <Plus size={12} /> Add
        </button>
        <button
          onClick={() => { setTraceMode(!traceMode); setTracePos(null); }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            traceMode
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <MousePointer2 size={12} /> Trace
        </button>
        <button
          onClick={handleShowTable}
          disabled={activeFunctions.length === 0}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40"
        >
          <Table size={12} /> Table
        </button>
        <button
          onClick={handleAutoFit}
          disabled={activeFunctions.length === 0}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40"
        >
          Auto-fit
        </button>
        <button
          onClick={() => setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-600"
          style={{ height: '280px', cursor: traceMode ? 'crosshair' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Window settings */}
      <div className="grid grid-cols-4 gap-2">
        {(['xMin', 'xMax', 'yMin', 'yMax'] as const).map((key) => (
          <div key={key} className="flex flex-col gap-0.5">
            <label className="text-[10px] text-gray-400 font-mono">{key}</label>
            <input
              type="number"
              value={view[key]}
              onChange={(e) => setView({ ...view, [key]: Number(e.target.value) })}
              className="w-full px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center font-mono text-xs border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              step="any"
            />
          </div>
        ))}
      </div>

      {/* Table of values */}
      {showTable && tableData && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              y = {tableData.expr}
            </span>
            <button
              onClick={() => setShowTable(false)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Close
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="py-1 text-left text-gray-500">x</th>
                  <th className="py-1 text-right text-gray-500">y</th>
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="py-0.5 text-gray-700 dark:text-gray-300">{row.x}</td>
                    <td className="py-0.5 text-right text-gray-900 dark:text-white">
                      {row.y !== null ? row.y.toFixed(4) : 'undef'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function formatAxis(n: number): string {
  if (Math.abs(n) >= 1000 || (Math.abs(n) < 0.01 && n !== 0)) {
    return n.toExponential(1);
  }
  const rounded = Math.round(n * 1000) / 1000;
  return String(rounded);
}
