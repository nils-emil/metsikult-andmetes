import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { fmtNumber } from "./format";
import { makeTooltip } from "./Tooltip";
import type { SimulationStep } from "../forestry/simulation";

export type TotalView = "standing" | "harvested" | "kogumaht";

interface Props {
  runs: SimulationStep[][];
  currentYear: number;
  scenarioColors: [string, string, string];
  scenarioLabels: [string, string, string];
  viewMode: TotalView;
  onViewModeChange: (m: TotalView) => void;
}

function valueFor(step: SimulationStep, mode: TotalView): number {
  if (mode === "standing") return step.total;
  if (mode === "harvested") return step.cumulativeHarvested;
  return step.total + step.cumulativeHarvested;
}

const VIEW_LABELS: Record<TotalView, string> = {
  standing: "Tagavara",
  harvested: "Kumulatiivne raie",
  kogumaht: "Kogumaht",
};

export function SimulationTotalChart({
  runs,
  currentYear,
  scenarioColors,
  scenarioLabels,
  viewMode,
  onViewModeChange,
}: Props) {
  const data = useMemo(() => {
    const reveal = Math.floor(currentYear);
    const upTo = Math.min(reveal, 100);
    const out: { year: number; s0?: number; s1?: number; s2?: number }[] = [];
    for (let y = 0; y <= 100; y++) {
      const row: { year: number; s0?: number; s1?: number; s2?: number } = {
        year: y,
      };
      if (y <= upTo) {
        row.s0 = valueFor(runs[0][y], viewMode);
        row.s1 = valueFor(runs[1][y], viewMode);
        row.s2 = valueFor(runs[2][y], viewMode);
      }
      out.push(row);
    }
    return out;
  }, [runs, currentYear, viewMode]);

  const tooltip = useMemo(
    () =>
      makeTooltip((label) => `Aasta ${label}`, [
        {
          name: scenarioLabels[0],
          key: "s0",
          color: scenarioColors[0],
          format: (v) => `${fmtNumber(v, 1)} M m³`,
        },
        {
          name: scenarioLabels[1],
          key: "s1",
          color: scenarioColors[1],
          format: (v) => `${fmtNumber(v, 1)} M m³`,
        },
        {
          name: scenarioLabels[2],
          key: "s2",
          color: scenarioColors[2],
          format: (v) => `${fmtNumber(v, 1)} M m³`,
        },
      ]),
    [scenarioColors, scenarioLabels],
  );

  return (
    <div>
      <div className="sim-tabs-row" style={{ marginBottom: 10 }}>
        <div className="sim-tabs">
          {(["standing", "harvested", "kogumaht"] as TotalView[]).map((m) => (
            <button
              key={m}
              type="button"
              className={
                "sim-tab" + (viewMode === m ? " sim-tab-active" : "")
              }
              onClick={() => onViewModeChange(m)}
            >
              {VIEW_LABELS[m]}
            </button>
          ))}
        </div>
        <span className="sim-hint sim-tabs-hint">
          Kogumaht = tagavara + kumulatiivne raie
        </span>
      </div>

      <div className="chart-wrap tall">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 28, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              stroke="#263a32"
              strokeDasharray="3 4"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              type="number"
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              label={{
                value: "Aastad",
                position: "insideBottom",
                offset: -2,
                fill: "#6f857c",
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              label={{
                value: `${VIEW_LABELS[viewMode]} (M m³)`,
                angle: -90,
                position: "insideLeft",
                fill: "#6f857c",
                fontSize: 11,
                dy: 60,
              }}
            />
            <Tooltip
              content={tooltip as never}
              cursor={{ stroke: "#4ade80", strokeOpacity: 0.4 }}
            />
            <ReferenceLine
              x={currentYear}
              stroke="#ecf3ef"
              strokeOpacity={0.45}
              strokeDasharray="2 4"
            />
            <Line
              type="monotone"
              dataKey="s0"
              stroke={scenarioColors[0]}
              strokeWidth={2.2}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="s1"
              stroke={scenarioColors[1]}
              strokeWidth={2.2}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="s2"
              stroke={scenarioColors[2]}
              strokeWidth={2.2}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
