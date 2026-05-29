# Eesti puistute vanuseklasside leht (raidur, lugu 2/3)

## Eesmärk

Lisada metsaraiduri-perspektiivi uus lehekülg `#/raidur/2`, mis visualiseerib JSON-ist (`eesti_puistute_vanuseklassid_10a_smi2023.json`) Eesti puistute pindala 10-aastastes vanuseklassides ja puuliikide kaupa. Praegune kalkulaatori-lehekülg nihkub `#/raidur/3`-le.

## Sõnum

"Eesti metsa portree" — kogu Eesti puistute jaotus vanuseklassiti ja liigiti, ilma narratiivse võrdluseta.

## Marsruut & navigatsioon

| Hash | Lehekülg | Muutub |
|------|----------|--------|
| `#/raidur/1` | `Story01Growth` | subtitle `Lugu 1 / 2` → `Lugu 1 / 3` |
| `#/raidur/2` | `Story02StandAges` (uus) | — |
| `#/raidur/3` | `CalculatorPage` | `<StoryDock currentIndex>` 1 → 2 |

`src/pages/lumberjack/steps.ts` saab kolmanda kirje. `StoryDock` arvutab `total = steps.length` automaatselt.

## Failistruktuur

| Fail | Roll |
|------|------|
| `src/data/estonian-stand-ages.json` | JSON liigub projekti juurest src-i sisse (tsconfig include) |
| `src/data/standAges.ts` | impordib JSON, ekspordib `StandAgesData` tüübi + typed konstant |
| `src/components/StandAgesChart.tsx` | recharts stacked `BarChart` |
| `src/pages/lumberjack/Story02StandAges.tsx` | lehe komponent |
| `src/App.tsx` | uus `#/raidur/2` route, kalkulaatori `currentIndex` uuendus |
| `src/pages/lumberjack/steps.ts` | uus kirje |
| `src/pages/lumberjack/Story01Growth.tsx` | subtitle uuendus |

## Andmemudel (`StandAgesData`)

```ts
interface StandAgesData {
  pealkiri: string;
  allikas: { nimi: string; valdaja: string; url: string; tabeli_kuupaev: string; ulatus: string };
  yhik: string;
  kokku_tuh_ha: number;
  keskmine_vanus_a: number;
  suurim_klass: string;
  vanuseklassid: string[];                         // 15 silti
  puuliigid: Record<SpeciesName, number[]>;        // 7 puuliiki × 15 väärtust
  kokku_klassiti_tuh_ha: number[];
  puuliikide_varvid: Record<SpeciesName, string>;
}
type SpeciesName = "Mänd" | "Kuusk" | "Kask" | "Haab" | "Sanglepp" | "Hall lepp" | "Teised";
```

## Graafiku ülesehitus

**Tüüp**: `recharts` `BarChart`, virnastatud (stacked) tulbad.

**Andmekuju** (transform JSON → recharts row):
```ts
type Row = { klass: string; total: number } & Record<SpeciesName, number>;
```
15 rida, iga puuliik oma võtmena.

**Teljed**:
- X: `dataKey="klass"` — 15 vanuseklassi silti, väike font, `interval={0}` (kõik nähtaval).
- Y: pindala tuh ha; ülemine piir auto.

**Stack**: 7 `<Bar>`-i ühe `stackId`-ga. Virna järjekord (alt üles) suurima kogupindala järgi: Kask → Mänd → Kuusk → Hall lepp → Haab → Sanglepp → Teised. Igale määratud `fill` JSON-i värvist.

**Tooltip**: ehitatud `Tooltip.tsx`-i `makeTooltip` helperiga. Rida iga puuliigi kohta + kogusumma; formaadiks `${v.toFixed(1)} tuh ha`. Null/0 ridu kuvada ei pea, aga tooltip näitab kõik mis on > 0.

**Animatsioon**: `isAnimationActive={false}` kõikidel `Bar`-idel (projekti konventsioon).

**Legend**: oma chip-rida (vt `Story01Growth` legend-mall), 7 chip-i puuliigi värvi ja nimega — mitte `recharts`-i sisemine legend (et stiil ühilduks).

## Lehe ülesehitus (`Story02StandAges`)

```
header
  h1: "Eesti metsa vanuseklassid"
  p (subtitle): "Lugu 2 / 3 — kogu Eesti puistute pindala vanuseklasside ja puuliikide kaupa, SMI 2023"

KPI-rida (story-cards muster, 3 kaarti):
  - "Kokku pindala"  → 2122,1 tuh ha
  - "Keskmine vanus" → 55 a
  - "Suurim klass"   → 51-60 a

panel
  section-title: "Pindala vanuseklassiti, jagunemine puuliigiti"
  <StandAgesChart />
  legend chip-rida (7 puuliiki)

footer (väike hall tekst):
  "Allikas: SMI 2023, tabel 13 — Keskkonnaagentuur"
  link allikas.url-ile
```

KPI-numbrid loetakse otse JSON-ist (`kokku_tuh_ha`, `keskmine_vanus_a`, `suurim_klass`); arv `2122.1` kuvatakse Eesti lokaalis komaga (`2122,1`).

## Stiil

Ei lisa uusi värvitokeneid `index.css`-i — puuliikide värvid on andmes ja kasutatavad ainult selle ühe vaate sees. Kasutab olemasolevaid klasse: `.app`, `.header`, `.title`, `.subtitle`, `.panel`, `.section-title`, `.legend`, `.legend-chip`, `.legend-dot`, `.story-cards`, `.story-card*`.

## Ulatusest väljas (YAGNI)

- Liigi-filter (peita/näidata) — pelk vaade.
- Narratiivne võrdlus lehega 1.
- Eraldi vaade riigimets vs erametsad (JSON-is pole eraldi välja).
- Animatsioonid.

## Verifikatsioon

- `npm run build` läbib ilma type-vigadeta.
- `#/raidur/1` → 2 → 3 ahel toimib, `StoryDock` näitab "1 / 3", "2 / 3", "3 / 3".
- Graafik renderdub: 15 tulpa, 7 värvilist segmenti, KPI-numbrid vastavad JSON-i väljadele.
