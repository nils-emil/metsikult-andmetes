import { fmtNumber } from "./format";

interface Props {
  harvests: [number, number, number];
  onHarvestsChange: (h: [number, number, number]) => void;
  currentYear: number;
  onYearChange: (y: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  scenarioColors: [string, string, string];
  scenarioLabels: [string, string, string];
}

export function SimulationControls({
  harvests,
  onHarvestsChange,
  currentYear,
  onYearChange,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  scenarioColors,
  scenarioLabels,
}: Props) {
  const updateHarvest = (idx: 0 | 1 | 2, v: number) => {
    const next: [number, number, number] = [...harvests];
    next[idx] = v;
    onHarvestsChange(next);
  };

  return (
    <div className="sim-controls">
      <div className="sim-scenarios">
        {[0, 1, 2].map((idx) => {
          const i = idx as 0 | 1 | 2;
          return (
            <div className="sim-scenario-row" key={i}>
              <span
                className="sim-dot sim-dot-lg"
                style={{ background: scenarioColors[i] }}
              />
              <span
                className="sim-scenario-label"
                style={{ color: scenarioColors[i] }}
              >
                {scenarioLabels[i]}
              </span>
              <input
                type="range"
                min={0}
                max={25}
                step={0.5}
                value={harvests[i]}
                onChange={(e) =>
                  updateHarvest(i, Number(e.target.value))
                }
              />
              <span className="sim-scenario-value">
                {fmtNumber(harvests[i], 1)}
                <span className="sim-unit"> M m³/a</span>
              </span>
            </div>
          );
        })}
      </div>

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
            disabled={currentYear >= 100}
          >
            ▶ Käivita
          </button>
        )}
        <button type="button" className="sim-btn" onClick={onReset}>
          ↺ Lähtesta
        </button>
        <div className="sim-scrub">
          <span className="sim-scrub-label">
            Aasta {Math.floor(currentYear)} / 100
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.floor(currentYear)}
            onChange={(e) => onYearChange(Number(e.target.value))}
          />
        </div>
        <span className="sim-hint">1 sek = 1 aastakümme</span>
      </div>
    </div>
  );
}
