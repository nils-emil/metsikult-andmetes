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
  { name: "NPV (üks raiering)", key: "npv", color: "#B6D24A", format: fmtMoneyFull },
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
          <CartesianGrid stroke="#2E4C40" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="age"
            tick={{ fill: "#A8B2A4", fontSize: 11 }}
            stroke="#456554"
            label={{
              value: "Raiering (aastat)",
              position: "insideBottom",
              offset: -2,
              fill: "#7E8A7B",
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fill: "#A8B2A4", fontSize: 11 }}
            stroke="#456554"
            tickFormatter={(v) => {
              const n = v as number;
              const abs = Math.abs(n);
              if (abs >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
              if (abs >= 1000) return `€${(n / 1000).toFixed(0)}k`;
              return `€${Math.round(n)}`;
            }}
          />
          <Tooltip content={tooltip as never} cursor={{ stroke: "#B6D24A", strokeOpacity: 0.4 }} />
          <ReferenceLine y={0} stroke="#7E8A7B" strokeOpacity={0.6} />
          <Line
            type="monotone"
            dataKey="npv"
            stroke="#B6D24A"
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
            stroke="#F0EBDE"
            strokeOpacity={0.55}
            strokeDasharray="2 4"
            label={{ value: `valitud`, fill: "#F0EBDE", fontSize: 10, position: "top" }}
          />
          <ReferenceLine
            x={optimalAge}
            stroke="#B6D24A"
            strokeOpacity={0.7}
            strokeDasharray="4 2"
            label={{ value: `optimum ${optimalAge}a`, fill: "#B6D24A", fontSize: 10, position: "insideTopRight" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
