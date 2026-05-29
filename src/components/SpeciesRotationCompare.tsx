import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { makeTooltip } from "./Tooltip";
import { fmtNumber } from "./format";
import { SPECIES, type SpeciesId, type SiteId } from "../forestry/species";
import {
  DEFAULT_COSTS,
  DEFAULT_PRICES,
  biologicalRotation,
  growthSeries,
  revenueAtAge,
} from "../forestry/model";
import { LEGAL_MIN } from "../forestry/legal";

const SITE_ID: SiteId = "medium";

const tooltip = makeTooltip(
  (label) => `Vanus ${label} aastat`,
  [
    {
      name: "Keskmine juurdekasv (MAI)",
      key: "mai",
      color: "#d4a373",
      format: (v) => `${fmtNumber(v, 2)} m³/ha/a`,
    },
    {
      name: "Jooksev juurdekasv (CAI)",
      key: "cai",
      color: "#c47e3e",
      format: (v) => `${fmtNumber(v, 2)} m³/ha/a`,
    },
  ],
);

/**
 * Undiscounted economic optimum: age that maximizes average net revenue per
 * year. Without discounting, LEV is undefined (perpetuity has no time cost),
 * so we use net/t — analogous to MAI but in money. Balances volume growth
 * against assortment value-shift (pulp → sawlog → veneer).
 */
function undiscountedEconomicRotation(speciesId: SpeciesId): number {
  const fixedCosts =
    DEFAULT_COSTS.establishment +
    DEFAULT_COSTS.tending +
    DEFAULT_COSTS.preCommercialThinning;
  let bestAge = 60;
  let bestMetric = -Infinity;
  for (let t = 20; t <= 140; t += 1) {
    const rev = revenueAtAge(t, speciesId, SITE_ID, DEFAULT_PRICES, DEFAULT_COSTS);
    const metric = (rev.net - fixedCosts) / t;
    if (metric > bestMetric) {
      bestMetric = metric;
      bestAge = t;
    }
  }
  return bestAge;
}

export function SpeciesRotationCompare({
  speciesId,
  onClose,
}: {
  speciesId: SpeciesId;
  onClose: () => void;
}) {
  const species = SPECIES[speciesId];
  const legal = LEGAL_MIN[speciesId];

  const { data, bioAge, ecoAge } = useMemo(() => {
    const series = growthSeries(speciesId, SITE_ID, 140, 1).map((p) => ({
      age: p.age,
      mai: p.mai,
      cai: p.cai,
    }));
    const bio = biologicalRotation(speciesId, SITE_ID);
    const eco = undiscountedEconomicRotation(speciesId);
    return { data: series, bioAge: bio.age, ecoAge: eco };
  }, [speciesId]);

  return (
    <div className="panel">
      <div className="section-title">
        <h2>
          Majanduslik vs bioloogiline raievanus — {species.name}
        </h2>
        <button className="back-btn" onClick={onClose}>
          Sulge ✕
        </button>
      </div>
      <p style={{ marginBottom: 12 }}>
        Eeldused: keskmine kasvukoht, vaikehinnad ja -kulud. Intressi ei ole
        arvesse võetud.
      </p>
      <div className="chart-wrap tall">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 24, right: 28, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              stroke="#263a32"
              strokeDasharray="3 4"
              vertical={false}
            />
            <XAxis
              dataKey="age"
              type="number"
              domain={[0, 140]}
              ticks={[
                0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,
              ]}
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              label={{
                value: "Vanus (aastat)",
                position: "insideBottom",
                offset: -2,
                fill: "#6f857c",
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fill: "#a4b7af", fontSize: 11 }}
              stroke="#355044"
              label={{
                value: "m³/ha/a",
                angle: -90,
                position: "insideLeft",
                fill: "#6f857c",
                fontSize: 11,
                dy: 30,
              }}
            />
            <Tooltip
              content={tooltip as never}
              cursor={{ stroke: "#4ade80", strokeOpacity: 0.4 }}
            />
            <Line
              type="monotone"
              dataKey="mai"
              stroke="#d4a373"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="cai"
              stroke="#c47e3e"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceLine
              x={bioAge}
              stroke="#93b86a"
              strokeDasharray="2 4"
              label={{
                value: `Bioloogiline ${bioAge}a`,
                fill: "#93b86a",
                fontSize: 11,
                position: "top",
              }}
            />
            <ReferenceLine
              x={ecoAge}
              stroke="#4ade80"
              strokeDasharray="2 4"
              label={{
                value: `Majanduslik ${ecoAge}a`,
                fill: "#4ade80",
                fontSize: 11,
                position: "top",
              }}
            />
            <ReferenceLine
              x={legal.minAge}
              stroke="#f87171"
              strokeDasharray="2 4"
              label={{
                value: `Seadus ${legal.minAge}a (Ø ${legal.minDbh} cm)`,
                fill: "#f87171",
                fontSize: 11,
                position: "insideTopRight",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        <span className="legend-chip">
          <span className="legend-dot" style={{ background: "#d4a373" }} />
          Keskmine juurdekasv (MAI)
        </span>
        <span className="legend-chip">
          <span className="legend-dot" style={{ background: "#c47e3e" }} />
          Jooksev juurdekasv (CAI)
        </span>
        <span className="legend-chip">
          <span className="legend-dot" style={{ background: "#93b86a" }} />
          Bioloogiline raievanus
        </span>
        <span className="legend-chip">
          <span className="legend-dot" style={{ background: "#4ade80" }} />
          Majanduslik raievanus
        </span>
        <span className="legend-chip">
          <span className="legend-dot" style={{ background: "#f87171" }} />
          Seaduslik miinimum (Metsaseadus § 29)
        </span>
      </div>
      <p className="story-takeaway" style={{ marginTop: 12 }}>
        <strong>Bioloogiliselt</strong> oleks {species.name.toLowerCase()}{" "}
        raievanus {bioAge} aastat — siis on keskmine juurdekasv (MAI)
        maksimaalne ja puit kasvab kõige kiiremini.{" "}
        <strong>Majanduslikult</strong> tasub raiuda {ecoAge} aastaselt (
        {ecoAge - bioAge} aastat hiljem), sest vanemates puudes on suurem
        osakaal palgil ja spoonipakul, mis on paberipuidust kallimad — seega
        keskmine netotulu hektari ja aasta kohta on suurim hilisemas eas.{" "}
        <strong>Eesti Metsaseaduse</strong> järgi (§ 29) tohib{" "}
        {species.name.toLowerCase()} uuendusraiet teha alates{" "}
        {legal.minAge} aastast või kui keskmine rinnasümbermõõt on vähemalt{" "}
        {legal.minCircumference} cm (rinnasdiameeter ≥ {legal.minDbh} cm,
        II boniteet).
      </p>
    </div>
  );
}
