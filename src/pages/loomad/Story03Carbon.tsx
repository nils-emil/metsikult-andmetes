import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtInt, fmtNumber } from "../../components/format";
import { makeTooltip } from "../../components/Tooltip";

// Üks hektar küpset Eesti okasmetsa raies ≈ 300 m³ puitu (lähend).
const M3_PER_HECTARE = 300;

// 1 m³ keskmist okaspuitu ≈ 750 kg CO₂.
// Kuivtihedus ~400 kg/m³ × 50% süsinikku × 3,67 (C → CO₂) ≈ 734 kg.
const CO2_PER_M3 = 750;

// 1 ha → ~225 tonni CO₂ ekvivalenti puidus seotud.
const CO2_TOTAL_T = (M3_PER_HECTARE * CO2_PER_M3) / 1000;

// Saetoodete (palk → mööbel/ehitus) pooliga ~50 a — IPCC 2019 pikem ots
// pikaajalisele tarbeotstarbele.
const SAWLOG_HALF_LIFE = 50;

// Eralduvalt vaates: kogu süsinik miinus see, mis on alles toodetes.
function sawlogEmitted(year: number): number {
  return CO2_TOTAL_T * (1 - Math.pow(0.5, year / SAWLOG_HALF_LIFE));
}

// Küttepuu põleb peaaegu kohe — kogu süsinik vabaneb atmosfääri esimese aastaga.
function firewoodEmitted(year: number): number {
  if (year <= 0) return 0;
  if (year >= 1) return CO2_TOTAL_T;
  return CO2_TOTAL_T * year;
}

export function Story03Carbon() {
  const data = useMemo(() => {
    const out: { year: number; sawlog: number; firewood: number }[] = [];
    for (let y = 0; y <= 100; y++) {
      out.push({
        year: y,
        sawlog: Number(sawlogEmitted(y).toFixed(1)),
        firewood: Number(firewoodEmitted(y).toFixed(1)),
      });
    }
    return out;
  }, []);

  const sawlogEmittedAt50 = sawlogEmitted(50);
  const sawlogEmittedAt100 = sawlogEmitted(100);
  const avoidedAt50 = CO2_TOTAL_T - sawlogEmittedAt50;

  const tooltip = useMemo(
    () =>
      makeTooltip((label) => `Aasta ${label}`, [
        {
          name: "Küttepuuks → ahju",
          key: "firewood",
          color: "#E26B5B",
          format: (v) => `${fmtNumber(v, 0)} t CO₂ vabanenud`,
        },
        {
          name: "Palgiks → mööbel ja ehitus",
          key: "sawlog",
          color: "#D8B98C",
          format: (v) => `${fmtNumber(v, 0)} t CO₂ vabanenud`,
        },
      ]),
    [],
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Süsinik palgis vs küttepuus</h1>
          <p className="subtitle">
            Lugu 3 / 4 — kui üks hektar küpset metsa raiutakse, on selles ~225
            tonni CO₂. Kui kogu see puit küttepuuks, vabaneb kogu süsinik
            atmosfääri kohe. Kui palgiks ja mööbliks, jääb pool süsinikust
            tootesse 50 aastaks kinni.
          </p>
        </div>
      </header>

      <div className="story-cards story-cards-3">
        <div className="story-card">
          <div className="story-card-label">1 ha küpset metsa</div>
          <div className="story-card-value">
            {fmtInt(CO2_TOTAL_T)}
            <span className="story-card-unit">t CO₂ puidus</span>
          </div>
          <div className="story-card-sub">
            ~{M3_PER_HECTARE} m³/ha × {CO2_PER_M3} kg CO₂/m³
          </div>
        </div>
        <div className="story-card story-card-accent">
          <div className="story-card-label">50 a pärast — kõik küttepuuks</div>
          <div className="story-card-value" style={{ color: "#E26B5B" }}>
            {fmtInt(CO2_TOTAL_T)}
            <span className="story-card-unit">t CO₂ vabanenud</span>
          </div>
          <div className="story-card-sub">
            100% atmosfääri tagasi esimese aastaga
          </div>
        </div>
        <div className="story-card">
          <div className="story-card-label">50 a pärast — kõik palgiks</div>
          <div className="story-card-value" style={{ color: "#D8B98C" }}>
            {fmtInt(sawlogEmittedAt50)}
            <span className="story-card-unit">t CO₂ vabanenud</span>
          </div>
          <div className="story-card-sub">
            {fmtInt(avoidedAt50)} t veel toodetes kinni
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>CO₂ vabanenud atmosfääri — 100 aasta jooksul</h2>
          <span className="hint">
            Üks hektar küpset metsa, kaks puidu kasutusviisi
          </span>
        </div>

        <div className="chart-wrap tall">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 10, right: 28, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#2E4C40"
                strokeDasharray="3 4"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                type="number"
                domain={[0, 100]}
                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                tick={{ fill: "#A8B2A4", fontSize: 11 }}
                stroke="#456554"
                label={{
                  value: "Aastad pärast raiet",
                  position: "insideBottom",
                  offset: -2,
                  fill: "#7E8A7B",
                  fontSize: 11,
                }}
              />
              <YAxis
                tick={{ fill: "#A8B2A4", fontSize: 11 }}
                stroke="#456554"
                domain={[0, CO2_TOTAL_T]}
                label={{
                  value: "CO₂ vabanenud (t / ha)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#7E8A7B",
                  fontSize: 11,
                  dy: 60,
                }}
              />
              <Tooltip
                content={tooltip as never}
                cursor={{ stroke: "#B6D24A", strokeOpacity: 0.4 }}
              />
              <ReferenceLine
                y={CO2_TOTAL_T}
                stroke="#E26B5B"
                strokeOpacity={0.3}
                strokeDasharray="2 4"
                label={{
                  value: "kogu puidu süsinik",
                  fill: "#A8B2A4",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />
              <Line
                type="monotone"
                dataKey="firewood"
                stroke="#E26B5B"
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="sawlog"
                stroke="#D8B98C"
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="legend" style={{ marginTop: 12 }}>
          <span className="legend-chip">
            <span className="legend-dot" style={{ background: "#E26B5B" }} />
            Küttepuud — kogu süsinik vabaneb esimese aastaga
          </span>
          <span className="legend-chip">
            <span className="legend-dot" style={{ background: "#D8B98C" }} />
            Palk → mööbel ja ehituspuit (pooliga ~50 a)
          </span>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Mida need numbrid tähendavad</h2>
        </div>
        <p className="story-takeaway">
          <strong>Sama mets, kaks saatust.</strong> Kui ühe hektari küpse metsa
          ~225 tonni CO₂ läheb täies mahus ahju, on see kogus atmosfääris{" "}
          <strong>aastaga</strong>. Kui sama puit saeb palgiks ja sealt mööbliks
          või kandetalaks, hoidub atmosfäärist 50 aasta jooksul eemal{" "}
          <strong>{fmtInt(avoidedAt50)} tonni CO₂</strong> — ja sajandi pärast
          on ikka veel ~{fmtInt(CO2_TOTAL_T - sawlogEmittedAt100)} tonni
          toodetes kinni.
        </p>
        <p className="story-takeaway" style={{ marginTop: 12 }}>
          <strong>Aga küttepuu pole alati halb.</strong> Kui ahjupuit asendab
          maagaasi või põlevkivi, on osa emissioonist <em>vältimatu</em> —
          fossiilkütus oleks põlenud niikuinii. Pikaajalise süsiniku sidumise
          poolt jääb palk siiski selgelt peale. Vahepealne on{" "}
          <strong>paberipuit</strong>: paberi pooliga on ~2 aastat, seega see
          käitub küttepuule sarnaselt. Lisaks seob mets, mis raie järel tagasi
          kasvab, omakorda uut süsinikku — kuid see kulgeb aeglaselt ega kustuta
          põletamise hetkemõju kohe.
        </p>
        <p
          className="story-takeaway"
          style={{ marginTop: 12, color: "var(--text-mute)", fontSize: 13 }}
        >
          Numbrid on illustratiivsed: IPCC 2019 toote-eluiga (pooliga) on
          saetoodetel 35 a, paberil 2 a; siin näidatud 50 a esindab pikemat
          tarbeotstarvet nagu puitehitis. 1 ha küpset Eesti okasmetsa annab
          ~{M3_PER_HECTARE} m³ puitu; 1 m³ ≈ 400 kg kuivmassi × 50% C × 3,67
          ≈ {CO2_PER_M3} kg CO₂. Eksponentsiaalne lagunemine on standardne
          lähendus. Allikad: IPCC 2019 Refinement (Harvested Wood Products),
          Eesti Keskkonnaagentuur.
        </p>
      </div>
    </div>
  );
}
