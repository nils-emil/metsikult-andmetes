import type { Species, SpeciesId } from "../wildlife/species";
import type { BalanceZone, SpeciesBalance } from "../synthesis/model";

interface ForestBalanceVennProps {
  balance: SpeciesBalance[];
  speciesById: Record<SpeciesId, Species>;
  selected: SpeciesId | null;
  onSelect(id: SpeciesId | null): void;
}

const W = 800;
const H = 470;

/** Emoji slot coordinates per zone (filled in species order). */
const POS: Record<BalanceZone, [number, number][]> = {
  majandus: [
    [185, 262],
    [185, 182],
    [185, 342],
  ],
  molemad: [
    [400, 150],
    [362, 205],
    [438, 205],
    [400, 262],
    [362, 318],
    [438, 318],
    [400, 372],
  ],
  kaitse: [
    [605, 188],
    [652, 188],
    [605, 332],
    [652, 332],
  ],
};

export function ForestBalanceVenn({
  balance,
  speciesById,
  selected,
  onSelect,
}: ForestBalanceVennProps) {
  const byZone: Record<BalanceZone, SpeciesBalance[]> = {
    majandus: [],
    molemad: [],
    kaitse: [],
  };
  for (const b of balance) byZone[b.zone].push(b);

  return (
    <div className="venn-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="venn-svg"
        role="img"
        aria-label="Venni diagramm: kus metsaliigid elavad — majandusmetsas, mõlemas või ainult kaitsealal"
      >
        {/* circles */}
        <circle
          cx={290}
          cy={262}
          r={200}
          fill="rgba(216,185,140,0.15)"
          stroke="#D8B98C"
          strokeWidth={1.5}
        />
        <circle
          cx={510}
          cy={262}
          r={200}
          fill="rgba(182,210,74,0.13)"
          stroke="#B6D24A"
          strokeWidth={1.5}
        />

        {/* circle titles */}
        <text x={150} y={34} fontSize={16} fontWeight={700} fill="#A65A3A" textAnchor="middle">
          🪓 Majandusmets
        </text>
        <text x={150} y={54} fontSize={11.5} fill="#7A8990" textAnchor="middle">
          raie ja tulu
        </text>
        <text x={650} y={34} fontSize={16} fontWeight={700} fill="#B6D24A" textAnchor="middle">
          Kaitsealune mets 🛡️
        </text>
        <text x={650} y={54} fontSize={11.5} fill="#003D49" textAnchor="middle">
          vana mets, kaitse
        </text>
        <text x={400} y={44} fontSize={12} fontWeight={700} fill="#003D49" textAnchor="middle" letterSpacing="0.08em">
          MÕLEMAS
        </text>

        {/* species emojis */}
        {(["majandus", "molemad", "kaitse"] as BalanceZone[]).flatMap((zone) =>
          byZone[zone].map((b, i) => {
            const slots = POS[zone];
            const [x, y] = slots[i] ?? slots[slots.length - 1];
            const sp = speciesById[b.species];
            const isSel = selected === b.species;
            return (
              <g
                key={b.species}
                onClick={() => onSelect(isSel ? null : b.species)}
                style={{ cursor: "pointer" }}
              >
                {isSel && (
                  <circle
                    cx={x}
                    cy={y}
                    r={26}
                    fill="rgba(182,210,74,0.22)"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                  />
                )}
                <circle cx={x} cy={y} r={26} fill="transparent" />
                <text
                  x={x}
                  y={y + 12}
                  fontSize={36}
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {sp.emoji}
                </text>
              </g>
            );
          }),
        )}
      </svg>
    </div>
  );
}
