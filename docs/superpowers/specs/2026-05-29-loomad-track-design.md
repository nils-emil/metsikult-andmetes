# Loomade vaade — 4-loo rada (design)

Date: 2026-05-29
Status: Draft → awaiting user review after spec review loop
Scope: Replace the `#/loomad` TODO stub with a four-story narrative that mirrors the Raidur track, explaining how clearcutting affects forest wildlife habitat, shelter, and food base in Estonia.

## Summary

A parallel track to Raidur. Where Raidur frames the forest as a resource, Loomad frames the same forest as **kihiline elupaik** (layered habitat). Four ordered stories under hash routes `#/loomad/1…4`:

1. **Lugu 1 — "Metsa kihid on elupaik"**: an interactive forest cross-section with six structural layers (võra, alusmets, põõsarinne, rohurinne, maapind, lamapuit), each tied to the Estonian species that depend on it.
2. **Lugu 2 — "Liik × metsa vanus"**: a species × forest-age-class suitability matrix (parallel to Raidur Story 2's stand-age × species matrix). Click a species → habitat / shelter / food / status card.
3. **Lugu 3 — "Lageraie ajaskaala"**: a year-slider over 0–100 years after clearcut, showing succession phase, three recovery curves (elupaik, varjualune, toidubaas), and a returning-species roster.
4. **Lugu 4 — "Mida saab teha"**: concrete Eesti conservation tools — vääriselupaigad, säilikpuud, puhverribad, raierahu, Natura 2000, püsielupaigad — each with what it protects, current coverage, and the MAK2030 link.

The landing page already has a "Loomad" card pointing to `#/loomad`; that route will redirect to `#/loomad/1`.

## Goals & non-goals

**Goals**
- Give the Raidur track a counterweight perspective the user can pick from the landing page.
- Use a domain layer (`src/wildlife/`) that mirrors `src/forestry/` in style: pure TS, no React, no recharts.
- Make species and habitat data a **single curated source** in `src/data/wildlife.ts` — all four stories consume from it.
- Reuse existing chart/tooltip/format/colour infrastructure from `src/components/` and `src/index.css`.
- Estonian UI strings throughout; English code identifiers (per repo convention).

**Non-goals**
- A biological population model. There's no math equivalent to Chapman-Richards here — animal data is curated facts, not simulated.
- Hooking into Story03Simulation's runtime output. Story 3 here uses its own pure post-clearcut succession dataset (year-keyed), not the harvest-volume engine.
- Maps, GIS layers, or species-distribution visualisations. All views are diagrammatic.
- Sound, photography, or external image assets. Diagrams use CSS + emoji + SVG only.

## Routing & navigation

- `src/App.tsx`: add four branches that mirror Raidur's pattern exactly. The first branch matches **both** `#/loomad` and `#/loomad/1` (just like `#/raidur` and `#/raidur/1` both render `Story01Growth`). Branches 2–4 match `#/loomad/2` … `#/loomad/4`. Existing `TodoPage` import is removed in the same edit. **No explicit `useEffect` redirect** — that pattern would either fight the back button or require `replaceState`; matching both hashes in one branch is what the existing track does and is the lower-risk choice.
- `src/pages/loomad/steps.ts`: new — same shape as `lumberjack/steps.ts` (`hash`, `label`).
- `src/pages/loomad/LoomadDock.tsx`: new — same structure as `StoryDock.tsx`, reads `LOOMAD_STEPS`. Visually identical (reuses `.story-dock` CSS).
- `src/pages/TodoPage.tsx`: delete (no other references).

Steps:
```ts
export const LOOMAD_STEPS: Step[] = [
  { hash: "#/loomad/1", label: "Metsa kihid on elupaik" },
  { hash: "#/loomad/2", label: "Liik × metsa vanus" },
  { hash: "#/loomad/3", label: "Lageraie ajaskaala" },
  { hash: "#/loomad/4", label: "Mida saab teha" },
];
```

`Step` interface is moved/extracted to a shared location (or re-declared identically — both are fine; we will re-declare to avoid coupling the two tracks). Both `LUMBERJACK_STEPS` and `LOOMAD_STEPS` use the same shape.

## File layout

```
src/
├── wildlife/
│   ├── species.ts              # new — SpeciesId union, SPECIES record, AgeClassId, AGE_CLASSES
│   ├── habitat.ts              # new — layer/suitability/succession types + lookups (pure)
│   └── conservation.ts         # new — protection-tool types + helpers
├── data/
│   └── wildlife.ts             # new — curated dataset: species, suitability, succession, tools, sources
├── components/
│   ├── ForestLayersDiagram.tsx # new — Story 1 cross-section (SVG/CSS)
│   ├── SpeciesAgeMatrix.tsx    # new — Story 2 heat-matrix
│   ├── SpeciesDetailCard.tsx   # new — Story 2 drawer/modal panel
│   ├── SuccessionTimeline.tsx  # new — Story 3 year slider + recovery bars + roster
│   └── ConservationToolGrid.tsx# new — Story 4 cards
├── pages/loomad/
│   ├── steps.ts                # new
│   ├── LoomadDock.tsx          # new
│   ├── Story01Layers.tsx       # new
│   ├── Story02SpeciesAge.tsx   # new
│   ├── Story03Succession.tsx   # new
│   └── Story04Conservation.tsx # new
├── pages/
│   └── TodoPage.tsx            # DELETE
└── App.tsx                     # edit — add #/loomad/{1..4} branches + #/loomad → /1 redirect
```

Reuse:
- `src/components/Tooltip.tsx#makeTooltip` — for any recharts tooltip in Story 3's recovery bars.
- `src/components/format.ts` — fmtNumber for percentages and counts.
- `src/index.css` colour tokens for species/layer/tool palette; species hex codes from `STAND_AGES.puuliikide_varvid` are still relevant where animal stories overlap on tree-species presentation (e.g. Story 1 layer "võra" referencing dominant tree species).
- The existing `.story-dock`, `.app`, `.panel`, `.header`, `.section-title`, `.story-cards`, `.story-takeaway` CSS classes — all four stories should look at home next to the Raidur stories without new top-level layout CSS.

## Domain: `src/wildlife/species.ts`

### Types
```ts
export type SpeciesId =
  | "metsis"          // capercaillie — Tetrao urogallus
  | "lendorav"        // Siberian flying squirrel — Pteromys volans
  | "must_toonekurg"  // black stork — Ciconia nigra
  | "valgeselg_rahn"  // white-backed woodpecker — Dendrocopos leucotos
  | "ilves"           // Eurasian lynx — Lynx lynx
  | "pruunkaru"       // brown bear — Ursus arctos
  | "poder"           // moose — Alces alces (ascii id for põder)
  | "metsnugis"       // pine marten — Martes martes
  | "handkakk"        // Ural owl — Strix uralensis
  | "kanakull"        // northern goshawk — Accipiter gentilis
  | "laanepuu"        // hazel grouse — Tetrastes bonasia
  | "raudkull";       // Eurasian sparrowhawk — Accipiter nisus

export type ConservationStatus = "I_kat" | "II_kat" | "III_kat" | "tavaline";
// Kat. = Eesti looduskaitseseaduse kaitsekategooria (I, II, III) või "tavaline" (kaitsealune ei ole)

export interface Species {
  id: SpeciesId;
  name: string;          // Estonian, e.g. "Metsis"
  latin: string;         // "Tetrao urogallus"
  emoji: string;         // single emoji for compact rendering
  group: "imetaja" | "lind";
  status: ConservationStatus;
  bodyMassKg: [number, number];  // [min, max] for adults
}

// Re-exported from data/wildlife.ts — this file declares types and the union only:
export { WILDLIFE_SPECIES as SPECIES } from "../data/wildlife";
```

**Emoji uniqueness**: each `Species.emoji` must be unique across the 12 species — no two birds get the same generic 🐦. This is a data-author rule, not a runtime check.

### Age classes
```ts
export type AgeClassId =
  | "raiesmik"      // 0–10 a   — kõrrelised, vaarikas, võsa
  | "noorendik"     // 10–30 a  — tihe noor mets
  | "keskealine"    // 30–60 a  — kihistus tekib
  | "vana"          // 60–100 a — küps mets
  | "vana_pluss";   // 100+ a   — väga vana, mitmekihiline

export interface AgeClass {
  id: AgeClassId;
  label: string;        // Estonian
  ageRange: string;     // "0–10 a"
  description: string;  // 1 sentence
  color: string;        // CSS colour token or hex
}

// Like SPECIES, the const re-exports from data/wildlife.ts:
export { WILDLIFE_AGE_CLASSES as AGE_CLASSES } from "../data/wildlife";
export const AGE_CLASS_ORDER: AgeClassId[];   // youngest → oldest — declared here, it is structural, not data
```

`species.ts` defines **types and the AGE_CLASS_ORDER constant** (which is structural and unlikely to change). All `Record<...>` data lives in `src/data/wildlife.ts` and is re-exported under domain names. This avoids the "the file can't both declare and re-export the same identifier" problem.

## Domain: `src/wildlife/habitat.ts`

### Forest layers (Story 1)

```ts
export type LayerId =
  | "vora"        // canopy
  | "alusmets"    // sub-canopy / mid-storey
  | "poosarinne"  // shrub
  | "rohurinne"   // herb / dwarf-shrub
  | "maapind"     // forest floor (moss, litter)
  | "lamapuit";   // coarse woody debris (deadwood, snags, logs)

export interface Layer {
  id: LayerId;
  label: string;            // Estonian
  shortDesc: string;        // 1 sentence
  examples: string;         // e.g. "kuusk, mänd"
  speciesUsing: SpeciesId[];// species that depend on this layer for shelter or food
  yPercent: number;         // top-of-layer position in the cross-section (0=top, 100=bottom) for SVG layout
  heightPercent: number;    // layer thickness
}

export const LAYERS: Record<LayerId, Layer>;
export const LAYER_ORDER: LayerId[];  // vora → lamapuit (top-down)
```

`speciesUsing` is the bridge: clicking a layer highlights its species; clicking a species in Story 2's drawer can highlight which layers it uses. Each species → layer set is curated and lives in the dataset, not derived.

### Habitat suitability (Story 2)

```ts
export type Suitability = 0 | 1 | 2 | 3;
// 0 = ei sobi (no use), 1 = piiratud (occasional), 2 = sobib (suitable), 3 = optimaalne (core habitat)

export interface HabitatRow {
  species: SpeciesId;
  byClass: Record<AgeClassId, Suitability>;
  primaryNeed: "vana_mets" | "noor_mets" | "segamets" | "lage_ala" | "lamapuit";
  shelter: string;     // 1 short sentence — where it shelters / nests
  food: string;        // 1 short sentence — what it eats here
  notes?: string;      // optional 1 sentence (e.g. mängud, talvituspaik)
}

export function suitabilityFor(species: SpeciesId, age: AgeClassId): Suitability;
export function suitabilityColor(s: Suitability): string;   // returns CSS colour token
```

Suitability values are curated, sourced primarily from Keskkonnaagentuuri ja EOÜ liigikirjeldused. See "Sources" section.

### Post-clearcut succession (Story 3)

**Year-axis semantics**: year 0 = **moment of clearcut** (just after the trees are felled). Year 0's recovery values are therefore low (elupaik ≈ 5, varjualune ≈ 0, toidubaas ≈ 10 — disturbed ground still has some seed bank), and `speciesPresent` at year 0 contains only species that tolerate open clearings.

The **pre-cut baseline** — the species roster that was there immediately before the cut — is a **separate constant** in the dataset, not part of the frame timeline:

```ts
export const PRECUT_BASELINE: SpeciesId[];   // species in a mature stand pre-clearcut
```

This is what the Story 3 UI uses to compute the "puuduvad praegu" tray: `PRECUT_BASELINE \ speciesPresent(year)`. The per-frame `speciesLost` field is dropped — it's derivable.

```ts
export interface SuccessionFrame {
  year: number;          // 0..100, sampled every 5 years (21 frames total)
  phase: string;         // Estonian short phase name, e.g. "Pioneeride faas"
  phaseDesc: string;     // 1 sentence
  recovery: {
    elupaik: number;     // 0..100 — % of mature-forest habitat-structure score
    varjualune: number;  // 0..100 — % of mature shelter (canopy + vertical structure)
    toidubaas: number;   // 0..100 — % of mature food-base diversity
  };
  speciesPresent: SpeciesId[];
  speciesGained?: SpeciesId[];   // newly returned this frame, for highlighting
}

export const SUCCESSION_FRAMES: SuccessionFrame[];
// 21 frames at years 0, 5, 10, …, 100. The UI interpolates `recovery` between frames;
// `speciesPresent` and `speciesGained` snap to the nearest frame ≤ year (no interpolation
// of categorical fields).
```

**Function contracts:**

```ts
export function frameAtYear(year: number): SuccessionFrame;
// Returns the frame with the largest `frame.year` ≤ clamp(year, 0, 100).
// year < 0 → returns the year-0 frame. year > 100 → returns the year-100 frame.
// Non-integer years are floored to the bracketing frame.

export function interpolatedRecovery(year: number): SuccessionFrame["recovery"];
// year is clamped to [0, 100]. If year falls exactly on a frame, returns that frame's
// recovery verbatim. Otherwise linearly interpolates each of the three pillars between
// the bracketing frames (year_lo ≤ year < year_hi). Categorical fields are NOT interpolated.
```

Numbers are illustrative, not measured. Source-note will clearly say "valgustav lähend, mitte mõõdetud taastumiskõver". The shape (rapid early dip, slow climb, some species curves never reaching 100% inside 100 years) reflects the qualitative literature.

## Domain: `src/wildlife/conservation.ts`

```ts
export type ToolId =
  | "vaarielupaik"     // VEP (woodland key habitats)
  | "sailikpuud"       // retention trees + dead wood retention
  | "puhverribad"      // riparian buffer strips
  | "raierahu"         // breeding-season logging restriction
  | "natura2000"       // Natura 2000 forest sites
  | "puselupaik";      // püsielupaigad — species-bound protected sites

export interface ConservationTool {
  id: ToolId;
  label: string;          // Estonian
  shortDesc: string;      // 1 sentence
  legalBasis: string;     // e.g. "Metsaseadus § 23"; "Looduskaitseseadus § 50"
  protects: SpeciesId[];  // primary beneficiary species (illustrative, not exhaustive)
  coverage: string;       // e.g. "≈ 36 000 ha (~ 1.5% erametsast)" — short label, no numeric type
  mak2030Link?: string;   // free-text reference to a MAK2030 subgoal / indicator
}

export const CONSERVATION_TOOLS: ConservationTool[];
```

No functions — data only.

## Data: `src/data/wildlife.ts`

Single curated module exporting everything the four `wildlife/*` modules expose as `Record`s / arrays. Treated as the project's "wildlife answer key" — like `mak2030.ts` and `historicalForest.ts` are for their stories.

Structure:
```ts
// in src/data/wildlife.ts
export const WILDLIFE_SPECIES: Record<SpeciesId, Species> = { … };
export const WILDLIFE_AGE_CLASSES: Record<AgeClassId, AgeClass> = { … };
export const WILDLIFE_LAYERS: Record<LayerId, Layer> = { … };
export const WILDLIFE_HABITAT: HabitatRow[] = [ … ];           // one entry per species
export const WILDLIFE_SUCCESSION: SuccessionFrame[] = [ … ];   // 21 frames @ 5 a steps
export const WILDLIFE_PRECUT_BASELINE: SpeciesId[] = [ … ];    // species present pre-clearcut in a mature stand
export const WILDLIFE_TOOLS: ConservationTool[] = [ … ];
export const WILDLIFE_SOURCES: { title: string; publisher: string; url: string }[];
```

`src/wildlife/species.ts`, `habitat.ts`, `conservation.ts` re-export these under their domain-flavoured names (`SPECIES`, `LAYERS`, etc.) along with the pure helpers (`suitabilityFor`, `frameAtYear`, `interpolatedRecovery`, `suitabilityColor`). This is **similar in spirit** to how `standAges.ts` wraps `estonian-stand-ages.json`, but with one deliberate divergence: the source here is a TS module, not JSON. The reason: wildlife data is richer in mixed shapes (unions, arrays of ids, optional fields, free-form descriptions) — keeping it as TS avoids defining a JSON schema and a TS-side mirror type.

### Why this split

- Adding/correcting a fact (e.g. "metsis kasutab ka rohurinnet talvitumiseks") happens in **one place**: `data/wildlife.ts`.
- Adding a new species means: extend `SpeciesId` union, add a `Species` entry, add a `HabitatRow`, optionally edit succession frames' `speciesPresent`.
- The four pages never touch raw data shapes — they use the domain re-exports.

## Pages

All four pages own their interaction state (`useState`) and derive view models with `useMemo`. No shared store. Each page is wrapped by `LoomadDock` in `App.tsx` exactly as Raidur pages are wrapped by `StoryDock`.

### `Story01Layers.tsx`

Composition:
- `<header className="header">` with title "Metsa kihid on elupaik" and subtitle "Lugu 1 / 4 — …".
- `<ForestLayersDiagram />` panel — the cross-section. SVG/CSS rendering of the 6 layers stacked vertically.
- Selection state: `selectedLayer: LayerId | null`. Clicking a layer in the diagram populates a sibling `<aside>` panel with `Layer.shortDesc`, `examples`, and the species roster (emoji + name list).
- Below the diagram: a "Mis juhtub lageraiel?" closing panel. **Interaction**: a single labelled toggle button ("Näita lageraie järel" ↔ "Näita küpset metsa") flips the same `<ForestLayersDiagram />` between mature-forest and cleared modes via the `clearedView` prop. In `clearedView`, layers `vora` / `alusmets` / `poosarinne` / `rohurinne` / `lamapuit` render at reduced opacity with a strike-through label; only `maapind` stays fully rendered (and even that band gets a "mehaaniliselt häiritud" annotation). One-paragraph takeaway sits next to the toggle.

`ForestLayersDiagram` component contract:
```ts
interface ForestLayersDiagramProps {
  layers: Layer[];                    // already in LAYER_ORDER
  selectedLayer: LayerId | null;
  onSelect(id: LayerId | null): void;
  clearedView?: boolean;              // if true, render the post-clearcut state
  speciesById: Record<SpeciesId, Species>;
}
```
Renders an SVG sized to its container; each layer is a horizontal band positioned by `yPercent`/`heightPercent`. On hover, the band highlights and shows a small species-emoji cluster pinned to it. On click, the parent updates `selectedLayer`.

### `Story02SpeciesAge.tsx`

Composition:
- Header + subtitle.
- `<SpeciesAgeMatrix />`: rows = species, columns = `AGE_CLASS_ORDER`. Each cell is coloured by `suitabilityColor(suitabilityFor(s, c))`. Row labels show species emoji + name + a tiny status pill.
- Selection state: `selectedSpecies: SpeciesId | null`. Defaults to first species. Clicking a row opens `<SpeciesDetailCard />` showing: liik (latin), kaitsekategooria, primaarne vajadus (vana_mets/…), varjualune, toit, märkmed, ja milliseid kihte kasutab (links back to Story 1's layers).
- A small legend under the matrix maps suitability 0/1/2/3 → label + colour, with a footnote: "Sobivushinnangud on valgustavad — kirjandusel ja liigikirjeldustel põhinevad lähendused, mitte mõõdetud tihedused."

`SpeciesAgeMatrix` props:
```ts
interface SpeciesAgeMatrixProps {
  rows: HabitatRow[];
  ageClasses: AgeClass[];          // AGE_CLASS_ORDER materialised
  speciesById: Record<SpeciesId, Species>;
  selected: SpeciesId | null;
  onSelect(id: SpeciesId): void;
}
```

### `Story03Succession.tsx`

Composition:
- Header + subtitle, plus three KPI cards at the top: current year, current phase, current overall recovery (avg of three pillars).
- `<SuccessionTimeline />` panel:
  - A year slider (0..100, step 1) plus play/pause/reset transport (visual parity with `SimulationControls`, but simpler — only one "scenario").
  - Three horizontal recovery bars labelled "Elupaik", "Varjualune", "Toidubaas". Each bar fills to the interpolated % at the current year. Colour-coded.
  - A species-strip below the bars: emoji + name for every species in `speciesPresent` at the current frame. Species `speciesGained` this frame pulse briefly; species marked as `speciesLost` since year 0 sit in a greyed-out "puuduvad praegu" tray with explanatory text on hover.
- Below the timeline: a "Mida see graafik EI ütle" caveat panel — explicitly notes that the curves are illustrative, that real recovery depends on raie tüüp, kasvukoht, jt teguritest, ja viitab teadusallikatele.

Animation parity with Story03Simulation:
- 1 sek = 1 aastakümme (rate `dt * 10` like Raidur Story 3), so a full 100-year sweep takes ~10 s.
- Reuse the same RAF loop pattern as `Story03Simulation`'s `useEffect`.

`SuccessionTimeline` props:
```ts
interface SuccessionTimelineProps {
  frames: SuccessionFrame[];        // already in order
  speciesById: Record<SpeciesId, Species>;
  year: number;                     // float allowed during playback
  onYearChange(year: number): void;
  isPlaying: boolean;
  onPlay(): void;
  onPause(): void;
  onReset(): void;
}
```

The component is responsible only for rendering; the page owns the RAF loop, exactly as Story03Simulation does.

### `Story04Conservation.tsx`

Composition:
- Header + subtitle that explicitly bridges back to MAK2030: "Lugu 4 / 4 — kaitsemeetmed, mis Eesti mets-elustiku säilitavad raie kõrval".
- `<ConservationToolGrid tools={WILDLIFE_TOOLS} />`: card grid (reuses `.subgoals-grid` styling from Story04Strategy as a starting point). Each card: emoji/icon, label, shortDesc, legalBasis pill, "kaitseb" species emojis row, "kate" coverage label, mak2030Link as a small footnote. The grid header carries a one-line disclaimer: "Kaetuse arvud on illustratiivsed; täpsed sihttasemed ja täitmise seis: kliimaministeerium.ee/MAK2030."
- A "Allikad" panel listing `WILDLIFE_SOURCES` (parallel to Story04Strategy's source list).
- Closing takeaway tying back to Raidur Story 4: "Need meetmed on osa MAK2030 alaeesmärk 2 (looduslik mitmekesisus) tegevuskavast."

## Visual & interaction conventions

- Reuse Raidur layout primitives (`.app`, `.panel`, `.header`, `.section-title`, `.story-cards`, `.story-takeaway`) verbatim where possible. Add **new CSS only** for new structural elements: `.layers-diagram`, `.layer-band`, `.species-strip`, `.species-matrix`, `.suitability-cell`, `.recovery-bars`, `.recovery-bar`, `.conservation-grid`, etc. New tokens go in `:root` (`--habitat`, `--shelter`, `--food`, plus per-layer colours).
- All recharts (if any) keep `isAnimationActive={false}`. Story 3's recovery bars are CSS-driven (width transitions), not recharts.
- Estonian for every user-visible string. English for identifiers.
- No comments in code except brief notes where the dataset's curated nature needs explaining (e.g. above the suitability matrix in `data/wildlife.ts`).

## Sources

Story 4's `WILDLIFE_SOURCES` lists at minimum:
- Keskkonnaagentuur — riigi metsainventuur, liigikaitse aruanded.
- Eesti Ornitoloogiaühing (EOÜ) — linnustiku ülevaated.
- eElurikkus — liigikirjeldused.
- Looduskaitseseadus (RT I, 21.04.2004) ja Metsaseadus (RT I, 07.06.2006) — vastavate sätete viited (`§`).
- Natura 2000 metsaalade ülevaade (Keskkonnaministeerium).
- Asjakohased uurimused metsise, lendorava ja musta toonekure elupaikade kohta (lisada konkreetsed viited spec-kirjutamise käigus).

Every numeric value in the curated dataset (suitability, recovery %, coverage labels) is illustrative. The source panel in Story 4 and the inline takeaway panels in Story 1–3 must say so plainly.

## Linking & cross-references

- Landing page Loomad card already links to `#/loomad`. Behaviour: `App.tsx`'s first Loomad branch matches both `#/loomad` and `#/loomad/1` and renders `Story01Layers` for either — no JS-side redirect, no back-button risk.
- Story 1's "cleared view" can softly link to Raidur Story 3 ("vt simulatsioon") since both depict post-clearcut state from different angles.
- Story 4's mak2030Link strings are plain text references — no clickable cross-page links in scope.

## Build sequence

1. Domain & data first, no UI:
   - `src/data/wildlife.ts` — first pass with all 12 species, 5 age classes, 6 layers, 21 succession frames, pre-cut baseline list, 6 conservation tools, sources.
   - `src/wildlife/species.ts` types + re-exports from data module.
   - `src/wildlife/habitat.ts` types + pure helpers (`suitabilityFor`, `frameAtYear`, `interpolatedRecovery`, `suitabilityColor`).
   - `src/wildlife/conservation.ts` types + re-exports from data module.
2. Routing scaffolding:
   - `src/pages/loomad/steps.ts`, `LoomadDock.tsx`.
   - `App.tsx`: add four routes (first branch matches `#/loomad` and `#/loomad/1`); **delete the `TodoPage` import and the `#/loomad` → `TodoPage` branch in the same edit** so the file type-checks.
   - Delete `src/pages/TodoPage.tsx` in the same commit (it's already unreferenced once the App.tsx edit lands).
   - Each story page initially renders a placeholder so all routes load.
3. Components, in order: `ForestLayersDiagram` → `SpeciesAgeMatrix` + `SpeciesDetailCard` → `SuccessionTimeline` → `ConservationToolGrid`.
4. CSS: new tokens + new class blocks appended to `src/index.css`.
5. `npm run build` after each story is wired in — that is the project's only type-check.

## Out of scope (future work)

- Maps / GIS overlays.
- Sound / photo / external image assets.
- Population-dynamic modelling.
- Coupling Story 3's succession data to Raidur Story 3's harvest-volume simulation.
- Mobile-specific layout tuning beyond what existing pages already provide.
- Internationalisation — Estonian only.
