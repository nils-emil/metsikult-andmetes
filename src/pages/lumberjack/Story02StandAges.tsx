import { useState } from "react";
import { StandAgesChart } from "../../components/StandAgesChart";
import { SpeciesRotationCompare } from "../../components/SpeciesRotationCompare";
import {
  SPECIES_ORDER,
  STAND_AGES,
  standAgesRows,
  type SpeciesName,
} from "../../data/standAges";
import type { SpeciesId } from "../../forestry/species";

const fmtArea1 = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("et-EE", { maximumFractionDigits: 1 }) : "—";

const SPECIES_MAP: Partial<Record<SpeciesName, SpeciesId>> = {
  Kuusk: "spruce",
  Mänd: "pine",
  Kask: "birch",
};

export function Story02StandAges() {
  const rows = standAgesRows();
  const colors = STAND_AGES.puuliikide_varvid;
  const legendOrder = [...SPECIES_ORDER].reverse();

  const [selected, setSelected] = useState<SpeciesName | null>(null);
  const selectedId = selected ? SPECIES_MAP[selected] : undefined;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Eesti metsa vanuseklassid</h1>
          <p className="subtitle">
            Lugu 2 / 5 — kogu Eesti puistute pindala vanuseklasside ja
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
            <span className="hint">
              Vajuta puuliigile (Kuusk, Mänd, Kask), et näha raievanuse võrdlust
            </span>
          </div>
          <StandAgesChart
            data={rows}
            selectedSpecies={selected}
            onSelectSpecies={setSelected}
          />
          <div className="legend">
            {legendOrder.map((name) => {
              const clickable = SPECIES_MAP[name] != null;
              const isSelected = selected === name;
              const dim =
                !clickable ? 0.55 : selected && !isSelected ? 0.55 : 1;
              return (
                <button
                  type="button"
                  className={
                    "legend-chip" +
                    (clickable ? " legend-chip-clickable" : "") +
                    (isSelected ? " legend-chip-active" : "")
                  }
                  key={name}
                  style={{ opacity: dim }}
                  onClick={
                    clickable
                      ? () => setSelected(isSelected ? null : name)
                      : undefined
                  }
                  disabled={!clickable}
                >
                  <span
                    className="legend-dot"
                    style={{ background: colors[name] }}
                  />
                  {name}
                </button>
              );
            })}
          </div>
          <p className="story-takeaway" style={{ marginTop: 12 }}>
            Allikas:{" "}
            <a href={STAND_AGES.allikas.url} target="_blank" rel="noreferrer">
              {STAND_AGES.allikas.nimi}
            </a>{" "}
            — {STAND_AGES.allikas.valdaja}, {STAND_AGES.allikas.tabeli_kuupaev}.
          </p>
        </div>

        {selectedId && (
          <SpeciesRotationCompare
            speciesId={selectedId}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
