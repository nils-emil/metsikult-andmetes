import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarPoint {
  label: string;
  value: number;
  color?: string;
}

export function TopicBars({
  data,
  unit,
  yLabel,
}: {
  data: BarPoint[];
  unit: string;
  yLabel?: string;
}) {
  const fmt = (v: number) =>
    `${v.toLocaleString("et-EE", { maximumFractionDigits: 1 })} ${unit}`;
  return (
    <div className="chart-wrap">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="#2E4C40" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#A8B2A4", fontSize: 12 }}
            stroke="#456554"
            interval={0}
          />
          <YAxis
            tick={{ fill: "#A8B2A4", fontSize: 11 }}
            stroke="#456554"
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    fill: "#7E8A7B",
                    fontSize: 11,
                    dy: 20,
                  }
                : undefined
            }
          />
          <Tooltip
            cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
            content={
              ((props: {
                active?: boolean;
                payload?: ReadonlyArray<{
                  value?: unknown;
                  payload?: { label?: string };
                }>;
              }) => {
                const { active, payload } = props;
                if (!active || !payload || !payload[0]) return null;
                const p = payload[0];
                return (
                  <div className="chart-tooltip">
                    <div className="tt-label">{p.payload?.label}</div>
                    <div className="tt-row">
                      <span className="tt-value">{fmt(Number(p.value))}</span>
                    </div>
                  </div>
                );
              }) as never
            }
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            <LabelList
              dataKey="value"
              position="top"
              fill="#F0EBDE"
              fontSize={12}
              formatter={(value) =>
                Number(value).toLocaleString("et-EE", {
                  maximumFractionDigits: 1,
                })
              }
            />
            {data.map((d, i) => (
              <Cell key={i} fill={d.color ?? "#93b86a"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
