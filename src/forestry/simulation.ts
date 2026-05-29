import { STAND_AGES, type SpeciesName } from "../data/standAges";
import { assortmentShares, volumeAtAge } from "./model";
import type { SpeciesId } from "./species";

export type StandMatrix = Record<SpeciesName, number[]>;

export interface Breakdown {
  bySpecies: Record<SpeciesName, number>;
  byAssortment: { pulp: number; saw: number; veneer: number };
  byClass: number[];
  total: number;
}

export interface SimulationStep extends Breakdown {
  year: number;
  harvested: Breakdown;
  cumulativeHarvested: number;
}

export const SPECIES_NAMES: SpeciesName[] = [
  "Mänd",
  "Kuusk",
  "Kask",
  "Haab",
  "Sanglepp",
  "Hall lepp",
  "Teised",
];

export const CLASS_MIDPOINTS = [
  5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145,
];

export const NUM_CLASSES = CLASS_MIDPOINTS.length;

// Non-modelled broadleaves use birch (kask) as a growth proxy.
const SPECIES_PROXY: Record<SpeciesName, SpeciesId> = {
  Mänd: "pine",
  Kuusk: "spruce",
  Kask: "birch",
  Haab: "birch",
  Sanglepp: "birch",
  "Hall lepp": "birch",
  Teised: "birch",
};

export const STARTING_VOLUME_LABEL_MM3 = 518;

export const CLASS_LABELS = STAND_AGES.vanuseklassid;

// Metsaseaduse § 29 alusel kehtestatud küpsusvanused (uuendusraie alampiir),
// keskmise boniteediga puistud. Lähendus — tegelik raievanus sõltub
// kasvukohatüübist. Allikas: Metsaseadus / KKM määrus nr 27.
export const LEGAL_MIN_HARVEST_AGE: Record<SpeciesName, number> = {
  Mänd: 90,
  Kuusk: 70,
  Kask: 60,
  Haab: 40,
  Sanglepp: 60,
  "Hall lepp": 30,
  Teised: 60,
};

export function isLegallyHarvestable(
  speciesName: SpeciesName,
  classIndex: number,
): boolean {
  return CLASS_MIDPOINTS[classIndex] >= LEGAL_MIN_HARVEST_AGE[speciesName];
}

export function initialMatrix(): StandMatrix {
  const out = {} as StandMatrix;
  for (const name of SPECIES_NAMES) {
    out[name] = STAND_AGES.puuliigid[name].slice();
  }
  return out;
}

export function volumePerHa(
  speciesName: SpeciesName,
  classIndex: number,
): number {
  return volumeAtAge(CLASS_MIDPOINTS[classIndex], SPECIES_PROXY[speciesName], "medium");
}

function emptyBreakdown(): Breakdown {
  const bySpecies = {} as Record<SpeciesName, number>;
  for (const n of SPECIES_NAMES) bySpecies[n] = 0;
  return {
    bySpecies,
    byAssortment: { pulp: 0, saw: 0, veneer: 0 },
    byClass: new Array(NUM_CLASSES).fill(0),
    total: 0,
  };
}

// area is in tuh ha, volPerHa in m³/ha → product in tuh × m³ = 1000 m³.
// Divide by 1000 → M m³.
const TO_MM3 = 1 / 1000;

export function snapshotBreakdown(state: StandMatrix): Breakdown {
  const out = emptyBreakdown();
  for (const name of SPECIES_NAMES) {
    const proxy = SPECIES_PROXY[name];
    const row = state[name];
    for (let i = 0; i < NUM_CLASSES; i++) {
      const area = row[i];
      if (area <= 0) continue;
      const v = volumePerHa(name, i);
      const mm3 = area * v * TO_MM3;
      out.total += mm3;
      out.bySpecies[name] += mm3;
      out.byClass[i] += mm3;
      const shares = assortmentShares(CLASS_MIDPOINTS[i], proxy);
      out.byAssortment.pulp += mm3 * shares.pulp;
      out.byAssortment.saw += mm3 * shares.saw;
      out.byAssortment.veneer += mm3 * shares.veneer;
    }
  }
  return out;
}

export function totalVolumeMm3(state: StandMatrix): number {
  let total = 0;
  for (const name of SPECIES_NAMES) {
    const row = state[name];
    for (let i = 0; i < NUM_CLASSES; i++) {
      const area = row[i];
      if (area <= 0) continue;
      total += area * volumePerHa(name, i);
    }
  }
  return total * TO_MM3;
}

function ageOneYear(state: StandMatrix): StandMatrix {
  // 10-year classes → 10% of each class promotes per year.
  // Walk i from top down so flows don't double-shift in one pass.
  const next = {} as StandMatrix;
  for (const name of SPECIES_NAMES) {
    const src = state[name];
    const dst = src.slice();
    for (let i = NUM_CLASSES - 1; i >= 1; i--) {
      const promote = src[i - 1] * 0.1;
      dst[i] = dst[i] + promote;
      dst[i - 1] = dst[i - 1] - promote;
    }
    // Last class is a sink; nothing leaves it.
    next[name] = dst;
  }
  return next;
}

function harvest(
  state: StandMatrix,
  targetMm3: number,
): { next: StandMatrix; harvested: Breakdown } {
  const harvested = emptyBreakdown();
  if (targetMm3 <= 0) return { next: state, harvested };

  const next = {} as StandMatrix;
  for (const name of SPECIES_NAMES) next[name] = state[name].slice();

  let remaining = targetMm3;

  // Walk classes from oldest to youngest. Within each class, only species
  // that have reached their legal küpsusvanus contribute.
  for (let i = NUM_CLASSES - 1; i >= 1 && remaining > 0; i--) {
    let classMm3 = 0;
    const perSpeciesMm3 = {} as Record<SpeciesName, number>;
    for (const name of SPECIES_NAMES) {
      if (!isLegallyHarvestable(name, i)) {
        perSpeciesMm3[name] = 0;
        continue;
      }
      const area = next[name][i];
      const v = volumePerHa(name, i);
      const mm3 = area * v * TO_MM3;
      perSpeciesMm3[name] = mm3;
      classMm3 += mm3;
    }
    if (classMm3 <= 0) continue;

    const take = Math.min(remaining, classMm3);
    const frac = take / classMm3;

    for (const name of SPECIES_NAMES) {
      const mm3Taken = perSpeciesMm3[name] * frac;
      if (mm3Taken <= 0) continue;
      const areaTaken = next[name][i] * frac;
      next[name][i] -= areaTaken;
      next[name][0] += areaTaken;

      harvested.total += mm3Taken;
      harvested.bySpecies[name] += mm3Taken;
      harvested.byClass[i] += mm3Taken;

      const shares = assortmentShares(
        CLASS_MIDPOINTS[i],
        SPECIES_PROXY[name],
      );
      harvested.byAssortment.pulp += mm3Taken * shares.pulp;
      harvested.byAssortment.saw += mm3Taken * shares.saw;
      harvested.byAssortment.veneer += mm3Taken * shares.veneer;
    }

    remaining -= take;
  }

  return { next, harvested };
}

export function stepOneYear(
  state: StandMatrix,
  targetHarvestMm3: number,
): { next: StandMatrix; harvested: Breakdown } {
  const aged = ageOneYear(state);
  return harvest(aged, targetHarvestMm3);
}

export function runSimulation(
  harvestMm3PerYear: number,
  years = 100,
): SimulationStep[] {
  const out: SimulationStep[] = [];
  let state = initialMatrix();
  const initial = snapshotBreakdown(state);
  out.push({
    year: 0,
    ...initial,
    harvested: emptyBreakdown(),
    cumulativeHarvested: 0,
  });
  let cumulative = 0;
  for (let y = 1; y <= years; y++) {
    const { next, harvested } = stepOneYear(state, harvestMm3PerYear);
    state = next;
    cumulative += harvested.total;
    const snap = snapshotBreakdown(state);
    out.push({ year: y, ...snap, harvested, cumulativeHarvested: cumulative });
  }
  return out;
}
