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
import { makeTooltip } from "./Tooltip";
import { fmtMoneyFull } from "./format";

interface Point {
  age: number;
  npv: number;
  lev: number;
  annualEquivalent: number;
}

const tooltip = makeTooltip((label) => `Raiering ${label} aastat`, [
  { name: "NPV (üks raiering)", key: "npv", color: "#4ade80", format: fmtMoneyFull },
  { name: "LEV (Faustmann)", key: "lev", color: "#d4a373", format: fmtMoneyFull },
  { name: "Aastane ekvivalent", key: "annualEquivalent", color: "#c47e3e", format: fmtMoneyFull },
]);

export function EconomicsChart({
  data,
  rotationAge,
  optimalAge,
  showLev,
}: {
  data: Point[];
  rotationAge: number;
  optimalAge: number;
  showLev: boolean;
}) {
  return (
    <div className="chart-wrap tall">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 28, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#263a32" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="age"
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            label={{
              value: "Raiering (aastat)",
              position: "insideBottom",
              offset: -2,
              fill: "#6f857c",
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            tickFormatter={(v) => {
              const n = v as number;
              const abs = Math.abs(n);
              if (abs >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
              if (abs >= 1000) return `€${(n / 1000).toFixed(0)}k`;
              return `€${Math.round(n)}`;
            }}
          />
          <Tooltip content={tooltip as never} cursor={{ stroke: "#4ade80", strokeOpacity: 0.4 }} />
          <ReferenceLine y={0} stroke="#6f857c" strokeOpacity={0.6} />
          <Line
            type="monotone"
            dataKey="npv"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          {showLev && (
            <Line
              type="monotone"
              dataKey="lev"
              stroke="#d4a373"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
          )}
          <Line
            type="monotone"
            dataKey="annualEquivalent"
            stroke="#c47e3e"
            strokeWidth={1.8}
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceLine
            x={rotationAge}
            stroke="#f0f3ef"
            strokeOpacity={0.55}
            strokeDasharray="2 4"
            label={{ value: `valitud`, fill: "#ecf3ef", fontSize: 10, position: "top" }}
          />
          <ReferenceLine
            x={optimalAge}
            stroke="#4ade80"
            strokeOpacity={0.7}
            strokeDasharray="4 2"
            label={{ value: `optimum ${optimalAge}a`, fill: "#4ade80", fontSize: 10, position: "insideTopRight" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
