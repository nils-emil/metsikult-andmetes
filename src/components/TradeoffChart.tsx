import {
  Area,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { makeTooltip } from "./Tooltip";
import { fmtInt, fmtMoney } from "./format";
import type { TradeoffPoint } from "../synthesis/model";

const ECON_COLOR = "#D8B98C";
const ECO_COLOR = "#B6D24A";

const tooltip = makeTooltip((label) => `Raievanus ${label} aastat`, [
  {
    name: "Majanduslik väärtus (LEV)",
    key: "lev",
    color: ECON_COLOR,
    format: (v) => `${fmtMoney(v)}/ha`,
  },
  {
    name: "Elupaiga taastumine",
    key: "elupaik",
    color: ECO_COLOR,
    format: (v) => `${Math.round(v)}%`,
  },
  {
    name: "Metsaliike kohal",
    key: "speciesCount",
    color: "#7FA88A",
    format: (v) => `${fmtInt(v)} liiki`,
  },
]);

export function TradeoffChart({
  data,
  rotationAge,
  economicOptimumAge,
  maxEcologyAge,
}: {
  data: TradeoffPoint[];
  rotationAge: number;
  economicOptimumAge: number;
  maxEcologyAge: number;
}) {
  const bandStart = Math.min(economicOptimumAge, maxEcologyAge);
  return (
    <div className="chart-wrap tall">
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 16, right: 28, left: 0, bottom: 8 }}
        >
          <defs>
            <linearGradient id="econFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ECON_COLOR} stopOpacity={0.28} />
              <stop offset="100%" stopColor={ECON_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E1E5E8" strokeDasharray="3 4" vertical={false} />

          <ReferenceArea
            yAxisId="pct"
            x1={bandStart}
            x2={maxEcologyAge}
            fill="#B6D24A"
            fillOpacity={0.06}
            stroke="#7A8990"
            strokeOpacity={0.3}
            strokeDasharray="2 4"
            label={{
              value: "Kompromissiala",
              fill: "#7A8990",
              fontSize: 11,
              position: "insideTop",
            }}
          />

          <XAxis
            dataKey="age"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fill: "#4A5A60", fontSize: 11 }}
            stroke="#7A8990"
            label={{
              value: "Raievanus (aastat)",
              position: "insideBottom",
              offset: -2,
              fill: "#7A8990",
              fontSize: 11,
            }}
          />
          <YAxis
            yAxisId="pct"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fill: "#4A5A60", fontSize: 11 }}
            stroke="#7A8990"
            label={{
              value: "suhteline väärtus (%)",
              angle: -90,
              position: "insideLeft",
              fill: "#7A8990",
              fontSize: 11,
              dy: 60,
            }}
          />
          <YAxis yAxisId="raw" hide domain={["dataMin", "dataMax"]} />
          <Tooltip
            content={tooltip as never}
            cursor={{ stroke: "#1A2B30", strokeOpacity: 0.3 }}
          />

          <Area
            yAxisId="pct"
            type="monotone"
            dataKey="levNorm"
            stroke={ECON_COLOR}
            strokeWidth={2}
            fill="url(#econFill)"
            isAnimationActive={false}
          />
          <Line
            yAxisId="pct"
            type="monotone"
            dataKey="elupaik"
            stroke={ECO_COLOR}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="raw"
            dataKey="lev"
            stroke="transparent"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            legendType="none"
          />
          <Line
            yAxisId="raw"
            dataKey="speciesCount"
            stroke="transparent"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            legendType="none"
          />

          <ReferenceLine
            yAxisId="pct"
            x={economicOptimumAge}
            stroke={ECON_COLOR}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            label={{
              value: `Majanduslik optimum: ${economicOptimumAge}a`,
              fill: ECON_COLOR,
              fontSize: 11,
              position: "top",
            }}
          />
          <ReferenceLine
            yAxisId="pct"
            x={rotationAge}
            stroke="#1A2B30"
            strokeOpacity={0.65}
            strokeDasharray="2 4"
            label={{
              value: `Valitud: ${rotationAge}a`,
              fill: "#1A2B30",
              fontSize: 11,
              position: "insideBottomRight",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
