import type { AgeClassId, SpeciesId } from "./species";
import {
  WILDLIFE_HABITAT,
  WILDLIFE_LAYERS,
  WILDLIFE_PRECUT_BASELINE,
  WILDLIFE_SUCCESSION,
} from "../data/wildlife";

export type LayerId =
  | "vora"
  | "alusmets"
  | "poosarinne"
  | "rohurinne"
  | "maapind"
  | "lamapuit";

export interface Layer {
  id: LayerId;
  label: string;
  shortDesc: string;
  examples: string;
  speciesUsing: SpeciesId[];
  yPercent: number;
  heightPercent: number;
}

export const LAYER_ORDER: LayerId[] = [
  "vora",
  "alusmets",
  "poosarinne",
  "rohurinne",
  "maapind",
  "lamapuit",
];

export type Suitability = 0 | 1 | 2 | 3;

export interface HabitatRow {
  species: SpeciesId;
  byClass: Record<AgeClassId, Suitability>;
  primaryNeed: "vana_mets" | "noor_mets" | "segamets" | "lage_ala" | "lamapuit";
  shelter: string;
  food: string;
  notes?: string;
}

export const PRIMARY_NEED_LABEL: Record<HabitatRow["primaryNeed"], string> = {
  vana_mets: "Vana mets",
  noor_mets: "Noor mets",
  segamets: "Segamets",
  lage_ala: "Lage ala",
  lamapuit: "Lamapuit",
};

export interface SuccessionFrame {
  year: number;
  phase: string;
  phaseDesc: string;
  recovery: {
    elupaik: number;
    varjualune: number;
    toidubaas: number;
  };
  speciesPresent: SpeciesId[];
  speciesGained?: SpeciesId[];
}

const SUITABILITY_COLOR: Record<Suitability, string> = {
  0: "#4a5e4f",
  1: "#8a9c52",
  2: "#b0d378",
  3: "#c8df5e",
};

const SUITABILITY_LABEL: Record<Suitability, string> = {
  0: "Ei sobi",
  1: "Piiratud",
  2: "Sobib",
  3: "Optimaalne",
};

export function suitabilityFor(species: SpeciesId, age: AgeClassId): Suitability {
  const row = WILDLIFE_HABITAT.find((r) => r.species === species);
  return row ? row.byClass[age] : 0;
}

export function suitabilityColor(s: Suitability): string {
  return SUITABILITY_COLOR[s];
}

export function suitabilityLabel(s: Suitability): string {
  return SUITABILITY_LABEL[s];
}

function clampYear(year: number): number {
  if (!Number.isFinite(year)) return 0;
  if (year < 0) return 0;
  if (year > 100) return 100;
  return year;
}

export function frameAtYear(year: number): SuccessionFrame {
  const y = clampYear(Math.floor(year));
  let chosen = WILDLIFE_SUCCESSION[0];
  for (const f of WILDLIFE_SUCCESSION) {
    if (f.year <= y) chosen = f;
    else break;
  }
  return chosen;
}

export function interpolatedRecovery(year: number): SuccessionFrame["recovery"] {
  const y = clampYear(year);
  const frames = WILDLIFE_SUCCESSION;
  for (let i = 0; i < frames.length - 1; i++) {
    const lo = frames[i];
    const hi = frames[i + 1];
    if (y >= lo.year && y <= hi.year) {
      if (y === lo.year) return lo.recovery;
      if (y === hi.year) return hi.recovery;
      const t = (y - lo.year) / (hi.year - lo.year);
      return {
        elupaik: lo.recovery.elupaik + (hi.recovery.elupaik - lo.recovery.elupaik) * t,
        varjualune:
          lo.recovery.varjualune +
          (hi.recovery.varjualune - lo.recovery.varjualune) * t,
        toidubaas:
          lo.recovery.toidubaas +
          (hi.recovery.toidubaas - lo.recovery.toidubaas) * t,
      };
    }
  }
  return frames[frames.length - 1].recovery;
}

export const LAYERS = WILDLIFE_LAYERS;
export const HABITAT = WILDLIFE_HABITAT;
export const SUCCESSION_FRAMES = WILDLIFE_SUCCESSION;
export const PRECUT_BASELINE = WILDLIFE_PRECUT_BASELINE;
