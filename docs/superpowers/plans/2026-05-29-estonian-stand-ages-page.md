# Eesti puistute vanuseklasside leht (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Lugu 2 / 3" page at `#/raidur/2` that visualises Estonian forest stand area by 10-year age class and tree species (stacked bar chart sourced from `eesti_puistute_vanuseklassid_10a_smi2023.json`). The existing calculator moves to `#/raidur/3`.

**Architecture:** Move the JSON inside `src/` and expose it through a typed module. Add a presentational `StandAgesChart` component matching the existing recharts patterns (custom tooltip via `makeTooltip`, `isAnimationActive={false}`, no internal legend). Build the page (`Story02StandAges`) using existing `.app/.header/.panel/.story-card*` classes — no new CSS tokens. Wire the new route into `App.tsx` and update `steps.ts` so `StoryDock` shows "N / 3". Domain layer (`src/forestry/`) is not touched — this is presentation only.

**Tech Stack:** Vite + React + TypeScript, `recharts` `BarChart`. No tests (project has none configured) — verification = `npm run build` (which runs `tsc -b` first) plus `npm run dev` visual check.

**Spec:** `docs/superpowers/specs/2026-05-29-estonian-stand-ages-page-design.md`

**Repo conventions to honour:**
- UI strings in Estonian; identifiers in English.
- No comments unless explaining non-obvious math.
- Reuse colour tokens from `:root` in `src/index.css`; species hex codes come from the JSON, not from new tokens.
- All recharts series MUST set `isAnimationActive={false}`.

---

### Task 1: Move JSON into `src/data/` with typed wrapper

**Files:**
- Move: `eesti_puistute_vanuseklassid_10a_smi2023.json` → `src/data/estonian-stand-ages.json`
- Create: `src/data/standAges.ts`

- [ ] **Step 1: Move the JSON file**

```bash
mkdir -p src/data
git mv eesti_puistute_vanuseklassid_10a_smi2023.json src/data/estonian-stand-ages.json
```

Expected: file appears under `src/data/`; root no longer contains the JSON.

- [ ] **Step 2: Create the typed wrapper**

Create `src/data/standAges.ts` with exactly this content:

```ts
import raw from "./estonian-stand-ages.json";

export type SpeciesName =
  | "Mänd"
  | "Kuusk"
  | "Kask"
  | "Haab"
  | "Sanglepp"
  | "Hall lepp"
  | "Teised";

export interface StandAgesData {
  pealkiri: string;
  allikas: {
    nimi: string;
    valdaja: string;
    url: string;
    tabeli_kuupaev: string;
    ulatus: string;
  };
  yhik: string;
  kokku_tuh_ha: number;
  keskmine_vanus_a: number;
  suurim_klass: string;
  vanuseklassid: string[];
  puuliigid: Record<SpeciesName, number[]>;
  kokku_klassiti_tuh_ha: number[];
  puuliikide_varvid: Record<SpeciesName, string>;
}

export const STAND_AGES: StandAgesData = raw as StandAgesData;

export const SPECIES_ORDER: SpeciesName[] = [
  "Kask",
  "Mänd",
  "Kuusk",
  "Hall lepp",
  "Haab",
  "Sanglepp",
  "Teised",
];

export interface StandAgesRow {
  klass: string;
  total: number;
  Mänd: number;
  Kuusk: number;
  Kask: number;
  Haab: number;
  Sanglepp: number;
  "Hall lepp": number;
  Teised: number;
}

export function standAgesRows(): StandAgesRow[] {
  const { vanuseklassid, puuliigid, kokku_klassiti_tuh_ha } = STAND_AGES;
  return vanuseklassid.map((klass, i) => ({
    klass,
    total: kokku_klassiti_tuh_ha[i],
    Mänd: puuliigid["Mänd"][i],
    Kuusk: puuliigid["Kuusk"][i],
    Kask: puuliigid["Kask"][i],
    Haab: puuliigid["Haab"][i],
    Sanglepp: puuliigid["Sanglepp"][i],
    "Hall lepp": puuliigid["Hall lepp"][i],
    Teised: puuliigid["Teised"][i],
  }));
}
```

Notes:
- `SPECIES_ORDER` is the bottom-to-top stack order — biggest total first → drawn at the bottom.
- `as StandAgesData` is safe here: the JSON shape is hand-controlled and validated at compile by the index-access usage.

- [ ] **Step 3: Type-check**

Run: `npm run build`
Expected: PASS (no TypeScript errors, no Vite errors). The JSON import works out of the box because Vite/TS bundler mode resolves JSON modules.

- [ ] **Step 4: Commit**

```bash
git add src/data/estonian-stand-ages.json src/data/standAges.ts
git commit -m "Move stand-ages JSON into src/data with typed accessor"
```

---

### Task 2: `StandAgesChart` component

**Files:**
- Create: `src/components/StandAgesChart.tsx`

- [ ] **Step 1: Create the chart component**

Create `src/components/StandAgesChart.tsx` with exactly this content:

```tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { makeTooltip } from "./Tooltip";
import {
  SPECIES_ORDER,
  STAND_AGES,
  type SpeciesName,
  type StandAgesRow,
} from "../data/standAges";

const fmtArea = (v: number) => `${v.toFixed(1)} tuh ha`;

export function StandAgesChart({ data }: { data: StandAgesRow[] }) {
  const colors = STAND_AGES.puuliikide_varvid;

  const tooltipRows = [...SPECIES_ORDER]
    .reverse()
    .map((name) => ({
      name,
      key: name,
      color: colors[name],
      format: fmtArea,
    }));
  tooltipRows.push({
    name: "Kokku",
    key: "total",
    color: "#ecf3ef",
    format: fmtArea,
  });

  const tooltip = makeTooltip(
    (label) => `Vanuseklass ${label} a`,
    tooltipRows,
  );

  return (
    <div className="chart-wrap tall">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 18 }}
        >
          <CartesianGrid
            stroke="#263a32"
            strokeDasharray="3 4"
            vertical={false}
          />
          <XAxis
            dataKey="klass"
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            interval={0}
            label={{
              value: "Vanuseklass (aastat)",
              position: "insideBottom",
              offset: -8,
              fill: "#6f857c",
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fill: "#a4b7af", fontSize: 11 }}
            stroke="#355044"
            label={{
              value: "tuh ha",
              angle: -90,
              position: "insideLeft",
              fill: "#6f857c",
              fontSize: 11,
              dy: 20,
            }}
          />
          <Tooltip
            content={tooltip as never}
            cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
          />
          {SPECIES_ORDER.map((name: SpeciesName) => (
            <Bar
              key={name}
              dataKey={name}
              stackId="stand"
              fill={colors[name]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

Key conventions verified:
- `isAnimationActive={false}` on every `Bar`.
- Axis colours / grid / fonts match `AssortmentChart`.
- Custom `Tooltip` via `makeTooltip` (no native recharts legend — the page renders its own chip row).

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/StandAgesChart.tsx
git commit -m "Add StandAgesChart stacked bar component"
```

---

### Task 3: `Story02StandAges` page

**Files:**
- Create: `src/pages/lumberjack/Story02StandAges.tsx`

- [ ] **Step 1: Create the page**

Create `src/pages/lumberjack/Story02StandAges.tsx` with exactly this content:

```tsx
import { StandAgesChart } from "../../components/StandAgesChart";
import {
  SPECIES_ORDER,
  STAND_AGES,
  standAgesRows,
} from "../../data/standAges";

const fmtArea1 = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("et-EE", { maximumFractionDigits: 1 }) : "—";

export function Story02StandAges() {
  const rows = standAgesRows();
  const colors = STAND_AGES.puuliikide_varvid;
  const legendOrder = [...SPECIES_ORDER].reverse();

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Eesti metsa vanuseklassid</h1>
          <p className="subtitle">
            Lugu 2 / 3 — kogu Eesti puistute pindala vanuseklasside ja
            puuliikide kaupa, SMI 2023.
          </p>
        </div>
      </header>

      <div className="col">
        <div className="story-cards story-cards-3">
          <div className="story-card">
            <div className="story-card-label">Kokku pindala</div>
            <div className="story-card-value">
              {fmtArea1(STAND_AGES.kokku_tuh_ha)}{" "}
              <span className="story-card-unit">tuh ha</span>
            </div>
          </div>
          <div className="story-card">
            <div className="story-card-label">Keskmine vanus</div>
            <div className="story-card-value">
              {STAND_AGES.keskmine_vanus_a}{" "}
              <span className="story-card-unit">aastat</span>
            </div>
          </div>
          <div className="story-card">
            <div className="story-card-label">Suurim klass</div>
            <div className="story-card-value">
              {STAND_AGES.suurim_klass}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Pindala vanuseklassiti, jagunemine puuliigiti</h2>
          </div>
          <StandAgesChart data={rows} />
          <div className="legend">
            {legendOrder.map((name) => (
              <span className="legend-chip" key={name}>
                <span
                  className="legend-dot"
                  style={{ background: colors[name] }}
                />
                {name}
              </span>
            ))}
          </div>
          <p className="story-takeaway" style={{ marginTop: 12 }}>
            Allikas:{" "}
            <a href={STAND_AGES.allikas.url} target="_blank" rel="noreferrer">
              {STAND_AGES.allikas.nimi}
            </a>{" "}
            — {STAND_AGES.allikas.valdaja}, {STAND_AGES.allikas.tabeli_kuupaev}.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/lumberjack/Story02StandAges.tsx
git commit -m "Add Story02StandAges page"
```

---

### Task 4: Wire route, steps, and "Lugu N / 3" labels

**Files:**
- Modify: `src/pages/lumberjack/steps.ts`
- Modify: `src/App.tsx`
- Modify: `src/pages/lumberjack/Story01Growth.tsx` (subtitle only)

- [ ] **Step 1: Add the step**

Edit `src/pages/lumberjack/steps.ts` so `LUMBERJACK_STEPS` reads:

```ts
export const LUMBERJACK_STEPS: Step[] = [
  { hash: "#/raidur/1", label: "Kuidas mets kasvab" },
  { hash: "#/raidur/2", label: "Eesti metsa vanuseklassid" },
  { hash: "#/raidur/3", label: "Mis puidust saab ja tulu" },
];
```

- [ ] **Step 2: Wire the route**

Edit `src/App.tsx`:

1. Add import near the other lumberjack imports:
   ```ts
   import { Story02StandAges } from "./pages/lumberjack/Story02StandAges";
   ```
2. Replace the calculator route block with the new pair:
   ```tsx
   if (hash === "#/raidur/2") {
     return (
       <>
         <Story02StandAges />
         <StoryDock currentIndex={1} />
       </>
     );
   }
   if (hash === "#/raidur/3") {
     return (
       <>
         <CalculatorPage />
         <StoryDock currentIndex={2} />
       </>
     );
   }
   ```

The first block (`#/raidur` and `#/raidur/1` → `Story01Growth` with `currentIndex={0}`) stays as is.

- [ ] **Step 3: Update Story 1 subtitle**

Edit `src/pages/lumberjack/Story01Growth.tsx`:

Replace `Lugu 1 / 2 — sama hektar metsamaad 400 aasta jooksul.` with `Lugu 1 / 3 — sama hektar metsamaad 400 aasta jooksul.`

- [ ] **Step 4: Type-check + build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/lumberjack/steps.ts src/App.tsx src/pages/lumberjack/Story01Growth.tsx
git commit -m "Wire Story02StandAges into raidur navigation"
```

---

### Task 5: Visual verification

**Files:** none changed.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Vite reports a local URL (e.g. http://localhost:5173).

- [ ] **Step 2: Walk the flow**

Open `http://localhost:5173/#/raidur/1` and confirm:
- Subtitle reads "Lugu 1 / 3 ...".
- `StoryDock` shows "1 / 3", "Edasi →" goes to `#/raidur/2`.

Navigate to `#/raidur/2` and confirm:
- Header: "Eesti metsa vanuseklassid", "Lugu 2 / 3 ...".
- Three KPI cards: `2122,1 tuh ha`, `55 aastat`, `51-60 a`.
- Stacked bar chart: 15 X-tick labels (`≤10` … `141+`); 7 visible colours stacked per bar; bars tallest around `51-60`.
- Tooltip on hover lists 7 species rows plus "Kokku" with `tuh ha` formatting.
- Legend chip row underneath, 7 chips with the JSON colours.
- Footer line with linked source.
- `StoryDock` shows "2 / 3"; "Edasi →" goes to `#/raidur/3`.

Navigate to `#/raidur/3` and confirm:
- Calculator renders (existing page) and `StoryDock` shows "3 / 3", "Lõpeta →" returns to landing.

- [ ] **Step 3: Stop dev server**

Stop the dev process (Ctrl+C in the dev terminal, or terminate the background shell).

- [ ] **Step 4: Final build check**

Run: `npm run build`
Expected: PASS, dist/ rebuilt without errors.

No further commit (verification only).
