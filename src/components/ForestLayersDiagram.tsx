import type { JSX } from "react";
import type { Layer, LayerId } from "../wildlife/habitat";
import type { Species, SpeciesId } from "../wildlife/species";

interface ForestLayersDiagramProps {
  layers: Layer[];
  selectedLayer: LayerId | null;
  onSelect(id: LayerId | null): void;
  clearedView?: boolean;
  speciesById: Record<SpeciesId, Species>;
}

const W = 800;
const H = 460;

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

/** Layered fir silhouette: trunk + three stacked triangles. */
function conifer(
  cx: number,
  baseY: number,
  height: number,
  width: number,
  fill: string,
  hi: string,
  key: string,
): JSX.Element {
  const trunkH = height * 0.12;
  const crownTop = baseY - height;
  const crownH = height - trunkH;
  const tiers = [0, 1, 2];
  return (
    <g key={key}>
      <rect
        x={cx - width * 0.05}
        y={baseY - trunkH}
        width={width * 0.1}
        height={trunkH}
        fill="#5a4326"
      />
      {tiers.map((k) => {
        const ty = crownTop + crownH * (k / 3) - (k > 0 ? crownH * 0.07 : 0);
        const by = crownTop + crownH * ((k + 1) / 3);
        const hw = width * (0.34 + k * 0.22);
        return (
          <polygon
            key={k}
            points={`${cx},${ty} ${cx - hw},${by} ${cx + hw},${by}`}
            fill={k === 0 ? hi : fill}
          />
        );
      })}
    </g>
  );
}

/** Rounded bush: a cluster of overlapping circles. */
function bush(
  cx: number,
  baseY: number,
  r: number,
  fill: string,
  hi: string,
  key: string,
): JSX.Element {
  return (
    <g key={key}>
      <circle cx={cx - r * 0.7} cy={baseY - r * 0.4} r={r * 0.7} fill={fill} />
      <circle cx={cx + r * 0.7} cy={baseY - r * 0.4} r={r * 0.7} fill={fill} />
      <circle cx={cx} cy={baseY - r} r={r * 0.85} fill={hi} />
    </g>
  );
}

/** Fan of grass blades + a couple of berries. */
function grassTuft(
  cx: number,
  baseY: number,
  h: number,
  key: string,
  berry?: string,
): JSX.Element {
  const blades = [-1, -0.5, 0, 0.5, 1];
  return (
    <g key={key}>
      {blades.map((b, i) => (
        <path
          key={i}
          d={`M ${cx} ${baseY} Q ${cx + b * h * 0.5} ${baseY - h * 0.6} ${
            cx + b * h
          } ${baseY - h}`}
          stroke="#8aa84f"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {berry && (
        <circle cx={cx + h * 0.3} cy={baseY - h * 0.45} r={2.6} fill={berry} />
      )}
    </g>
  );
}

/** Fallen log lying along the ground, with a cap mushroom or two. */
function log(
  x: number,
  cy: number,
  len: number,
  thick: number,
  key: string,
): JSX.Element {
  return (
    <g key={key}>
      <rect
        x={x}
        y={cy - thick / 2}
        width={len}
        height={thick}
        rx={thick / 2}
        fill="#6a4530"
      />
      <ellipse cx={x + len} cy={cy} rx={thick * 0.32} ry={thick / 2} fill="#8a5d3c" />
      <ellipse cx={x + len} cy={cy} rx={thick * 0.18} ry={thick * 0.28} fill="#5a3a24" />
      {/* mushrooms */}
      <g>
        <rect x={x + len * 0.3} y={cy - thick * 0.75} width={2.5} height={thick * 0.45} fill="#e7d8b8" />
        <ellipse cx={x + len * 0.3 + 1.2} cy={cy - thick * 0.72} rx={6} ry={3.4} fill="#c87b50" />
        <rect x={x + len * 0.55} y={cy - thick * 0.68} width={2} height={thick * 0.4} fill="#e7d8b8" />
        <ellipse cx={x + len * 0.55 + 1} cy={cy - thick * 0.66} rx={4.5} ry={2.6} fill="#d68a5c" />
      </g>
    </g>
  );
}

/** Moss mounds + scattered seeds across the soil. */
function mossRow(baseY: number, key: string): JSX.Element {
  const mounds = [70, 200, 330, 470, 600, 720];
  return (
    <g key={key}>
      {mounds.map((x, i) => (
        <ellipse key={i} cx={x} cy={baseY - 3} rx={36} ry={9} fill="#6a7a3a" opacity={0.8} />
      ))}
      {[120, 280, 410, 560, 680].map((x, i) => (
        <circle key={`s${i}`} cx={x} cy={baseY - 14} r={2.2} fill="#caa35a" />
      ))}
    </g>
  );
}

function layerArt(id: LayerId, y: number, h: number): JSX.Element | null {
  const baseY = y + h;
  switch (id) {
    case "vora":
      return (
        <g>
          {conifer(140, baseY, h * 0.95, 90, "#1f6b3a", "#2e8a4d", "v1")}
          {conifer(330, baseY, h * 1.02, 100, "#1c5f34", "#2c8047", "v2")}
          {conifer(520, baseY, h * 0.9, 86, "#1f6b3a", "#2e8a4d", "v3")}
          {conifer(690, baseY, h * 0.98, 96, "#1c5f34", "#2c8047", "v4")}
        </g>
      );
    case "alusmets":
      return (
        <g>
          {conifer(90, baseY, h * 0.85, 56, "#2f7a44", "#3f9456", "a1")}
          {conifer(250, baseY, h * 0.78, 50, "#2a7040", "#3a8a50", "a2")}
          {conifer(430, baseY, h * 0.9, 60, "#2f7a44", "#3f9456", "a3")}
          {conifer(600, baseY, h * 0.8, 52, "#2a7040", "#3a8a50", "a4")}
          {conifer(730, baseY, h * 0.86, 56, "#2f7a44", "#3f9456", "a5")}
        </g>
      );
    case "poosarinne":
      return (
        <g>
          {bush(110, baseY, 26, "#3f7032", "#56913f", "b1")}
          {bush(290, baseY, 30, "#3a6a2e", "#52883c", "b2")}
          {bush(470, baseY, 24, "#3f7032", "#56913f", "b3")}
          {bush(640, baseY, 28, "#3a6a2e", "#52883c", "b4")}
          {bush(740, baseY, 22, "#3f7032", "#56913f", "b5")}
        </g>
      );
    case "rohurinne":
      return (
        <g>
          {grassTuft(80, baseY, 26, "g1", "#4a5a9a")}
          {grassTuft(190, baseY, 22, "g2", "#c0392b")}
          {grassTuft(300, baseY, 28, "g3")}
          {grassTuft(410, baseY, 24, "g4", "#4a5a9a")}
          {grassTuft(520, baseY, 26, "g5", "#c0392b")}
          {grassTuft(630, baseY, 22, "g6")}
          {grassTuft(730, baseY, 27, "g7", "#4a5a9a")}
        </g>
      );
    case "maapind":
      return mossRow(baseY, "moss");
    case "lamapuit":
      return (
        <g>
          {log(90, baseY - h * 0.45, 320, 22, "l1")}
          {log(470, baseY - h * 0.55, 250, 18, "l2")}
        </g>
      );
    default:
      return null;
  }
}

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
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="layers-svg"
        role="img"
        aria-label={clearedView ? "Mets pärast lageraiet" : "Küps mets kihiti"}
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2a26" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#sky)" />
        {layers.map((layer) => {
          const isSelected = selectedLayer === layer.id;
          const isHidden = clearedView && STRIPE_LAYERS.includes(layer.id);
          const opacity = isHidden ? 0.16 : isSelected ? 1 : 0.82;
          const y = (layer.yPercent / 100) * H;
          const h = (layer.heightPercent / 100) * H;
          return (
            <g key={layer.id} className="layer-band-group">
              <rect
                x={0}
                y={y}
                width={W}
                height={h}
                fill={LAYER_FILL[layer.id]}
                opacity={opacity}
                onClick={() => onSelect(isSelected ? null : layer.id)}
                style={{ cursor: "pointer" }}
              />
              {!isHidden && (
                <g style={{ pointerEvents: "none" }} opacity={isSelected ? 1 : 0.92}>
                  {layerArt(layer.id, y, h)}
                </g>
              )}
              {isSelected && (
                <rect
                  x={1}
                  y={y + 1}
                  width={W - 2}
                  height={h - 2}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  style={{ pointerEvents: "none" }}
                />
              )}
              <text
                x={20}
                y={y + h / 2 + 5}
                fill="#ecf3ef"
                fontSize={15}
                fontWeight={700}
                opacity={isHidden ? 0.45 : 0.97}
                style={{
                  pointerEvents: "none",
                  textDecoration: isHidden ? "line-through" : undefined,
                }}
              >
                {layer.label}
              </text>
              {!isHidden && (
                <g
                  transform={`translate(${W - 56}, ${y + h / 2})`}
                  style={{ pointerEvents: "none" }}
                >
                  {layer.speciesUsing.slice(0, 5).map((sid, i) => {
                    const sp = speciesById[sid];
                    if (!sp) return null;
                    return (
                      <text
                        key={sid}
                        x={-i * 46}
                        y={14}
                        fontSize={40}
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
              <g key={i}>
                <rect x={x - 9} y={395} width={18} height={14} rx={3} fill="#5a4326" />
                <ellipse cx={x} cy={395} rx={9} ry={4} fill="#6e5430" />
                <ellipse cx={x} cy={395} rx={4} ry={2} fill="#3a2a1a" />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
