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
  { key: "soodne", name: "Soodne", color: "#4ade80" },
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
            <CartesianGrid stroke="#263a32" strokeDasharray="3 4" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="period"
              tick={{ fill: "#a4b7af", fontSize: 12 }}
              stroke="#355044"
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
