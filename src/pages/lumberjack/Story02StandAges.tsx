import { StandAgesChart } from "../../components/StandAgesChart";
import {
  SPECIES_ORDER,
  STAND_AGES,
  standAgesRows,
} from "../../data/standAges";

const fmtArea1 = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("et-EE", { maximumFractionDigits: 1 }) : "—";

export function Story02StandAges() {
  const rows = standAgesRows();
  const colors = STAND_AGES.puuliikide_varvid;
  const legendOrder = [...SPECIES_ORDER].reverse();

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Eesti metsa vanuseklassid</h1>
          <p className="subtitle">
            Lugu 2 / 3 — kogu Eesti puistute pindala vanuseklasside ja
            puuliikide kaupa, SMI 2023.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="story-cards story-cards-3">
          <div className="story-card">
            <div className="story-card-label">Kokku pindala</div>
            <div className="story-card-value">
              {fmtArea1(STAND_AGES.kokku_tuh_ha)}{" "}
              <span className="story-card-unit">tuh ha</span>
            </div>
          </div>
          <div className="story-card">
            <div className="story-card-label">Keskmine vanus</div>
            <div className="story-card-value">
              {STAND_AGES.keskmine_vanus_a}{" "}
              <span className="story-card-unit">aastat</span>
            </div>
          </div>
          <div className="story-card">
            <div className="story-card-label">Suurim klass</div>
            <div className="story-card-value">
              {STAND_AGES.suurim_klass}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Pindala vanuseklassiti, jagunemine puuliigiti</h2>
          </div>
          <StandAgesChart data={rows} />
          <div className="legend">
            {legendOrder.map((name) => (
              <span className="legend-chip" key={name}>
                <span
                  className="legend-dot"
                  style={{ background: colors[name] }}
                />
                {name}
              </span>
            ))}
          </div>
          <p className="story-takeaway" style={{ marginTop: 12 }}>
            Allikas:{" "}
            <a href={STAND_AGES.allikas.url} target="_blank" rel="noreferrer">
              {STAND_AGES.allikas.nimi}
            </a>{" "}
            — {STAND_AGES.allikas.valdaja}, {STAND_AGES.allikas.tabeli_kuupaev}.
          </p>
        </div>
      </div>
    </div>
  );
}
