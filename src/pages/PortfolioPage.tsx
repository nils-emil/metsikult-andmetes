import { useMemo, useState } from "react";
import { fmtInt, fmtMoney, fmtMoneyFull } from "../components/format";
import {
  DEFAULT_COSTS,
  DEFAULT_PRICES,
  optimalRotation,
  revenueAtAge,
  volumeAtAge,
} from "../forestry/model";
import { clearcutEligibility } from "../forestry/legal";
import { SPECIES, SITES } from "../forestry/species";
import { loadPortfolio, removeStand, type Stand } from "../portfolio";
import { standToHash } from "../stand";

const PORTFOLIO_DISCOUNT = 0.025;

interface StandView {
  stand: Stand;
  eligible: boolean;
  minAge: number;
  yearsUntil: number;
  optimalAge: number;
  standingNetTotal: number; // net value of standing timber today, whole stand
  optimalNetTotal: number; // net value if cut at optimal rotation, whole stand
  volumeTotal: number;
}

function buildView(stand: Stand): StandView {
  const { speciesId, siteId, currentAge, area } = stand;
  const { eligible, minAge, yearsUntil } = clearcutEligibility(speciesId, currentAge);
  const optimal = optimalRotation({
    speciesId,
    siteId,
    discountRate: PORTFOLIO_DISCOUNT,
    prices: DEFAULT_PRICES,
    costs: DEFAULT_COSTS,
  });
  const standingNet = revenueAtAge(currentAge, speciesId, siteId, DEFAULT_PRICES, DEFAULT_COSTS).net;
  const optimalNet = revenueAtAge(optimal.age, speciesId, siteId, DEFAULT_PRICES, DEFAULT_COSTS).net;
  return {
    stand,
    eligible,
    minAge,
    yearsUntil,
    optimalAge: optimal.age,
    standingNetTotal: standingNet * area,
    optimalNetTotal: optimalNet * area,
    volumeTotal: volumeAtAge(currentAge, speciesId, siteId) * area,
  };
}

export function PortfolioPage() {
  const [stands, setStands] = useState<Stand[]>(() => loadPortfolio());

  const views = useMemo(() => stands.map(buildView), [stands]);

  const totals = useMemo(() => {
    return views.reduce(
      (acc, v) => {
        acc.area += v.stand.area;
        acc.volume += v.volumeTotal;
        acc.standingNet += v.eligible ? v.standingNetTotal : 0;
        acc.readyNow += v.eligible ? 1 : 0;
        return acc;
      },
      { area: 0, volume: 0, standingNet: 0, readyNow: 0 },
    );
  }, [views]);

  const handleRemove = (id: string) => {
    setStands(removeStand(id));
  };

  return (
    <div className="app">
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <a className="back-btn" href="#/">← Avalehele</a>
        <a className="back-btn" href="#/kalkulaator">Kalkulaator</a>
      </div>

      <header className="header">
        <div>
          <h1 className="title">Minu metsad</h1>
          <p className="subtitle">
            Kõik sinu kirjeldatud metsatukad ühes vaates. Arvutused kasutavad
            tänaseid orienteeruvaid hindu ja {(PORTFOLIO_DISCOUNT * 100).toFixed(1)}%
            intressimäära. Andmed salvestatakse ainult sinu brauserisse.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="story-cards story-cards-3">
          <div className="story-card story-card-accent">
            <div className="story-card-label">Kogupindala</div>
            <div className="story-card-value">
              {totals.area.toLocaleString("et-EE")}{" "}
              <span className="story-card-unit">ha</span>
            </div>
            <div className="story-card-sub">{stands.length} metsatukka</div>
          </div>
          <div className="story-card">
            <div className="story-card-label">Raieküpset metsa</div>
            <div className="story-card-value">
              {totals.readyNow} <span className="story-card-unit">tk</span>
            </div>
            <div className="story-card-sub">
              seisva puidu väärtus ~{fmtMoney(totals.standingNet)}
            </div>
          </div>
          <div className="story-card">
            <div className="story-card-label">Puitu kokku</div>
            <div className="story-card-value">
              {fmtInt(totals.volume)} <span className="story-card-unit">m³</span>
            </div>
            <div className="story-card-sub">praeguses vanuses</div>
          </div>
        </div>

        {stands.length === 0 ? (
          <div className="panel todo-panel">
            <div className="todo-emoji">🌲</div>
            <h2>Portfell on tühi</h2>
            <p>
              Lisa esimene metsatukk: ava kalkulaator, kirjelda oma mets ja
              vajuta "Lisa see mets portfelli".
            </p>
            <div style={{ marginTop: 16 }}>
              <a className="story-next" href="#/kalkulaator">
                Ava kalkulaator →
              </a>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="section-title">
              <h2>Metsatukad</h2>
              <a className="back-btn" href="#/kalkulaator">+ Lisa uus</a>
            </div>
            <div className="table-wrap">
              <table className="compare">
                <thead>
                  <tr>
                    <th>Nimi</th>
                    <th>Puuliik</th>
                    <th>Kasvukoht</th>
                    <th>Vanus</th>
                    <th>Pindala</th>
                    <th>Staatus</th>
                    <th>Kätte (kinnistu) €</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {views.map((v) => {
                    const sp = SPECIES[v.stand.speciesId];
                    const site = SITES[v.stand.siteId];
                    return (
                      <tr key={v.stand.id}>
                        <td>
                          <a href={standToHash(v.stand)}>{v.stand.name}</a>
                        </td>
                        <td>{sp.emoji} {sp.name}</td>
                        <td>{site.name}</td>
                        <td>{v.stand.currentAge} a</td>
                        <td>{v.stand.area.toLocaleString("et-EE")} ha</td>
                        <td className={v.eligible ? "pos" : "neg"}>
                          {v.eligible
                            ? "Raieküps"
                            : `Küps ${v.yearsUntil} a pärast`}
                        </td>
                        <td>
                          {v.eligible
                            ? fmtMoneyFull(v.standingNetTotal)
                            : `~${fmtMoney(v.optimalNetTotal)} (${v.optimalAge} a)`}
                        </td>
                        <td>
                          <button
                            className="back-btn"
                            style={{ marginBottom: 0, padding: "4px 10px" }}
                            onClick={() => handleRemove(v.stand.id)}
                          >
                            Eemalda
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
