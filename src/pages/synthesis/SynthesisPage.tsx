import { useMemo, useState } from "react";
import { SPECIES, SITES, type SpeciesId, type SiteId } from "../../forestry/species";
import {
  economics,
  volumeAtAge,
  DEFAULT_PRICES,
  DEFAULT_COSTS,
} from "../../forestry/model";
import {
  tradeoffSeries,
  ecologyAtAge,
  ECOLOGY_MILESTONES,
  NEVER_RETURNS,
  WILDLIFE_SPECIES_COUNT,
} from "../../synthesis/model";
import { WILDLIFE_SPECIES } from "../../data/wildlife";
import type { SpeciesId as WildlifeSpeciesId } from "../../wildlife/species";
import {
  CONSERVATION_TOOLS,
  TOOL_ICON,
  type ToolId,
} from "../../wildlife/conservation";
import { ConservationToolGrid } from "../../components/ConservationToolGrid";
import { TradeoffChart } from "../../components/TradeoffChart";
import { fmtInt, fmtMoney } from "../../components/format";

const ECOLOGY_MAX_YEAR = 100;

/** The six conservation tools grouped into three balancing strategies. */
const BALANCE_TIERS: {
  icon: string;
  title: string;
  body: string;
  tools: ToolId[];
}[] = [
  {
    icon: "🛡️",
    title: "Alad väljaspool majandust",
    body: "Osa metsast võetakse raiest täielikult või suures osas välja — siia jäävad vana metsa liigid, mida ükski raievanus majandusmetsas ei taga.",
    tools: ["natura2000", "puselupaik", "vaarielupaik"],
  },
  {
    icon: "🪵",
    title: "Struktuur jäetakse raie sisse",
    body: "Majandatavas metsas säilitatakse vana metsa elemente — säilikpuud, surnud puit ja raiumata servad annavad liikidele tugipunktid läbi raieringi.",
    tools: ["sailikpuud", "puhverribad"],
  },
  {
    icon: "🪺",
    title: "Raie ajastus",
    body: "Tundlikel perioodidel raiet piiratakse, et mitte hävitada pesakondi siis, kui mets on hõivatud.",
    tools: ["raierahu"],
  },
];

const TOOL_LABEL: Record<ToolId, string> = Object.fromEntries(
  CONSERVATION_TOOLS.map((t) => [t.id, t.label]),
) as Record<ToolId, string>;

export function SynthesisPage() {
  const [speciesId, setSpeciesId] = useState<SpeciesId>("spruce");
  const [siteId, setSiteId] = useState<SiteId>("medium");
  const [discountRate, setDiscountRate] = useState(0.03);
  const [rotationAge, setRotationAge] = useState(70);

  const { series, economicOptimumAge } = useMemo(
    () => tradeoffSeries({ speciesId, siteId, discountRate }),
    [speciesId, siteId, discountRate],
  );

  const econ = useMemo(
    () =>
      economics({
        speciesId,
        siteId,
        rotationAge,
        discountRate,
        prices: DEFAULT_PRICES,
        costs: DEFAULT_COSTS,
      }),
    [speciesId, siteId, rotationAge, discountRate],
  );

  const eco = useMemo(() => ecologyAtAge(rotationAge), [rotationAge]);
  const volume = useMemo(
    () => volumeAtAge(rotationAge, speciesId, siteId),
    [rotationAge, speciesId, siteId],
  );

  const presentSet = useMemo(
    () => new Set(eco.speciesPresent),
    [eco.speciesPresent],
  );

  const missingMilestones = ECOLOGY_MILESTONES.filter(
    (m) => m.age > rotationAge && presentSet.has(m.species) === false,
  );

  const recoveryPct = Math.round(eco.recovery.elupaik);
  const nearOptimum = Math.abs(rotationAge - economicOptimumAge) <= 4;
  const beforeOptimum = rotationAge < economicOptimumAge - 4;

  return (
    <div className="app">
      <a className="back-btn" href="#/">
        ← Avalehele
      </a>

      <header className="header">
        <div>
          <h1 className="title">Otsusta ise: kaks vaadet, üks raievanus</h1>
          <p className="subtitle">
            Raidur näeb tulu, loom näeb elupaika. Sama puistu, sama
            raievanus — liiguta liugurit ja vaata, kus kahe vaate huvid
            lahknevad. Majandus tipneb varakult; vana metsa liigid jõuavad
            kohale alles palju hiljem.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="panel">
          <div className="section-title">
            <h2>Puistu ja raievanus</h2>
            <span className="hint">Hinnad ja kulud on vaikeväärtused</span>
          </div>

          <div className="field">
            <span className="field-label" style={{ marginBottom: 6 }}>
              Puuliik
            </span>
            <div
              className="picker"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {Object.values(SPECIES).map((sp) => (
                <button
                  key={sp.id}
                  className={`picker-option compact${speciesId === sp.id ? " active" : ""}`}
                  onClick={() => setSpeciesId(sp.id)}
                >
                  <span className="opt-title">
                    <span>{sp.emoji}</span>
                    {sp.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field-label" style={{ marginBottom: 6 }}>
              Kasvukoha headus
            </span>
            <div
              className="picker"
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              {Object.values(SITES).map((s) => (
                <button
                  key={s.id}
                  className={`picker-option compact${siteId === s.id ? " active" : ""}`}
                  onClick={() => setSiteId(s.id)}
                >
                  <span className="opt-title">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <div className="field-row">
              <span className="field-label">Intressimäär (raha ajaväärtus)</span>
              <span className="field-value">
                {(discountRate * 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={0.1}
              value={discountRate * 100}
              onChange={(e) => setDiscountRate(Number(e.target.value) / 100)}
            />
          </div>

          <div className="field">
            <div className="field-row">
              <span className="field-label">Raievanus — ühine liugur</span>
              <span className="field-value">{rotationAge} aastat</span>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              step={1}
              value={rotationAge}
              onChange={(e) => setRotationAge(Number(e.target.value))}
            />
            <button
              className="optimal-btn"
              onClick={() => setRotationAge(economicOptimumAge)}
            >
              Vali majanduslik optimum: {economicOptimumAge} a
            </button>
          </div>
        </div>

        <div className="story-cards">
          <div className="story-card synth-card-econ">
            <div className="story-card-label" style={{ color: "#D8B98C" }}>
              🪓 Raiduri vaade
            </div>
            <div className="story-card-value" style={{ color: "#E2C79A" }}>
              {fmtMoney(econ.lev)}
              <span className="story-card-unit">/ha maa väärtus (LEV)</span>
            </div>
            <div className="sim-card-extra">
              <div className="sim-card-row">
                <span>Aastane ekvivalent</span>
                <strong>{fmtMoney(econ.annualEquivalent)}/ha/a</strong>
              </div>
              <div className="sim-card-row">
                <span>Tagavara raie hetkel</span>
                <strong>{fmtInt(volume)} m³/ha</strong>
              </div>
              <div className="sim-card-row">
                <span>Majanduslik optimum</span>
                <strong>{economicOptimumAge} a</strong>
              </div>
            </div>
          </div>

          <div className="story-card synth-card-eco">
            <div className="story-card-label" style={{ color: "#B6D24A" }}>
              🦌 Looma vaade
            </div>
            <div className="story-card-value" style={{ color: "#B6D24A" }}>
              {recoveryPct}
              <span className="story-card-unit">% elupaiga taastumine</span>
            </div>
            <div className="sim-card-extra">
              <div className="sim-card-row">
                <span>Metsaliike kohal</span>
                <strong>
                  {eco.speciesCount} / {WILDLIFE_SPECIES_COUNT}
                </strong>
              </div>
              <div className="sim-card-row">
                <span>Optimaalne elupaik liikidele</span>
                <strong>
                  {eco.oldGrowthOptimalCount} / {WILDLIFE_SPECIES_COUNT}
                </strong>
              </div>
            </div>
            <div className="species-strip" style={{ marginTop: 12 }}>
              {(Object.values(WILDLIFE_SPECIES)).map((sp) => {
                const present = presentSet.has(sp.id as WildlifeSpeciesId);
                return (
                  <span
                    key={sp.id}
                    className={`species-chip${present ? "" : " species-chip-missing"}`}
                    title={present ? "Kohal" : "Veel puudub"}
                  >
                    <span className="species-chip-emoji">{sp.emoji}</span>
                    {sp.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Majandus vs. elurikkus raieringi pikkuse järgi</h2>
            <span className="hint">Ökoloogia andmed kuni {ECOLOGY_MAX_YEAR} a</span>
          </div>
          <TradeoffChart
            data={series}
            rotationAge={rotationAge}
            economicOptimumAge={economicOptimumAge}
            maxEcologyAge={ECOLOGY_MAX_YEAR}
          />
          <div className="legend">
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: "#D8B98C" }}
              />
              Majanduslik väärtus (LEV, normaliseeritud)
            </span>
            <span className="legend-chip">
              <span
                className="legend-dot"
                style={{ background: "#B6D24A" }}
              />
              Elupaiga taastumine (%)
            </span>
          </div>
        </div>

        <div className="panel">
          <p className="story-takeaway">
            {beforeOptimum && (
              <>
                <strong>{rotationAge} a:</strong> raiud enne majanduslikku
                optimumi ({economicOptimumAge} a) — maa tootlus pole veel
                maksimaalne ja mets on liiga noor enamiku metsaliikide jaoks.
              </>
            )}
            {nearOptimum && (
              <>
                <strong>{rotationAge} a — Faustmanni optimum:</strong> maa annab
                maksimaalse tulu. Kuid see puistu pole veel vana metsa liikidele
                elupaik — elupaiga taastumine on alles {recoveryPct}%.
              </>
            )}
            {!beforeOptimum && !nearOptimum && (
              <>
                <strong>{rotationAge} a:</strong> loobud osast tulust pikema
                raieringi nimel ({economicOptimumAge} a oli majanduslik
                optimum) — vastutasuks jõuavad vana metsa liigid tagasi ja
                elupaik on {recoveryPct}% taastunud.
              </>
            )}{" "}
            {missingMilestones.length > 0 ? (
              <>
                Selle raievanuse juures puuduvad veel:{" "}
                {missingMilestones
                  .map((m) => `${m.emoji} ${m.name} (jõuab ${m.age} a)`)
                  .join(", ")}
                .
              </>
            ) : (
              <>Kõik järk-järgult naasvad liigid on selleks vanuseks kohal.</>
            )}{" "}
            {NEVER_RETURNS.length > 0 && (
              <>
                Liike, kes ei jõua isegi {ECOLOGY_MAX_YEAR} aastaga tagasi:{" "}
                {NEVER_RETURNS.map((id) => WILDLIFE_SPECIES[id].name).join(", ")}
                .
              </>
            )}
          </p>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Kuidas tasakaal leitakse</h2>
            <span className="hint">
              Mitte üks raievanus kõikjal, vaid meetmete kogum
            </span>
          </div>
          <p>
            Liugur näitab, et üks raievanus ei rahulda korraga mõlemat vaadet:
            raha tipneb vara, vana metsa elupaik jõuab kohale palju hiljem.
            Eesti metsanduses ei lahendata seda ühe numbriga, vaid{" "}
            <strong>maastiku tasandil</strong> — osa metsast jäetakse kaitse
            alla, ülejäänut majandatakse leevendavate reeglitega.
          </p>

          <div className="balance-tiers">
            {BALANCE_TIERS.map((tier) => (
              <div className="balance-tier" key={tier.title}>
                <div className="balance-tier-head">
                  <span className="balance-tier-icon" aria-hidden>
                    {tier.icon}
                  </span>
                  <h3>{tier.title}</h3>
                </div>
                <p>{tier.body}</p>
                <div className="balance-tier-tools">
                  {tier.tools.map((id) => (
                    <span className="balance-tool-chip" key={id}>
                      <span aria-hidden>{TOOL_ICON[id]}</span>
                      {TOOL_LABEL[id]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 22 }}>
            <h3 style={{ margin: 0 }}>Kuus kaitsevahendit lähemalt</h3>
            <span className="hint">Sama tööriistakast Loomade loost 4</span>
          </div>
          <ConservationToolGrid
            tools={CONSERVATION_TOOLS}
            speciesById={WILDLIFE_SPECIES}
          />

          <p className="story-takeaway" style={{ marginTop: 16 }}>
            <strong>Kokkuvõte:</strong> raidur saab tulu majandusmetsast, loom
            saab elupaiga kaitsealadest ja säilikstruktuuridest. Tasakaal pole
            üks õige raievanus, vaid <strong>kasutuse ja kaitse jaotus</strong>{" "}
            üle terve maastiku — kõik kuus vahendit kuuluvad MAK2030 alaeesmärki
            2 (looduslik mitmekesisus) ja 4 (säästev metsamajandus).
          </p>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Olulised teemad</h2>
            <span className="hint">Mõlemat vaadet puudutav ühisosa</span>
          </div>
          <p>
            Raie ümber käib praegu mitu suurt vaidlust — kaitsetasemed,
            raiemaht, süsiniku sidumine, omandistruktuur — ja need ei kuulu
            kummalegi vaatele eraldi, vaid puudutavad mõlemat korraga.
          </p>
          <a className="back-btn" href="#/teemad">
            🔥 Eesti metsa olulised teemad →
          </a>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Mõlemad vaated</h2>
            <span className="hint">Tagasi lugude juurde</span>
          </div>
          <div
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <a className="back-btn" href="#/raidur/1">
              🪓 Raiduri lood
            </a>
            <a className="back-btn" href="#/loomad/1">
              🦌 Loomade lood
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
