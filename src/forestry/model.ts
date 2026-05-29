import { SPECIES, SITES, type SpeciesId, type SiteId } from "./species";

export interface Prices {
  pulp: number; // €/m³
  saw: number;
  veneer: number;
}

export interface Costs {
  establishment: number; // €/ha at year 0
  tending: number; // €/ha at year 10
  preCommercialThinning: number; // €/ha at year 25
  harvestPerM3: number; // €/m³
}

export const DEFAULT_PRICES: Prices = { pulp: 32, saw: 80, veneer: 130 };

export const DEFAULT_COSTS: Costs = {
  establishment: 2000,
  tending: 500,
  preCommercialThinning: 350,
  harvestPerM3: 12,
};

export interface ScenarioInputs {
  speciesId: SpeciesId;
  siteId: SiteId;
  rotationAge: number;
  discountRate: number; // e.g. 0.03 for 3%
  prices: Prices;
  costs: Costs;
}

/** Standing volume per ha at given age (Chapman-Richards). */
export function volumeAtAge(
  age: number,
  speciesId: SpeciesId,
  siteId: SiteId,
): number {
  if (age <= 0) return 0;
  const sp = SPECIES[speciesId];
  const site = SITES[siteId];
  const k = sp.k * site.kFactor;
  return sp.vMax * site.factor * Math.pow(1 - Math.exp(-k * age), sp.p);
}

/** Mean annual increment m³/ha/yr. */
export function maiAtAge(age: number, speciesId: SpeciesId, siteId: SiteId): number {
  if (age <= 0) return 0;
  return volumeAtAge(age, speciesId, siteId) / age;
}

/** Current annual increment ≈ derivative dV/dt (finite difference). */
export function caiAtAge(age: number, speciesId: SpeciesId, siteId: SiteId): number {
  if (age <= 0.5) return 0;
  const h = 0.5;
  return (
    (volumeAtAge(age + h, speciesId, siteId) -
      volumeAtAge(age - h, speciesId, siteId)) /
    (2 * h)
  );
}

export interface AssortmentShares {
  pulp: number;
  saw: number;
  veneer: number;
}

/**
 * Share of harvested volume by assortment, as a function of stand age.
 *
 * Young stands are dominated by small-diameter pulpwood. As trees mature,
 * stem diameter grows and the share of sawlog (and eventually veneer)
 * increases. Calibrated against Nordic stand-level practice; exact mill
 * specs vary but the qualitative shape is robust.
 */
export function assortmentShares(
  age: number,
  speciesId: SpeciesId,
): AssortmentShares {
  const sp = SPECIES[speciesId];
  // Pulpwood: 95% at very young, exponential decay to a 12% floor.
  const pulp = Math.max(0.12, 0.95 * Math.exp(-Math.max(0, age - 15) / 35));
  // Veneer: only emerges in old, large-diameter stems. Saturates to species cap.
  const veneerProgress = Math.max(0, Math.min(1, (age - 80) / 60));
  const veneer = veneerProgress * sp.veneerCap;
  // Saw is whatever's left.
  const saw = Math.max(0, 1 - pulp - veneer);
  // Normalize to handle floating-point drift.
  const sum = pulp + saw + veneer;
  return { pulp: pulp / sum, saw: saw / sum, veneer: veneer / sum };
}

export interface AssortmentVolumes {
  pulp: number;
  saw: number;
  veneer: number;
  total: number;
}

export function assortmentVolumes(
  age: number,
  speciesId: SpeciesId,
  siteId: SiteId,
): AssortmentVolumes {
  const total = volumeAtAge(age, speciesId, siteId);
  const s = assortmentShares(age, speciesId);
  return {
    pulp: total * s.pulp,
    saw: total * s.saw,
    veneer: total * s.veneer,
    total,
  };
}

export interface RevenueBreakdown {
  pulp: number;
  saw: number;
  veneer: number;
  gross: number;
  harvestCost: number;
  net: number; // gross at harvest minus harvesting cost
}

export function revenueAtAge(
  age: number,
  speciesId: SpeciesId,
  siteId: SiteId,
  prices: Prices,
  costs: Costs,
): RevenueBreakdown {
  const v = assortmentVolumes(age, speciesId, siteId);
  const pulp = v.pulp * prices.pulp;
  const saw = v.saw * prices.saw;
  const veneer = v.veneer * prices.veneer;
  const gross = pulp + saw + veneer;
  const harvestCost = v.total * costs.harvestPerM3;
  return { pulp, saw, veneer, gross, harvestCost, net: gross - harvestCost };
}

export interface EconomicResult {
  npv: number; // single rotation, bare-land start
  lev: number; // Faustmann land expectation value (∞ rotations)
  annualEquivalent: number; // €/ha/yr equivalent perpetuity
  pvCosts: number;
  pvRevenue: number;
}

/**
 * Faustmann: bare land, plant, grow, clearcut at t, repeat forever.
 * LEV = NetFV(t) / ((1+r)^t - 1) where NetFV(t) is the future value of one
 * rotation's net cashflow at year t.
 */
export function economics(input: ScenarioInputs): EconomicResult {
  const { speciesId, siteId, rotationAge, discountRate, prices, costs } = input;
  const r = discountRate;
  const t = rotationAge;
  const disc = (year: number) => Math.pow(1 + r, -year);

  const rev = revenueAtAge(t, speciesId, siteId, prices, costs);
  const pvRevenue = rev.net * disc(t);
  const pvCosts =
    costs.establishment +
    costs.tending * disc(10) +
    costs.preCommercialThinning * disc(25);

  const npv = pvRevenue - pvCosts;

  let lev: number;
  let annualEquivalent: number;
  if (r <= 0 || t <= 0) {
    lev = Number.POSITIVE_INFINITY;
    annualEquivalent = t > 0 ? npv / t : 0;
  } else {
    const compound = Math.pow(1 + r, t);
    // Future value of one rotation's net (revenue minus future-valued costs)
    const fvCosts =
      costs.establishment * compound +
      costs.tending * Math.pow(1 + r, t - 10) +
      costs.preCommercialThinning * Math.pow(1 + r, t - 25);
    const netFV = rev.net - fvCosts;
    lev = netFV / (compound - 1);
    annualEquivalent = lev * r;
  }

  return { npv, lev, annualEquivalent, pvCosts, pvRevenue };
}

/** Search for the rotation age that maximizes LEV (or NPV when r=0). */
export function optimalRotation(input: Omit<ScenarioInputs, "rotationAge">): {
  age: number;
  metric: number;
} {
  let bestAge = 60;
  let bestMetric = -Infinity;
  for (let t = 20; t <= 180; t += 1) {
    const result = economics({ ...input, rotationAge: t });
    const metric = input.discountRate > 0 ? result.lev : result.npv;
    if (Number.isFinite(metric) && metric > bestMetric) {
      bestMetric = metric;
      bestAge = t;
    }
  }
  return { age: bestAge, metric: bestMetric };
}

/**
 * Biologically optimal rotation: the age that maximizes mean annual increment
 * (MAI). Independent of prices and discounting — purely a function of how
 * volume grows with age. Coincides with the MAI=CAI crossover point.
 */
export function biologicalRotation(
  speciesId: SpeciesId,
  siteId: SiteId,
): { age: number; mai: number } {
  let bestAge = 60;
  let bestMai = -Infinity;
  for (let t = 20; t <= 180; t += 1) {
    const m = maiAtAge(t, speciesId, siteId);
    if (m > bestMai) {
      bestMai = m;
      bestAge = t;
    }
  }
  return { age: bestAge, mai: bestMai };
}

/** Generate a series of {age, ...} points for charting. */
export function growthSeries(
  speciesId: SpeciesId,
  siteId: SiteId,
  maxAge = 180,
  step = 1,
) {
  const out: {
    age: number;
    volume: number;
    mai: number;
    cai: number;
    pulp: number;
    saw: number;
    veneer: number;
    pulpShare: number;
    sawShare: number;
    veneerShare: number;
  }[] = [];
  for (let age = 0; age <= maxAge; age += step) {
    const v = volumeAtAge(age, speciesId, siteId);
    const shares = assortmentShares(age, speciesId);
    out.push({
      age,
      volume: v,
      mai: maiAtAge(age, speciesId, siteId),
      cai: caiAtAge(age, speciesId, siteId),
      pulp: v * shares.pulp,
      saw: v * shares.saw,
      veneer: v * shares.veneer,
      pulpShare: shares.pulp * 100,
      sawShare: shares.saw * 100,
      veneerShare: shares.veneer * 100,
    });
  }
  return out;
}
