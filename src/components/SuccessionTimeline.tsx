import {
  frameAtYear,
  interpolatedRecovery,
  PRECUT_BASELINE,
  type SuccessionFrame,
} from "../wildlife/habitat";
import type { Species, SpeciesId } from "../wildlife/species";
import { fmtNumber } from "./format";

interface SuccessionTimelineProps {
  frames: SuccessionFrame[];
  speciesById: Record<SpeciesId, Species>;
  year: number;
  onYearChange(year: number): void;
  isPlaying: boolean;
  onPlay(): void;
  onPause(): void;
  onReset(): void;
}

const BAR_COLORS = {
  elupaik: "var(--habitat, #4ade80)",
  varjualune: "var(--shelter, #93b86a)",
  toidubaas: "var(--food, #d4a373)",
} as const;

const BAR_LABELS = {
  elupaik: "Elupaik",
  varjualune: "Varjualune",
  toidubaas: "Toidubaas",
} as const;

export function SuccessionTimeline({
  frames,
  speciesById,
  year,
  onYearChange,
  isPlaying,
  onPlay,
  onPause,
  onReset,
}: SuccessionTimelineProps) {
  const frame = frameAtYear(year);
  const recovery = interpolatedRecovery(year);
  const present = new Set(frame.speciesPresent);
  const gained = new Set(frame.speciesGained ?? []);
  const missing = PRECUT_BASELINE.filter((s) => !present.has(s));

  return (
    <div className="succession-timeline">
      <div className="sim-controls">
        <div className="sim-transport">
          {isPlaying ? (
            <button
              type="button"
              className="sim-btn sim-btn-primary"
              onClick={onPause}
            >
              ⏸ Paus
            </button>
          ) : (
            <button
              type="button"
              className="sim-btn sim-btn-primary"
              onClick={onPlay}
            >
              ▶ Käivita
            </button>
          )}
          <button type="button" className="sim-btn" onClick={onReset}>
            ↺ Algusesse
          </button>
          <div className="sim-scrub">
            <span className="sim-scrub-label">
              Aasta {fmtNumber(year, 0)} / 100
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(year)}
              onChange={(e) => onYearChange(Number(e.target.value))}
            />
            <span className="sim-hint">1 sek = 1 aastakümme</span>
          </div>
        </div>
      </div>

      <div className="succession-phase">
        <div className="kpi-label">Faas</div>
        <div className="succession-phase-name">{frame.phase}</div>
        <p className="succession-phase-desc">{frame.phaseDesc}</p>
      </div>

      <div className="recovery-bars">
        {(["elupaik", "varjualune", "toidubaas"] as const).map((key) => {
          const v = recovery[key];
          return (
            <div className="recovery-row" key={key}>
              <div className="recovery-label">{BAR_LABELS[key]}</div>
              <div className="recovery-bar">
                <div
                  className="recovery-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, v))}%`,
                    background: BAR_COLORS[key],
                  }}
                />
              </div>
              <div className="recovery-value">{fmtNumber(v, 0)}%</div>
            </div>
          );
        })}
      </div>

      <div className="succession-species">
        <div className="kpi-label" style={{ marginBottom: 8 }}>
          Liigid kohal ({frame.speciesPresent.length})
        </div>
        <div className="species-strip">
          {frame.speciesPresent.map((sid) => {
            const sp = speciesById[sid];
            const isNew = gained.has(sid);
            return (
              <span
                key={sid}
                className={
                  "species-chip" + (isNew ? " species-chip-gained" : "")
                }
                title={sp.latin + (isNew ? " — uus" : "")}
              >
                <span className="species-chip-emoji" aria-hidden>
                  {sp.emoji}
                </span>
                {sp.name}
              </span>
            );
          })}
        </div>
      </div>

      {missing.length > 0 && (
        <div className="succession-species succession-missing">
          <div className="kpi-label" style={{ marginBottom: 8 }}>
            Puuduvad praegu ({missing.length})
          </div>
          <div className="species-strip">
            {missing.map((sid) => {
              const sp = speciesById[sid];
              return (
                <span
                  key={sid}
                  className="species-chip species-chip-missing"
                  title={`${sp.latin} — pole veel naasnud`}
                >
                  <span className="species-chip-emoji" aria-hidden>
                    {sp.emoji}
                  </span>
                  {sp.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="succession-frame-rail">
        {frames.map((f) => {
          const reached = year >= f.year;
          return (
            <button
              type="button"
              key={f.year}
              className={
                "succession-frame-dot" +
                (reached ? " succession-frame-dot-reached" : "")
              }
              onClick={() => onYearChange(f.year)}
              aria-label={`Hüppa aastale ${f.year}`}
              title={`${f.year} a — ${f.phase}`}
            />
          );
        })}
      </div>
    </div>
  );
}
