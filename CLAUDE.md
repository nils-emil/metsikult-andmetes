# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page Vite + React + TypeScript app that walks the visitor through Estonian forestry from four angles. The landing page (`src/pages/LandingPage.tsx`) sends users into the **"Raidur"** track (4 ordered stories) or the **"Loomad"** placeholder. The Raidur track lives under hash routes `#/raidur/1…4`:

1. **Story01Growth** — Chapman-Richards growth curve, 400-year side-by-side rotation comparison.
2. **Story02StandAges** — SMI 2023 stand-age × species area matrix; clickable species opens `SpeciesRotationCompare`.
3. **Story03Simulation** — animated 100-year forest-stock simulation with three harvest scenarios, legal küpsusvanus constraint, historical 1960–2010 context on the breakdown chart.
4. **Story04Strategy** — MAK2030 ("Metsanduse arengukava 2030") outcomes, indicators, and problem framing.

No backend, no router library (hash routing in `App.tsx`), no tests.

## Commands

```bash
npm run dev      # vite dev server with HMR
npm run build    # tsc -b && vite build  (type-checks then bundles)
npm run lint     # eslint .              (flat config, eslint.config.js)
npm run preview  # serve the production build
```

There is no test runner configured. `npm run build` is the closest thing to a check — it runs `tsc -b` first, so a successful build means the project type-checks.

## Architecture

Three strictly separated layers.

### `src/forestry/` — pure domain (no React, no recharts)

- **`species.ts`** — `SPECIES` (spruce/pine/birch) and `SITES` (poor/medium/good/excellent) lookup tables with growth parameters. Adding a species/site means extending these records and the `SpeciesId` / `SiteId` union types; everything downstream is parameterised.
- **`model.ts`** — biological and financial math as pure functions over `ScenarioInputs`:
  - `volumeAtAge` uses Chapman-Richards `V(t) = vMax · site.factor · (1 − e^(−k·site.kFactor·t))^p`.
  - `assortmentShares` splits volume into pulp/sawlog/veneer as a function of age.
  - `economics` returns `{ npv, lev, annualEquivalent, ... }`. NPV is one rotation from bare land; LEV is the Faustmann land expectation value for infinite identical rotations: `LEV = NetFV(t) / ((1+r)^t − 1)`. When `r ≤ 0`, LEV is treated as infinite and the metric falls back to NPV/t.
  - `optimalRotation` brute-force searches ages 20–180 maximising LEV (or NPV when r=0).
- **`simulation.ts`** — Story03's engine. State is a `StandMatrix` (species × 15 age-class areas, tuh ha) seeded from `estonian-stand-ages.json`. `stepOneYear` ages each class by 10% per year, then clearcuts oldest-first up to a target M m³/a, skipping any species/class below its legal küpsusvanus. `runSimulation(harvestMm3PerYear, years)` returns one `SimulationStep` per year including `total`, `bySpecies`, `byAssortment`, `byClass`, `harvested`, and `cumulativeHarvested`. Non-modelled broadleaves (Haab, Sanglepp, Hall lepp, Teised) use birch growth params as a proxy.
- **`legal.ts`** — Metsaseaduse § 29 küpsusvanused (min age) and rinnasdiameetrid (min DBH) per `SpeciesId`, II boniteet.

**Never put React or chart code in `src/forestry/`.** Adding new outputs means extending the relevant interface (e.g. `EconomicResult`, `SimulationStep`) and the math; the UI consumes whatever fields exist.

### `src/data/` — typed accessors over static datasets

- `estonian-stand-ages.json` — SMI 2023 stand-age × species areas (tuh ha) + metadata.
- `standAges.ts` — typed wrapper (`STAND_AGES`, `SpeciesName`, `standAgesRows()`, species colours).
- `historicalForest.ts` — approximate Estonian standing-volume time series 1960–2010 used as historical context in the Story03 breakdown chart, plus `SIM_BASE_YEAR = 2020` anchor.
- `mak2030.ts` — MAK2030 strategy overview, six subgoals, indicators (with `status`), problem groups, and source list used by Story04.

### `src/components/` — presentation over `recharts`

- Each chart takes already-shaped data and renders a `recharts` chart. They share `makeTooltip(labelFormatter, rows[])` from `Tooltip.tsx` — use it instead of writing one-off tooltip components.
- `format.ts` centralises number formatting (Estonian locale, `€` prefix, k/M suffixes). Use these helpers rather than ad-hoc `toLocaleString`.

Active components:
- **Story01:** `GrowthChart`.
- **Story02:** `StandAgesChart`, `SpeciesRotationCompare`.
- **Story03:** `SimulationControls` (sliders + transport + scrub), `SimulationTotalChart` (3-scenario line chart with Tagavara / Kumulatiivne raie / Kogumaht view tabs), `SimulationBreakdownChart` (stacked decade bars 1960–2120 with view tabs + scenario tabs; historical decades are projected from year-0 sim shares scaled to historical totals).

Orphaned components (kept for now, no live references after Story03 replaced the calculator at step 3): `ControlsPanel`, `EconomicsChart`, `AssortmentChart`, `RevenueBars`, and the page `CalculatorPage.tsx`. Safe to delete as a cleanup task.

### `src/pages/` and routing

- `App.tsx` is the router (hash-based): `#/` → `LandingPage`; `#/raidur/{1..4}` → the four stories wrapped with `StoryDock`; `#/loomad` → `TodoPage`. On hash change the page scrolls to top.
- `src/pages/lumberjack/StoryDock.tsx` is the bottom navigation pill. `src/pages/lumberjack/steps.ts` is the single source of truth for step labels and order — update it when adding/removing/renaming a story.
- Each story page owns its own state (`useState`) and derives series with `useMemo`. There is no shared store.

## Conventions specific to this repo

- **UI language is Estonian.** All user-visible strings, chart labels, axis labels, KPI titles, and explanatory text are in Estonian. Code identifiers stay in English. When adding UI text, write Estonian; when adding a domain type, write English. Don't translate existing strings without being asked.
- **Domain terminology mapping** (handy when editing UI text): pulp = paberipuit, sawlog = palk, veneer = spoonipakk, rotation = raiering, rotation age / küpsusvanus = raievanus, stand volume = tagavara, MAI = keskmine juurdekasv, CAI = jooksev juurdekasv, site = kasvukoht, discount rate = intressimäär, clearcut = lageraie, regeneration cut = uuendusraie.
- **Color tokens live in `:root` in `src/index.css`** (`--pulp`, `--saw`, `--veneer`, `--accent`, etc.) — reuse them. Species colours come from `STAND_AGES.puuliikide_varvid` (used in Story02 and Story03 for visual continuity). Chart series use literal hex matching these tokens; if you change a token, update the matching chart color.
- **Animations off**: every `recharts` series sets `isAnimationActive={false}`. Keep it that way — Story03 in particular updates on every animation-frame tick, and recharts' built-in transitions cause flicker.
- **Story03 animation**: 1 sek = 1 aastakümme (rate `dt * 10` in the RAF loop). Bars in `SimulationBreakdownChart` use `Cell` with `fillOpacity` to dim future decades until playback reaches them; historical decades (year < `SIM_BASE_YEAR`) are always full-opacity.
- **No comments unless explaining non-obvious math.** Existing JSDoc on `assortmentShares`, `economics`, `LEGAL_MIN`, and the `stepOneYear` harvest loop is the right level: short, anchored on the formula or law, not restating the code.
- **Specs and design docs** live in `docs/superpowers/specs/` (e.g. the Story03 simulation design). Add a new spec there when starting any non-trivial story.
