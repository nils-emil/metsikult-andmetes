import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { makeTooltip } from "./Tooltip";
import { fmtInt, fmtPct } from "./format";

interface Point {
  age: number;
  pulp: number;
  saw: number;
  veneer: number;
  pulpShare: number;
  sawShare: number;
  veneerShare: number;
}

type Mode = "volume" | "share";

export function AssortmentChart({
  data,
  rotationAge,
  mode,
}: {
  data: Point[];
  rotationAge: number;
  mode: Mode;
}) {
  const keys =
    mode === "volume"
      ? { pulp: "pulp", saw: "saw", veneer: "veneer", unit: "m³/ha" }
      : { pulp: "pulpShare", saw: "sawShare", veneer: "veneerShare", unit: "%" };

  const tooltip = makeTooltip((label) => `Vanus ${label} aastat`, [
    {
      name: "Spoonipakk",
      key: keys.veneer,
      color: "#c47e3e",
      format: (v) => (mode === "volume" ? `${fmtInt(v)} m³` : fmtPct(v)),
    },
    {
      name: "Palk",
      key: keys.saw,
      color: "#d4a373",
      format: (v) => (mode === "volume" ? `${fmtInt(v)} m³` : fmtPct(v)),
    },
    {
      name: "Paberipuit",
      key: keys.pulp,
      color: "#93b86a",
      format: (v) => (mode === "volume" ? `${fmtInt(v)} m³` : fmtPct(v)),
    },
  ]);

  return (
    <div className="chart-wrap tall">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          stackOffset="none"
          margin={{ top: 10, right: 20, left: 0, bottom: 8 }}
        >
          <CartesianGrid stroke="#263a32" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="age"
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            label={{ value: "Puistu vanus (aastat)", position: "insideBottom", offset: -2, fill: "#6f857c", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            domain={mode === "share" ? [0, 100] : ["auto", "auto"]}
            label={{ value: keys.unit, angle: -90, position: "insideLeft", fill: "#6f857c", fontSize: 11, dy: 20 }}
          />
          <Tooltip content={tooltip as never} cursor={{ stroke: "#4ade80", strokeOpacity: 0.4 }} />
          <Area
            type="monotone"
            stackId="1"
            dataKey={keys.pulp}
            stroke="#7ea356"
            fill="#93b86a"
            fillOpacity={0.85}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            stackId="1"
            dataKey={keys.saw}
            stroke="#bf8a5e"
            fill="#d4a373"
            fillOpacity={0.85}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            stackId="1"
            dataKey={keys.veneer}
            stroke="#a96730"
            fill="#c47e3e"
            fillOpacity={0.9}
            isAnimationActive={false}
          />
          <ReferenceLine
            x={rotationAge}
            stroke="#f0f3ef"
            strokeOpacity={0.55}
            strokeDasharray="2 4"
            label={{ value: `${rotationAge}a`, fill: "#ecf3ef", fontSize: 11, position: "top" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
