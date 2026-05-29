import {
  type HabitatRow,
  PRIMARY_NEED_LABEL,
  LAYERS,
  LAYER_ORDER,
} from "../wildlife/habitat";
import type { Species } from "../wildlife/species";
import { STATUS_LABEL } from "../wildlife/species";

interface SpeciesDetailCardProps {
  species: Species;
  row: HabitatRow;
}

export function SpeciesDetailCard({ species, row }: SpeciesDetailCardProps) {
  const usingLayers = LAYER_ORDER.filter((lid) =>
    LAYERS[lid].speciesUsing.includes(species.id),
  );

  return (
    <div className="species-detail">
      <div className="species-detail-head">
        <span className="species-detail-emoji" aria-hidden>
          {species.emoji}
        </span>
        <div>
          <div className="species-detail-name">{species.name}</div>
          <div className="species-detail-latin">{species.latin}</div>
        </div>
        <span className="species-detail-status">
          {STATUS_LABEL[species.status]}
        </span>
      </div>
      <div className="species-detail-meta">
        <div>
          <div className="kpi-label">Primaarne vajadus</div>
          <div className="species-detail-need">
            {PRIMARY_NEED_LABEL[row.primaryNeed]}
          </div>
        </div>
        <div>
          <div className="kpi-label">Mass</div>
          <div className="species-detail-mass">
            {species.bodyMassKg[0]}–{species.bodyMassKg[1]} kg
          </div>
        </div>
      </div>
      <div className="species-detail-block">
        <div className="kpi-label">Varjualune</div>
        <p>{row.shelter}</p>
      </div>
      <div className="species-detail-block">
        <div className="kpi-label">Toit</div>
        <p>{row.food}</p>
      </div>
      {row.notes && (
        <div className="species-detail-block">
          <div className="kpi-label">Märkmed</div>
          <p>{row.notes}</p>
        </div>
      )}
      <div className="species-detail-block">
        <div className="kpi-label">Kasutab kihte</div>
        <div className="species-strip">
          {usingLayers.map((lid) => (
            <span key={lid} className="species-chip">
              {LAYERS[lid].label}
            </span>
          ))}
          {usingLayers.length === 0 && (
            <span style={{ color: "var(--text-mute)", fontSize: 12 }}>
              kihistus pole oluline
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
