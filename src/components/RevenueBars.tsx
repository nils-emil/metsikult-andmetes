import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtMoneyFull } from "./format";

interface BarPoint {
  category: string;
  value: number;
  color: string;
}

export function RevenueBars({ data }: { data: BarPoint[] }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="#263a32" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            interval={0}
          />
          <YAxis
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            tickFormatter={(v) => {
              const n = v as number;
              const abs = Math.abs(n);
              if (abs >= 1000) return `€${(n / 1000).toFixed(0)}k`;
              return `€${Math.round(n)}`;
            }}
          />
          <Tooltip
            cursor={{ fill: "rgba(74,222,128,0.06)" }}
            content={((props: { active?: boolean; payload?: ReadonlyArray<{ value?: unknown; payload?: { category?: string } }> }) => {
              const { active, payload } = props;
              if (!active || !payload || !payload[0]) return null;
              const p = payload[0];
              return (
                <div className="chart-tooltip">
                  <div className="tt-label">{p.payload?.category}</div>
                  <div className="tt-row">
                    <span className="tt-name">Väärtus</span>
                    <span className="tt-value">{fmtMoneyFull(Number(p.value))}</span>
                  </div>
                </div>
              );
            }) as never}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
