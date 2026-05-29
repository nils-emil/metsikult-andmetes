import {
  type ConservationTool,
  TOOL_ICON,
} from "../wildlife/conservation";
import type { Species, SpeciesId } from "../wildlife/species";

interface ConservationToolGridProps {
  tools: ConservationTool[];
  speciesById: Record<SpeciesId, Species>;
}

export function ConservationToolGrid({
  tools,
  speciesById,
}: ConservationToolGridProps) {
  return (
    <div className="conservation-grid">
      {tools.map((tool) => (
        <div className="conservation-card" key={tool.id}>
          <div className="conservation-head">
            <span className="conservation-icon" aria-hidden>
              {TOOL_ICON[tool.id]}
            </span>
            <div>
              <div className="conservation-label">{tool.label}</div>
              <div className="conservation-legal">{tool.legalBasis}</div>
            </div>
          </div>
          <p className="conservation-desc">{tool.shortDesc}</p>
          <div className="conservation-block">
            <div className="kpi-label">Kaitseb</div>
            <div className="species-strip">
              {tool.protects.map((sid) => {
                const sp = speciesById[sid];
                return (
                  <span
                    key={sid}
                    className="species-chip"
                    title={sp.latin}
                  >
                    <span className="species-chip-emoji" aria-hidden>
                      {sp.emoji}
                    </span>
                    {sp.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="conservation-block">
            <div className="kpi-label">Kate</div>
            <div className="conservation-coverage">{tool.coverage}</div>
          </div>
          {tool.mak2030Link && (
            <div className="conservation-block conservation-mak">
              <div className="kpi-label">MAK2030</div>
              <div className="conservation-mak-text">{tool.mak2030Link}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
