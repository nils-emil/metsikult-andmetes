import {
  economics,
  optimalRotation,
  volumeAtAge,
  DEFAULT_PRICES,
  DEFAULT_COSTS,
  type EconomicResult,
} from "../forestry/model";
import type { SpeciesId, SiteId } from "../forestry/species";
import {
  interpolatedRecovery,
  frameAtYear,
  suitabilityFor,
  type SuccessionFrame,
} from "../wildlife/habitat";
import type {
  SpeciesId as WildlifeSpeciesId,
  AgeClassId,
} from "../wildlife/species";
import {
  WILDLIFE_SPECIES,
  WILDLIFE_SUCCESSION,
} from "../data/wildlife";

/** Stand inputs shared by both perspectives (prices/costs use defaults). */
export interface StandInputs {
  speciesId: SpeciesId;
  siteId: SiteId;
  discountRate: number;
}

/** Oldest stand year the ecological model has data for. */
export const ECOLOGY_MAX_YEAR = 100;

/** Number of forest species tracked by the wildlife model. */
export const WILDLIFE_SPECIES_COUNT = Object.keys(WILDLIFE_SPECIES).length;

/**
 * Map a rotation age (years) to a wildlife age class. Boundaries follow the
 * ageRange metadata in WILDLIFE_AGE_CLASSES (0–10, 10–30, 30–60, 60–100, 100+).
 */
export function ageToAgeClass(age: number): AgeClassId {
  if (age < 10) return "raiesmik";
  if (age < 30) return "noorendik";
  if (age < 60) return "keskealine";
  if (age < 100) return "vana";
  return "vana_pluss";
}

export interface EcologySnapshot {
  recovery: SuccessionFrame["recovery"];
  speciesPresent: WildlifeSpeciesId[];
  speciesCount: number;
  /** Species for which this stand age is optimal habitat (suitability === 3). */
  oldGrowthOptimalCount: number;
}

/** Ecological state of a regenerating stand at the given age (clamped to data range). */
export function ecologyAtAge(age: number): EcologySnapshot {
  const year = Math.min(ECOLOGY_MAX_YEAR, Math.max(0, age));
  const recovery = interpolatedRecovery(year);
  const speciesPresent = frameAtYear(year).speciesPresent;
  const ageClass = ageToAgeClass(age);
  const oldGrowthOptimalCount = (
    Object.keys(WILDLIFE_SPECIES) as WildlifeSpeciesId[]
  ).filter((id) => suitabilityFor(id, ageClass) === 3).length;
  return {
    recovery,
    speciesPresent,
    speciesCount: speciesPresent.length,
    oldGrowthOptimalCount,
  };
}

export interface TradeoffPoint {
  age: number;
  lev: number;
  /** LEV scaled to 0–100 against the max LEV in the range; clamped at 0. */
  levNorm: number;
  npv: number;
  volume: number;
  /** Habitat-recovery share 0–100. */
  elupaik: number;
  speciesCount: number;
}

export const TRADEOFF_MIN_AGE = 20;
export const TRADEOFF_MAX_AGE = 120;

export interface TradeoffResult {
  series: TradeoffPoint[];
  /** Faustmann LEV-maximising rotation age. */
  economicOptimumAge: number;
  /** Stand age at which every key old-growth species has returned (or null). */
  oldGrowthThresholdAge: number | null;
}

/**
 * Build the full economy-vs-ecology series over the rotation-age range, plus
 * the two reference ages that anchor the trade-off.
 */
export function tradeoffSeries(inputs: StandInputs): TradeoffResult {
  const { speciesId, siteId, discountRate } = inputs;
  const base = {
    speciesId,
    siteId,
    discountRate,
    prices: DEFAULT_PRICES,
    costs: DEFAULT_COSTS,
  };

  const raw: { age: number; econ: EconomicResult; eco: EcologySnapshot }[] = [];
  for (let age = TRADEOFF_MIN_AGE; age <= TRADEOFF_MAX_AGE; age += 1) {
    raw.push({
      age,
      econ: economics({ ...base, rotationAge: age }),
      eco: ecologyAtAge(age),
    });
  }

  const maxLev = raw.reduce(
    (m, r) => (Number.isFinite(r.econ.lev) ? Math.max(m, r.econ.lev) : m),
    0,
  );

  const series: TradeoffPoint[] = raw.map((r) => ({
    age: r.age,
    lev: r.econ.lev,
    levNorm:
      maxLev > 0 && Number.isFinite(r.econ.lev)
        ? Math.max(0, (r.econ.lev / maxLev) * 100)
        : 0,
    npv: r.econ.npv,
    volume: volumeAtAge(r.age, speciesId, siteId),
    elupaik: r.eco.recovery.elupaik,
    speciesCount: r.eco.speciesCount,
  }));

  const { age: economicOptimumAge } = optimalRotation(base);

  return {
    series,
    economicOptimumAge,
    oldGrowthThresholdAge: computeOldGrowthThreshold(),
  };
}

export interface EcologyMilestone {
  species: WildlifeSpeciesId;
  name: string;
  emoji: string;
  /** Stand age at which the species first returns after clearcut. */
  age: number;
}

/**
 * Stand age at which each species first appears in the post-clearcut
 * succession, derived from the speciesGained markers in WILDLIFE_SUCCESSION.
 * Sorted by arrival age.
 */
export const ECOLOGY_MILESTONES: EcologyMilestone[] = WILDLIFE_SUCCESSION.flatMap(
  (frame) =>
    (frame.speciesGained ?? []).map((id) => ({
      species: id,
      name: WILDLIFE_SPECIES[id].name,
      emoji: WILDLIFE_SPECIES[id].emoji,
      age: frame.year,
    })),
).sort((a, b) => a.age - b.age);

/**
 * Species the wildlife model never records as present within the 100-year
 * succession — the old-growth dependents no rotation can bring back in time.
 */
export const NEVER_RETURNS: WildlifeSpeciesId[] = (
  Object.keys(WILDLIFE_SPECIES) as WildlifeSpeciesId[]
).filter(
  (id) => !WILDLIFE_SUCCESSION.some((f) => f.speciesPresent.includes(id)),
);

function computeOldGrowthThreshold(): number | null {
  const arrivals = ECOLOGY_MILESTONES.map((m) => m.age);
  if (arrivals.length === 0 || NEVER_RETURNS.length > 0) return null;
  return Math.max(...arrivals);
}
