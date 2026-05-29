import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { makeTooltip } from "./Tooltip";
import {
  SPECIES_ORDER,
  STAND_AGES,
  type SpeciesName,
  type StandAgesRow,
} from "../data/standAges";

const fmtArea = (v: number) => `${v.toFixed(1)} tuh ha`;

const MODELED: Record<SpeciesName, boolean> = {
  Mänd: true,
  Kuusk: true,
  Kask: true,
  Haab: false,
  Sanglepp: false,
  "Hall lepp": false,
  Teised: false,
};

export function StandAgesChart({
  data,
  selectedSpecies,
  onSelectSpecies,
}: {
  data: StandAgesRow[];
  selectedSpecies: SpeciesName | null;
  onSelectSpecies: (name: SpeciesName | null) => void;
}) {
  const colors = STAND_AGES.puuliikide_varvid;

  const tooltipRows: {
    name: string;
    key: string;
    color: string;
    format: (v: number) => string;
  }[] = [...SPECIES_ORDER].reverse().map((name) => ({
    name,
    key: name,
    color: colors[name],
    format: fmtArea,
  }));
  tooltipRows.push({
    name: "Kokku",
    key: "total",
    color: "#F0EBDE",
    format: fmtArea,
  });

  const tooltip = makeTooltip(
    (label) => `Vanuseklass ${label} a`,
    tooltipRows,
  );

  return (
    <div className="chart-wrap tall">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 18 }}
        >
          <CartesianGrid
            stroke="#2E4C40"
            strokeDasharray="3 4"
            vertical={false}
          />
          <XAxis
            dataKey="klass"
            tick={{ fill: "#A8B2A4", fontSize: 11 }}
            stroke="#456554"
            interval={0}
            label={{
              value: "Vanuseklass (aastat)",
              position: "insideBottom",
              offset: -8,
              fill: "#7E8A7B",
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fill: "#A8B2A4", fontSize: 11 }}
            stroke="#456554"
            label={{
              value: "tuh ha",
              angle: -90,
              position: "insideLeft",
              fill: "#7E8A7B",
              fontSize: 11,
              dy: 20,
            }}
          />
          <Tooltip
            content={tooltip as never}
            cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
          />
          {SPECIES_ORDER.map((name: SpeciesName) => {
            const modeled = MODELED[name];
            const isSelected = selectedSpecies === name;
            let opacity = 1;
            if (!modeled) opacity = 0.35;
            else if (selectedSpecies && !isSelected) opacity = 0.45;
            return (
              <Bar
                key={name}
                dataKey={name}
                stackId="stand"
                fill={colors[name]}
                fillOpacity={opacity}
                stroke={isSelected ? "#F0EBDE" : undefined}
                strokeWidth={isSelected ? 1.2 : 0}
                className={modeled ? "bar-clickable" : undefined}
                onClick={
                  modeled
                    ? () => onSelectSpecies(isSelected ? null : name)
                    : undefined
                }
                isAnimationActive={false}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
