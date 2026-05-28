# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page Vite + React + TypeScript app: an interactive forestry rotation-economics calculator ("Metsa kalkulaator"). User picks species/site/rotation age/discount rate/prices/costs with sliders; the app plots growth curves, assortment composition, and Faustmann economics, and recommends an optimal rotation age. No backend, no router, no tests.

## Commands

```bash
npm run dev      # vite dev server with HMR
npm run build    # tsc -b && vite build  (type-checks then bundles)
npm run lint     # eslint .              (flat config, eslint.config.js)
npm run preview  # serve the production build
```

There is no test runner configured. `npm run build` is the closest thing to a check — it runs `tsc -b` first, so a successful build means the project type-checks.

## Architecture

Two clean layers, kept strictly separated:

### `src/forestry/` — pure domain (no React)

- **`species.ts`** — `SPECIES` (spruce/pine/birch) and `SITES` (poor/medium/good/excellent) lookup tables with growth parameters. Adding a species/site means extending these records and the `SpeciesId` / `SiteId` union types; everything downstream is parameterised.
- **`model.ts`** — all biological and financial math as pure functions over `ScenarioInputs`:
  - `volumeAtAge` uses Chapman-Richards `V(t) = vMax · site.factor · (1 − e^(−k·site.kFactor·t))^p`.
  - `assortmentShares` splits volume into pulp/sawlog/veneer as a function of age (pulp decays exponentially, veneer ramps up after age 80 up to a species-specific cap).
  - `economics` returns `{ npv, lev, annualEquivalent, ... }`. NPV is one rotation from bare land; LEV is the Faustmann land expectation value for infinite identical rotations: `LEV = NetFV(t) / ((1+r)^t − 1)`. When `r ≤ 0`, LEV is treated as infinite and the metric falls back to NPV/t.
  - `optimalRotation` brute-force searches ages 20–180 maximising LEV (or NPV when r=0). Cheap enough to call on every render.

**Never put React or chart code in `src/forestry/`.** Adding new economic outputs means extending `EconomicResult` and the math; the UI consumes whatever fields exist.

### `src/components/` — presentation over `recharts`

- `App.tsx` owns all state (six `useState`) and recomputes derived series with `useMemo`. It is the only stateful component.
- `ControlsPanel.tsx` is a pure controlled component — sliders + species/site pickers.
- Each chart (`GrowthChart`, `AssortmentChart`, `EconomicsChart`, `RevenueBars`) takes already-shaped data and renders a `recharts` `ComposedChart` / `BarChart`. They share a `makeTooltip(labelFormatter, rows[])` factory in `Tooltip.tsx` — use it instead of writing one-off tooltip components.
- `format.ts` centralises number formatting (Estonian locale, `€` prefix, k/M suffixes). Use these helpers rather than ad-hoc `toLocaleString`.

## Conventions specific to this repo

- **UI language is Estonian.** All user-visible strings, chart labels, axis labels, KPI titles, and explanatory text are in Estonian. Code identifiers stay in English. When adding UI text, write Estonian; when adding a domain type, write English. Don't translate existing strings without being asked.
- **Domain terminology mapping** (handy when editing UI text): pulp = paberipuit, sawlog = palk, veneer = spoonipakk, rotation = raiering, rotation age = raievanus, stand volume = tagavara, MAI = keskmine juurdekasv, CAI = jooksev juurdekasv, site = kasvukoht, discount rate = intressimäär.
- **Color tokens live in `:root` in `src/index.css`** (`--pulp`, `--saw`, `--veneer`, `--accent`, etc.) — reuse them. Chart series use literal hex matching those tokens; if you change a token, update the matching chart color.
- **Animations off**: every `recharts` series sets `isAnimationActive={false}`. Keep it that way — the charts update on every slider drag and animation causes flicker.
- **No comments unless explaining non-obvious math.** The existing JSDoc on `assortmentShares` and `economics` is the right level: short, anchored on the formula, not restating the code.
