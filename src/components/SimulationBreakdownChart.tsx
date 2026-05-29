import {
  Bar,
  BarChart,
  CartesianGrid,
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
  "#4ade80",
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

  const decades = useMemo(() => {
    const upTo = Math.floor(currentYear / 10) * 10;
    const out: number[] = [];
    for (let y = 0; y <= 100; y += 10) {
      if (y <= upTo) out.push(y);
    }
    return out;
  }, [currentYear]);

  const data = useMemo(() => {
    return decades.map((year) => {
      const step = run[year];
      const row: Record<string, number | string> = { year };
      if (viewMode === "species") {
        for (const name of SPECIES_NAMES) {
          row[name] = step.bySpecies[name];
        }
      } else if (viewMode === "assortment") {
        row.pulp = step.byAssortment.pulp;
        row.saw = step.byAssortment.saw;
        row.veneer = step.byAssortment.veneer;
      } else {
        for (let i = 0; i < NUM_CLASSES; i++) {
          row[`c${i}`] = step.byClass[i];
        }
      }
      return row;
    });
  }, [run, decades, viewMode]);

  const tooltip = useMemo(() => {
    const formatV = (v: number) => `${fmtNumber(v, 1)} M m³`;
    if (viewMode === "species") {
      const rows = [...SPECIES_NAMES].reverse().map((name: SpeciesName) => ({
        name,
        key: name,
        color: colors[name],
        format: formatV,
      }));
      return makeTooltip((label) => `Aasta ${label}`, rows);
    }
    if (viewMode === "assortment") {
      return makeTooltip((label) => `Aasta ${label}`, [
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
    return makeTooltip((label) => `Aasta ${label}`, rows);
  }, [viewMode, colors]);

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
              stroke="#263a32"
              strokeDasharray="3 4"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              label={{
                value: "Aastakümme",
                position: "insideBottom",
                offset: -8,
                fill: "#6f857c",
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              label={{
                value: "M m³",
                angle: -90,
                position: "insideLeft",
                fill: "#6f857c",
                fontSize: 11,
                dy: 20,
              }}
            />
            <Tooltip
              content={tooltip as never}
              cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
            />
            {viewMode === "species" &&
              SPECIES_NAMES.map((name: SpeciesName) => (
                <Bar
                  key={name}
                  dataKey={name}
                  stackId="sim"
                  fill={colors[name]}
                  isAnimationActive={false}
                />
              ))}
            {viewMode === "assortment" && (
              <>
                <Bar
                  dataKey="pulp"
                  stackId="sim"
                  fill={ASSORTMENT_COLORS.pulp}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="saw"
                  stackId="sim"
                  fill={ASSORTMENT_COLORS.saw}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="veneer"
                  stackId="sim"
                  fill={ASSORTMENT_COLORS.veneer}
                  isAnimationActive={false}
                />
              </>
            )}
            {viewMode === "class" &&
              CLASS_COLORS.map((color, i) => (
                <Bar
                  key={i}
                  dataKey={`c${i}`}
                  stackId="sim"
                  fill={color}
                  isAnimationActive={false}
                />
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
