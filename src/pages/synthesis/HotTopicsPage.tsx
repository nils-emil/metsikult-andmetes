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

export function HotTopicsPage() {
  return (
    <div className="app">
      <a className="back-btn" href="#/sild">
        ← Tagasi kokkuvõttesse
      </a>

      <header className="header">
        <div>
          <h1 className="title">Eesti metsa olulised teemad</h1>
          <p className="subtitle">
            Ühisosa — seitse vaidlust, mille üle praegu Eesti metsade kohta
            kõige rohkem debatti käib. Need puudutavad mõlemat vaadet korraga.
            Iga teema kõrval on reaalsetel andmetel põhinev visualiseering ja
            viide allikale.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="story-cards story-cards-3">
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
              {topic.chartHint && <span className="hint">{topic.chartHint}</span>}
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

        <div className="panel">
          <p className="story-takeaway">
            <strong>Kaks vaadet kohtuvad:</strong> raidur näeb tulu, loom näeb
            elupaika. Pane mõlemad ühele skaalale ja otsusta ise, kus on õige
            raievanus — <a href="#/sild">Otsusta ise: kaks vaadet, üks
            raievanus</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
