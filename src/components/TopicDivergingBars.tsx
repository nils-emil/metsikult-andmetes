import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DivPoint {
  label: string;
  value: number;
}

const SINK = "#B6D24A"; // siduja (negatiivne)
const SOURCE = "#f87171"; // heitja (positiivne)

export function TopicDivergingBars({
  data,
  unit,
}: {
  data: DivPoint[];
  unit: string;
}) {
  const fmt = (v: number) =>
    `${v > 0 ? "+" : ""}${v.toLocaleString("et-EE", {
      maximumFractionDigits: 1,
    })} ${unit}`;
  return (
    <>
      <div className="chart-wrap">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 8, bottom: 10 }}
          >
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
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
                fill: "#7E8A7B",
                fontSize: 11,
                dy: 30,
              }}
            />
            <ReferenceLine y={0} stroke="#7E8A7B" strokeWidth={1.2} />
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="value"
                position="top"
                fill="#F0EBDE"
                fontSize={12}
                formatter={(value) => fmt(Number(value))}
              />
              {data.map((d, i) => (
                <Cell key={i} fill={d.value < 0 ? SINK : SOURCE} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        <span className="legend-chip">
          <span className="legend-dot" style={{ background: SINK }} />
          Süsiniku siduja (−)
        </span>
        <span className="legend-chip">
          <span className="legend-dot" style={{ background: SOURCE }} />
          Süsiniku heitja (+)
        </span>
      </div>
    </>
  );
}
