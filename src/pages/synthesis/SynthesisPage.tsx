import { useState } from "react";
import {
  optimalRotation,
  DEFAULT_PRICES,
  DEFAULT_COSTS,
} from "../../forestry/model";
import {
  SPECIES_BALANCE,
  BALANCE_ZONE_COUNT,
  type BalanceZone,
} from "../../synthesis/model";
import { WILDLIFE_SPECIES, WILDLIFE_SOURCES } from "../../data/wildlife";
import {
  STATUS_LABEL,
  SPECIES,
  type SpeciesId as WildlifeSpeciesId,
} from "../../wildlife/species";
import { ForestBalanceVenn } from "../../components/ForestBalanceVenn";
import { ConservationToolGrid } from "../../components/ConservationToolGrid";
import { CONSERVATION_TOOLS } from "../../wildlife/conservation";
import { TopicBars } from "../../components/TopicBars";
import { TopicDivergingBars } from "../../components/TopicDivergingBars";
import { TopicDonut } from "../../components/TopicDonut";
import { TopicStackedBars } from "../../components/TopicStackedBars";
import { HOT_TOPICS, type HotTopic } from "../../data/hotTopics";

function TopicVisual({ chart }: { chart: HotTopic["chart"] }) {
  switch (chart.kind) {
    case "donut":
      return <TopicDonut segments={chart.segments} unit={chart.unit} />;
    case "bars":
      return (
        <TopicBars data={chart.data} unit={chart.unit} yLabel={chart.yLabel} />
      );
    case "diverging":
      return <TopicDivergingBars data={chart.data} unit={chart.unit} />;
    case "stacked":
      return <TopicStackedBars periods={chart.periods} />;
  }
}

const ZONE_META: Record<
  BalanceZone,
  { label: string; icon: string; color: string; blurb: string }
> = {
  majandus: {
    label: "Majandusmets",
    icon: "🪓",
    color: "#A65A3A",
    blurb: "Talub metsamajandust — noor ja keskealine mets sobib. Raie isegi soosib seda liiki.",
  },
  molemad: {
    label: "Mõlemas",
    icon: "🤝",
    color: "#003D49",
    blurb:
      "Püsib raie kõrval, KUI jäetakse säilikpuid, lamapuitu ja metsaservi.",
  },
  kaitse: {
    label: "Ainult kaitse",
    icon: "🛡️",
    color: "#B6D24A",
    blurb:
      "Vana metsa liik — ei ela majandusmetsas ühegi leevendusega. Vajab sihitud kaitseala.",
  },
};

const balanceById = new Map(SPECIES_BALANCE.map((b) => [b.species, b]));
const speciesInZone = (zone: BalanceZone) =>
  SPECIES_BALANCE.filter((b) => b.zone === zone);

/** Broader environmental dimensions of the balance, each linking to its story. */
const ENV_TOPICS = [
  {
    icon: "🌿",
    title: "Taimestik",
    body: "Lageraie pöörab alustaimestiku pea peale: metsataimed taanduvad, pioneerid vohavad, mustikas taastub aeglaselt.",
    href: "#/keskkond/3",
  },
  {
    icon: "🔥",
    title: "Süsinik",
    body: "Raiutud puit kas seob süsinikku (palk → ehitus) või vabastab selle kohe (küttepuu). Pikem kasutus = vähem heidet.",
    href: "#/keskkond/4",
  },
  {
    icon: "🌍",
    title: "Maakasutuse muutus",
    body: "Raie ei ole raadamine: raie järel mets taastub, raadamise järel saab maast põld või linn — elupaik kaob jäädavalt.",
    href: "#/keskkond/5",
  },
];

/** Faustmann economic optimum for a representative spruce stand (3% rate). */
const ECON_OPTIMUM_AGE = optimalRotation({
  speciesId: "spruce",
  siteId: "medium",
  discountRate: 0.03,
  prices: DEFAULT_PRICES,
  costs: DEFAULT_COSTS,
}).age;

export function SynthesisPage() {
  const [vennSpecies, setVennSpecies] = useState<WildlifeSpeciesId | null>(
    null,
  );

  const selBalance = vennSpecies ? balanceById.get(vennSpecies) ?? null : null;
  const selSp = vennSpecies ? WILDLIFE_SPECIES[vennSpecies] : null;
  const selZone = selBalance ? ZONE_META[selBalance.zone] : null;

  return (
    <div className="app">
      <a className="back-btn" href="#/">
        ← Avalehele
      </a>

      <header className="header">
        <div>
          <h1 className="title">Raie ja kaitse: kus on tasakaal?</h1>
          <p className="subtitle">
            Sama mets, kaks huvi. Osa liike talub metsamajandust, osa vajab
            sihitud kaitset. Tõde pole majanduslik optimum ega range kaitse —{" "}
            <strong>tõde on tasakaalus</strong>.
          </p>
        </div>
      </header>

      <div className="col">
        {/* ---- Venn ---- */}
        <div className="row">
          <div className="panel">
            <div className="section-title">
              <h2>Kes elab kus?</h2>
              <span className="hint">Klõpsa liigile</span>
            </div>
            <ForestBalanceVenn
              balance={SPECIES_BALANCE}
              speciesById={WILDLIFE_SPECIES}
              selected={vennSpecies}
              onSelect={setVennSpecies}
            />
            <div className="venn-legend">
              <span className="venn-legend-item">
                <span className="venn-legend-dot" style={{ background: "#D8B98C" }} />
                Ainult majandusmetsas — <strong>{BALANCE_ZONE_COUNT.majandus}</strong>
              </span>
              <span className="venn-legend-item">
                <span className="venn-legend-dot" style={{ background: "#003D49" }} />
                Mõlemas — <strong>{BALANCE_ZONE_COUNT.molemad}</strong>
              </span>
              <span className="venn-legend-item">
                <span className="venn-legend-dot" style={{ background: "#B6D24A" }} />
                Ainult kaitsealal — <strong>{BALANCE_ZONE_COUNT.kaitse}</strong>
              </span>
            </div>
          </div>

          <aside className="panel">
            {selSp && selBalance && selZone ? (
              <>
                <div className="section-title">
                  <h2>
                    {selSp.emoji} {selSp.name}
                  </h2>
                  <span
                    className="header-chip"
                    style={{ borderColor: selZone.color, color: selZone.color }}
                  >
                    {selZone.icon} {selZone.label}
                  </span>
                </div>
                <div
                  style={{
                    color: "var(--text-mute)",
                    fontSize: 12.5,
                    fontStyle: "italic",
                    marginBottom: 10,
                  }}
                >
                  {selSp.latin} · {STATUS_LABEL[selSp.status]}
                </div>
                <p style={{ marginBottom: 12 }}>{selZone.blurb}</p>
                <div className="field">
                  <div className="field-row">
                    <span className="field-label">Elupaiga sobivus (0–3)</span>
                  </div>
                  <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
                    Noor / keskealine mets{" "}
                    <strong>{selBalance.managedScore}/3</strong> · vana mets{" "}
                    <strong>{selBalance.oldScore}/3</strong>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="section-title">
                  <h2>Kaks metsa, üks tasakaal</h2>
                </div>
                <p style={{ marginBottom: 10 }}>
                  Iga liik vajab eri metsa. Vasak ring on{" "}
                  <strong>majandusmets</strong> — noor ja keskealine, kust tuleb
                  puit. Parem ring on <strong>kaitsealune mets</strong> — vana
                  ja raiest puutumata.
                </p>
                <p style={{ marginBottom: 10 }}>
                  Enamik liike (<strong>{BALANCE_ZONE_COUNT.molemad}</strong>)
                  jääb keskele: nad püsivad majandusmetsas, kui jätta säilikpuid
                  ja lamapuitu. Aga{" "}
                  <strong>{BALANCE_ZONE_COUNT.kaitse} vana metsa liiki</strong>{" "}
                  ei ela majandusmetsas kunagi — neile on vaja kaitsealasid.
                  Põder seevastu lausa võidab raiest.
                </p>
                <p className="hint">
                  Klõpsa diagrammil liigile, et näha selle lugu.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* ---- Three zones ---- */}
        <div className="panel">
          <div className="section-title">
            <h2>Kolm rühma, kolm lahendust</h2>
          </div>
          <div className="balance-tiers">
            {(["majandus", "molemad", "kaitse"] as BalanceZone[]).map((zone) => {
              const meta = ZONE_META[zone];
              const list = speciesInZone(zone);
              return (
                <div className="balance-tier" key={zone}>
                  <div className="balance-tier-head">
                    <span className="balance-tier-icon" aria-hidden>
                      {meta.icon}
                    </span>
                    <h3>
                      {meta.label}{" "}
                      <span style={{ color: meta.color }}>({list.length})</span>
                    </h3>
                  </div>
                  <p>{meta.blurb}</p>
                  <div className="balance-tier-tools">
                    {list.map((b) => {
                      const sp = WILDLIFE_SPECIES[b.species];
                      return (
                        <button
                          type="button"
                          key={b.species}
                          className="species-chip"
                          onClick={() => setVennSpecies(b.species)}
                          title={`Näita diagrammil: ${sp.name}`}
                        >
                          <span className="species-chip-emoji" aria-hidden>
                            {sp.emoji}
                          </span>
                          {sp.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Actionable conservation tools ---- */}
        <div className="panel">
          <div className="section-title">
            <h2>Mida saab teha</h2>
            <span className="hint">
              Kaetuse arvud on illustratiivsed; täpsed sihttasemed
              kliimaministeerium.ee/MAK2030
            </span>
          </div>
          <p>
            Tasakaal ei püsi ise — selleks on seadusandlikud vahendid:
            säilikpuud, vääriselupaigad, kaitsealad ja muu. Iga vahend on
            kompromiss kasutamise ja säilitamise vahel.
          </p>
          <div style={{ marginTop: 14 }}>
            <ConservationToolGrid
              tools={CONSERVATION_TOOLS}
              speciesById={SPECIES}
            />
          </div>
          <p className="story-takeaway" style={{ marginTop: 14 }}>
            <strong>Side MAK2030-ga:</strong> need meetmed on osa{" "}
            <strong>alaeesmärgist 2 (looduslik mitmekesisus)</strong> ja{" "}
            <strong>alaeesmärgist 4 (säästev metsamajandus)</strong>{" "}
            tegevuskavast.
          </p>
        </div>

        {/* ---- The thesis: economics overshoots ---- */}
        <div className="panel">
          <div className="section-title">
            <h2>Majandus tahab rohkem raiet, kui on õige</h2>
          </div>
          <p>
            Puhtalt rahas on optimaalne raiuda <strong>varem ja rohkem</strong>:
            kuusiku majanduslik optimum on umbes{" "}
            <strong>{ECON_OPTIMUM_AGE} aastat</strong>. Vana metsa liigid
            (🛡️ ülal) jõuavad aga kohale alles <strong>80–100+ aasta</strong>{" "}
            vanuses — majanduslik optimum jätaks nad ilma.
          </p>
          <p className="story-takeaway" style={{ marginTop: 12 }}>
            Õige vastus pole suurim tihumeetrite hulk ega ka „ära raiu".{" "}
            <strong>Tõde on tasakaalus, mitte tihumeetrites:</strong> majanda
            seal ja nii palju, kui liigid taluvad, ja kaitse täpselt seal, kus
            vana metsa liigid seda vajavad.
          </p>
        </div>

        {/* ---- Broader environmental impact ---- */}
        <div className="panel">
          <div className="section-title">
            <h2>Keskkonnamõju laiemalt</h2>
            <span className="hint">Raie puudutab muudki kui liike</span>
          </div>
          <p>
            Tasakaal ei ole ainult liikide küsimus — raie mõjutab ka kliimat,
            mulda ja maakasutust.
          </p>
          <div className="balance-tiers" style={{ marginTop: 14 }}>
            {ENV_TOPICS.map((t) => (
              <a className="balance-tier env-topic" href={t.href} key={t.title}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {t.icon}
                  </span>
                  <h3>{t.title}</h3>
                </div>
                <p>{t.body}</p>
                <span className="env-topic-cta">Loe lähemalt →</span>
              </a>
            ))}
          </div>
        </div>

        {/* ---- Hot topics: current public debate ---- */}
        <div className="panel">
          <div className="section-title">
            <h2>Olulised teemad</h2>
            <span className="hint">
              Seitse vaidlust, mille üle praegu kõige rohkem debatti käib
            </span>
          </div>
          <p>
            Mida tegelikult vaieldakse Eesti metsade kohta? Iga teema kõrval on
            reaalsetel andmetel põhinev visualiseering ja viide allikale.
          </p>
          <div className="story-cards story-cards-3" style={{ marginTop: 14 }}>
            <div className="story-card story-card-accent">
              <div className="story-card-label">Kaitse eesmärk</div>
              <div className="story-card-value">
                30 <span className="story-card-unit">% maismaast</span>
              </div>
              <div className="story-card-sub">praegu ~28,7%</div>
            </div>
            <div className="story-card">
              <div className="story-card-label">Raiemaht 2023</div>
              <div className="story-card-value">
                11,7 <span className="story-card-unit">mln m³</span>
              </div>
              <div className="story-card-sub">tagavara langeb</div>
            </div>
            <div className="story-card">
              <div className="story-card-label">LULUCF netoheide 2023</div>
              <div className="story-card-value">
                +2131 <span className="story-card-unit">kt CO₂</span>
              </div>
              <div className="story-card-sub">siduja → heitja</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 18,
            alignItems: "start",
          }}
        >
          {HOT_TOPICS.map((topic) => (
            <div className="panel" key={topic.id}>
              <div className="topic-head">
                <span className="topic-nr">{topic.nr}</span>
                <h2 className="topic-title">{topic.pealkiri}</h2>
              </div>
              <p className="topic-body">{topic.sisu}</p>

              <div className="section-title">
                <h2>{topic.chartTitle}</h2>
                {topic.chartHint && (
                  <span className="hint">{topic.chartHint}</span>
                )}
              </div>

              <TopicVisual chart={topic.chart} />

              <p className="story-takeaway" style={{ marginTop: 12 }}>
                Allikas:{" "}
                <a href={topic.allikas.url} target="_blank" rel="noreferrer">
                  {topic.allikas.nimi}
                </a>
                {topic.lisaallikas && (
                  <>
                    {" · "}
                    <a
                      href={topic.lisaallikas.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {topic.lisaallikas.nimi}
                    </a>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* ---- Sources ---- */}
        <div className="panel">
          <div className="section-title">
            <h2>Allikad</h2>
            <span className="hint">Riigi andmed ja teadusbaas</span>
          </div>
          <ul className="source-list">
            {WILDLIFE_SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
                <span className="source-publisher"> — {s.publisher}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- Nav ---- */}
        <div className="panel">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="back-btn" href="#/raidur/1">
              🪓 Raiduri lood
            </a>
            <a className="back-btn" href="#/keskkond/1">
              🦌 Keskkonna lood
            </a>
            <a className="back-btn" href="#/">
              ← Avalehele
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
