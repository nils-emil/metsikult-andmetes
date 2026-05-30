import { GrowthChart } from "../../components/GrowthChart";
import { fmtInt } from "../../components/format";
import { growthSeries } from "../../forestry/model";

const HORIZON_YEARS = 400;
const STORY_AGE_A = 50;
const STORY_AGE_B = 80;
const STORY_AGE_C = 133;
const SPECIES_ID = "spruce" as const;
const SITE_ID = "medium" as const;

export function Story01Growth() {
  const series = growthSeries(SPECIES_ID, SITE_ID, 180, 1);

  const total400 = (age: number) => {
    const cycles = Math.max(1, Math.floor(HORIZON_YEARS / age));
    const v = series[age]?.volume ?? 0;
    return { cycles, perCycle: v, total: cycles * v };
  };
  const storyA = total400(STORY_AGE_A);
  const storyB = total400(STORY_AGE_B);
  const storyC = total400(STORY_AGE_C);
  const totals = [
    { age: STORY_AGE_A, total: storyA.total },
    { age: STORY_AGE_B, total: storyB.total },
    { age: STORY_AGE_C, total: storyC.total },
  ];
  const best = totals.reduce((b, p) => (p.total > b.total ? p : b));
  const worst = totals.reduce((b, p) => (p.total < b.total ? p : b));
  const spread = best.total - worst.total;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Kuidas mets kasvab</h1>
          <p className="subtitle">
            Lugu 2 / 5 — sama hektar metsamaad 400 aasta jooksul.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="panel">
          <div className="section-title">
            <h2>Kuidas mets kasvab</h2>
          </div>
          <GrowthChart data={series} showRotationMark={false} showMai={false} />
          <div className="legend">
            <span className="legend-chip">
              <span className="legend-dot" style={{ background: "#B6D24A" }} />
              Puidu kogus (m³/ha)
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

        <div className="panel story-panel">
          <h2>400 aastat sama metsamaad</h2>
          <p>
            Sama hektar metsa. Kui sama metsa raida iga {STORY_AGE_A},{" "}
            {STORY_AGE_B} või {STORY_AGE_C} aasta tagant, on 400 aasta
            lõpus kogusumma erinev:
          </p>

          <div className="story-cards story-cards-3">
            <div className="story-card">
              <div className="story-card-label">Väga noor mets</div>
              <div className="story-card-value">
                {STORY_AGE_A} <span className="story-card-unit">aastat</span>
              </div>
              <div className="story-card-sub">
                {storyA.cycles} raiet × {fmtInt(storyA.perCycle)} m³/ha
              </div>
              <div className="story-card-total">
                = {fmtInt(storyA.total)} m³/ha
              </div>
            </div>

            <div className="story-card">
              <div className="story-card-label">Noorem mets</div>
              <div className="story-card-value">
                {STORY_AGE_B} <span className="story-card-unit">aastat</span>
              </div>
              <div className="story-card-sub">
                {storyB.cycles} raiet × {fmtInt(storyB.perCycle)} m³/ha
              </div>
              <div className="story-card-total">
                = {fmtInt(storyB.total)} m³/ha
              </div>
            </div>

            <div className="story-card">
              <div className="story-card-label">Vanem mets</div>
              <div className="story-card-value">
                {STORY_AGE_C} <span className="story-card-unit">aastat</span>
              </div>
              <div className="story-card-sub">
                {storyC.cycles} raiet × {fmtInt(storyC.perCycle)} m³/ha
              </div>
              <div className="story-card-total">
                = {fmtInt(storyC.total)} m³/ha
              </div>
            </div>
          </div>

          <p className="story-takeaway">
            Kõige rohkem puitu — <strong>{fmtInt(best.total)} m³/ha</strong>{" "}
            — saab {best.age}-aastaselt raides. Vahe kõige vähem tootva
            ({worst.age}-aastase) variandiga on{" "}
            <strong>{fmtInt(spread)} m³/ha</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
