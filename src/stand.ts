import type { SpeciesId, SiteId } from "./forestry/species";
import { SPECIES, SITES } from "./forestry/species";

/**
 * A forest owner's described stand. UI-level concept: the pure forestry
 * model stays per-hectare, while `area` scales outputs to whole-property
 * totals at the edge.
 */
export interface StandParams {
  speciesId: SpeciesId;
  siteId: SiteId;
  currentAge: number;
  area: number; // hectares
}

export const DEFAULT_STAND: StandParams = {
  speciesId: "spruce",
  siteId: "medium",
  currentAge: 60,
  area: 1,
};

function isSpeciesId(v: string | null): v is SpeciesId {
  return v != null && v in SPECIES;
}

function isSiteId(v: string | null): v is SiteId {
  return v != null && v in SITES;
}

function clampNumber(raw: string | null, fallback: number, min: number, max: number): number {
  const n = raw != null ? Number(raw) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Read a StandParams out of hash query params, falling back to defaults. */
export function parseStandParams(
  params: URLSearchParams,
  fallback: StandParams = DEFAULT_STAND,
): StandParams {
  const species = params.get("species");
  const site = params.get("site");
  return {
    speciesId: isSpeciesId(species) ? species : fallback.speciesId,
    siteId: isSiteId(site) ? site : fallback.siteId,
    currentAge: Math.round(clampNumber(params.get("age"), fallback.currentAge, 1, 180)),
    area: clampNumber(params.get("area"), fallback.area, 0.1, 100000),
  };
}

/** Serialize a StandParams into a `#/kalkulaator?...` hash. */
export function standToHash(stand: StandParams, path = "#/kalkulaator"): string {
  const params = new URLSearchParams({
    species: stand.speciesId,
    site: stand.siteId,
    age: String(stand.currentAge),
    area: String(stand.area),
  });
  return `${path}?${params.toString()}`;
}
