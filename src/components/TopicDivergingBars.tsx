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

const SINK = "#4ade80"; // siduja (negatiivne)
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
            <CartesianGrid stroke="#263a32" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#a4b7af", fontSize: 12 }}
              stroke="#355044"
              interval={0}
            />
            <YAxis
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
                fill: "#6f857c",
                fontSize: 11,
                dy: 30,
              }}
            />
            <ReferenceLine y={0} stroke="#6f857c" strokeWidth={1.2} />
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
                fill="#ecf3ef"
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
