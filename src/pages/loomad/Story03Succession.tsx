import { useEffect, useRef, useState } from "react";
import { SuccessionTimeline } from "../../components/SuccessionTimeline";
import {
  frameAtYear,
  interpolatedRecovery,
  SUCCESSION_FRAMES,
} from "../../wildlife/habitat";
import { SPECIES } from "../../wildlife/species";
import { fmtNumber } from "../../components/format";

export function Story03Succession() {
  const [year, setYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setYear((y) => {
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

  const handlePlay = () => {
    if (year >= 100) setYear(0);
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setYear(0);
  };
  const handleScrub = (y: number) => {
    setIsPlaying(false);
    setYear(y);
  };

  const frame = frameAtYear(year);
  const recovery = interpolatedRecovery(year);
  const overall =
    (recovery.elupaik + recovery.varjualune + recovery.toidubaas) / 3;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Lageraie ajaskaala</h1>
          <p className="subtitle">
            Lugu 3 / 4 — kui kaua kulub elupaiga, varjualuse ja toidubaasi
            taastumiseks pärast lageraiet? Vali aasta või lase mängul edasi —
            1 sek = 1 aastakümme.
          </p>
        </div>
      </header>

      <div className="story-cards story-cards-3">
        <div className="story-card">
          <div className="story-card-label">Aasta raie järel</div>
          <div className="story-card-value">
            {fmtNumber(year, 0)}
            <span className="story-card-unit">a</span>
          </div>
        </div>
        <div className="story-card">
          <div className="story-card-label">Faas</div>
          <div
            className="story-card-value"
            style={{ fontSize: 20, lineHeight: 1.2 }}
          >
            {frame.phase}
          </div>
        </div>
        <div className="story-card story-card-accent">
          <div className="story-card-label">Taastumine kokku</div>
          <div className="story-card-value">
            {fmtNumber(overall, 0)}
            <span className="story-card-unit">% küpse metsa väärtusest</span>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Taastumiskõverad ja liigid</h2>
          <span className="hint">
            Klõpsa punktile rajal, et hüpata kindlale aastale
          </span>
        </div>
        <SuccessionTimeline
          frames={SUCCESSION_FRAMES}
          speciesById={SPECIES}
          year={year}
          onYearChange={handleScrub}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
        />
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="section-title">
          <h2>Mida see graafik EI ütle</h2>
        </div>
        <p className="story-takeaway">
          <strong>Kõverad on illustratiivsed</strong>, mitte mõõdetud — Eesti
          lageraie-järgse sukessiooni kvantitatiivseid kõveraid on vähe
          avaldatud. Tegelik taastumine sõltub raie tüübist (lageraie vs
          uuendusraie säilikpuudega), kasvukoha boniteedist, jäänud lamapuidu
          mahust ja sellest, kas läheduses on populatsiooni allikas (näiteks
          lendoravale ainult Kirde-Eestis).{" "}
          <strong>Mida graafik siiski ütleb õigesti:</strong> taastumise
          järjekord — toidubaas tuleb esimesena (aastad 0–10), varjualune järgmine
          (20–50), kihistus ja vana metsa elemendid alles 60+ a. Mõned liigid
          (valgeselg-kirjurähn, lendorav, must-toonekurg) ei taastu täielikult
          isegi 100 a jooksul. Allikad: Keskkonnaagentuur, EOÜ, eElurikkus.
        </p>
      </div>
    </div>
  );
}
