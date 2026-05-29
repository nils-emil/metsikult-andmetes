import type { SpeciesId } from "./species";

export interface LegalMinimum {
  minAge: number; // years
  minDbh: number; // cm, rinnasdiameeter
  minCircumference: number; // cm, rinnasümbermõõt = π·DBH (rounded)
}

/**
 * Eesti Metsaseadus § 29 lg 5–6 — uuendusraie miinimumvanused
 * ja küpsusläbimõõdud II boniteedi (keskmise kasvukoha) korral.
 * Lubatud raiuda kas vanuse järgi VÕI kui keskmine rinnasdiameeter
 * (DBH) ületab seadusliku piiri.
 */
export const LEGAL_MIN: Record<SpeciesId, LegalMinimum> = {
  pine: {
    minAge: 90,
    minDbh: 28,
    minCircumference: Math.round(Math.PI * 28),
  },
  spruce: {
    minAge: 80,
    minDbh: 26,
    minCircumference: Math.round(Math.PI * 26),
  },
  birch: {
    minAge: 60,
    minDbh: 22,
    minCircumference: Math.round(Math.PI * 22),
  },
};
