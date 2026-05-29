import { useEffect, useMemo, useRef, useState } from "react";
import { SimulationControls } from "../../components/SimulationControls";
import {
  SimulationTotalChart,
  type TotalView,
} from "../../components/SimulationTotalChart";
import {
  SimulationBreakdownChart,
  type BreakdownView,
} from "../../components/SimulationBreakdownChart";
import { fmtNumber } from "../../components/format";
import { runSimulation, STARTING_VOLUME_LABEL_MM3 } from "../../forestry/simulation";
import { STAND_AGES } from "../../data/standAges";

const SCENARIO_LABELS: [string, string, string] = ["Madal", "Tänane", "Kõrge"];
const SCENARIO_COLORS: [string, string, string] = [
  "#93b86a",
  "#4ade80",
  "#c47e3e",
];
const DEFAULT_HARVESTS: [number, number, number] = [6, 12, 18];

export function Story03Simulation() {
  const [harvests, setHarvests] =
    useState<[number, number, number]>(DEFAULT_HARVESTS);
  const [currentYear, setCurrentYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<BreakdownView>("species");
  const [breakdownScenario, setBreakdownScenario] = useState<0 | 1 | 2>(1);
  const [totalView, setTotalView] = useState<TotalView>("standing");
  const rafRef = useRef<number | null>(null);

  const runs = useMemo(
    () => harvests.map((h) => runSimulation(h, 100)),
    [harvests],
  );

  useEffect(() => {
    if (!isPlaying) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setCurrentYear((y) => {
        const next = y + dt * 10;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const handleHarvestsChange = (h: [number, number, number]) => {
    setHarvests(h);
    setIsPlaying(false);
    setCurrentYear(0);
  };

  const handleScrub = (y: number) => {
    setIsPlaying(false);
    setCurrentYear(y);
  };

  const handlePlay = () => {
    if (currentYear >= 100) setCurrentYear(0);
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentYear(0);
  };

  const yearIdx = Math.min(
    100,
    Math.max(0, Math.floor(currentYear)),
  );
  const start0 = runs[0]?.[0]?.total ?? 0;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Eesti metsa simulatsioon</h1>
          <p className="subtitle">
            Lugu 3 / 3 — mis juhtub Eesti metsavaruga eri raiemahtude juures,
            100 aasta jooksul. Algtagavara ~{STARTING_VOLUME_LABEL_MM3} M m³
            (SMI 2023).
          </p>
        </div>
      </header>

      <div className="col">
        <div className="panel">
          <div className="section-title">
            <h2>Stsenaariumid ja taasesitus</h2>
            <span className="hint">
              Vali raiemaht igale stsenaariumile, vajuta Käivita
            </span>
          </div>
          <SimulationControls
            harvests={harvests}
            onHarvestsChange={handleHarvestsChange}
            currentYear={currentYear}
            onYearChange={handleScrub}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            scenarioColors={SCENARIO_COLORS}
            scenarioLabels={SCENARIO_LABELS}
          />
        </div>

        <div className="story-cards story-cards-3">
          {[0, 1, 2].map((idx) => {
            const i = idx as 0 | 1 | 2;
            const step = runs[i]?.[yearIdx];
            if (!step) return null;
            const standing = step.total;
            const cumRaie = step.cumulativeHarvested;
            const kogumaht = standing + cumRaie;
            const delta = standing - start0;
            const sign = delta >= 0 ? "+" : "−";
            const actualHarvest = step.harvested.total;
            const target = harvests[i];
            const clipped = yearIdx > 0 && actualHarvest + 0.05 < target;
            return (
              <div
                className="story-card"
                key={i}
                style={{ borderColor: SCENARIO_COLORS[i] + "55" }}
              >
                <div
                  className="story-card-label"
                  style={{ color: SCENARIO_COLORS[i] }}
                >
                  {SCENARIO_LABELS[i]} — {fmtNumber(harvests[i], 1)} M m³/a
                </div>
                <div className="story-card-value">
                  {fmtNumber(standing, 0)}{" "}
                  <span className="story-card-unit">M m³ tagavara</span>
                </div>
                <div className="story-card-sub">
                  Muutus algusest: {sign}
                  {fmtNumber(Math.abs(delta), 1)} M m³
                </div>
                <div className="sim-card-extra">
                  <div className="sim-card-row">
                    <span>Kumulatiivne raie</span>
                    <strong>{fmtNumber(cumRaie, 0)} M m³</strong>
                  </div>
                  <div className="sim-card-row sim-card-row-total">
                    <span>Kogumaht</span>
                    <strong>{fmtNumber(kogumaht, 0)} M m³</strong>
                  </div>
                </div>
                {clipped && (
                  <div className="sim-clip-warn">
                    ⚠ Küpset metsa pole piisavalt — raie{" "}
                    {fmtNumber(actualHarvest, 1)} M m³/a
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Kogutagavara Eestis</h2>
            <span className="hint">100 aastat, kõik kolm stsenaariumi</span>
          </div>
          <SimulationTotalChart
            runs={runs}
            currentYear={currentYear}
            scenarioColors={SCENARIO_COLORS}
            scenarioLabels={SCENARIO_LABELS}
            viewMode={totalView}
            onViewModeChange={setTotalView}
          />
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Tagavara jaotus aastakümneti</h2>
            <span className="hint">
              Üks stsenaarium korraga — vali ülal vaade ja stsenaarium
            </span>
          </div>
          <SimulationBreakdownChart
            run={runs[breakdownScenario]}
            currentYear={currentYear}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            scenarioIndex={breakdownScenario}
            onScenarioChange={setBreakdownScenario}
            scenarioLabels={SCENARIO_LABELS}
            scenarioColors={SCENARIO_COLORS}
          />
          <p className="story-takeaway" style={{ marginTop: 12 }}>
            Algandmed:{" "}
            <a href={STAND_AGES.allikas.url} target="_blank" rel="noreferrer">
              {STAND_AGES.allikas.nimi}
            </a>{" "}
            — {STAND_AGES.allikas.valdaja}. Kasvumudel: Chapman-Richards
            keskmisel kasvukohal (Story 1 valem). Haab, sanglepp, hall lepp ja
            teised liigid kasutavad arukase kasvuparameetreid lähendusena.
            Vanuseklassi promotsioon: 10% aastas.
            <br />
            <strong>Seaduslik piirang:</strong> uuendusraie toimub ainult
            küpsusvanuse saavutanud puistutest (Metsaseadus § 29) — mänd 90 a,
            kuusk 70 a, kask 60 a, sanglepp ja teised 60 a, haab 40 a, hall
            lepp 30 a (keskmise boniteediga puistud). Kui küpset metsa pole
            piisavalt, piirdub raiemaht olemasolevaga ja stsenaariumi kaart
            näitab hoiatust. Tegemist on hariva lihtsustusega, mitte ametliku
            prognoosiga.
          </p>
        </div>
      </div>
    </div>
  );
}
