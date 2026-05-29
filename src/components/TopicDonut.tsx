import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Segment {
  label: string;
  value: number;
  color: string;
}

const fmtSeg = (unit: string | undefined) => (v: number) =>
  `${v.toLocaleString("et-EE", { maximumFractionDigits: 1 })}${unit ? ` ${unit}` : ""}`;

export function TopicDonut({
  segments,
  unit,
}: {
  segments: Segment[];
  unit?: string;
}) {
  const format = fmtSeg(unit);
  return (
    <>
      <div className="chart-wrap">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="#10211A"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {segments.map((s) => (
                <Cell key={s.label} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
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
                        <span className="tt-value">{format(Number(p.value))}</span>
                      </div>
                    </div>
                  );
                }) as never
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        {segments.map((s) => (
          <span className="legend-chip" key={s.label}>
            <span className="legend-dot" style={{ background: s.color }} />
            {s.label} — <strong>{format(s.value)}</strong>
          </span>
        ))}
      </div>
    </>
  );
}
