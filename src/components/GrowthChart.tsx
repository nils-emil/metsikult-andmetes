import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { makeTooltip } from "./Tooltip";
import { fmtInt, fmtNumber } from "./format";

interface Point {
  age: number;
  volume: number;
  mai: number;
  cai: number;
}

const tooltip = makeTooltip(
  (label) => `Vanus ${label} aastat`,
  [
    { name: "Tagavara", key: "volume", color: "#4ade80", format: (v) => `${fmtInt(v)} m³/ha` },
    { name: "Keskmine juurdekasv", key: "mai", color: "#d4a373", format: (v) => `${fmtNumber(v, 2)} m³/ha/a` },
    { name: "Jooksev juurdekasv", key: "cai", color: "#c47e3e", format: (v) => `${fmtNumber(v, 2)} m³/ha/a` },
  ],
);

export function GrowthChart({
  data,
  rotationAge,
}: {
  data: Point[];
  rotationAge: number;
}) {
  return (
    <div className="chart-wrap tall">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 28, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#263a32" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="age"
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            label={{ value: "Puistu vanus (aastat)", position: "insideBottom", offset: -2, fill: "#6f857c", fontSize: 11 }}
          />
          <YAxis
            yAxisId="vol"
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            label={{ value: "m³/ha", angle: -90, position: "insideLeft", fill: "#6f857c", fontSize: 11, dy: 30 }}
          />
          <YAxis
            yAxisId="inc"
            orientation="right"
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            label={{ value: "m³/ha/a", angle: 90, position: "insideRight", fill: "#6f857c", fontSize: 11, dy: -30 }}
          />
          <Tooltip content={tooltip as never} cursor={{ stroke: "#4ade80", strokeOpacity: 0.4 }} />
          <Area
            yAxisId="vol"
            type="monotone"
            dataKey="volume"
            stroke="#4ade80"
            strokeWidth={2}
            fill="url(#volFill)"
            isAnimationActive={false}
          />
          <Line
            yAxisId="inc"
            type="monotone"
            dataKey="mai"
            stroke="#d4a373"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="inc"
            type="monotone"
            dataKey="cai"
            stroke="#c47e3e"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceLine
            x={rotationAge}
            yAxisId="vol"
            stroke="#f0f3ef"
            strokeOpacity={0.55}
            strokeDasharray="2 4"
            label={{ value: `Raiering: ${rotationAge}a`, fill: "#ecf3ef", fontSize: 11, position: "top" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
