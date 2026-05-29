import {
  type HabitatRow,
  suitabilityColor,
  suitabilityLabel,
  type Suitability,
} from "../wildlife/habitat";
import type { AgeClass, Species, SpeciesId } from "../wildlife/species";
import { STATUS_LABEL } from "../wildlife/species";

interface SpeciesAgeMatrixProps {
  rows: HabitatRow[];
  ageClasses: AgeClass[];
  speciesById: Record<SpeciesId, Species>;
  selected: SpeciesId | null;
  onSelect(id: SpeciesId): void;
}

export function SpeciesAgeMatrix({
  rows,
  ageClasses,
  speciesById,
  selected,
  onSelect,
}: SpeciesAgeMatrixProps) {
  return (
    <div className="species-matrix-wrap">
      <table className="species-matrix">
        <thead>
          <tr>
            <th className="species-matrix-spec-h">Liik</th>
            {ageClasses.map((c) => (
              <th key={c.id} className="species-matrix-age-h">
                <div className="species-matrix-age-label">{c.label}</div>
                <div className="species-matrix-age-sub">{c.ageRange}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const sp = speciesById[row.species];
            const isSelected = selected === row.species;
            return (
              <tr
                key={row.species}
                className={
                  "species-matrix-row" +
                  (isSelected ? " species-matrix-row-selected" : "")
                }
                onClick={() => onSelect(row.species)}
              >
                <th scope="row" className="species-matrix-spec">
                  <span className="species-matrix-emoji" aria-hidden>
                    {sp.emoji}
                  </span>
                  <span className="species-matrix-name">{sp.name}</span>
                  <span className="species-matrix-status">
                    {STATUS_LABEL[sp.status]}
                  </span>
                </th>
                {ageClasses.map((c) => {
                  const v = row.byClass[c.id] as Suitability;
                  return (
                    <td
                      key={c.id}
                      className="suitability-cell"
                      title={`${sp.name} × ${c.label}: ${suitabilityLabel(v)}`}
                      style={{ background: suitabilityColor(v) }}
                    >
                      <span className="suitability-cell-text">{v}</span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
