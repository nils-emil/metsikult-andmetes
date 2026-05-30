import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { fmtNumber } from "./format";
import { makeTooltip } from "./Tooltip";
import {
  CLASS_LABELS,
  NUM_CLASSES,
  SPECIES_NAMES,
  type SimulationStep,
} from "../forestry/simulation";
import { STAND_AGES, type SpeciesName } from "../data/standAges";
import {
  HISTORICAL_DECADES,
  SIM_BASE_YEAR,
} from "../data/historicalForest";

export type BreakdownView = "species" | "assortment" | "class";

interface Props {
  run: SimulationStep[];
  currentYear: number;
  viewMode: BreakdownView;
  onViewModeChange: (m: BreakdownView) => void;
  scenarioIndex: 0 | 1 | 2;
  onScenarioChange: (i: 0 | 1 | 2) => void;
  scenarioLabels: [string, string, string];
  scenarioColors: [string, string, string];
}

const ASSORTMENT_COLORS = {
  pulp: "#93b86a",
  saw: "#d4a373",
  veneer: "#c47e3e",
};
const ASSORTMENT_LABELS = {
  pulp: "Paberipuit",
  saw: "Palk",
  veneer: "Spoonipakk",
};

// Sequential young (green) → old (warm brown) palette for the 15 classes.
const CLASS_COLORS = [
  "#B6D24A",
  "#5bd07a",
  "#76c374",
  "#8fb56a",
  "#a3a85e",
  "#b69b54",
  "#c4904a",
  "#cf8540",
  "#d57b39",
  "#d57033",
  "#cf6630",
  "#c25c2e",
  "#a85129",
  "#8d4622",
  "#6f3b1c",
];

const SIM_DECADE_OFFSETS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

interface Row {
  year: number;
  historical: boolean;
  simYear: number | null;
  [field: string]: number | boolean | null;
}

export function SimulationBreakdownChart({
  run,
  currentYear,
  viewMode,
  onViewModeChange,
  scenarioIndex,
  onScenarioChange,
  scenarioLabels,
  scenarioColors,
}: Props) {
  const colors = STAND_AGES.puuliikide_varvid;
  const currentDecade = Math.round(currentYear / 10) * 10;

  const data = useMemo<Row[]>(() => {
    const out: Row[] = [];
    const ref = run?.[0];

    const fillRow = (
      row: Row,
      bySpecies: Record<SpeciesName, number>,
      byAssortment: { pulp: number; saw: number; veneer: number },
      byClass: number[],
    ) => {
      if (viewMode === "species") {
        for (const name of SPECIES_NAMES) row[name] = bySpecies[name];
      } else if (viewMode === "assortment") {
        row.pulp = byAssortment.pulp;
        row.saw = byAssortment.saw;
        row.veneer = byAssortment.veneer;
      } else {
        for (let i = 0; i < NUM_CLASSES; i++) row[`c${i}`] = byClass[i];
      }
    };

    if (ref && ref.total > 0) {
      // Historical: scale the year-0 simulation breakdown by the ratio of
      // historical-total / current-total. Assumes broadly similar species,
      // assortment and age composition through the last century — a coarse
      // approximation flagged in the source note.
      for (const h of HISTORICAL_DECADES) {
        const ratio = h.totalMm3 / ref.total;
        const row: Row = {
          year: h.year,
          historical: true,
          simYear: null,
        };
        const bySpecies = {} as Record<SpeciesName, number>;
        for (const n of SPECIES_NAMES) bySpecies[n] = ref.bySpecies[n] * ratio;
        const byAssortment = {
          pulp: ref.byAssortment.pulp * ratio,
          saw: ref.byAssortment.saw * ratio,
          veneer: ref.byAssortment.veneer * ratio,
        };
        const byClass = ref.byClass.map((v) => v * ratio);
        fillRow(row, bySpecies, byAssortment, byClass);
        out.push(row);
      }
    }

    for (const off of SIM_DECADE_OFFSETS) {
      const step = run?.[off];
      const row: Row = {
        year: SIM_BASE_YEAR + off,
        historical: false,
        simYear: off,
      };
      if (step) {
        fillRow(row, step.bySpecies, step.byAssortment, step.byClass);
      }
      out.push(row);
    }

    return out;
  }, [run, viewMode]);

  const cellOpacity = (row: Row): number => {
    if (row.historical) return 1;
    if (row.simYear === null) return 0.35;
    return row.simYear <= currentDecade ? 1 : 0.35;
  };

  const tooltip = useMemo(() => {
    const formatV = (v: number) => `${fmtNumber(v, 1)} M m³`;
    const labelFn = (label: number | string) => {
      const y = Number(label);
      const era = y < SIM_BASE_YEAR ? " (ajalooline)" : "";
      return `Aasta ${y}${era}`;
    };
    if (viewMode === "species") {
      const rows = [...SPECIES_NAMES].reverse().map((name: SpeciesName) => ({
        name,
        key: name,
        color: colors[name],
        format: formatV,
      }));
      return makeTooltip(labelFn, rows);
    }
    if (viewMode === "assortment") {
      return makeTooltip(labelFn, [
        {
          name: ASSORTMENT_LABELS.veneer,
          key: "veneer",
          color: ASSORTMENT_COLORS.veneer,
          format: formatV,
        },
        {
          name: ASSORTMENT_LABELS.saw,
          key: "saw",
          color: ASSORTMENT_COLORS.saw,
          format: formatV,
        },
        {
          name: ASSORTMENT_LABELS.pulp,
          key: "pulp",
          color: ASSORTMENT_COLORS.pulp,
          format: formatV,
        },
      ]);
    }
    const rows = [];
    for (let i = NUM_CLASSES - 1; i >= 0; i--) {
      rows.push({
        name: `${CLASS_LABELS[i]} a`,
        key: `c${i}`,
        color: CLASS_COLORS[i],
        format: formatV,
      });
    }
    return makeTooltip(labelFn, rows);
  }, [viewMode, colors]);

  const xTicks = [1960, 1980, 2000, 2020, 2040, 2060, 2080, 2100, 2120];

  return (
    <div>
      <div className="sim-tabs-row">
        <div className="sim-tabs">
          <button
            type="button"
            className={
              "sim-tab" + (viewMode === "species" ? " sim-tab-active" : "")
            }
            onClick={() => onViewModeChange("species")}
          >
            Liigi järgi
          </button>
          <button
            type="button"
            className={
              "sim-tab" + (viewMode === "assortment" ? " sim-tab-active" : "")
            }
            onClick={() => onViewModeChange("assortment")}
          >
            Sortimendi järgi
          </button>
          <button
            type="button"
            className={
              "sim-tab" + (viewMode === "class" ? " sim-tab-active" : "")
            }
            onClick={() => onViewModeChange("class")}
          >
            Vanuseklassi järgi
          </button>
        </div>
        <div className="sim-tabs">
          {scenarioLabels.map((label, i) => {
            const active = scenarioIndex === i;
            return (
              <button
                key={label}
                type="button"
                className={"sim-tab" + (active ? " sim-tab-active" : "")}
                style={
                  active
                    ? {
                        borderColor: scenarioColors[i],
                        color: scenarioColors[i],
                      }
                    : undefined
                }
                onClick={() => onScenarioChange(i as 0 | 1 | 2)}
              >
                <span
                  className="sim-dot"
                  style={{ background: scenarioColors[i] }}
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="chart-wrap tall">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 18 }}
          >
            <CartesianGrid
              stroke="#E1E5E8"
              strokeDasharray="3 4"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "#4A5A60", fontSize: 11 }}
              stroke="#7A8990"
              ticks={xTicks}
              interval={0}
              label={{
                value: "Aasta",
                position: "insideBottom",
                offset: -8,
                fill: "#7A8990",
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fill: "#4A5A60", fontSize: 11 }}
              stroke="#7A8990"
              label={{
                value: "M m³",
                angle: -90,
                position: "insideLeft",
                fill: "#7A8990",
                fontSize: 11,
                dy: 20,
              }}
            />
            <Tooltip
              content={tooltip as never}
              cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
            />
            <ReferenceLine
              x={SIM_BASE_YEAR}
              stroke="#1A2B30"
              strokeOpacity={0.5}
              strokeDasharray="2 4"
              label={{
                value: "Simulatsiooni algus",
                fill: "#4A5A60",
                fontSize: 10,
                position: "top",
              }}
            />
            {viewMode === "species" &&
              SPECIES_NAMES.map((name: SpeciesName) => (
                <Bar
                  key={name}
                  dataKey={name}
                  stackId="sim"
                  fill={colors[name]}
                  isAnimationActive={false}
                >
                  {data.map((row) => (
                    <Cell key={row.year} fillOpacity={cellOpacity(row)} />
                  ))}
                </Bar>
              ))}
            {viewMode === "assortment" &&
              (
                [
                  { key: "pulp", fill: ASSORTMENT_COLORS.pulp },
                  { key: "saw", fill: ASSORTMENT_COLORS.saw },
                  { key: "veneer", fill: ASSORTMENT_COLORS.veneer },
                ] as const
              ).map((b) => (
                <Bar
                  key={b.key}
                  dataKey={b.key}
                  stackId="sim"
                  fill={b.fill}
                  isAnimationActive={false}
                >
                  {data.map((row) => (
                    <Cell key={row.year} fillOpacity={cellOpacity(row)} />
                  ))}
                </Bar>
              ))}
            {viewMode === "class" &&
              CLASS_COLORS.map((color, i) => (
                <Bar
                  key={i}
                  dataKey={`c${i}`}
                  stackId="sim"
                  fill={color}
                  isAnimationActive={false}
                >
                  {data.map((row) => (
                    <Cell key={row.year} fillOpacity={cellOpacity(row)} />
                  ))}
                </Bar>
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        {viewMode === "species" &&
          [...SPECIES_NAMES].reverse().map((name) => (
            <span className="legend-chip" key={name}>
              <span
                className="legend-dot"
                style={{ background: colors[name] }}
              />
              {name}
            </span>
          ))}
        {viewMode === "assortment" && (
          <>
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: ASSORTMENT_COLORS.pulp }}
              />
              {ASSORTMENT_LABELS.pulp}
            </span>
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: ASSORTMENT_COLORS.saw }}
              />
              {ASSORTMENT_LABELS.saw}
            </span>
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: ASSORTMENT_COLORS.veneer }}
              />
              {ASSORTMENT_LABELS.veneer}
            </span>
          </>
        )}
        {viewMode === "class" && (
          <>
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: CLASS_COLORS[0] }}
              />
              Noor (≤10 a)
            </span>
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: CLASS_COLORS[7] }}
              />
              Keskealine (~75 a)
            </span>
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: CLASS_COLORS[14] }}
              />
              Vana (141+ a)
            </span>
          </>
        )}
      </div>
    </div>
  );
}
