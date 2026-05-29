import type { Layer, LayerId } from "../wildlife/habitat";
import type { Species, SpeciesId } from "../wildlife/species";

interface ForestLayersDiagramProps {
  layers: Layer[];
  selectedLayer: LayerId | null;
  onSelect(id: LayerId | null): void;
  clearedView?: boolean;
  speciesById: Record<SpeciesId, Species>;
}

const LAYER_FILL: Record<LayerId, string> = {
  vora: "#2d5a3a",
  alusmets: "#3a6b48",
  poosarinne: "#4a7a3a",
  rohurinne: "#6d8a48",
  maapind: "#5a4a30",
  lamapuit: "#6a4530",
};

const STRIPE_LAYERS: LayerId[] = [
  "vora",
  "alusmets",
  "poosarinne",
  "rohurinne",
  "lamapuit",
];

export function ForestLayersDiagram({
  layers,
  selectedLayer,
  onSelect,
  clearedView = false,
  speciesById,
}: ForestLayersDiagramProps) {
  return (
    <div className="layers-diagram">
      <svg
        viewBox="0 0 800 460"
        preserveAspectRatio="xMidYMid meet"
        className="layers-svg"
        role="img"
        aria-label={
          clearedView ? "Mets pärast lageraiet" : "Küps mets kihiti"
        }
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2a26" />
            <stop offset="100%" stopColor="#10211A" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={800} height={460} fill="url(#sky)" />
        {layers.map((layer) => {
          const isSelected = selectedLayer === layer.id;
          const isHidden = clearedView && STRIPE_LAYERS.includes(layer.id);
          const opacity = isHidden ? 0.16 : isSelected ? 1 : 0.78;
          const y = (layer.yPercent / 100) * 460;
          const h = (layer.heightPercent / 100) * 460;
          return (
            <g key={layer.id} className="layer-band-group">
              <rect
                x={0}
                y={y}
                width={800}
                height={h}
                fill={LAYER_FILL[layer.id]}
                opacity={opacity}
                onClick={() => onSelect(isSelected ? null : layer.id)}
                style={{ cursor: "pointer" }}
              />
              {isSelected && (
                <rect
                  x={1}
                  y={y + 1}
                  width={798}
                  height={h - 2}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2}
                />
              )}
              <text
                x={20}
                y={y + h / 2 + 5}
                fill="#ecf3ef"
                fontSize={14}
                fontWeight={600}
                opacity={isHidden ? 0.45 : 0.95}
                style={{
                  pointerEvents: "none",
                  textDecoration: isHidden ? "line-through" : undefined,
                }}
              >
                {layer.label}
              </text>
              {!isHidden && (
                <g
                  transform={`translate(${800 - 40}, ${y + h / 2})`}
                  style={{ pointerEvents: "none" }}
                >
                  {layer.speciesUsing.slice(0, 5).map((sid, i) => {
                    const sp = speciesById[sid];
                    if (!sp) return null;
                    return (
                      <text
                        key={sid}
                        x={-i * 24}
                        y={5}
                        fontSize={18}
                        textAnchor="middle"
                      >
                        {sp.emoji}
                      </text>
                    );
                  })}
                </g>
              )}
              {clearedView && layer.id === "maapind" && (
                <text
                  x={400}
                  y={y + h / 2 + 5}
                  fill="#d4a373"
                  fontSize={12}
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  ↯ mehaaniliselt häiritud
                </text>
              )}
            </g>
          );
        })}
        {clearedView && (
          <g style={{ pointerEvents: "none" }}>
            {[120, 260, 380, 540, 660].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1={385}
                x2={x}
                y2={415}
                stroke="#3a2a1f"
                strokeWidth={6}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
