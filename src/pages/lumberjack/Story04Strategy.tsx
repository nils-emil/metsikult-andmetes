import { useState } from "react";
import {
  MAK2030_OVERALL,
  MAK2030_SUBGOALS,
  MAK2030_INDICATORS,
  MAK2030_PROBLEMS,
  MAK2030_SOURCES,
  POST_CLEARCUT_FACTS,
  type Indicator,
} from "../../data/mak2030";

const STATUS_LABEL: Record<Indicator["status"], string> = {
  saavutatud: "Saavutatud",
  edenemas: "Edeneb",
  vajab_tegevust: "Vajab tegevust",
};

const STATUS_COLOR: Record<Indicator["status"], string> = {
  saavutatud: "#B6D24A",
  edenemas: "#d4a373",
  vajab_tegevust: "#f87171",
};

type FilterStatus = "koik" | Indicator["status"];

export function Story04Strategy() {
  const [filter, setFilter] = useState<FilterStatus>("koik");
  const [openProblem, setOpenProblem] = useState<number | null>(null);

  const indicators = MAK2030_INDICATORS.filter(
    (i) => filter === "koik" || i.status === filter,
  );

  const counts = MAK2030_INDICATORS.reduce<Record<Indicator["status"], number>>(
    (acc, i) => {
      acc[i.status] += 1;
      return acc;
    },
    { saavutatud: 0, edenemas: 0, vajab_tegevust: 0 },
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Mis juhtub peale lageraiet</h1>
          <p className="subtitle">
            Lugu 4 / 4 — Eesti metsanduse arengukava {MAK2030_OVERALL.period}{" "}
            (MAK2030) väljundid: kuhu Eesti mets liigub raie järel ja kuidas
            seda mõõdetakse.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="panel">
          <div className="section-title">
            <h2>Lageraie järel — neli tahku</h2>
            <span className="hint">
              Strateegia raamib seda, mis raie järel juhtuma peab
            </span>
          </div>
          <div className="strategy-facts">
            {POST_CLEARCUT_FACTS.map((f) => (
              <div className="strategy-fact" key={f.label}>
                <div className="strategy-fact-label">{f.label}</div>
                <div className="strategy-fact-body">{f.fact}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>MAK2030 üldeesmärgid</h2>
            <span className="hint">
              Kinnitab Riigikogu ({MAK2030_OVERALL.baseLaw}); pika vaate aasta{" "}
              {MAK2030_OVERALL.longViewYear}
            </span>
          </div>
          <ul className="strategy-goals">
            {MAK2030_OVERALL.generalGoals.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Kuus alaeesmärki</h2>
            <span className="hint">
              Juhtkogu poolt 2020. a sõnastatud — strateegia selgroog
            </span>
          </div>
          <div className="subgoals-grid">
            {MAK2030_SUBGOALS.map((s) => (
              <div className="subgoal-card" key={s.number}>
                <div className="subgoal-header">
                  <span className="subgoal-icon" aria-hidden>
                    {s.icon}
                  </span>
                  <div>
                    <div className="subgoal-number">Alaeesmärk {s.number}</div>
                    <div className="subgoal-short">{s.shortLabel}</div>
                  </div>
                </div>
                <div className="subgoal-title">{s.title}</div>
                <div className="subgoal-desc">{s.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Mõõdetavad sihid ja saavutused</h2>
            <span className="hint">
              {MAK2030_INDICATORS.length} indikaatorit — filtreeri seisundi
              järgi
            </span>
          </div>
          <div className="indicator-filters">
            <button
              type="button"
              className={
                "indicator-filter" + (filter === "koik" ? " active" : "")
              }
              onClick={() => setFilter("koik")}
            >
              Kõik ({MAK2030_INDICATORS.length})
            </button>
            {(["saavutatud", "edenemas", "vajab_tegevust"] as const).map(
              (s) => (
                <button
                  type="button"
                  key={s}
                  className={
                    "indicator-filter" + (filter === s ? " active" : "")
                  }
                  onClick={() => setFilter(s)}
                  style={{
                    borderColor:
                      filter === s ? STATUS_COLOR[s] : undefined,
                    color: filter === s ? STATUS_COLOR[s] : undefined,
                  }}
                >
                  <span
                    className="indicator-dot"
                    style={{ background: STATUS_COLOR[s] }}
                  />
                  {STATUS_LABEL[s]} ({counts[s]})
                </button>
              ),
            )}
          </div>
          <div className="indicator-grid">
            {indicators.map((i) => (
              <div
                className="indicator-card"
                key={i.label}
                style={{ borderColor: STATUS_COLOR[i.status] + "55" }}
              >
                <div className="indicator-top">
                  <span
                    className="indicator-status"
                    style={{
                      background: STATUS_COLOR[i.status] + "22",
                      color: STATUS_COLOR[i.status],
                      borderColor: STATUS_COLOR[i.status] + "55",
                    }}
                  >
                    {STATUS_LABEL[i.status]}
                  </span>
                </div>
                <div className="indicator-value">
                  {i.value}
                  <span className="indicator-unit"> {i.unit}</span>
                </div>
                <div className="indicator-label">{i.label}</div>
                <div className="indicator-context">{i.context}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>12 prioriteetset probleemi</h2>
            <span className="hint">
              Algatamise töörühm sõnastas 101 probleemi, neist 12 valiti
              prioriteetseks
            </span>
          </div>
          <div className="problem-groups">
            {MAK2030_PROBLEMS.map((g) => (
              <div className="problem-group" key={g.category}>
                <div className="problem-group-head">
                  <h3 className="problem-group-title">{g.category}</h3>
                  <span className="problem-group-meta">
                    Forest Europe: {g.forestEuropeCriterion}
                  </span>
                </div>
                <div className="problem-list">
                  {g.problems.map((p) => {
                    const isOpen = openProblem === p.number;
                    return (
                      <button
                        type="button"
                        className={
                          "problem-item" + (isOpen ? " problem-item-open" : "")
                        }
                        key={p.number}
                        onClick={() =>
                          setOpenProblem(isOpen ? null : p.number)
                        }
                        aria-expanded={isOpen}
                      >
                        <div className="problem-item-head">
                          <span className="problem-num">{p.number}</span>
                          <span className="problem-title">{p.title}</span>
                          <span className="problem-toggle" aria-hidden>
                            {isOpen ? "−" : "+"}
                          </span>
                        </div>
                        {isOpen && (
                          <div className="problem-bg">{p.background}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Allikad</h2>
            <span className="hint">Ametlikud dokumendid ja taustamaterjal</span>
          </div>
          <ul className="source-list">
            {MAK2030_SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
                <span className="source-publisher"> — {s.publisher}</span>
              </li>
            ))}
          </ul>
          <p className="story-takeaway" style={{ marginTop: 12 }}>
            <strong>Märkus:</strong> arvulised väärtused pärinevad valdavalt
            MAK2030 koostamise ettepanekust (2019) ja MAK2020 täitmise
            aruandest (2011–2016 + täiendused 2017). Need on{" "}
            arengukava <em>algtasemed</em> — strateegia lõplikud sihttasemed
            kinnitati Riigikogu poolt MAK2030 vastuvõtmisel; jälgi
            kliimaministeerium.ee/MAK2030 ajakohaste väärtuste jaoks.
          </p>
        </div>
      </div>
    </div>
  );
}
