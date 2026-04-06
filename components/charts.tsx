"use client";

import { useEffect, useRef, useState } from "react";

// ─── Couleurs utilitaires ─────────────────────────────────────────────────────

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── PEAK HOURS BAR CHART ─────────────────────────────────────────────────────
// 24 colonnes, hover tooltip, heure de pic mise en valeur

interface PeakHour {
  hour: number;
  label: string;
  orders: number;
  revenue: number;
}

export function PeakHoursChart({
  data,
  color = "#16a34a",
}: {
  data: PeakHour[];
  color?: string;
}) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    d: PeakHour;
  } | null>(null);
  const maxOrders = Math.max(...data.map((d) => d.orders), 1);
  const peakVal = Math.max(...data.map((d) => d.orders));

  if (!data.length)
    return (
      <div className="flex items-center justify-center h-32 text-zinc-400 text-sm">
        Pas encore de données
      </div>
    );

  return (
    <div className="relative select-none">
      <div className="flex items-end gap-[2px] h-28">
        {data.map((h) => {
          const pct = Math.max(4, (h.orders / maxOrders) * 100);
          const isPeak = h.orders === peakVal && peakVal > 0;
          return (
            <div
              key={h.hour}
              className="flex-1 flex flex-col items-center justify-end group cursor-default"
              style={{ height: "100%" }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget
                  .closest(".relative")!
                  .getBoundingClientRect();
                setTooltip({
                  x: rect.left - parent.left + rect.width / 2,
                  y: rect.top - parent.top,
                  d: h,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <div
                className="w-full rounded-t-[3px] transition-all duration-200 group-hover:opacity-80"
                style={{
                  height: `${pct}%`,
                  backgroundColor: isPeak ? color : hexToRgba(color, 0.22),
                  minHeight: "3px",
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Labels heures */}
      <div className="flex gap-[2px] mt-1">
        {data.map((h) => (
          <div key={h.hour} className="flex-1 text-center">
            {h.hour % 6 === 0 && (
              <span className="text-[9px] text-zinc-400">{h.label}</span>
            )}
          </div>
        ))}
      </div>
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 52,
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-zinc-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap">
            <p className="font-bold">{tooltip.d.label}</p>
            <p className="text-zinc-400">
              {tooltip.d.orders} commande{tooltip.d.orders !== 1 ? "s" : ""}
            </p>
            {tooltip.d.revenue > 0 && (
              <p style={{ color }} className="font-semibold">
                {tooltip.d.revenue.toLocaleString("fr-FR")} FCFA
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DONUT / PIE CHART ────────────────────────────────────────────────────────

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  data,
  size = 160,
  thickness = 28,
  centerLabel,
  centerValue,
}: {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total)
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-zinc-400 text-xs">Aucune donnée</span>
      </div>
    );

  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circum = 2 * Math.PI * r;

  let cumulative = 0;
  const [hovered, setHovered] = useState<number | null>(null);

  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const offset = circum - cumulative * circum;
    const dash = pct * circum;
    const gap = circum - dash;
    cumulative += pct;
    return { ...d, offset, dash, gap, pct, i };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#f4f4f5"
        strokeWidth={thickness}
      />
      {/* Slices */}
      {slices.map((s) => (
        <circle
          key={s.i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={hovered === s.i ? thickness + 4 : thickness}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={s.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          className="transition-all duration-200 cursor-pointer"
          onMouseEnter={() => setHovered(s.i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            filter:
              hovered === s.i ? `drop-shadow(0 0 6px ${s.color}60)` : "none",
          }}
        />
      ))}
      {/* Center */}
      {centerValue && (
        <>
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize={18}
            fontWeight={800}
          >
            {centerValue}
          </text>
          {centerLabel && (
            <text
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#a1a1aa"
              fontSize={10}
            >
              {centerLabel}
            </text>
          )}
        </>
      )}
    </svg>
  );
}

// ─── AREA / LINE CHART ────────────────────────────────────────────────────────

interface LinePoint {
  label: string;
  value: number;
}

export function AreaChart({
  data,
  color = "#16a34a",
  height = 120,
  showDots = true,
}: {
  data: LinePoint[];
  color?: string;
  height?: number;
  showDots?: boolean;
}) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    d: LinePoint;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 560;
  const H = height;
  const PAD = { t: 10, r: 8, b: 24, l: 8 };
  const maxV = Math.max(...data.map((d) => d.value), 1);
  const minV = Math.min(...data.map((d) => d.value), 0);
  const range = maxV - minV || 1;

  if (!data.length) return null;

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r),
    y: PAD.t + (1 - (d.value - minV) / range) * (H - PAD.t - PAD.b),
    d,
  }));

  // Smooth curve (cubic bezier)
  const path = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = `${path} L ${pts[pts.length - 1].x} ${H - PAD.b} L ${pts[0].x} ${H - PAD.b} Z`;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient
            id={`area-grad-${color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaPath} fill={`url(#area-grad-${color.replace("#", "")})`} />
        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots + interaction */}
        {pts.map((pt, i) => (
          <g
            key={i}
            onMouseEnter={() =>
              setTooltip({ x: (pt.x / W) * 100, y: pt.y, d: pt.d })
            }
            onMouseLeave={() => setTooltip(null)}
          >
            <circle
              cx={pt.x}
              cy={pt.y}
              r={16}
              fill="transparent"
              className="cursor-default"
            />
            {showDots && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={3.5}
                fill="white"
                stroke={color}
                strokeWidth={2}
              />
            )}
          </g>
        ))}
        {/* X labels */}
        {pts.map((pt, i) => {
          const every = Math.ceil(pts.length / 6);
          return i % every === 0 ? (
            <text
              key={i}
              x={pt.x}
              y={H - 4}
              textAnchor="middle"
              fontSize={9}
              fill="#a1a1aa"
            >
              {pt.d.label}
            </text>
          ) : null;
        })}
      </svg>
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${tooltip.x}%`,
            top: tooltip.y - 42,
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-zinc-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap">
            <p className="font-bold">{tooltip.d.label}</p>
            <p style={{ color }}>{tooltip.d.value.toLocaleString("fr-FR")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HORIZONTAL BAR CHART ─────────────────────────────────────────────────────

interface BarItem {
  label: string;
  value: number;
  sub?: string;
  color?: string;
}

export function HorizontalBars({
  data,
  maxValue,
  color = "#16a34a",
  showValue = true,
}: {
  data: BarItem[];
  maxValue?: number;
  color?: string;
  showValue?: boolean;
}) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2.5">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 font-mono w-4 flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-zinc-800 truncate max-w-[180px]">
                {item.label}
              </span>
              {item.sub && (
                <span className="text-xs text-zinc-400">{item.sub}</span>
              )}
            </div>
            {showValue && (
              <span className="text-sm font-bold text-zinc-700 flex-shrink-0 ml-2">
                {item.value.toLocaleString("fr-FR")}
              </span>
            )}
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor:
                  item.color ??
                  (i === 0 ? color : hexToRgba(color, 0.5 - i * 0.08)),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RADIAL PROGRESS ─────────────────────────────────────────────────────────

export function RadialProgress({
  value,
  max = 100,
  size = 80,
  color = "#16a34a",
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - 10) / 2;
  const circum = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = pct * circum;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${dash} ${circum - dash}`}
          strokeDashoffset={circum / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text
          x={size / 2}
          y={size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize={size * 0.18}
          fontWeight={800}
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label && <p className="text-[11px] text-zinc-500">{label}</p>}
    </div>
  );
}

// ─── SPARK LINE (mini trend) ──────────────────────────────────────────────────

export function SparkLine({
  values,
  color = "#16a34a",
  width = 80,
  height = 28,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - 2 - ((v - min) / range) * (height - 4),
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── LEGEND ───────────────────────────────────────────────────────────────────

export function ChartLegend({
  items,
}: {
  items: { color: string; label: string; value?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-zinc-600">{item.label}</span>
          {item.value && (
            <span className="text-xs font-bold text-zinc-800">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
