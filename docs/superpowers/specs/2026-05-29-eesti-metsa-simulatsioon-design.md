# Eesti metsa simulatsioon — Lugu 3 (design)

Date: 2026-05-29
Status: Draft → awaiting user review after spec review loop
Scope: Replace the Calculator at lumberjack step 3 with an animated forest-stock simulation page.

## Summary

A new page that lets the user pick **three annual harvest volumes** (M m³/aastas) and watch the Estonian forest stock evolve over 100 years. The simulation uses the existing Chapman-Richards growth model applied to the SMI 2023 stand-age × species area matrix. Two charts: (1) total standing volume in Estonia over time, three lines side-by-side; (2) per-decade segmented breakdown of the currently focused scenario, with view tabs for species / assortment / age class. Playback rate is **1 sekund = 3 aastat**; full run takes ~33 seconds.

## Goals & non-goals

**Goals**
- Communicate visually how different harvest intensities reshape Estonia's forest stock and structure over a century.
- Reuse the project's existing biological model (`volumeAtAge` from `src/forestry/model.ts`) rather than introduce a parallel growth formula.
- Keep the domain (simulation math) cleanly separate from the React/chart presentation, consistent with the rest of the codebase.

**Non-goals**
- Economic / revenue / CO₂ / biodiversity outputs (those are separate future stories).
- More than three scenarios, saved/shareable scenarios, or mobile-specific layout tuning beyond what existing pages already provide.
- Historical or projected real-world claims about Estonian harvest policy — the scenarios are illustrative.

## Routing & navigation

- Hash route `#/raidur/3` continues to exist; its component swaps from `CalculatorPage` to `Story03Simulation`.
- `src/pages/lumberjack/steps.ts`: relabel step 3 from `"Mis puidust saab ja tulu"` to `"Eesti metsa simulatsioon"`.
- `src/App.tsx`: swap the import on the `#/raidur/3` branch.
- `CalculatorPage.tsx` and its dedicated components stay in the tree (no references after the swap). A follow-up cleanup is **out of scope** for this work.

## File layout

```
src/
├── forestry/
│   └── simulation.ts                   # new — pure domain, no React
├── components/
│   ├── SimulationControls.tsx          # new — sliders + transport + scrub
│   ├── SimulationTotalChart.tsx        # new — Chart 1 (line chart)
│   └── SimulationBreakdownChart.tsx    # new — Chart 2 (stacked bars + tabs)
├── pages/lumberjack/
│   ├── steps.ts                        # edit — relabel step 3
│   └── Story03Simulation.tsx           # new — owns state, composes the page
└── App.tsx                             # edit — swap import on #/raidur/3
```

Reuse: `src/components/Tooltip.tsx#makeTooltip`, `src/components/format.ts`, color tokens in `src/index.css`.

## Domain: `src/forestry/simulation.ts`

### Types

```ts
import type { SpeciesName } from "../data/standAges";

export type StandMatrix = Record<SpeciesName, number[]>;     // 15 entries, tuh ha per age class

export interface Breakdown {
  bySpecies: Record<SpeciesName, number>;                    // M m³
  byAssortment: { pulp: number; saw: number; veneer: number }; // M m³
  byClass: number[];                                         // 15 entries, M m³
}

export interface SimulationStep extends Breakdown {
  year: number;          // 0..100
  total: number;         // M m³
  harvested: Breakdown;  // realized harvest this year (may be < target if stock runs out)
}
```

### Constants

- `STARTING_VOLUME_LABEL_MM3 = 518` — used only for the KPI starting-label and source citation. The actual `total` at year 0 is computed from the matrix; both are displayed.
- `CLASS_MIDPOINTS = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145]` — midpoints of the 15 ten-year classes (final class "141+" treated as midpoint 145).
- `SPECIES_PROXY: Record<SpeciesName, SpeciesId>` —
  `Mänd → pine`, `Kuusk → spruce`, `Kask → birch`, and `Haab / Sanglepp / Hall lepp / Teised → birch` (kask-proxy for broadleaves not in the model).
- Site for all puistud: `"medium"`.
- Class promotion rate: 10%/aastas (10-year classes → 1/10 of each class moves to the next class per year). Approximate cohort flow; flagged in source note.

### Functions

```ts
export function initialMatrix(): StandMatrix;
// Loads from src/data/estonian-stand-ages.json. Returns a deep-cloned matrix
// in tuh ha. Order of age classes matches STAND_AGES.vanuseklassid.

export function volumePerHa(speciesName: SpeciesName, classIndex: number): number;
// volumeAtAge(CLASS_MIDPOINTS[classIndex], SPECIES_PROXY[speciesName], "medium")

export function totalVolumeMm3(state: StandMatrix): number;
// Σ over species, classes of (area[tuh ha] × volPerHa[m³/ha]) → tuh×m³ = kilo m³,
// divided by 1000 to give M m³.

export function breakdown(state: StandMatrix): Breakdown;
// bySpecies, byClass straight aggregations; byAssortment uses assortmentShares()
// at each class midpoint per species and weights by area×volPerHa.

export function stepOneYear(
  state: StandMatrix,
  targetHarvestMm3: number,
): { next: StandMatrix; harvested: Breakdown };
// 1. Age: for each species, for each class i from 14 down to 1, move 10% of
//    area from class i-1 into class i; the last class accumulates (no class beyond 145).
//    (Implementation iterates back-to-front so flows don't double-shift in one pass.)
// 2. Harvest: walk classes from oldest to youngest. For the current oldest class
//    with available volume, compute how much area is needed to satisfy the remaining
//    target, harvest that area proportionally across species in that class, move the
//    cleared area into class 0 (≤10), and continue. If target cannot be met, stop and
//    return the realized harvest.
// 3. Return new matrix and a Breakdown describing what was harvested.

export function runSimulation(
  harvestMm3PerYear: number,
  years: number = 100,
): SimulationStep[];
// Year 0 snapshot from initialMatrix() + 100 stepOneYear calls. Length = years+1.
// Cheap: ~100 steps × O(species × classes) = trivial.
```

### Why pre-compute the full run

- 100 yearly snapshots × 3 scenarios is cheap (<1 ms).
- Animation just walks an index into the precomputed array — no risk of state-update bugs mid-playback.
- Recomputing on slider change is instant.

## Components

### `SimulationControls.tsx`

Pure controlled component.

```ts
interface Props {
  harvests: [number, number, number];               // M m³/aastas, one per scenario
  onHarvestsChange: (h: [number, number, number]) => void;
  currentYear: number;                              // 0..100
  onYearChange: (y: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  scenarioColors: [string, string, string];
  scenarioLabels: [string, string, string];
}
```

Renders:
- 3 horizontal rows: color dot · label ("Madal" / "Tänane" / "Kõrge") · slider (range 1–25, step 0.5) · numeric value with unit "M m³/aastas".
- Transport row: `▶ Käivita` / `⏸ Paus` / `↺ Lähtesta` buttons (single button toggles play/pause; reset always available).
- Year scrub slider (range 0–100, step 1) labeled "Aasta {N} / 100".
- Hint text: *"1 sekund = 3 aastat"*.

### `SimulationTotalChart.tsx`

```ts
interface Props {
  runs: SimulationStep[][];                         // 3 entries, each length 101
  currentYear: number;
  scenarioColors: [string, string, string];
  scenarioLabels: [string, string, string];
}
```

Recharts `LineChart`:
- x-axis: `year` (0–100), label "Aastad"
- y-axis: M m³, label "Kogutagavara (M m³)"
- 3 `Line` series, one per scenario. Each is the slice `runs[i].slice(0, Math.floor(currentYear) + 1)` so lines draw up to the current moment.
- Vertical `ReferenceLine` at `currentYear` (decimal allowed for smooth scrub).
- Tooltip via `makeTooltip` with rows for each scenario.
- `isAnimationActive={false}` on every series.

### `SimulationBreakdownChart.tsx`

```ts
interface Props {
  run: SimulationStep[];                            // the selected scenario
  currentYear: number;
  viewMode: "species" | "assortment" | "class";
  onViewModeChange: (m: "species" | "assortment" | "class") => void;
  scenarioIndex: 0 | 1 | 2;
  onScenarioChange: (i: 0 | 1 | 2) => void;
  scenarioLabels: [string, string, string];
}
```

Renders:
- Two tab strips above the chart:
  - View mode: `Liigi järgi · Sortimendi järgi · Vanuseklassi järgi`
  - Scenario: `Madal · Tänane · Kõrge`
- Recharts `BarChart`, stacked, with one bar per visible decade (0, 10, …, currentDecade). `currentDecade = Math.floor(currentYear / 10) * 10`.
- y-axis: M m³.
- Stacks:
  - **species**: 7 stacks using `STAND_AGES.puuliikide_varvid` colors (matches Story 2).
  - **assortment**: 3 stacks using `--pulp` / `--saw` / `--veneer` tokens.
  - **class**: 15 stacks using a sequential palette from young (green) → old (brown). Define inside the component.
- `isAnimationActive={false}`.

## Page: `Story03Simulation.tsx`

State (six `useState`):

```ts
const [harvests, setHarvests] = useState<[number, number, number]>([6, 12, 18]);
const [currentYear, setCurrentYear] = useState(0);
const [isPlaying, setIsPlaying] = useState(false);
const [viewMode, setViewMode] = useState<"species"|"assortment"|"class">("species");
const [breakdownScenario, setBreakdownScenario] = useState<0|1|2>(1);
const rafRef = useRef<number | null>(null);
```

Derived:

```ts
const runs = useMemo(
  () => harvests.map(h => runSimulation(h, 100)),
  [harvests],
);
```

Effect — RAF loop:

```ts
useEffect(() => {
  if (!isPlaying) return;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = (now - last) / 1000;
    last = now;
    setCurrentYear((y) => {
      const next = y + dt * 3;             // 1 sec = 3 years
      if (next >= 100) { setIsPlaying(false); return 100; }
      return next;
    });
    rafRef.current = requestAnimationFrame(tick);
  };
  rafRef.current = requestAnimationFrame(tick);
  return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
}, [isPlaying]);
```

Behaviour:
- Changing any harvest slider → recomputes `runs`, resets `currentYear=0`, pauses.
- Scrub slider → pauses and sets `currentYear` directly.
- Reset → pauses, sets `currentYear=0`.

Layout (top → bottom): header → `SimulationControls` → 3 KPI cards (one per scenario: current `total`, Δ vs year 0) → `SimulationTotalChart` → `SimulationBreakdownChart` → source line.

## Estonian copy (UI)

- Title: **"Eesti metsa simulatsioon"**
- Subtitle: *"Lugu 3 / 3 — mis juhtub Eesti metsavaruga eri raiemahtude juures, 100 aasta jooksul."*
- Scenario labels: *Madal* / *Tänane* / *Kõrge*
- KPI labels: *Kogutagavara* (current), *Muutus* (Δ from year 0)
- Chart 1 axes: *Aastad* / *Kogutagavara (M m³)*
- Chart 2 axes: *Aastakümme* / *Tagavara (M m³)*
- Transport: *Käivita* / *Paus* / *Lähtesta*
- Hint: *1 sekund = 3 aastat*
- Source note (under Chart 2): "Algandmed: SMI 2023 (Keskkonnaagentuur). Kasvumudel: Chapman-Richards keskmisel kasvukohal, Story 2 andmestiku järgi. Haab, sanglepp, hall lepp ja teised liigid kasutavad arukase kasvuparameetreid lähendusena."

## Edge cases & assumptions

- **Harvest exceeds available mature stock**: `stepOneYear` returns realized < target; total line bends down sharply — the visual is the message.
- **Sliders at 0**: no harvest; total grows toward equilibrium.
- **Floating-point drift**: each step's `total` is recomputed from the matrix; not accumulated.
- **Class promotion**: 10%/aastas of each class moves up (exponential cohort flow, not strict cohort tracking). Acceptable approximation for an educational tool; flagged in source note.
- **Site is uniformly medium**; non-modelled species use kask (birch) Chapman-Richards parameters. Both flagged in the source note.

## Conventions adherence

- Pure domain code stays in `src/forestry/`; no React or Recharts imports there.
- Recharts series use `isAnimationActive={false}` everywhere.
- All user-visible strings in Estonian; identifiers in English.
- Colors come from `:root` tokens where possible; species colors come from the existing `STAND_AGES.puuliikide_varvid` for visual continuity with Story 2.
- No JSDoc / comments except for the non-obvious math (`stepOneYear`, the matrix→M m³ scaling).

## Out of scope (explicit)

- Removing or refactoring `CalculatorPage.tsx`.
- Persisting / sharing scenarios.
- > 3 scenarios.
- Multiple breakdown views simultaneously.
- Economic / CO₂ / biodiversity modelling.
- Mobile-specific layout tweaks beyond what `.app` / `.col` / `.panel` already provide.
