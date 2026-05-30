import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { makeTooltip } from "./Tooltip";

interface StatusPeriod {
  period: string;
  soodne: number;
  ebasoodne: number;
  halb: number;
}

const SERIES = [
  { key: "soodne", name: "Soodne", color: "#B6D24A" },
  { key: "ebasoodne", name: "Ebasoodne", color: "#d4a373" },
  { key: "halb", name: "Halb", color: "#f87171" },
] as const;

const fmtPct = (v: number) => `${v.toLocaleString("et-EE", { maximumFractionDigits: 1 })}%`;

export function TopicStackedBars({ periods }: { periods: StatusPeriod[] }) {
  const tooltip = makeTooltip(
    (label) => String(label),
    SERIES.map((s) => ({
      name: s.name,
      key: s.key,
      color: s.color,
      format: fmtPct,
    })),
  );
  return (
    <>
      <div className="chart-wrap">
        <ResponsiveContainer>
          <BarChart
            data={periods}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 8, bottom: 10 }}
          >
            <CartesianGrid stroke="#E1E5E8" strokeDasharray="3 4" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#4A5A60", fontSize: 11 }}
              stroke="#7A8990"
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="period"
              tick={{ fill: "#4A5A60", fontSize: 12 }}
              stroke="#7A8990"
              width={120}
            />
            <Tooltip
              content={tooltip as never}
              cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
            />
            {SERIES.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                stackId="status"
                fill={s.color}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        {SERIES.map((s) => (
          <span className="legend-chip" key={s.key}>
            <span className="legend-dot" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </>
  );
}
