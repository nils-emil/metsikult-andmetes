import { useMemo, useState } from "react";
import { ControlsPanel } from "../components/ControlsPanel";
import { GrowthChart } from "../components/GrowthChart";
import { AssortmentChart } from "../components/AssortmentChart";
import { EconomicsChart } from "../components/EconomicsChart";
import { RevenueBars } from "../components/RevenueBars";
import { fmtInt, fmtMoney, fmtMoneyFull, fmtNumber } from "../components/format";
import {
  DEFAULT_COSTS,
  DEFAULT_PRICES,
  economics,
  growthSeries,
  optimalRotation,
  revenueAtAge,
  type Costs,
  type Prices,
} from "../forestry/model";
import type { SiteId, SpeciesId } from "../forestry/species";
import { SPECIES, SITES } from "../forestry/species";

const COMPARE_AGES = [40, 60, 80, 100, 120, 150];

export function CalculatorPage() {
  const [speciesId, setSpeciesId] = useState<SpeciesId>("spruce");
  const [siteId, setSiteId] = useState<SiteId>("medium");
  const [rotationAge, setRotationAge] = useState(80);
  const [discountRate, setDiscountRate] = useState(0.025);
  const [prices, setPrices] = useState<Prices>(DEFAULT_PRICES);
  const [costs, setCosts] = useState<Costs>(DEFAULT_COSTS);
  const [assortmentMode, setAssortmentMode] = useState<"volume" | "share">("volume");

  const series = useMemo(
    () => growthSeries(speciesId, siteId, 180, 1),
    [speciesId, siteId],
  );

  const econSeries = useMemo(() => {
    const out: { age: number; npv: number; lev: number; annualEquivalent: number }[] = [];
    for (let t = 20; t <= 180; t += 1) {
      const e = economics({ speciesId, siteId, rotationAge: t, discountRate, prices, costs });
      out.push({
        age: t,
        npv: e.npv,
        lev: Number.isFinite(e.lev) ? e.lev : 0,
        annualEquivalent: e.annualEquivalent,
      });
    }
    return out;
  }, [speciesId, siteId, discountRate, prices, costs]);

  const optimal = useMemo(
    () =>
      optimalRotation({ speciesId, siteId, discountRate, prices, costs }),
    [speciesId, siteId, discountRate, prices, costs],
  );

  const cur = useMemo(() => {
    const point = series[rotationAge] ?? series[series.length - 1];
    const rev = revenueAtAge(rotationAge, speciesId, siteId, prices, costs);
    const econ = economics({ speciesId, siteId, rotationAge, discountRate, prices, costs });
    return { point, rev, econ };
  }, [series, rotationAge, speciesId, siteId, prices, costs, discountRate]);

  const compareRows = useMemo(() => {
    return COMPARE_AGES.map((age) => {
      const rev = revenueAtAge(age, speciesId, siteId, prices, costs);
      const econ = economics({ speciesId, siteId, rotationAge: age, discountRate, prices, costs });
      const v = series[age]?.volume ?? 0;
      return {
        age,
        volume: v,
        mai: series[age]?.mai ?? 0,
        gross: rev.gross,
        net: rev.net,
        npv: econ.npv,
        lev: econ.lev,
        annual: econ.annualEquivalent,
      };
    });
  }, [speciesId, siteId, prices, costs, discountRate, series]);

  const revBars = useMemo(
    () => [
      { category: "Paberipuit", value: cur.rev.pulp, color: "#93b86a" },
      { category: "Palk", value: cur.rev.saw, color: "#d4a373" },
      { category: "Spoonipakk", value: cur.rev.veneer, color: "#c47e3e" },
      { category: "Raiekulu", value: -cur.rev.harvestCost, color: "#f87171" },
    ],
    [cur],
  );

  const sp = SPECIES[speciesId];
  const site = SITES[siteId];

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Metsaraiduri perspektiiv</h1>
          <p className="subtitle">
            Mets kui ressurss. Uuri, kui palju puitu mets aja jooksul kasvatab
            ja millal on kõige tulusam see maha võtta. Liiguta liugureid — vali
            puuliik, kasvukoht, raievanus ja puiduhinnad — ning vaata, kuidas
            tulu muutub.
          </p>
        </div>
        <div className="header-chip">
          {sp.emoji} {sp.name} · {site.name} kasvukoht · raie {rotationAge}-aastaselt · intress{" "}
          {(discountRate * 100).toFixed(1)}%
        </div>
      </header>

      <div className="grid">
        <ControlsPanel
          speciesId={speciesId}
          setSpecies={setSpeciesId}
          siteId={siteId}
          setSite={setSiteId}
          rotationAge={rotationAge}
          setRotationAge={setRotationAge}
          discountRate={discountRate}
          setDiscountRate={setDiscountRate}
          prices={prices}
          setPrices={setPrices}
          costs={costs}
          setCosts={setCosts}
          optimalAge={optimal.age}
          onUseOptimal={() => setRotationAge(optimal.age)}
        />

        <div className="col">
          <div className="kpi-grid">
            <Kpi
              label="Puidu kogus"
              value={fmtInt(cur.point.volume)}
              unit="m³/ha"
              sub={`${rotationAge}-aastases metsas`}
            />
            <Kpi
              label="Aastane juurdekasv"
              value={fmtNumber(cur.point.mai, 2)}
              unit="m³/ha/a"
              sub={`kiireim kasv ~${
                series.reduce((b, p) => (p.mai > b.mai ? p : b), series[20]).age
              } a vanuses`}
            />
            <Kpi
              label="Müügitulu kokku"
              value={fmtMoney(cur.rev.gross)}
              unit="€/ha"
              sub={`pärast raiekulu: ${fmtMoney(cur.rev.net)}`}
            />
            <Kpi
              label="Tänane kasum"
              value={fmtMoney(cur.econ.npv)}
              unit="€/ha"
              sub={`kogu tulu tänasesse päeva tooduna, intress ${(discountRate * 100).toFixed(1)}%`}
              accent={cur.econ.npv > 0}
              negative={cur.econ.npv < 0}
            />
            <Kpi
              label="Maa väärtus pikas plaanis"
              value={
                Number.isFinite(cur.econ.lev) ? fmtMoney(cur.econ.lev) : "—"
              }
              unit="€/ha"
              sub="kui korrata sama raieringi lõpmatuseni"
              accent={Number.isFinite(cur.econ.lev) && cur.econ.lev > 0}
              negative={Number.isFinite(cur.econ.lev) && cur.econ.lev < 0}
            />
            <Kpi
              label="Tulu aasta kohta"
              value={fmtMoney(cur.econ.annualEquivalent)}
              unit="€/ha/a"
              sub={`parim raievanus oleks ${optimal.age} a`}
            />
          </div>

          <div className="row">
            <div className="panel">
              <div className="section-title">
                <h2>Kuidas mets kasvab</h2>
                <span className="hint">Liiguta raievanuse liugurit →</span>
              </div>
              <GrowthChart data={series} rotationAge={rotationAge} />
              <div className="legend">
                <span className="legend-chip">
                  <span className="legend-dot" style={{ background: "#B6D24A" }} />
                  Puidu kogus (m³/ha)
                </span>
                <span className="legend-chip">
                  <span className="legend-dot" style={{ background: "#d4a373" }} />
                  Keskmine kasv aastas (m³/ha)
                </span>
                <span className="legend-chip">
                  <span
                    className="legend-dot"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg,#c47e3e 0 4px,transparent 4px 8px)",
                    }}
                  />
                  Tänavune kasv (m³/ha)
                </span>
              </div>
            </div>

            <div className="panel">
              <div className="section-title">
                <h2>Mis puidust saab</h2>
                <ModeToggle
                  value={assortmentMode}
                  onChange={setAssortmentMode}
                  options={[
                    { id: "volume", label: "Kogus" },
                    { id: "share", label: "Osakaal %" },
                  ]}
                />
              </div>
              <AssortmentChart data={series} rotationAge={rotationAge} mode={assortmentMode} />
              <div className="legend">
                <span className="legend-chip">
                  <span className="legend-dot" style={{ background: "#93b86a" }} />
                  Paberipuit (odav, peeneks tehtud paber)
                </span>
                <span className="legend-chip">
                  <span className="legend-dot" style={{ background: "#d4a373" }} />
                  Palk (saematerjal)
                </span>
                <span className="legend-chip">
                  <span className="legend-dot" style={{ background: "#c47e3e" }} />
                  Spoonipakk (kallim, kvaliteetne)
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="panel">
              <div className="section-title">
                <h2>Tulu valitud vanuses</h2>
                <span className="hint">Müügitulu miinus raiekulu</span>
              </div>
              <RevenueBars data={revBars} />
              <p style={{ marginTop: 10 }}>
                <strong>{rotationAge}-aastases metsas</strong> on {fmtInt(cur.point.volume)} m³/ha
                puitu — sellest umbes{" "}
                <span style={{ color: "var(--pulp)" }}>
                  {fmtInt(cur.point.pulp)} m³ paberipuitu
                </span>
                ,{" "}
                <span style={{ color: "var(--saw)" }}>
                  {fmtInt(cur.point.saw)} m³ palki
                </span>
                {cur.point.veneer > 1 ? (
                  <>
                    {" "}ja{" "}
                    <span style={{ color: "var(--veneer)" }}>
                      {fmtInt(cur.point.veneer)} m³ spoonipakku
                    </span>
                  </>
                ) : null}
                . Müügitulu kokku = {fmtMoneyFull(cur.rev.gross)}; pärast raietöid (€
                {costs.harvestPerM3}/m³) jääb kätte {fmtMoneyFull(cur.rev.net)}.
              </p>
            </div>

            <div className="panel">
              <div className="section-title">
                <h2>Tulu sõltuvalt raievanusest</h2>
                <span className="hint">
                  Parim aeg raida: <strong style={{ color: "var(--accent)" }}>{optimal.age} a</strong>
                </span>
              </div>
              <EconomicsChart
                data={econSeries}
                rotationAge={rotationAge}
                optimalAge={optimal.age}
                showLev={discountRate > 0.001}
              />
              <div className="legend">
                <span className="legend-chip">
                  <span className="legend-dot" style={{ background: "#B6D24A" }} />
                  Tänane kasum (üks raiering)
                </span>
                {discountRate > 0.001 && (
                  <span className="legend-chip">
                    <span
                      className="legend-dot"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg,#d4a373 0 5px,transparent 5px 9px)",
                      }}
                    />
                    Maa väärtus pikas plaanis
                  </span>
                )}
                <span className="legend-chip">
                  <span className="legend-dot" style={{ background: "#c47e3e" }} />
                  Tulu aasta kohta
                </span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <h2>Erinevate raievanuste võrdlus</h2>
              <span className="hint">Kõik väärtused hektari kohta</span>
            </div>
            <div className="table-wrap">
              <table className="compare">
                <thead>
                  <tr>
                    <th>Raievanus</th>
                    <th>Puit m³/ha</th>
                    <th>Aastane kasv</th>
                    <th>Müügitulu €</th>
                    <th>Kätte jääb €</th>
                    <th>Tänane kasum €</th>
                    <th>Pikaajaline €</th>
                    <th>€/ha/a</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => {
                    const isCurrent = Math.abs(r.age - rotationAge) < 5;
                    return (
                      <tr key={r.age} className={isCurrent ? "highlight" : undefined}>
                        <td>{r.age} a</td>
                        <td>{fmtInt(r.volume)}</td>
                        <td>{fmtNumber(r.mai, 2)}</td>
                        <td>{fmtMoneyFull(r.gross)}</td>
                        <td>{fmtMoneyFull(r.net)}</td>
                        <td className={r.npv >= 0 ? "pos" : "neg"}>
                          {fmtMoneyFull(r.npv)}
                        </td>
                        <td className={r.lev >= 0 ? "pos" : "neg"}>
                          {Number.isFinite(r.lev) ? fmtMoneyFull(r.lev) : "—"}
                        </td>
                        <td>{fmtMoneyFull(r.annual)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="notes">
            <div className="panel">
              <h3>Miks noor mets annab vähem puitu</h3>
              <p>
                Mets kasvab S-kuju järgi: alguses aeglaselt (väikesed puud),
                keskmises eas kiiresti, vanas eas jälle aeglaselt. Kui 80-aastane
                kuusemets annab umbes 350 m³/ha, siis 150-aastane annab juba
                ~600 m³ — aga selle aja jooksul oleksid mujal kaks korda metsa
                kasvatada saanud.
              </p>
            </div>
            <div className="panel">
              <h3>Miks vanem puit on väärtuslikum</h3>
              <p>
                Saekaatrid maksavad rohkem suurte ja oksavabade palkide eest.
                Noor mets annab peamiselt odavat paberipuitu
                (~€{prices.pulp}/m³). 100-aastases metsas on enamus juba palki
                (~€{prices.saw}/m³) ja osa väärtuslikku spoonipakku
                (~€{prices.veneer}/m³).
              </p>
            </div>
            <div className="panel">
              <h3>Miks pole alati tasuv kaua oodata</h3>
              <p>
                Kasvavas metsas seisev raha võiks olla mujal — näiteks aktsiates
                — kus see toodaks intresse. Mida kõrgem on alternatiivne tootlus,
                seda varem tasub mets maha võtta ja raha mujale panna. See ongi
                "intressimäära" liuguri mõte.
              </p>
            </div>
            <div className="panel">
              <h3>Mida mudel ei arvesta</h3>
              <p>
                Vaatame ainult ühte istandust, harvendusraietest (vahepealsetest
                väiksematest raietöödest) tulu ei lähe arvesse. Ei arvesta ka
                tormikahjusid, kahjureid ega metsa muid väärtusi (süsinik,
                loodus, puhkemets). Päris elus on metsamajandus keerukam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  unit,
  sub,
  accent,
  negative,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  accent?: boolean;
  negative?: boolean;
}) {
  return (
    <div className={`kpi${accent ? " accent" : ""}${negative ? " negative" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}
        {unit ? <span className="kpi-unit">{unit}</span> : null}
      </div>
      {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
  );
}

function ModeToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", padding: 3, borderRadius: 8, border: "1px solid var(--border)" }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            background: value === o.id ? "var(--accent-dim)" : "transparent",
            color: value === o.id ? "#FFFFFF" : "var(--text-dim)",
            border: "none",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
